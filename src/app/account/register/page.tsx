import Link from "next/link";

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return <main><h1>Create your ATHAR account</h1><RegisterForm /><p>Already have an account? <Link href="/account/sign-in">Sign in</Link></p></main>;
}
