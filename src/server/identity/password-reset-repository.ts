import "server-only";

import type { Db } from "mongodb";
import { databaseCollections } from "@/server/db/collections";
import { getDatabase } from "@/server/db/mongodb";
import { parsePasswordResetTokenDocument } from "@/identity/password-reset-parser";
import type { PasswordResetTokenDocument } from "@/identity/password-reset-documents";
import type { UserCredentialDocument } from "@/identity/credential-documents";

export class MongoPasswordResetRepository {
  constructor(private readonly database: () => Promise<Db> = getDatabase) {}

  async replaceForUser(input: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void> {
    const now = new Date();
    const document: PasswordResetTokenDocument = { userId: input.userId, tokenHash: input.tokenHash, expiresAt: input.expiresAt, createdAt: now };
    parsePasswordResetTokenDocument(document);
    await (await this.database()).collection<PasswordResetTokenDocument>(databaseCollections.passwordResetTokens)
      .replaceOne({ userId: input.userId }, document, { upsert: true });
  }

  async removeByHash(tokenHash: string): Promise<void> {
    await (await this.database()).collection<PasswordResetTokenDocument>(databaseCollections.passwordResetTokens).deleteOne({ tokenHash });
  }

  async consumeAndChangePassword(input: { tokenHash: string; now: Date; passwordHash: string }): Promise<boolean> {
    const database = await this.database();
    const client = database.client;
    const session = client.startSession();
    let changed = false;
    try {
      await session.withTransaction(async () => {
        const tokens = database.collection<PasswordResetTokenDocument>(databaseCollections.passwordResetTokens);
        const token = await tokens.findOneAndDelete(
          { tokenHash: input.tokenHash, expiresAt: { $gt: input.now } },
          { session },
        );
        if (!token) return;
        parsePasswordResetTokenDocument(token);
        const credentials = database.collection<UserCredentialDocument>(databaseCollections.userCredentials);
        const result = await credentials.updateOne(
          { userId: token.userId, disabledAt: null },
          { $set: { passwordHash: input.passwordHash, updatedAt: input.now }, $inc: { securityVersion: 1 } },
          { session },
        );
        if (result.modifiedCount !== 1) throw new Error("Reset credential unavailable.");
        await tokens.deleteMany({ userId: token.userId }, { session });
        changed = true;
      });
      return changed;
    } finally {
      await session.endSession();
    }
  }
}
