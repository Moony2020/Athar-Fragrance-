import Link from "next/link";
import { hasUnscopedDiscoveryQuery, type CatalogDiscoveryOptions, type CatalogDiscoveryResult } from "@/server/catalog/services";
import type { PublicDiscoveryQuery } from "@/server/catalog/schemas";
import styles from "./CatalogDiscovery.module.css";

type Props = { action: string; options: CatalogDiscoveryOptions; query: PublicDiscoveryQuery; resultCount: number; scope?: CatalogDiscoveryResult["scope"] };

export function CatalogDiscovery({ action, options, query, resultCount, scope = {} }: Props) {
  const active = [["Search", query.q], ["Audience", !scope.audience ? query.audience : undefined], ["Brand", !scope.brandSlug ? query.brand : undefined], ["Family", query.family], ["Collection", !scope.collectionSlug ? query.collection : undefined], ["Sort", query.sort !== "name-asc" ? query.sort : undefined]].filter((entry): entry is [string, string] => Boolean(entry[1]));
  return <section className={styles.discovery} aria-label="Catalog discovery">
    <form action={action} method="get" className={styles.form}>
      <label className={styles.search}>Search fragrances<input name="q" type="search" defaultValue={query.q} maxLength={80} placeholder="Search by name or brand" /></label>
      <details className={styles.filters}><summary>Filters</summary><div className={styles.filterFields}>
        <label>Audience<select name="audience" defaultValue={query.audience ?? ""}><option value="">All audiences</option><option value="women">Women</option><option value="men">Men</option><option value="unisex">Unisex</option></select></label>
        <label>Brand<select name="brand" defaultValue={query.brand ?? ""}><option value="">All brands</option>{options.brands.map((brand) => <option key={brand.slug} value={brand.slug}>{brand.name}</option>)}</select></label>
        <label>Fragrance family<select name="family" defaultValue={query.family ?? ""}><option value="">All families</option>{options.families.map((family) => <option key={family} value={family}>{family}</option>)}</select></label>
        <label>Collection<select name="collection" defaultValue={query.collection ?? ""}><option value="">All collections</option>{options.collections.map((collection) => <option key={collection.slug} value={collection.slug}>{collection.name}</option>)}</select></label>
      </div></details>
      <label className={styles.sort}>Sort<select name="sort" defaultValue={query.sort}><option value="name-asc">Name: A–Z</option><option value="name-desc">Name: Z–A</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
      <button type="submit">Apply</button><Link className={styles.clear} href={action}>Clear all</Link>
    </form>
    <p className={styles.status}>{resultCount} {resultCount === 1 ? "fragrance" : "fragrances"} found.</p>
    {hasUnscopedDiscoveryQuery(query, scope) && active.length > 0 && <p className={styles.active}>Active: {active.map(([label, value]) => `${label}: ${value}`).join(" · ")}</p>}
  </section>;
}
