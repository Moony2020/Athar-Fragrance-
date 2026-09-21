import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { auth } from "@/auth";
import { getCustomerProfile } from "@/server/identity/profile-service";
import styles from "./account.module.css";

export const instant = false;

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/account/sign-in");
  const profile = await getCustomerProfile(session.user.id);
  if (!profile) redirect("/account/sign-in");
  return <main className={styles.shell}><h1>Your ATHAR account</h1><label className={styles.email} htmlFor="account-email">Email<input id="account-email" aria-label="Email" value={profile.email} readOnly /></label><p className={styles.publicId} data-testid="public-user-id">User ID: {profile.userId}</p><ProfileForm className={styles.profile} initialDisplayName={profile.displayName} /><SignOutButton /></main>;
}
