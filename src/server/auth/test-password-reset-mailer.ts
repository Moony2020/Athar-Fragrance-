import "server-only";

import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";
import type { PasswordResetMailer } from "@/server/auth/brevo-mailer";

type CapturedPasswordReset = {
  to: string;
  resetUrl: string;
  expiresMinutes: number;
};

type TestMailState = { messages: CapturedPasswordReset[] };

declare global {
  // This in-memory outbox exists only for an explicitly enabled local E2E run.
  var atharPasswordResetTestMailState: TestMailState | undefined;
}

function state(): TestMailState {
  globalThis.atharPasswordResetTestMailState ??= { messages: [] };
  return globalThis.atharPasswordResetTestMailState;
}

export function isPasswordResetTestMailerEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.ATHAR_TEST_MAIL_ADAPTER === "1";
}

export class TestPasswordResetMailer implements PasswordResetMailer {
  async sendPasswordReset(message: CapturedPasswordReset): Promise<void> {
    if (!isPasswordResetTestMailerEnabled()) throw new Error("Test mail adapter is disabled.");
    const outboxPath = process.env.ATHAR_TEST_MAIL_OUTBOX;
    if (outboxPath) {
      if (!path.isAbsolute(outboxPath)) throw new Error("Test mail outbox path must be absolute.");
      await appendFile(outboxPath, `${JSON.stringify(message)}\n`, { encoding: "utf8", mode: 0o600 });
      return;
    }
    state().messages.push({ ...message });
  }
}

export async function getCapturedPasswordResetMessages(): Promise<CapturedPasswordReset[]> {
  const outboxPath = process.env.ATHAR_TEST_MAIL_OUTBOX;
  if (outboxPath) {
    if (!path.isAbsolute(outboxPath)) throw new Error("Test mail outbox path must be absolute.");
    try {
      const contents = await readFile(outboxPath, "utf8");
      return contents.split(/\r?\n/).filter(Boolean).map((line) => {
        const value: unknown = JSON.parse(line);
        if (!value || typeof value !== "object") throw new Error("Invalid test mail outbox entry.");
        const message = value as Partial<CapturedPasswordReset>;
        if (typeof message.to !== "string" || typeof message.resetUrl !== "string" || typeof message.expiresMinutes !== "number") {
          throw new Error("Invalid test mail outbox entry.");
        }
        return { to: message.to, resetUrl: message.resetUrl, expiresMinutes: message.expiresMinutes };
      });
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
      throw error;
    }
  }
  return state().messages.map((message) => ({ ...message }));
}
