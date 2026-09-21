import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth } from "@/auth";

export const instant = false;

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/account/sign-in");
  return <main><h1>Your ATHAR account</h1><p>Signed in as {session.user.email}</p><p data-testid="public-user-id">User ID: {session.user.id}</p><SignOutButton /></main>;
}
