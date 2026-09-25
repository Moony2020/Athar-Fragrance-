import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getCapturedPasswordResetMessages, isPasswordResetTestMailerEnabled } from "@/server/auth/test-password-reset-mailer";

function authorized(request: Request): boolean {
  if (!isPasswordResetTestMailerEnabled()) return false;
  const expected = process.env.ATHAR_TEST_MAIL_SECRET;
  const supplied = request.headers.get("x-athar-test-mail-secret");
  if (!expected || !supplied) return false;
  const expectedBytes = Buffer.from(expected, "utf8");
  const suppliedBytes = Buffer.from(supplied, "utf8");
  return expectedBytes.length === suppliedBytes.length && timingSafeEqual(expectedBytes, suppliedBytes);
}

export async function GET(request: Request) {
  if (!authorized(request)) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ messages: await getCapturedPasswordResetMessages() }, { headers: { "Cache-Control": "no-store" } });
}
