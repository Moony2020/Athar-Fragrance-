import { emailSchema } from "@/identity/contracts";
import { z } from "zod";

export const GENERIC_FORGOT_MESSAGE = "If an account exists for that email, password reset instructions will be sent.";

type PasswordResetRequest = (input: { email: string }) => Promise<string>;

export async function handleForgotPasswordRequest(input: unknown, requestPasswordReset: PasswordResetRequest): Promise<string> {
  const parsed = z.object({ email: emailSchema }).strict().safeParse(input);
  if (!parsed.success) return GENERIC_FORGOT_MESSAGE;
  return requestPasswordReset({ email: parsed.data.email });
}
