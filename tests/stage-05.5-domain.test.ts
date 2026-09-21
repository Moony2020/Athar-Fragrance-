import assert from "node:assert/strict";
import test from "node:test";
import { ObjectId } from "mongodb";

import { cartStateSchema, wishlistStateSchema } from "../src/commerce/contracts";
import { DURABLE_COMMERCE_TTL_DAYS, guestCommerceOwner, toDurableCartDocument, toDurableWishlistDocument } from "../src/commerce/durable-contracts";
import { parseCartDocument, parseWishlistDocument } from "../src/commerce/durable-parser";

test("durable owner records keep opaque owner identity and 30-day expiry", () => {
  const now = new Date("2026-09-21T00:00:00.000Z");
  const owner = guestCommerceOwner("a".repeat(32));
  const cart = toDurableCartDocument(owner, { lines: [{ productSlug: "athar-test-no-01", variantId: "variant-50", quantity: 2 }] }, now);
  const wishlist = toDurableWishlistDocument(owner, { productSlugs: ["athar-test-no-01"] }, now);
  assert.equal(cart.ownerType, "guest");
  assert.equal(cart.ownerId, owner.ownerId);
  assert.equal(cart.expiresAt.getTime() - now.getTime(), DURABLE_COMMERCE_TTL_DAYS * 24 * 60 * 60 * 1000);
  assert.deepEqual(cartStateSchema.parse(cart.state), cart.state);
  assert.deepEqual(wishlistStateSchema.parse(wishlist.state), wishlist.state);
  assert.equal("priceMinor" in cart, false);
  assert.equal("inventoryQuantity" in cart, false);
});

test("durable records support a future user owner without changing guest identity", () => {
  const guest = guestCommerceOwner("g".repeat(32));
  const user = { ownerType: "user" as const, ownerId: "u".repeat(32) };
  const guestCart = toDurableCartDocument(guest, { lines: [] });
  const userWishlist = toDurableWishlistDocument(user, { productSlugs: [] });
  assert.notEqual(guestCart.ownerId, userWishlist.ownerId);
  assert.equal(userWishlist.ownerType, "user");
});

test("parser accepts a valid Cart Mongo document without exposing persistence identity", () => {
  const owner = guestCommerceOwner("c".repeat(32));
  const document = toDurableCartDocument(owner, { lines: [{ productSlug: "athar-test-no-01", variantId: "variant-50", quantity: 1 }] });
  const parsed = parseCartDocument(document, owner);
  assert.deepEqual(parsed.state, document.state);
  assert.ok(parsed._id instanceof ObjectId);
  assert.equal(parsed.state.lines[0]?.productSlug, "athar-test-no-01");
});

test("parser accepts a valid Wishlist Mongo document and validates its state", () => {
  const owner = guestCommerceOwner("w".repeat(32));
  const document = toDurableWishlistDocument(owner, { productSlugs: ["athar-test-no-01"] });
  const parsed = parseWishlistDocument(document, owner);
  assert.deepEqual(parsed.state, document.state);
  assert.ok(parsed._id instanceof ObjectId);
});

test("parser rejects malformed top-level documents", () => {
  const owner = guestCommerceOwner("t".repeat(32));
  const document = toDurableCartDocument(owner, { lines: [] });
  const malformed = { ...document, unexpected: true } as unknown as typeof document;
  assert.throws(() => parseCartDocument(malformed, owner));
});

test("parser rejects malformed Cart state", () => {
  const owner = guestCommerceOwner("m".repeat(32));
  const document = toDurableCartDocument(owner, { lines: [] });
  const malformed = { ...document, state: { lines: [{ productSlug: "athar-test-no-01", variantId: "variant-50", quantity: 0 }] } };
  assert.throws(() => parseCartDocument(malformed, owner));
});

test("parser rejects malformed Wishlist state", () => {
  const owner = guestCommerceOwner("n".repeat(32));
  const document = toDurableWishlistDocument(owner, { productSlugs: ["athar-test-no-01"] });
  const malformed = { ...document, state: { productSlugs: ["Not A Slug"] } };
  assert.throws(() => parseWishlistDocument(malformed, owner));
});
