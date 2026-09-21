import "server-only";
import { createGuestWishlistService } from "@/commerce/guest-wishlist-service";
import { resolvePublicCommerceProduct } from "@/server/commerce/services";
import { getEphemeralGuestWishlistStore } from "@/server/commerce/store";
const service = createGuestWishlistService(getEphemeralGuestWishlistStore(), resolvePublicCommerceProduct);
export const readGuestWishlist = (guestId: string) => service.read(guestId);
export const toggleGuestWishlist = (guestId: string, input: unknown) => service.toggle(guestId, input);
