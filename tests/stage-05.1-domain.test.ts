import assert from "node:assert/strict";
import test from "node:test";
import { addCartLine, addWishlistItem, removeCartLine, removeWishlistItem, resolveCart, updateCartLineQuantity, type CommerceProductResolver } from "../src/commerce/domain";
import { CommerceError, MAX_CART_LINE_QUANTITY } from "../src/commerce/contracts";

const products = new Map([
  ["cedar-study", { slug: "cedar-study", currency: "SEK", variants: [{ id: "cedar-50", priceMinor: 149900, availability: "available" as const }, { id: "cedar-100", priceMinor: 199900, availability: "unavailable" as const }] }],
  ["private-study", null],
]);
const resolve: CommerceProductResolver = async (slug) => ({ availability: "available", product: products.get(slug) ?? null });
const unavailable: CommerceProductResolver = async () => ({ availability: "unavailable", product: null });

test("Cart merges canonical Product + Variant identities and resolves current integer-minor prices", async () => {
  let cart = await addCartLine({ lines: [] }, { productSlug: "cedar-study", variantId: "cedar-50", quantity: 2 }, resolve);
  cart = await addCartLine(cart, { productSlug: "cedar-study", variantId: "cedar-50", quantity: 3 }, resolve);
  assert.deepEqual(cart.lines, [{ productSlug: "cedar-study", variantId: "cedar-50", quantity: 5 }]);
  const resolved = await resolveCart(cart, resolve);
  assert.equal(resolved.subtotalMinor, 749500);
  assert.equal(resolved.lines[0]?.priceMinor, 149900);
});

test("Cart rejects invalid quantities and unavailable/private variants", async () => {
  await assert.rejects(() => addCartLine({ lines: [] }, { productSlug: "cedar-study", variantId: "cedar-50", quantity: 0 }, resolve));
  await assert.rejects(() => addCartLine({ lines: [] }, { productSlug: "cedar-study", variantId: "cedar-50", quantity: MAX_CART_LINE_QUANTITY + 1 }, resolve));
  await assert.rejects(() => addCartLine({ lines: [] }, { productSlug: "cedar-study", variantId: "cedar-100", quantity: 1 }, resolve), (error: unknown) => error instanceof CommerceError && error.code === "VARIANT_UNAVAILABLE");
  await assert.rejects(() => addCartLine({ lines: [] }, { productSlug: "private-study", variantId: "private-50", quantity: 1 }, resolve), (error: unknown) => error instanceof CommerceError && error.code === "PRODUCT_UNAVAILABLE");
});

test("Cart quantity updates require an existing canonical line and a readable canonical source", async () => {
  const cart = { lines: [{ productSlug: "cedar-study", variantId: "cedar-50", quantity: 1 }] };
  const updated = await updateCartLineQuantity(cart, { productSlug: "cedar-study", variantId: "cedar-50" }, 4, resolve);
  assert.equal(updated.lines[0]?.quantity, 4);
  await assert.rejects(() => updateCartLineQuantity(cart, { productSlug: "cedar-study", variantId: "cedar-50" }, 1.5, resolve));
  await assert.rejects(() => updateCartLineQuantity(cart, { productSlug: "cedar-study", variantId: "cedar-50" }, 1, unavailable), (error: unknown) => error instanceof CommerceError && error.code === "COMMERCE_SOURCE_UNAVAILABLE");
});

test("Cart removal uses the same canonical Product + Variant identity", () => {
  const remaining = removeCartLine({ lines: [
    { productSlug: "cedar-study", variantId: "cedar-50", quantity: 1 },
    { productSlug: "cedar-study", variantId: "cedar-100", quantity: 1 },
  ] }, { productSlug: "cedar-study", variantId: "cedar-50" });
  assert.deepEqual(remaining.lines, [{ productSlug: "cedar-study", variantId: "cedar-100", quantity: 1 }]);
});

test("Wishlist is Product-level, deduplicated, and validates public Product identity", async () => {
  let wishlist = await addWishlistItem({ productSlugs: [] }, { productSlug: "cedar-study" }, resolve);
  wishlist = await addWishlistItem(wishlist, { productSlug: "cedar-study" }, resolve);
  assert.deepEqual(wishlist.productSlugs, ["cedar-study"]);
  assert.deepEqual(removeWishlistItem(wishlist, { productSlug: "cedar-study" }), { productSlugs: [] });
  await assert.rejects(() => addWishlistItem(wishlist, { productSlug: "private-study" }, resolve), (error: unknown) => error instanceof CommerceError && error.code === "PRODUCT_UNAVAILABLE");
});
