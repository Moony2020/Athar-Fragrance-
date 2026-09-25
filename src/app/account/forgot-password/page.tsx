import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import styles from "../account.module.css";

export default function ForgotPasswordPage() {
  return <main className={styles.shell}><h1>Forgot your password?</h1><p>Enter your account email and we will send reset instructions if an account exists.</p><ForgotPasswordForm /><p><Link href="/account/sign-in">Return to sign in</Link></p></main>;
}
