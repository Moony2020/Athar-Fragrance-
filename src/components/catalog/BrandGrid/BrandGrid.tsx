import type { CatalogAvailability } from "@/server/catalog/services";
import type { CatalogBrandCard } from "@/server/catalog/read-model";
import { BrandCard } from "@/components/catalog/BrandCard/BrandCard";
import styles from "./BrandGrid.module.css";

type BrandGridProps = { availability: CatalogAvailability; brands: CatalogBrandCard[] };

export function BrandGrid({ availability, brands }: BrandGridProps) {
  if (availability === "unavailable") return <p className={styles.empty} role="status">Brand browsing is temporarily unavailable.</p>;
  if (brands.length === 0) return <p className={styles.empty} role="status">No public brands are available at the moment.</p>;
  return <ul className={styles.grid} aria-label="Brands">{brands.map((brand) => <li key={brand.slug}><BrandCard brand={brand} /></li>)}</ul>;
}
