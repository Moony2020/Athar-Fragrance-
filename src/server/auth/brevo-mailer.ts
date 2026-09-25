import "server-only";

type ResetEmail = { to: string; resetUrl: string; expiresMinutes: number };

export interface PasswordResetMailer {
  sendPasswordReset(message: ResetEmail): Promise<void>;
}

export class BrevoPasswordResetMailer implements PasswordResetMailer {
  async sendPasswordReset(message: ResetEmail): Promise<void> {
    const apiKey = process.env.BREVO_API_KEY?.trim();
    const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
    const senderName = process.env.BREVO_SENDER_NAME?.trim() || "ATHAR";
    if (!apiKey || !senderEmail) throw new Error("Transactional email is not configured.");
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "content-type": "application/json", "api-key": apiKey },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: message.to }],
        subject: "Reset your ATHAR password",
        textContent: `We received a request to reset your ATHAR password. Use this link within ${message.expiresMinutes} minutes: ${message.resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        htmlContent: `<main style="font-family:Arial,sans-serif;color:#191817"><h1>Reset your ATHAR password</h1><p>Use the button below within ${message.expiresMinutes} minutes to choose a new password.</p><p><a href="${message.resetUrl}" style="display:inline-block;padding:14px 22px;background:#191817;color:#fff;text-decoration:none">Reset password</a></p><p>If you did not request this, ignore this email. Your password will not change.</p></main>`,
      }),
    });
    if (!response.ok) throw new Error("Transactional email delivery failed.");
  }
}
