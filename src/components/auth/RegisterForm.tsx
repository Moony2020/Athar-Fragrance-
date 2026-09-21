"use client";

import { FormEvent, useState } from "react";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
    setPending(false);
    if (!response.ok) { setError("Unable to create account."); return; }
    setComplete(true);
  }

  if (complete) return <p role="status">Account created. You can now sign in.</p>;
  return <form onSubmit={submit} aria-label="Create account">
    <label htmlFor="register-email">Email</label>
    <input id="register-email" name="email" type="email" autoComplete="email" required />
    <label htmlFor="register-password">Password</label>
    <input id="register-password" name="password" type="password" minLength={15} maxLength={128} autoComplete="new-password" required />
    <p>Password must be 15–128 characters.</p>
    {error ? <p role="alert">{error}</p> : null}
    <button type="submit" disabled={pending}>{pending ? "Creating account…" : "Create account"}</button>
  </form>;
}
