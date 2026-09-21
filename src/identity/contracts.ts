import { z } from "zod";

export const publicUserIdSchema = z.string().trim().min(32).max(128).regex(/^[A-Za-z0-9_-]+$/);
export const emailSchema = z.string().trim().email().max(320);
export const normalizedEmailSchema = emailSchema.transform((value) => value.toLowerCase());

export const customerCreateInputSchema = z.object({
  email: emailSchema,
  passwordHash: z.string().trim().min(1).max(512),
}).strict();

export const userPublicSchema = z.object({
  userId: publicUserIdSchema,
  email: emailSchema,
}).strict();

export type CustomerCreateInput = z.input<typeof customerCreateInputSchema>;
export type UserPublic = z.output<typeof userPublicSchema>;

export function normalizeEmail(email: string): string {
  return normalizedEmailSchema.parse(email);
}
