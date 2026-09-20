"use client";

import { useState, useTransition } from "react";
import type { ReactNode } from "react";
import type { CatalogProductDetailVariant } from "@/server/catalog/read-model";
import { addToGuestCartAction } from "@/server/commerce/actions";
import styles from "./ProductPurchasePanel.module.css";

type Props = {
  productSlug: string;
  currency: string;
  selectedVariant: CatalogProductDetailVariant;
};

/** Preserved owner UI; Stage 5.2 activates only bounded quantity and canonical PDP Add-to-bag. */
export function ProductPurchasePanel({ productSlug, selectedVariant }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const canAdd = selectedVariant.availability === "available" && !isPending;

  function addToBag() {
    setResult(null);
    startTransition(async () => {
      const actionResult = await addToGuestCartAction({ productSlug, variantId: selectedVariant.id, quantity });
      if (actionResult.ok) {
        (window as Window & { __atharCartCount?: number }).__atharCartCount = actionResult.totalQuantity;
        window.setTimeout(() => window.dispatchEvent(new CustomEvent("athar:cart-count", { detail: actionResult.totalQuantity })), 100);
      }
      setResult({ kind: actionResult.ok ? "success" : "error", message: actionResult.ok ? `${actionResult.message} ${actionResult.totalQuantity} item${actionResult.totalQuantity === 1 ? "" : "s"} in bag.` : actionResult.message });
    });
  }

  return <section aria-label="Purchase options" className={styles.panel}>
    <p className={styles.quantityLabel}>Quantity</p>
    <div className={styles.purchaseRow}>
      <div aria-label={`Quantity: ${quantity}`} className={styles.quantity} role="group"><button aria-label="Decrease quantity" disabled={quantity === 1 || isPending} onClick={() => setQuantity((current) => Math.max(1, current - 1))} type="button">−</button><span aria-live="polite">{quantity}</span><button aria-label="Increase quantity" disabled={quantity === 12 || isPending} onClick={() => setQuantity((current) => Math.min(12, current + 1))} type="button">+</button></div>
      <button aria-busy={isPending || undefined} className={styles.addToBag} disabled={!canAdd} onClick={addToBag} type="button"><span>{isPending ? "Adding" : "Add to bag"}</span><BagIcon /></button>
      <button aria-label="Wishlist is not available yet" aria-pressed={false} className={styles.wishlist} disabled type="button"><HeartIcon /></button>
    </div>
    <p aria-live="polite" className={styles.status} data-result={result?.kind}>{result?.message ?? (selectedVariant.availability === "available" ? "Delivery information varies by order." : "This size is currently unavailable.")}</p>
    <div aria-label="Service information" className={styles.benefits} role="group"><BenefitIcon type="delivery" label={<>Delivery<br />options</>} /><BenefitIcon type="authenticity" label={<>House<br />standards</>} /><BenefitIcon type="gift" label={<>Gift<br />options</>} /></div>
  </section>;
}

function HeartIcon() { return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="M12 20.1 5.8 14.3a4.9 4.9 0 0 1 6.2-7.5 4.9 4.9 0 0 1 6.2 7.5L12 20.1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function BagIcon() { return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="M4.5 9.5h15l-1.15 10H5.65L4.5 9.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /><path d="M8.5 9.5V7.25a3.5 3.5 0 0 1 7 0V9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function BenefitIcon({ type, label }: { type: "delivery" | "authenticity" | "gift"; label: ReactNode }) { const paths = type === "delivery" ? <><path d="M3 6h11v10H3zM14 10h3l3 3v3h-6z" /><path d="M7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /></> : type === "authenticity" ? <><path d="m12 3 6 2.5v5.1c0 4-2.5 7-6 8.4-3.5-1.4-6-4.4-6-8.4V5.5z" /><path d="m9.3 11.4 1.7 1.7 3.7-3.8" /></> : <><path d="M4 10h16v10H4zM3 6h18v4H3zM12 6v14" /><path d="M12 6C8 6 7 4 8.3 2.7 10 1 12 4 12 6ZM12 6c4 0 5-2 3.7-3.3C14 1 12 4 12 6Z" /></>; return <span><svg aria-hidden="true" fill="none" viewBox="0 0 24 24">{paths}</svg><small>{label}</small></span>; }
