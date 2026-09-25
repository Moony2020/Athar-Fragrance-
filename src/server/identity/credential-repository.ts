import "server-only";

import type { ClientSession, Db } from "mongodb";

import type { UserCredentialDocument } from "@/identity/credential-documents";
import { parseUserCredentialDocument } from "@/identity/credential-parser";
import { databaseCollections } from "@/server/db/collections";
import { getDatabase } from "@/server/db/mongodb";

export class MongoCredentialRepository {
  constructor(private readonly database: () => Promise<Db> = getDatabase) {}

  async findByUserId(userId: string): Promise<UserCredentialDocument | null> {
    const document = await (await this.database()).collection<UserCredentialDocument>(databaseCollections.userCredentials).findOne({ userId });
    return document ? parseUserCredentialDocument(document) : null;
  }

  async create(input: { userId: string; passwordHash: string }): Promise<UserCredentialDocument> {
    const now = new Date();
    const document: UserCredentialDocument = { userId: input.userId, passwordHash: input.passwordHash, disabledAt: null, securityVersion: 0, createdAt: now, updatedAt: now };
    await (await this.database()).collection<UserCredentialDocument>(databaseCollections.userCredentials).insertOne(document);
    return parseUserCredentialDocument(document);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await (await this.database()).collection<UserCredentialDocument>(databaseCollections.userCredentials).deleteOne({ userId });
  }

  async replacePassword(userId: string, passwordHash: string, session: ClientSession): Promise<boolean> {
    const result = await (await this.database()).collection<UserCredentialDocument>(databaseCollections.userCredentials)
      .updateOne({ userId, disabledAt: null }, { $set: { passwordHash, updatedAt: new Date() }, $inc: { securityVersion: 1 } }, { session });
    return result.modifiedCount === 1;
  }

  async isSessionCurrent(userId: string, securityVersion: number): Promise<boolean> {
    const credential = await this.findByUserId(userId);
    return Boolean(credential && !credential.disabledAt && credential.securityVersion === securityVersion);
  }
}
