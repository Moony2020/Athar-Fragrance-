import { ObjectId } from "mongodb";
import { z } from "zod";

import { publicUserIdSchema } from "./contracts";
import type { UserCredentialDocument } from "./credential-documents";

const userCredentialDocumentSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: publicUserIdSchema,
  passwordHash: z.string().trim().min(1).max(512),
  disabledAt: z.date().nullable(),
  securityVersion: z.number().int().nonnegative().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
}).strict();

export function parseUserCredentialDocument(raw: UserCredentialDocument): UserCredentialDocument {
  return userCredentialDocumentSchema.parse(raw);
}
