import { ObjectId } from "mongodb";
import { z } from "zod";
import { publicUserIdSchema } from "./contracts";
import type { PasswordResetTokenDocument } from "./password-reset-documents";

const schema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: publicUserIdSchema,
  tokenHash: z.string().regex(/^[a-f0-9]{64}$/),
  expiresAt: z.date(),
  createdAt: z.date(),
}).strict();

export function parsePasswordResetTokenDocument(raw: PasswordResetTokenDocument): PasswordResetTokenDocument {
  return schema.parse(raw);
}
