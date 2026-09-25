import { NextResponse } from "next/server";
import { resetPassword } from "@/server/auth/password-reset";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const succeeded = await resetPassword(body);
    return succeeded
      ? NextResponse.json({ message: "Password updated. Please sign in with your new password." }, { headers: { "Cache-Control": "no-store" } })
      : NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Password reset is temporarily unavailable. Please try again later." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
