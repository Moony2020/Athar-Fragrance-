import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { passwordSchema, normalizeEmail } from "@/identity/contracts";
import { MongoUserRepository } from "@/server/identity/user-repository";
import { MongoCredentialRepository } from "@/server/identity/credential-repository";
import { MongoPasswordResetRepository } from "@/server/identity/password-reset-repository";
import { hashPassword } from "@/server/auth/passwords";
import { BrevoPasswordResetMailer, type PasswordResetMailer } from "@/server/auth/brevo-mailer";
import { isPasswordResetTestMailerEnabled, TestPasswordResetMailer } from "@/server/auth/test-password-reset-mailer";
import { GENERIC_FORGOT_MESSAGE } from "@/server/auth/forgot-password-request";
import { emailSchema } from "@/identity/contracts";
import { z } from "zod";

export { GENERIC_FORGOT_MESSAGE };

const TOKEN_TTL_MS = 30 * 60 * 1000;
const tokenHash = (token: string) => createHash("sha256").update(token, "utf8").digest("hex");

type ForgotDeps = {
  users: Pick<MongoUserRepository, "findByNormalizedEmail">;
  credentials: Pick<MongoCredentialRepository, "findByUserId">;
  resets: Pick<MongoPasswordResetRepository, "replaceForUser" | "removeByHash">;
  mailer: PasswordResetMailer;
  siteUrl?: string;
  createToken?: () => string;
  now?: () => Date;
};

export async function requestPasswordReset(input: unknown, overrides?: Partial<ForgotDeps>): Promise<string> {
  const parsed = z.object({ email: emailSchema }).strict().safeParse(input);
  if (!parsed.success) return GENERIC_FORGOT_MESSAGE;
  const mailer = isPasswordResetTestMailerEnabled() ? new TestPasswordResetMailer() : new BrevoPasswordResetMailer();
  const defaults: ForgotDeps = {
    users: new MongoUserRepository(), credentials: new MongoCredentialRepository(), resets: new MongoPasswordResetRepository(),
    mailer, siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    createToken: () => randomBytes(32).toString("base64url"), now: () => new Date(),
  };
  const deps = { ...defaults, ...overrides };
  const user = await deps.users.findByNormalizedEmail(normalizeEmail(parsed.data.email));
  if (!user) return GENERIC_FORGOT_MESSAGE;
  const credential = await deps.credentials.findByUserId(user.userId);
  if (!credential || credential.disabledAt) return GENERIC_FORGOT_MESSAGE;
  const token = deps.createToken!();
  const digest = tokenHash(token);
  await deps.resets.replaceForUser({ userId: user.userId, tokenHash: digest, expiresAt: new Date(deps.now!().getTime() + TOKEN_TTL_MS) });
  try {
    const root = new URL(deps.siteUrl || "");
    if (!/^https?:$/.test(root.protocol)) throw new Error("Site URL is invalid.");
    const url = new URL("/account/reset-password", root);
    url.searchParams.set("token", token);
    await deps.mailer.sendPasswordReset({ to: user.normalizedEmail, resetUrl: url.toString(), expiresMinutes: 30 });
  } catch (error) {
    await deps.resets.removeByHash(digest).catch(() => undefined);
    // Keep the public response indistinguishable; never log the token, URL or
    // recipient. The production sender is still the real Brevo adapter.
    void error;
  }
  return GENERIC_FORGOT_MESSAGE;
}

type ResetDeps = {
  reset: Pick<MongoPasswordResetRepository, "consumeAndChangePassword">;
  hashPassword: typeof hashPassword;
  now?: () => Date;
};

export async function resetPassword(input: unknown, overrides?: Partial<ResetDeps>): Promise<boolean> {
  const parsed = z.object({ token: z.string().min(32).max(256), password: passwordSchema }).strict().safeParse(input);
  if (!parsed.success) return false;
  const deps: ResetDeps = { reset: new MongoPasswordResetRepository(), hashPassword, now: () => new Date(), ...overrides };
  const hash = await deps.hashPassword(parsed.data.password);
  return deps.reset.consumeAndChangePassword({ tokenHash: tokenHash(parsed.data.token), now: deps.now!(), passwordHash: hash });
}

export { tokenHash as hashResetToken };
