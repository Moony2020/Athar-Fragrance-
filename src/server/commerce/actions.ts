"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { addToGuestCart, type GuestCartMutationResult } from "@/server/commerce/guest-cart";

const guestCartCookieName = "athar_guest_cart";
const guestCartIdPattern = /^[A-Za-z0-9_-]{32,128}$/;

function createGuestCartId() {
  return randomBytes(32).toString("base64url");
}

/** PDP-only Cart mutation. It receives identity + quantity, never browser-owned commerce data. */
export async function addToGuestCartAction(input: unknown): Promise<GuestCartMutationResult> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(guestCartCookieName)?.value;
  const guestId = existing && guestCartIdPattern.test(existing) ? existing : createGuestCartId();
  const result = await addToGuestCart(guestId, input);
  if (result.ok && guestId !== existing) {
    cookieStore.set({ name: guestCartCookieName, value: guestId, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
  }
  return result;
}
