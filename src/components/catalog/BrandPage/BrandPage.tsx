import { CatalogGrid } from "@/components/catalog/CatalogGrid/CatalogGrid";
import { CatalogDiscovery } from "@/components/catalog/CatalogDiscovery/CatalogDiscovery";
import { CatalogShell } from "@/components/catalog/CatalogShell/CatalogShell";
import { Container } from "@/components/ui/Container/Container";
import { hasUnscopedDiscoveryQuery, type BrandBrowseResult, type CatalogDiscoveryResult } from "@/server/catalog/services";
import styles from "./BrandPage.module.css";

type BrandPageProps = { browse: BrandBrowseResult; discovery?: CatalogDiscoveryResult; discoveryAction?: string };

export function BrandPage({ browse, discovery, discoveryAction = "/brands" }: BrandPageProps) {
  const brand = browse.brand;
  return (
    <CatalogShell>
      <section className={styles.page} aria-labelledby="brand-title">
        <Container>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Brand</p>
            <h1 id="brand-title">{brand?.name ?? "Brand"}</h1>
            <p className={styles.description}>{brand?.description ?? "Brand browsing is temporarily unavailable."}</p>
          </header>
          {discovery?.availability === "available" && <CatalogDiscovery action={discoveryAction} options={discovery.options} query={discovery.query} resultCount={discovery.products.length} scope={discovery.scope} />}
          <CatalogGrid availability={browse.availability} products={browse.products} emptyMessage={discovery && hasUnscopedDiscoveryQuery(discovery.query, discovery.scope) && discovery.products.length === 0 && discovery.availability === "available" ? "No fragrances match these filters." : "This brand has no public fragrances yet."} />
        </Container>
      </section>
    </CatalogShell>
  );
}
