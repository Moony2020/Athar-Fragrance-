import { NextResponse } from "next/server";

import { registrationInputSchema } from "@/identity/contracts";
import { registerCustomer, RegistrationError } from "@/server/auth/registration";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registrationInputSchema.parse(body);
    const user = await registerCustomer(input);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof RegistrationError) return NextResponse.json({ error: "Unable to create account." }, { status: 409 });
    return NextResponse.json({ error: "Unable to create account." }, { status: 400 });
  }
}
