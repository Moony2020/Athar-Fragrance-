"use server";

import { randomBytes } from "node:crypto";
import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { addToGuestCart, removeGuestCartLine, type GuestCartMutationResult, updateGuestCartLine } from "@/server/commerce/guest-cart";
import { readGuestCartId } from "@/server/commerce/guest-cookie";

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
  if (result.ok) refresh();
  return result;
}

export async function updateGuestCartLineAction(input: unknown) {
  const guestId = await readGuestCartId();
  if (!guestId) return { ok: false as const, code: "CART_LINE_NOT_FOUND", message: "This item is no longer in your bag." };
  const result = await updateGuestCartLine(guestId, input);
  if (result.ok) refresh();
  return result;
}

export async function removeGuestCartLineAction(input: unknown) {
  const guestId = await readGuestCartId();
  if (!guestId) return { ok: false as const, code: "CART_LINE_NOT_FOUND", message: "This item is no longer in your bag." };
  const result = await removeGuestCartLine(guestId, input);
  if (result.ok) refresh();
  return result;
}
