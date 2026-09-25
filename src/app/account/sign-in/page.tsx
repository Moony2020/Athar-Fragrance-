import Link from "next/link";

import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return <main><h1>Sign in to ATHAR</h1><SignInForm /><p><Link href="/account/forgot-password">Forgot password?</Link></p><p>New to ATHAR? <Link href="/account/register">Create an account</Link></p></main>;
}
