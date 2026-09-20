import "server-only";

import { cookies } from "next/headers";

export const guestCartCookieName = "athar_guest_cart";
const guestCartIdPattern = /^[A-Za-z0-9_-]{32,128}$/;

export async function readGuestCartId() {
  const value = (await cookies()).get(guestCartCookieName)?.value;
  return value && guestCartIdPattern.test(value) ? value : null;
}
