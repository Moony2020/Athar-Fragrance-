import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { hashResetToken, requestPasswordReset, resetPassword, GENERIC_FORGOT_MESSAGE } from "../src/server/auth/password-reset";
import { hashPassword, verifyPassword } from "../src/server/auth/passwords";
import { MongoPasswordResetRepository } from "../src/server/identity/password-reset-repository";
import { getCapturedPasswordResetMessages, isPasswordResetTestMailerEnabled } from "../src/server/auth/test-password-reset-mailer";
import { parsePasswordResetTokenDocument } from "../src/identity/password-reset-parser";
import { ObjectId } from "mongodb";
import { handleForgotPasswordRequest } from "../src/server/auth/forgot-password-request";

test("forgot-password HTTP adapter passes a validated email string and keeps malformed input generic", async () => {
  const received: unknown[] = [];
  const service = async (input: { email: string }) => {
    received.push(input);
    return GENERIC_FORGOT_MESSAGE;
  };

  assert.equal(await handleForgotPasswordRequest({ email: "  active@example.invalid  " }, service), GENERIC_FORGOT_MESSAGE);
  assert.deepEqual(received, [{ email: "active@example.invalid" }]);

  received.length = 0;
  assert.equal(await handleForgotPasswordRequest({ email: { email: "active@example.invalid" } }, service), GENERIC_FORGOT_MESSAGE);
  assert.deepEqual(received, []);
  assert.equal(await handleForgotPasswordRequest({ email: "not-an-email", extra: true }, service), GENERIC_FORGOT_MESSAGE);
  assert.deepEqual(received, []);
});

test("password reset token parser is strict and accepts the Mongo _id", () => {
  const parsed = parsePasswordResetTokenDocument({ _id: new ObjectId(), userId: "u".repeat(43), tokenHash: "a".repeat(64), expiresAt: new Date(), createdAt: new Date() });
  assert.equal(parsed.userId, "u".repeat(43));
  assert.throws(() => parsePasswordResetTokenDocument({ ...parsed, unexpected: true } as never));
});

test("forgot password is generic for unknown, disabled and active accounts; persists hash only", async () => {
  const rawToken = "x".repeat(43);
  const saved: Array<{ userId: string; tokenHash: string; expiresAt: Date }> = [];
  const mail: Array<{ to: string; resetUrl: string; expiresMinutes: number }> = [];
  const user = { userId: "u".repeat(43), normalizedEmail: "person@example.invalid" };
  const result = (credential: { disabledAt: Date | null } | null, foundUser: typeof user | null = user) => requestPasswordReset({ email: user.normalizedEmail }, {
    users: { async findByNormalizedEmail() { return foundUser as never; } },
    credentials: { async findByUserId() { return credential as never; } },
    resets: { async replaceForUser(value) { saved.push(value); }, async removeByHash() {} },
    mailer: { async sendPasswordReset(value) { mail.push(value); } }, siteUrl: "https://athar.example", createToken: () => rawToken, now: () => new Date("2026-01-01T00:00:00Z"),
  });
  const generic = await result(null, null);
  assert.equal(generic, GENERIC_FORGOT_MESSAGE); assert.equal(mail.length, 0);
  assert.equal(saved.length, 0);
  assert.equal(await result(null), GENERIC_FORGOT_MESSAGE); assert.equal(mail.length, 0);
  assert.equal(await result({ disabledAt: new Date() }), GENERIC_FORGOT_MESSAGE); assert.equal(mail.length, 0);
  assert.equal(await result({ disabledAt: null }), GENERIC_FORGOT_MESSAGE);
  assert.equal(saved[0].tokenHash, hashResetToken(rawToken)); assert.equal(JSON.stringify(saved).includes(rawToken), false);
  assert.match(mail[0].resetUrl, new RegExp(encodeURIComponent(rawToken)));
  assert.equal(mail[0].expiresMinutes, 30);
});

test("server-selected test mailer captures exactly one message for eligible accounts only", async () => {
  const prior = {
    nodeEnv: process.env.NODE_ENV,
    adapter: process.env.ATHAR_TEST_MAIL_ADAPTER,
    outbox: process.env.ATHAR_TEST_MAIL_OUTBOX,
  };
  const directory = await mkdtemp(path.join(tmpdir(), "athar-stage65-mail-"));
  const outbox = path.join(directory, "outbox.jsonl");
  process.env.NODE_ENV = "test";
  process.env.ATHAR_TEST_MAIL_ADAPTER = "1";
  process.env.ATHAR_TEST_MAIL_OUTBOX = outbox;
  const active = { userId: "u".repeat(43), normalizedEmail: "active@example.invalid" };
  const disabled = { userId: "d".repeat(43), normalizedEmail: "disabled@example.invalid" };
  const deps = {
    users: { async findByNormalizedEmail(email: string) { return email === active.normalizedEmail ? active as never : email === disabled.normalizedEmail ? disabled as never : null; } },
    credentials: { async findByUserId(userId: string) { return userId === active.userId ? { disabledAt: null } as never : { disabledAt: new Date() } as never; } },
    resets: { async replaceForUser() {}, async removeByHash() {} },
    siteUrl: "https://athar.example",
    createToken: () => "test-reset-token-0123456789012345678901234567890123456789",
  };

  try {
    assert.equal(isPasswordResetTestMailerEnabled(), true);
    assert.equal(await requestPasswordReset({ email: "missing@example.invalid" }, deps), GENERIC_FORGOT_MESSAGE);
    assert.equal(await requestPasswordReset({ email: disabled.normalizedEmail }, deps), GENERIC_FORGOT_MESSAGE);
    assert.deepEqual(await getCapturedPasswordResetMessages(), []);
    assert.equal(await requestPasswordReset({ email: active.normalizedEmail }, deps), GENERIC_FORGOT_MESSAGE);
    const messages = await getCapturedPasswordResetMessages();
    assert.equal(messages.length, 1);
    assert.equal(messages[0].to, active.normalizedEmail);
    assert.equal(messages[0].expiresMinutes, 30);
    assert.match(messages[0].resetUrl, /\/account\/reset-password\?token=/);
  } finally {
    if (prior.nodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = prior.nodeEnv;
    if (prior.adapter === undefined) delete process.env.ATHAR_TEST_MAIL_ADAPTER; else process.env.ATHAR_TEST_MAIL_ADAPTER = prior.adapter;
    if (prior.outbox === undefined) delete process.env.ATHAR_TEST_MAIL_OUTBOX; else process.env.ATHAR_TEST_MAIL_OUTBOX = prior.outbox;
    await rm(directory, { recursive: true, force: true });
  }
});

test("production can never enable the test password-reset mailer", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousFlag = process.env.ATHAR_TEST_MAIL_ADAPTER;
  try {
    process.env.NODE_ENV = "production";
    process.env.ATHAR_TEST_MAIL_ADAPTER = "1";
    assert.equal(isPasswordResetTestMailerEnabled(), false);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousNodeEnv;
    if (previousFlag === undefined) delete process.env.ATHAR_TEST_MAIL_ADAPTER; else process.env.ATHAR_TEST_MAIL_ADAPTER = previousFlag;
  }
});

test("reset rejects invalid/expired/reused tokens and applies the existing password policy", async () => {
  let usedHash = "";
  let nextHash = "";
  const dependency = { reset: { async consumeAndChangePassword(input: { tokenHash: string; now: Date; passwordHash: string }) { usedHash = input.tokenHash; nextHash = input.passwordHash; return input.tokenHash === hashResetToken("valid-reset-token-12345678901234567890"); } }, hashPassword };
  assert.equal(await resetPassword({ token: "bad", password: "A sufficiently long password" }, dependency), false);
  assert.equal(await resetPassword({ token: "valid-reset-token-12345678901234567890", password: "short" }, dependency), false);
  assert.equal(await resetPassword({ token: "valid-reset-token-12345678901234567890", password: "New safe password 4567" }, dependency), true);
  assert.equal(usedHash, hashResetToken("valid-reset-token-12345678901234567890"));
  assert.equal(await verifyPassword(nextHash, "New safe password 4567"), true);
});

test("credential security version invalidates a JWT claim after a reset", async () => {
  let version = 3;
  const credentials = { async findByUserId() { return { userId: "u".repeat(43), passwordHash: "hidden", disabledAt: null, securityVersion: version, createdAt: new Date(), updatedAt: new Date() }; } };
  const { MongoCredentialRepository } = await import("../src/server/identity/credential-repository");
  const repository = new MongoCredentialRepository(async () => ({} as never));
  Object.assign(repository, { findByUserId: credentials.findByUserId });
  assert.equal(await repository.isSessionCurrent("u".repeat(43), 3), true);
  version += 1;
  assert.equal(await repository.isSessionCurrent("u".repeat(43), 3), false);
  assert.equal(await repository.isSessionCurrent("u".repeat(43), 4), true);
});

test("password reset transaction updates credential and consumes token exactly once in dedicated Mongo", { skip: !(process.env.MONGODB_URI && process.env.MONGODB_DB_NAME === "athar_stage55_test") }, async () => {
  const { getDatabase } = await import("../src/server/db/mongodb");
  const { databaseCollections } = await import("../src/server/db/collections");
  const { ensureIdentityIndexes, ensurePasswordResetIndexes } = await import("../src/server/db/indexes");
  const { registerCustomer } = await import("../src/server/auth/registration");
  const { authorizeCredentials } = await import("../src/server/auth/credentials");
  const database = await getDatabase(); await ensureIdentityIndexes(); await ensurePasswordResetIndexes();
  const email = `stage65-${Date.now()}@example.invalid`; const oldPassword = "Old safe password 12345"; const newPassword = "New safe password 67890";
  const tokenCollection = database.collection(databaseCollections.passwordResetTokens);
  let userId: string | undefined;
  try {
    const user = await registerCustomer({ email, password: oldPassword }); userId = user.userId;
    const raw = "stage65-" + crypto.randomUUID() + "-reset-token";
    const tokenHash = hashResetToken(raw); const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const resetIndexes = await tokenCollection.listIndexes().toArray();
    assert.deepEqual(new Set(resetIndexes.map((index) => index.name)), new Set(["_id_", "password_reset_user_unique", "password_reset_token_hash_unique", "password_reset_expiry_ttl"]));
    await tokenCollection.insertOne({ userId: user.userId, tokenHash, expiresAt, createdAt: new Date() });
    const persistedToken = await tokenCollection.findOne({ tokenHash, userId: user.userId });
    assert.equal(persistedToken?.tokenHash, tokenHash);
    assert.equal("token" in (persistedToken ?? {}), false);
    const reset = new MongoPasswordResetRepository();
    const oldCredential = await authorizeCredentials(email, oldPassword); assert.equal(oldCredential?.id, user.userId);
    const concurrent = await Promise.all([
      resetPassword({ token: raw, password: newPassword }, { reset }),
      resetPassword({ token: raw, password: "Another safe password 98765" }, { reset }),
    ]);
    assert.equal(concurrent.filter(Boolean).length, 1);
    assert.equal(await authorizeCredentials(email, oldPassword), null);
    assert.equal((await authorizeCredentials(email, newPassword))?.id === user.userId || (await authorizeCredentials(email, "Another safe password 98765"))?.id === user.userId, true);
    const credential = await database.collection(databaseCollections.userCredentials).findOne({ userId: user.userId });
    assert.equal(credential?.securityVersion, 1);
  } finally {
    if (userId) {
      await tokenCollection.deleteMany({ userId });
      await database.collection(databaseCollections.userCredentials).deleteMany({ userId });
      await database.collection(databaseCollections.users).deleteMany({ userId });
    }
    await database.client.close();
  }
});
