import "server-only";

import { auth } from "@/auth";
import { readGuestCartId } from "@/server/commerce/guest-cookie";
import { readGuestWishlistId } from "@/server/commerce/guest-wishlist-cookie";

export async function readCurrentCommerceOwner() {
  const session = await auth();
  if (session?.user?.id) return { ownerType: "user" as const, ownerId: session.user.id, cartId: null, wishlistId: null };
  return { ownerType: "guest" as const, ownerId: null, cartId: await readGuestCartId(), wishlistId: await readGuestWishlistId() };
}
