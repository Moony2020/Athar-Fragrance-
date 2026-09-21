import "server-only";
import { createGuestWishlistService } from "@/commerce/guest-wishlist-service";
import { resolvePublicCommerceProduct } from "@/server/commerce/services";
import { getGuestWishlistStore } from "@/server/commerce/store";
function getService() { return createGuestWishlistService(getGuestWishlistStore(), resolvePublicCommerceProduct); }
export const readGuestWishlist = (guestId: string) => getService().read(guestId);
export const toggleGuestWishlist = (guestId: string, input: unknown) => getService().toggle(guestId, input);
