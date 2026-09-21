import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container/Container";
import { HeaderCartLink } from "./HeaderCartLink";
import { HeaderCartCount } from "./HeaderCartCount";
import { MobileMenu } from "./MobileMenu";
import { HeaderNavigation } from "./HeaderNavigation";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.root}>
      <Container className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="ATHAR home">
          <span className={styles.wordmark}>ATHAR</span>
          <span className={styles.descriptor}>Haute Parfumerie</span>
        </Link>

        <HeaderNavigation />

        <div className={styles.actions}>
          <button className={styles.action} aria-label="Search" type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.7" /><path d="m16 16 4.5 4.5" /></svg>
          </button>
          <button className={styles.action} aria-label="Account" type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3.8" /><path d="M4.5 21c.8-4 3.4-6 7.5-6s6.7 2 7.5 6" /></svg>
          </button>
          <Link className={styles.action} aria-label="Wishlist" href="/wishlist">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.9a5.2 5.2 0 0 0-7.4 0L12 6.3l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21l8.8-8.7a5.2 5.2 0 0 0 0-7.4Z" /></svg>
          </Link>
          <Suspense fallback={<HeaderCartCount initialCount={0} />}><HeaderCartLink /></Suspense>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
