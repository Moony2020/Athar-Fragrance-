import "server-only";
import { createGuestWishlistService } from "@/commerce/guest-wishlist-service";
import { resolvePublicCommerceProduct } from "@/server/commerce/services";
import { getGuestWishlistStore } from "@/server/commerce/store";
import { MongoGuestWishlistStore } from "@/server/commerce/mongo-store";
import type { CommerceOwner } from "@/commerce/durable-contracts";
function getService() { return createGuestWishlistService(getGuestWishlistStore(), resolvePublicCommerceProduct); }
export const readGuestWishlist = (guestId: string) => getService().read(guestId);
export const toggleGuestWishlist = (guestId: string, input: unknown) => getService().toggle(guestId, input);
export function toggleCommerceWishlist(owner: CommerceOwner, input: unknown) {
  if (owner.ownerType === "guest") return toggleGuestWishlist(owner.ownerId, input);
  const store = getGuestWishlistStore();
  if (!(store instanceof MongoGuestWishlistStore)) return Promise.resolve({ ok: false as const, code: "WISHLIST_UNAVAILABLE" as const, message: "Wishlist is temporarily unavailable." });
  return createGuestWishlistService({ read: () => store.readOwner(owner), mutate: (_ignored, mutation) => store.mutateOwner(owner, mutation) }, resolvePublicCommerceProduct).toggle(owner.ownerId, input);
}
