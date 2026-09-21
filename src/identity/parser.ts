import { ObjectId } from "mongodb";
import { z } from "zod";

import { normalizedEmailSchema, publicUserIdSchema } from "./contracts";
import type { UserDocument } from "./documents";

const userDocumentSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: publicUserIdSchema,
  normalizedEmail: normalizedEmailSchema,
  passwordHash: z.string().trim().min(1).max(512),
  createdAt: z.date(),
  updatedAt: z.date(),
}).strict();

export function parseUserDocument(raw: UserDocument): UserDocument {
  const parsed = userDocumentSchema.parse(raw);
  if (parsed.normalizedEmail !== raw.normalizedEmail) throw new Error("User email is not normalized.");
  return parsed;
}
