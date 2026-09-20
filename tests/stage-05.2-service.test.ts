import assert from "node:assert/strict";
import test from "node:test";
import type { CommerceProductResolver } from "../src/commerce/domain";
import { createGuestCartService, type GuestCartStore } from "../src/commerce/guest-cart-service";
import type { CartState } from "../src/commerce/contracts";

function createStore(): GuestCartStore {
  let cart: CartState = { lines: [] };
  return {
    async read() { return cart; },
    async mutate(_guestId, mutation) { cart = await mutation(cart); return cart; },
  };
}

const resolver: CommerceProductResolver = async (slug) => {
  if (slug === "private-study") return { availability: "available", product: null };
  return {
    availability: "available",
    product: {
      slug,
      currency: "SEK",
      variants: [
        { id: "variant-50", priceMinor: 129900, availability: "available" },
        { id: "variant-100", priceMinor: 199900, availability: "available" },
        { id: "variant-unavailable", priceMinor: 249900, availability: "unavailable" },
      ],
    },
  };
};

test("guest Cart service creates, merges, separates variants, and resolves canonical integer subtotal", async () => {
  const service = createGuestCartService(createStore(), resolver);
  const guestId = "uQ9z7kL4pN2wX8cV6mR1tY3bH5dF0aJ7sK";
  assert.equal((await service.add(guestId, { productSlug: "cedar-study", variantId: "variant-50", quantity: 2 })).ok, true);
  const merged = await service.add(guestId, { productSlug: "cedar-study", variantId: "variant-50", quantity: 3 });
  assert.deepEqual(merged, { ok: true, lineQuantity: 5, totalQuantity: 5, message: "Added to bag." });
  await service.add(guestId, { productSlug: "cedar-study", variantId: "variant-100", quantity: 1 });
  const cart = await service.read(guestId);
  assert.equal(cart.availability, "available");
  assert.equal(cart.lines.length, 2);
  assert.equal(cart.subtotalMinor, 849400);
});

test("guest Cart service rejects price tampering, invalid quantities, unavailable Variants, and private Products", async () => {
  const service = createGuestCartService(createStore(), resolver);
  const guestId = "S4m9nD1r6pQ2xY8vK3aB7cE5fG0hJ4lM9N";
  assert.deepEqual(await service.add(guestId, { productSlug: "cedar-study", variantId: "variant-50", quantity: 1, priceMinor: 1 }), { ok: false, code: "INVALID_CART_INPUT", message: "Please choose an available size and quantity." });
  assert.equal((await service.add(guestId, { productSlug: "cedar-study", variantId: "variant-50", quantity: 13 })).ok, false);
  assert.deepEqual(await service.add(guestId, { productSlug: "cedar-study", variantId: "variant-unavailable", quantity: 1 }), { ok: false, code: "VARIANT_UNAVAILABLE", message: "This size is currently unavailable." });
  assert.deepEqual(await service.add(guestId, { productSlug: "private-study", variantId: "variant-50", quantity: 1 }), { ok: false, code: "PRODUCT_UNAVAILABLE", message: "This fragrance is no longer available." });
});

test("production adapter absence fails safely instead of using memory fallback", async () => {
  const service = createGuestCartService(null, resolver);
  assert.deepEqual(await service.add("uQ9z7kL4pN2wX8cV6mR1tY3bH5dF0aJ7sK", { productSlug: "cedar-study", variantId: "variant-50", quantity: 1 }), { ok: false, code: "CART_UNAVAILABLE", message: "Bag service is temporarily unavailable." });
});
