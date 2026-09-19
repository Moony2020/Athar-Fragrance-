import type { CatalogProductCard as CatalogProductCardModel } from "@/server/catalog/read-model";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: CatalogProductCardModel;
};

/** Shared catalog card: all browse surfaces resolve the canonical Product Detail route. */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className={styles.card} aria-label={`${product.brandName} ${product.name}`}>
      <Link className={styles.link} href={`/products/${product.slug}`}>
        <div className={styles.media} aria-hidden="true">
          <span>ATHAR</span>
          <span className={styles.mediaLine} />
        </div>
        <div className={styles.body}>
          <p className={styles.brand}>{product.brandName}</p>
          <h2 className={styles.name}>{product.name}</h2>
          <div className={styles.details}>
            <span>{product.variantLabel}</span>
            <span className={styles.price}>{product.priceLabel}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
import Link from "next/link";
