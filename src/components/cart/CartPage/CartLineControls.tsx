"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PublicCartLine } from "@/server/commerce/cart-read";
import { removeGuestCartLineAction, updateGuestCartLineAction } from "@/server/commerce/actions";
import styles from "./CartPage.module.css";

export function CartLineControls({ line }: { line: PublicCartLine }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const mutate = (quantity?: number) => startTransition(async () => {
    const result = quantity === undefined
      ? await removeGuestCartLineAction({ productSlug: line.productSlug, variantId: line.variantId })
      : await updateGuestCartLineAction({ productSlug: line.productSlug, variantId: line.variantId, quantity });
    setMessage(result.message);
    if (result.ok) {
      (window as Window & { __atharCartCount?: number }).__atharCartCount = result.totalQuantity;
      window.setTimeout(() => window.dispatchEvent(new CustomEvent("athar:cart-count", { detail: result.totalQuantity })), 100);
      router.refresh();
    }
  });
  return <div className={styles.controls}>
    {line.availability === "available" ? <div aria-label={`Quantity: ${line.quantity}`} className={styles.quantity} role="group">
      <button aria-label={`Decrease ${line.productName ?? "item"} quantity`} disabled={pending} onClick={() => mutate(line.quantity === 1 ? undefined : line.quantity - 1)} type="button">−</button>
      <span>{line.quantity}</span>
      <button aria-label={`Increase ${line.productName ?? "item"} quantity`} disabled={pending || line.quantity === 12} onClick={() => mutate(line.quantity + 1)} type="button">+</button>
    </div> : <span className={styles.unavailable}>Unavailable</span>}
    <button aria-label={`Remove ${line.productName ?? "unavailable item"} from bag`} className={styles.remove} disabled={pending} onClick={() => mutate()} type="button">Remove</button>
    <span aria-live="polite" className={styles.lineStatus}>{message}</span>
  </div>;
}
