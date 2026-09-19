import Link from "next/link";
import { Container } from "@/components/ui/Container/Container";
import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

const navigationItems = [
  { label: "Shop", href: "#collections" },
  { label: "Collections", href: "#collections" },
  { label: "Our Story", href: "#story" },
];

export function Header() {
  return (
    <header className={styles.root}>
      <Container className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="ATHAR home">
          <span className={styles.wordmark}>ATHAR</span>
          <span className={styles.descriptor}>Haute Parfumerie</span>
        </Link>

        <nav className={styles.navigation} aria-label="Main navigation">
          <Link className={styles.activeLink} href="/" aria-current="page">
            Home
          </Link>
          {navigationItems.map((item) => (
            <Link className={styles.navigationLink} href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions} aria-label="Header actions">
          <button className={styles.action} aria-label="Search" type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.7" /><path d="m16 16 4.5 4.5" /></svg>
          </button>
          <button className={styles.action} aria-label="Account" type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3.8" /><path d="M4.5 21c.8-4 3.4-6 7.5-6s6.7 2 7.5 6" /></svg>
          </button>
          <button className={styles.action} aria-label="Wishlist" type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.9a5.2 5.2 0 0 0-7.4 0L12 6.3l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21l8.8-8.7a5.2 5.2 0 0 0 0-7.4Z" /></svg>
          </button>
          <button className={`${styles.action} ${styles.bag}`} aria-label="Shopping bag, 0 items" type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            <span className={styles.badge} aria-hidden="true">0</span>
          </button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
