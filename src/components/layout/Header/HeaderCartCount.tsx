"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

/** Visual cache only: the server Cart remains authoritative; actions publish their returned safe total. */
export function HeaderCartCount({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    const update = (event: Event) => setCount((event as CustomEvent<number>).detail);
    window.addEventListener("athar:cart-count", update);
    return () => window.removeEventListener("athar:cart-count", update);
  }, []);
  return <Link className={`${styles.action} ${styles.bag}`} aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`} href="/cart">
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    <span className={styles.badge} aria-hidden="true">{count}</span>
  </Link>;
}
