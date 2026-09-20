"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CatalogProductCard as CatalogProductCardModel } from "@/server/catalog/read-model";
import styles from "./ProductCard.module.css";

type ProductCardProps = { product: CatalogProductCardModel };

const productImages: Record<string, string> = {
  "athar-test-no-01": "/images/catalog/athar-test-no-01-v1.webp",
  "cedar-study": "/images/catalog/cedar-study-v1.webp",
  "no-media-study": "/images/catalog/no-media-study-v1.webp",
  "velvet-sillage": "/images/catalog/velvet-sillage-v1.webp",
  "luminous-fig": "/images/catalog/luminous-fig-v1.webp",
};

/** Established Shop-card presentation; local controls stay separate from persistent commerce. */
export function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageReady, setImageReady] = useState(false);
  const [selectedSize, setSelectedSize] = useState(() => product.variants.find((variant) => variant.availability === "available")?.sizeMl ?? product.variants[0]?.sizeMl);
  const image = productImages[product.slug] ?? "/images/catalog/product-placeholder.svg";
  const selectedVariant = product.variants.find((variant) => variant.sizeMl === selectedSize) ?? product.variants[0];

  return <article className={styles.card} aria-label={`${product.brandName} ${product.name}`}>
    <div className={styles.visual}>
      <Link aria-label={`View ${product.name}`} className={styles.imageLink} href={`/products/${product.slug}`}>
        {!isImageReady ? <span aria-hidden="true" className={styles.imageFallback}><b>ATHAR</b></span> : null}
        <Image alt="" className={styles.productImage} fill onError={() => setImageReady(false)} onLoad={() => setImageReady(true)} sizes="(max-width: 760px) 88vw, (max-width: 1100px) 45vw, 24vw" src={image} />
        {product.badge ? <span className={styles.status}>{product.badge}</span> : !product.isAvailable ? <span className={styles.status}>Not available</span> : null}
      </Link>
      <button aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.name} ${isWishlisted ? "from" : "to"} wishlist`} aria-pressed={isWishlisted} className={styles.wishlist} onClick={() => setIsWishlisted((current) => !current)} type="button"><HeartIcon filled={isWishlisted} /></button>
      <span className={styles.overlay}><small>{product.brandName}</small><strong>{product.name}</strong><span>{product.scentNotes.join(", ")}</span><button aria-label={`Add ${product.name} to bag`} className={styles.bag} disabled={!product.isAvailable || selectedVariant?.availability !== "available"} onClick={() => setIsAdded(true)} type="button"><BagIcon added={isAdded} /></button></span>
    </div>
    <div className={styles.actions}>
      <div aria-label={`Choose ${product.name} size`} className={styles.sizeChoices} role="group">{product.variants.map((variant) => <button aria-pressed={variant.sizeMl === selectedVariant?.sizeMl} className={styles.sizeChoice} disabled={variant.availability !== "available"} key={variant.sizeMl} onClick={() => { setSelectedSize(variant.sizeMl); setIsAdded(false); }} type="button">{variant.sizeMl} ml</button>)}</div>
      <strong className={styles.price}>{selectedVariant?.priceLabel ?? product.priceLabel}</strong>
    </div>
  </article>;
}

function HeartIcon({ filled }: { filled: boolean }) { return <svg aria-hidden="true" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24"><path d="M12 20.1 5.8 14.3a4.9 4.9 0 0 1 6.2-7.5 4.9 4.9 0 0 1 6.2 7.5L12 20.1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }
function BagIcon({ added }: { added: boolean }) { return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="M4.5 9.5h15l-1.15 10H5.65L4.5 9.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /><path d="M8.5 9.5V7.25a3.5 3.5 0 0 1 7 0V9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />{added ? <path d="m9.15 14 1.85 1.85 3.9-4.1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /> : null}</svg>; }
