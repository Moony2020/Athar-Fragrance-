"use client";

import { formatMoneyMinor } from "@/lib/money";
import type { CatalogProductDetailVariant } from "@/server/catalog/read-model";
import styles from "./ProductVariantSelector.module.css";

type Props = { currency: string; variants: CatalogProductDetailVariant[]; selectedId: string; onSelect: (id: string) => void };

/** Controlled presentation of the canonical public variant selected by the narrow purchase-area client island. */
export function ProductVariantSelector({ currency, variants, selectedId, onSelect }: Props) {
  const initial = variants.find((variant) => variant.availability === "available") ?? variants[0];
  const selected = variants.find((variant) => variant.id === selectedId) ?? initial;
  if (!selected) return null;
  const compareAt = selected.compareAtPriceMinor && selected.compareAtPriceMinor > selected.priceMinor ? selected.compareAtPriceMinor : null;
  const discountPercent = compareAt ? Math.round((1 - selected.priceMinor / compareAt) * 100) : null;

  return <section aria-label="Product size and availability" className={styles.selector}>
    <div aria-atomic="true" aria-live="polite" className={styles.summary}>
      <div className={styles.priceBlock}><strong>{formatMoneyMinor(selected.priceMinor, currency)}</strong>{compareAt ? <del>{formatMoneyMinor(compareAt, currency)}</del> : null}{discountPercent ? <span className={styles.discount}>{discountPercent}% OFF</span> : null}</div>
      <p data-availability={selected.availability}>{selected.availability === "available" ? "In stock · Ready to dispatch" : "Currently unavailable"}</p>
    </div>
    <fieldset className={styles.fieldset}><div className={styles.choiceHeader}><legend>Size</legend>{variants.length > 1 ? <span>Size guide <b aria-hidden="true">↗</b></span> : null}</div><div className={styles.options}>
      {variants.map((variant) => <label className={styles.option} data-selected={variant.id === selected.id} data-availability={variant.availability} key={variant.id}>
        <input checked={variant.id === selected.id} disabled={variant.availability === "unavailable"} name="product-size" onChange={() => onSelect(variant.id)} type="radio" value={variant.id} />
        <span>{variant.sizeMl} ml</span><small>{formatMoneyMinor(variant.priceMinor, currency)}</small>
      </label>)}
    </div></fieldset>
  </section>;
}
