import Link from "next/link";
import { CatalogGrid } from "@/components/catalog/CatalogGrid/CatalogGrid";
import { CatalogDiscovery } from "@/components/catalog/CatalogDiscovery/CatalogDiscovery";
import { CatalogShell } from "@/components/catalog/CatalogShell/CatalogShell";
import { Container } from "@/components/ui/Container/Container";
import { hasUnscopedDiscoveryQuery, type CatalogBrowseResult, type CatalogDiscoveryResult } from "@/server/catalog/services";
import styles from "./CatalogPage.module.css";

type CatalogPageProps = {
  browse: CatalogBrowseResult;
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  showAudienceNavigation?: boolean;
  showCollections?: boolean;
  discovery?: CatalogDiscoveryResult;
  discoveryAction?: string;
};

const audiences = [
  { href: "/shop/women", label: "For Her" },
  { href: "/shop/men", label: "For Him" },
  { href: "/shop/unisex", label: "Unisex" },
];

export function CatalogPage({ browse, eyebrow, title, description, emptyMessage, showAudienceNavigation = true, showCollections = false, discovery, discoveryAction = "/shop" }: CatalogPageProps) {
  return (
    <CatalogShell>
      <section className={styles.page} aria-labelledby="catalog-title">
        <Container>
          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <p className={styles.eyebrow}>{eyebrow}</p>
              <h1 id="catalog-title">{title}</h1>
              <p className={styles.description}>{description}</p>
              <p className={styles.headerNote}>A considered edit of lasting impressions.</p>
            </div>
          </header>

          {showAudienceNavigation && (
            <nav className={styles.audienceNav} aria-label="Browse by audience">
              <span className={styles.navLabel}>Discover by</span>{audiences.map((audience) => <Link href={audience.href} key={audience.href}>{audience.label}</Link>)}
            </nav>
          )}

          {showCollections && browse.availability === "available" && browse.collections.length > 0 && (
            <nav className={styles.collectionNav} aria-label="Browse collections">
              {browse.collections.map((collection) => <Link href={`/collections/${collection.slug}`} key={collection.slug}>{collection.name}</Link>)}
            </nav>
          )}

          {discovery && discovery.availability === "available" && <CatalogDiscovery action={discoveryAction} options={discovery.options} query={discovery.query} resultCount={discovery.products.length} scope={discovery.scope} />}
          <CatalogGrid availability={browse.availability} emptyMessage={discovery && hasUnscopedDiscoveryQuery(discovery.query, discovery.scope) && discovery.products.length === 0 && discovery.availability === "available" ? "No fragrances match these filters." : emptyMessage} products={browse.products} />
        </Container>
      </section>
    </CatalogShell>
  );
}
