import "server-only";
import { cookies } from "next/headers";
export const guestWishlistCookieName = "athar_guest_wishlist";
export const guestWishlistIdPattern = /^[A-Za-z0-9_-]{32,128}$/;
export async function readGuestWishlistId() { const value = (await cookies()).get(guestWishlistCookieName)?.value; return value && guestWishlistIdPattern.test(value) ? value : null; }
