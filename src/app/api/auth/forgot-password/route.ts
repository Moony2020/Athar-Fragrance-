import { NextResponse } from "next/server";
import { GENERIC_FORGOT_MESSAGE, handleForgotPasswordRequest } from "@/server/auth/forgot-password-request";
import { requestPasswordReset } from "@/server/auth/password-reset";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const message = await handleForgotPasswordRequest(body, requestPasswordReset);
    return NextResponse.json({ message }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: GENERIC_FORGOT_MESSAGE }, { headers: { "Cache-Control": "no-store" } });
  }
}
