"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return <button type="button" onClick={() => signOut({ callbackUrl: "/account/sign-in" })}>Sign out</button>;
}
