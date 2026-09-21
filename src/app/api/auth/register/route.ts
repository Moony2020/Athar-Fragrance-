import { NextResponse } from "next/server";

import { registrationInputSchema } from "@/identity/contracts";
import { registerCustomer, RegistrationError } from "@/server/auth/registration";
import { mergeGuestCommerceForUser } from "@/server/commerce/reconciliation";
import { readGuestCartId } from "@/server/commerce/guest-cookie";
import { readGuestWishlistId } from "@/server/commerce/guest-wishlist-cookie";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registrationInputSchema.parse(body);
    const user = await registerCustomer(input);
    await mergeGuestCommerceForUser(user.userId, { cartId: await readGuestCartId(), wishlistId: await readGuestWishlistId() });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof RegistrationError) return NextResponse.json({ error: "Unable to create account." }, { status: 409 });
    return NextResponse.json({ error: "Unable to create account." }, { status: 400 });
  }
}
