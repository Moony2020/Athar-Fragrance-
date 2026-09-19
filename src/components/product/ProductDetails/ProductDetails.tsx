import Link from "next/link";
import { CatalogShell } from "@/components/catalog/CatalogShell/CatalogShell";
import { Container } from "@/components/ui/Container/Container";
import type { CatalogProductDetail } from "@/server/catalog/read-model";
import styles from "./ProductDetails.module.css";

export function ProductDetails({ product }: { product: CatalogProductDetail }) {
  const media = product.media[0] ?? null;
  return <CatalogShell><article className={styles.page}><Container><div className={styles.layout}>
    <section className={styles.media} aria-label="Product media">{media ? <ProductMedia src={media.url} alt={media.alt} width={media.width} height={media.height} /> : <span aria-hidden="true">ATHAR</span>}</section>
    <section className={styles.details}>
      <Link className={styles.brand} href={`/brands/${product.brand.slug}`}>{product.brand.name}</Link>
      <h1>{product.name}</h1>
      {product.shortDescription && <p className={styles.short}>{product.shortDescription}</p>}
      <p className={styles.price}>{product.priceLabel}</p>
      <p className={styles.availability}>{product.isAvailable ? "Available" : "Currently unavailable"}</p>
      <dl className={styles.facts}><div><dt>Fragrance family</dt><dd>{product.fragranceFamily}</dd></div><div><dt>Audience</dt><dd>{product.audience}</dd></div></dl>
      <p className={styles.description}>{product.description}</p>
      <section className={styles.variants} aria-labelledby="sizes-title"><h2 id="sizes-title">Available sizes</h2><ul>{product.variants.map((variant) => <li key={variant.sizeMl}><span>{variant.sizeMl} ml</span><span>{variant.priceLabel}</span><span>{variant.availability === "available" ? "Available" : "Unavailable"}</span></li>)}</ul></section>
      <section className={styles.notes} aria-labelledby="notes-title"><h2 id="notes-title">Fragrance notes</h2><div><Notes title="Top" notes={product.notes.top} /><Notes title="Heart" notes={product.notes.heart} /><Notes title="Base" notes={product.notes.base} /></div></section>
    </section>
  </div></Container></article></CatalogShell>;
}

function Notes({ title, notes }: { title: string; notes: string[] }) { return <section><h3>{title}</h3>{notes.length ? <ul>{notes.map((note) => <li key={note}>{note}</li>)}</ul> : <p>Not specified</p>}</section>; }

/** Fixture/provider URLs are not yet an approved Next Image host; no optimization contract is implied. */
function ProductMedia({ alt, height, src, width }: { alt: string; height?: number; src: string; width?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={width} height={height} />;
}
