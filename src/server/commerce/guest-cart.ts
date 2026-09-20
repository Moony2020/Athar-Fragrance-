import "server-only";

import {
  createGuestCartService,
  type CartLineInput,
} from "@/commerce/guest-cart-service";
import { removeCartLine, updateCartLineQuantity } from "@/commerce/domain";
import { CommerceError, quantitySchema, publicVariantIdSchema } from "@/commerce/contracts";
import { slugSchema } from "@/server/catalog/schemas";
import { resolvePublicCommerceProduct } from "@/server/commerce/services";
import { getEphemeralGuestCartStore } from "@/server/commerce/store";

export type { GuestCartMutationResult, GuestCartReadResult } from "@/commerce/guest-cart-service";

const defaultService = createGuestCartService(getEphemeralGuestCartStore(), resolvePublicCommerceProduct);

export function addToGuestCart(guestId: string, input: CartLineInput | unknown) {
  return defaultService.add(guestId, input);
}

export function readGuestCart(guestId: string) {
  return defaultService.read(guestId);
}

function mutationFailure(error: unknown) {
  if (!(error instanceof CommerceError)) return { ok: false as const, code: "CART_UNAVAILABLE", message: "Bag service is temporarily unavailable." };
  if (error.code === "CART_LINE_NOT_FOUND") return { ok: false as const, code: "CART_LINE_NOT_FOUND", message: "This item is no longer in your bag." };
  if (error.code === "VARIANT_UNAVAILABLE") return { ok: false as const, code: "VARIANT_UNAVAILABLE", message: "This size is currently unavailable." };
  if (error.code === "PRODUCT_UNAVAILABLE") return { ok: false as const, code: "PRODUCT_UNAVAILABLE", message: "This fragrance is no longer available." };
  return { ok: false as const, code: "INVALID_QUANTITY", message: "Please choose a quantity from 1 to 12." };
}

export async function updateGuestCartLine(guestId: string, rawInput: unknown) {
  const input = publicVariantIdSchema.safeParse(typeof rawInput === "object" && rawInput ? (rawInput as { variantId?: unknown }).variantId : undefined);
  const productSlug = slugSchema.safeParse(typeof rawInput === "object" && rawInput ? (rawInput as { productSlug?: unknown }).productSlug : undefined);
  const quantity = quantitySchema.safeParse(typeof rawInput === "object" && rawInput ? (rawInput as { quantity?: unknown }).quantity : undefined);
  if (!input.success || !productSlug.success || !quantity.success) return { ok: false as const, code: "INVALID_CART_INPUT", message: "Please choose an available size and quantity." };
  const store = getEphemeralGuestCartStore();
  if (!store) return { ok: false as const, code: "CART_UNAVAILABLE", message: "Bag service is temporarily unavailable." };
  try {
    const cart = await store.mutate(guestId, (current) => updateCartLineQuantity(current, { productSlug: productSlug.data, variantId: input.data }, quantity.data, resolvePublicCommerceProduct));
    return { ok: true as const, totalQuantity: cart.lines.reduce((total, line) => total + line.quantity, 0), message: "Quantity updated." };
  } catch (error) { return mutationFailure(error); }
}

export async function removeGuestCartLine(guestId: string, rawInput: unknown) {
  const input = publicVariantIdSchema.safeParse(typeof rawInput === "object" && rawInput ? (rawInput as { variantId?: unknown }).variantId : undefined);
  const productSlug = slugSchema.safeParse(typeof rawInput === "object" && rawInput ? (rawInput as { productSlug?: unknown }).productSlug : undefined);
  if (!input.success || !productSlug.success) return { ok: false as const, code: "INVALID_CART_INPUT", message: "This bag item is invalid." };
  const store = getEphemeralGuestCartStore();
  if (!store) return { ok: false as const, code: "CART_UNAVAILABLE", message: "Bag service is temporarily unavailable." };
  try {
    const cart = await store.mutate(guestId, async (current) => removeCartLine(current, { productSlug: productSlug.data, variantId: input.data }));
    return { ok: true as const, totalQuantity: cart.lines.reduce((total, line) => total + line.quantity, 0), message: "Item removed from bag." };
  } catch (error) { return mutationFailure(error); }
}
