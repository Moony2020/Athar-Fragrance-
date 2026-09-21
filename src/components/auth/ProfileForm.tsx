"use client";

import { FormEvent, useState } from "react";

type ProfileFormProps = { initialDisplayName: string; className?: string };

export function ProfileForm({ initialDisplayName, className }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    const response = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName }),
    });
    setPending(false);
    setStatus(response.ok ? "Profile saved." : "Unable to save profile.");
  }

  return <form className={className} onSubmit={submit} aria-label="Profile details">
    <label htmlFor="displayName">Display name</label>
    <input id="displayName" name="displayName" value={displayName} onChange={(event) => setDisplayName(event.target.value)} minLength={1} maxLength={80} required />
    <button type="submit" disabled={pending}>{pending ? "Saving…" : "Save profile"}</button>
    {status ? <p role="status">{status}</p> : null}
  </form>;
}
