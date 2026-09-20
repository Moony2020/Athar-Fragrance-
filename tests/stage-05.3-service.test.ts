import assert from "node:assert/strict";
import test from "node:test";
import { removeCartLine, updateCartLineQuantity, type CommerceProductResolver } from "../src/commerce/domain";
import { CommerceError, type CartState } from "../src/commerce/contracts";

const resolver: CommerceProductResolver = async (slug) => slug === "private" ? { availability: "available", product: null } : {
  availability: "available",
  product: { slug, currency: "SEK", variants: [{ id: "one", priceMinor: 129900, availability: "available" }, { id: "unavailable", priceMinor: 199900, availability: "unavailable" }] },
};

test("Cart line updates keep canonical identity, bounds, and other lines intact", async () => {
  const state: CartState = { lines: [{ productSlug: "cedar-study", variantId: "one", quantity: 1 }, { productSlug: "luminous-fig", variantId: "one", quantity: 2 }] };
  const updated = await updateCartLineQuantity(state, { productSlug: "cedar-study", variantId: "one" }, 12, resolver);
  assert.deepEqual(updated.lines, [{ productSlug: "cedar-study", variantId: "one", quantity: 12 }, { productSlug: "luminous-fig", variantId: "one", quantity: 2 }]);
  await assert.rejects(() => updateCartLineQuantity(state, { productSlug: "cedar-study", variantId: "one" }, 13, resolver), (error: unknown) => error instanceof CommerceError && error.code === "INVALID_QUANTITY");
  await assert.rejects(() => updateCartLineQuantity(state, { productSlug: "cedar-study", variantId: "unavailable" }, 2, resolver), (error: unknown) => error instanceof CommerceError && error.code === "CART_LINE_NOT_FOUND");
});

test("Cart removal uses identity only and supports stale-line cleanup", () => {
  const state: CartState = { lines: [{ productSlug: "removed-product", variantId: "legacy", quantity: 1 }, { productSlug: "cedar-study", variantId: "one", quantity: 2 }] };
  assert.deepEqual(removeCartLine(state, { productSlug: "removed-product", variantId: "legacy" }), { lines: [{ productSlug: "cedar-study", variantId: "one", quantity: 2 }] });
});
