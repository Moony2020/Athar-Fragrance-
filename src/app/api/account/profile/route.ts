import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { updateCustomerDisplayName } from "@/server/identity/profile-service";

export async function PATCH(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await request.json();
    const profile = await updateCustomerDisplayName(userId, body?.displayName);
    if (!profile) return NextResponse.json({ error: "Account not found." }, { status: 404 });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Invalid display name." }, { status: 400 });
  }
}
