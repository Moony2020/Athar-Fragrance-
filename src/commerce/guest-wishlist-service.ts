import { addWishlistItem, removeWishlistItem, type CommerceProductResolver } from "@/commerce/domain";
import { CommerceError, wishlistItemInputSchema, type WishlistState } from "@/commerce/contracts";

export type GuestWishlistStore = { read(guestId: string): Promise<WishlistState>; mutate(guestId: string, mutation: (current: WishlistState) => Promise<WishlistState>): Promise<WishlistState> };
export type GuestWishlistResult = { ok: true; wishlisted: boolean; totalItems: number; message: string } | { ok: false; code: "INVALID_WISHLIST_INPUT" | "WISHLIST_UNAVAILABLE" | "PRODUCT_UNAVAILABLE"; message: string };

function failure(code: Extract<GuestWishlistResult, { ok: false }>['code']): Extract<GuestWishlistResult, { ok: false }> { return { ok: false, code, message: code === "PRODUCT_UNAVAILABLE" ? "This fragrance is no longer available." : code === "WISHLIST_UNAVAILABLE" ? "Wishlist is temporarily unavailable." : "This wishlist item is invalid." }; }

export function createGuestWishlistService(store: GuestWishlistStore | null, resolveProduct: CommerceProductResolver) {
  return {
    async read(guestId: string) { return store ? { availability: "available" as const, productSlugs: (await store.read(guestId)).productSlugs } : { availability: "unavailable" as const, productSlugs: [] }; },
    async toggle(guestId: string, rawInput: unknown): Promise<GuestWishlistResult> {
      const input = wishlistItemInputSchema.safeParse(rawInput); if (!input.success) return failure("INVALID_WISHLIST_INPUT"); if (!store) return failure("WISHLIST_UNAVAILABLE");
      try { const state = await store.mutate(guestId, async current => current.productSlugs.includes(input.data.productSlug) ? removeWishlistItem(current, input.data) : addWishlistItem(current, input.data, resolveProduct)); const wishlisted = state.productSlugs.includes(input.data.productSlug); return { ok: true, wishlisted, totalItems: state.productSlugs.length, message: wishlisted ? "Added to wishlist." : "Removed from wishlist." }; }
      catch (error) { return error instanceof CommerceError && error.code === "PRODUCT_UNAVAILABLE" ? failure("PRODUCT_UNAVAILABLE") : failure("WISHLIST_UNAVAILABLE"); }
    },
  };
}
