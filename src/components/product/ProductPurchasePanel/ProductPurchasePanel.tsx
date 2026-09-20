"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { formatMoneyMinor } from "@/lib/money";
import type { CatalogProductDetailVariant } from "@/server/catalog/read-model";
import styles from "./ProductPurchasePanel.module.css";

type Props = {
  currency: string;
  presentationOnly?: boolean;
  variants: CatalogProductDetailVariant[];
};

/** Preserved deferred commerce UI. It is intentionally not rendered in Stage 4.3. */
export function ProductPurchasePanel({ currency, presentationOnly = false, variants }: Props) {
  const [selectedId, setSelectedId] = useState(variants.find((variant) => variant.availability === "available")?.id ?? variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setWishlisted] = useState(false);
  const selected = variants.find((variant) => variant.id === selectedId) ?? variants[0];

  if (!selected) return null;

  return <section aria-label="Purchase options" className={styles.panel} data-presentation={presentationOnly || undefined}>
    <div className={styles.choiceHeader}><h2>Choose a size</h2><span>Size guide <b aria-hidden="true">↗</b></span></div>
    <div className={styles.sizeChoices} role="group" aria-label="Choose a size">
      {variants.map((variant) => <button aria-pressed={variant.id === selected.id} className={styles.sizeChoice} disabled={presentationOnly} key={variant.id} onClick={() => setSelectedId(variant.id)} type="button"><span>{variant.sizeMl} ml</span><small>{formatMoneyMinor(variant.priceMinor, currency)}</small></button>)}
    </div>
    <p className={styles.quantityLabel}>Quantity</p>
    <div className={styles.purchaseRow}>
      <div aria-label="Quantity" className={styles.quantity} role="group"><button aria-label="Decrease quantity" disabled={presentationOnly || quantity === 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))} type="button">−</button><span>{quantity}</span><button aria-label="Increase quantity" disabled={presentationOnly} onClick={() => setQuantity((current) => current + 1)} type="button">+</button></div>
      <button className={styles.addToBag} disabled={presentationOnly || selected.availability !== "available"} type="button"><span>Add to bag</span><BagIcon /></button>
      <button aria-label={`${isWishlisted ? "Remove from" : "Add to"} wishlist`} aria-pressed={isWishlisted} className={styles.wishlist} disabled={presentationOnly} onClick={() => setWishlisted((current) => !current)} type="button"><HeartIcon /></button>
    </div>
    <p className={styles.status}>{selected.availability === "available" ? "Delivery information varies by order." : "This size is currently unavailable."}</p>
    <div aria-label="Service information" className={styles.benefits} role="group"><BenefitIcon type="delivery" label={<>Delivery<br />options</>} /><BenefitIcon type="authenticity" label={<>House<br />standards</>} /><BenefitIcon type="gift" label={<>Gift<br />options</>} /></div>
  </section>;
}

function HeartIcon() { return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="M12 20.1 5.8 14.3a4.9 4.9 0 0 1 6.2-7.5 4.9 4.9 0 0 1 6.2 7.5L12 20.1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function BagIcon() { return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="M4.5 9.5h15l-1.15 10H5.65L4.5 9.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /><path d="M8.5 9.5V7.25a3.5 3.5 0 0 1 7 0V9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function BenefitIcon({ type, label }: { type: "delivery" | "authenticity" | "gift"; label: ReactNode }) { const paths = type === "delivery" ? <><path d="M3 6h11v10H3zM14 10h3l3 3v3h-6z" /><path d="M7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /></> : type === "authenticity" ? <><path d="m12 3 6 2.5v5.1c0 4-2.5 7-6 8.4-3.5-1.4-6-4.4-6-8.4V5.5z" /><path d="m9.3 11.4 1.7 1.7 3.7-3.8" /></> : <><path d="M4 10h16v10H4zM3 6h18v4H3zM12 6v14" /><path d="M12 6C8 6 7 4 8.3 2.7 10 1 12 4 12 6ZM12 6c4 0 5-2 3.7-3.3C14 1 12 4 12 6Z" /></>; return <span><svg aria-hidden="true" fill="none" viewBox="0 0 24 24">{paths}</svg><small>{label}</small></span>; }
