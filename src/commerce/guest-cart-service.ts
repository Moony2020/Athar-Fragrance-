import { addCartLine, resolveCart, type CommerceProductResolver } from "@/commerce/domain";
import { cartLineInputSchema, CommerceError, type CartLineInput, type CartState } from "@/commerce/contracts";

export type GuestCartStore = {
  read(guestId: string): Promise<CartState>;
  mutate(guestId: string, mutation: (current: CartState) => Promise<CartState>): Promise<CartState>;
};

export type GuestCartFailureCode = "INVALID_CART_INPUT" | "CART_UNAVAILABLE" | "PRODUCT_UNAVAILABLE" | "VARIANT_UNAVAILABLE" | "INVALID_QUANTITY";
export type GuestCartMutationResult =
  | { ok: true; lineQuantity: number; totalQuantity: number; message: string }
  | { ok: false; code: GuestCartFailureCode; message: string };
export type GuestCartReadResult =
  | { availability: "available"; lines: Array<{ productSlug: string; variantId: string; quantity: number; priceMinor: number; subtotalMinor: number }>; subtotalMinor: number; currency: string | null }
  | { availability: "unavailable"; lines: []; subtotalMinor: 0; currency: null };

function failure(code: GuestCartFailureCode): Extract<GuestCartMutationResult, { ok: false }> {
  const messages = {
    INVALID_CART_INPUT: "Please choose an available size and quantity.",
    CART_UNAVAILABLE: "Bag service is temporarily unavailable.",
    PRODUCT_UNAVAILABLE: "This fragrance is no longer available.",
    VARIANT_UNAVAILABLE: "This size is currently unavailable.",
    INVALID_QUANTITY: "Please choose a quantity from 1 to 12.",
  } as const;
  return { ok: false, code, message: messages[code] };
}

/** Pure cart orchestration: persistence and public catalog access are injected at the server edge. */
export function createGuestCartService(store: GuestCartStore | null, resolveProduct: CommerceProductResolver) {
  return {
    async add(guestId: string, rawInput: unknown): Promise<GuestCartMutationResult> {
      const input = cartLineInputSchema.safeParse(rawInput);
      if (!input.success) return failure("INVALID_CART_INPUT");
      if (!store) return failure("CART_UNAVAILABLE");
      try {
        const cart = await store.mutate(guestId, (current) => addCartLine(current, input.data, resolveProduct));
        const line = cart.lines.find((candidate) => candidate.productSlug === input.data.productSlug && candidate.variantId === input.data.variantId);
        return { ok: true, lineQuantity: line?.quantity ?? input.data.quantity, totalQuantity: cart.lines.reduce((total, candidate) => total + candidate.quantity, 0), message: "Added to bag." };
      } catch (error) {
        if (!(error instanceof CommerceError)) return failure("CART_UNAVAILABLE");
        if (error.code === "COMMERCE_SOURCE_UNAVAILABLE") return failure("CART_UNAVAILABLE");
        if (error.code === "PRODUCT_UNAVAILABLE") return failure("PRODUCT_UNAVAILABLE");
        if (error.code === "VARIANT_UNAVAILABLE") return failure("VARIANT_UNAVAILABLE");
        return failure("INVALID_QUANTITY");
      }
    },
    async read(guestId: string): Promise<GuestCartReadResult> {
      if (!store) return { availability: "unavailable", lines: [], subtotalMinor: 0, currency: null };
      try {
        const cart = await store.read(guestId);
        const resolved = await resolveCart(cart, resolveProduct);
        return { availability: "available", lines: resolved.lines.map(({ productSlug, variantId, quantity, priceMinor, subtotalMinor }) => ({ productSlug, variantId, quantity, priceMinor, subtotalMinor })), subtotalMinor: resolved.subtotalMinor, currency: resolved.currency };
      } catch {
        return { availability: "unavailable", lines: [], subtotalMinor: 0, currency: null };
      }
    },
  };
}

export type { CartLineInput };
