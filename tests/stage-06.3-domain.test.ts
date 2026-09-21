import assert from "node:assert/strict";
import test from "node:test";

import { displayNameSchema } from "../src/identity/contracts";
import { type UserDocument } from "../src/identity/documents";
import { updateCustomerDisplayName } from "../src/server/identity/profile-service";

const userId = "u".repeat(43);
const base: UserDocument = { userId, normalizedEmail: "customer@example.com", displayName: "Customer", createdAt: new Date(), updatedAt: new Date() };

test("profile display name is trimmed and bounded", () => {
  assert.equal(displayNameSchema.parse("  A fresh name  "), "A fresh name");
  assert.throws(() => displayNameSchema.parse(""));
  assert.throws(() => displayNameSchema.parse("x".repeat(81)));
});

test("profile service updates the session-owned user and returns public data", async () => {
  let updatedUserId = "";
  const repository = {
    async updateDisplayName(id: string, displayName: string) { updatedUserId = id; return { ...base, displayName }; },
  };
  const result = await updateCustomerDisplayName(userId, "  New Name ", repository);
  assert.equal(updatedUserId, userId);
  assert.deepEqual(result, { userId, email: "customer@example.com", displayName: "New Name" });
  assert.equal("_id" in (result ?? {}), false);
  assert.equal("passwordHash" in (result ?? {}), false);
});
