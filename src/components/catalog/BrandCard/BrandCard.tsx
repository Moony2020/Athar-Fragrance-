import Link from "next/link";
import type { CatalogBrandCard } from "@/server/catalog/read-model";
import styles from "./BrandCard.module.css";

type BrandCardProps = { brand: CatalogBrandCard };

/** Discovery link only; no authorization, retailer, or partnership claim is implied. */
export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link className={styles.card} href={`/brands/${brand.slug}`} aria-label={`Browse ${brand.name} fragrances`}>
      <div className={styles.media} aria-hidden="true"><span>ATHAR</span><span className={styles.line} /></div>
      <div className={styles.body}>
        <h2>{brand.name}</h2>
        {brand.description && <p>{brand.description}</p>}
        <span className={styles.linkLabel}>Explore brand <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}
