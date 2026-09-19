import "server-only";

import { databaseCollections } from "@/server/db/collections";
import { ensureCatalogIndexes } from "@/server/db/indexes";
import { getDatabase } from "@/server/db/mongodb";
import type { BrandDocument, CollectionDocument, ProductDocument, SeedMetadata } from "@/server/catalog/documents";
import { getBrandRepository, getCollectionRepository, getProductRepository } from "@/server/catalog/repositories";
import { developmentCatalogSeed, type CatalogSeedDataset } from "@/server/catalog/seed/fixtures";
import { dryRunCatalogSeed } from "@/server/catalog/seed/dry-run";
import {
  buildCatalogSeedPlan,
  formatSeedSummary,
  type CatalogSeedPlan,
  type SeedExistingRecord,
} from "@/server/catalog/seed/plan";

export type CatalogSeedResult = {
  plan: CatalogSeedPlan;
  summary: string;
  wrote: boolean;
};

function assertDevelopmentWriteAllowed(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Catalog seed writes are blocked when NODE_ENV=production.");
  }
  if (process.env.CATALOG_SEED_ALLOW_WRITE !== "1") {
    throw new Error("Catalog seed writes require CATALOG_SEED_ALLOW_WRITE=1 in a development or test environment.");
  }
}

function metadata(key: string, fingerprint: string): SeedMetadata {
  return { key, fingerprint, version: 1 };
}

async function readExistingSeedRecords(): Promise<SeedExistingRecord[]> {
  const database = await getDatabase();
  const [brands, collections, products] = await Promise.all([
    database.collection<BrandDocument>(databaseCollections.brands).find({}, { projection: { slug: 1, seed: 1 } }).toArray(),
    database.collection<CollectionDocument>(databaseCollections.collections).find({}, { projection: { slug: 1, seed: 1 } }).toArray(),
    database.collection<ProductDocument>(databaseCollections.products).find({}, { projection: { slug: 1, seed: 1 } }).toArray(),
  ]);
  return [
    ...brands.map((record) => ({ type: "brand" as const, slug: record.slug, seed: record.seed })),
    ...collections.map((record) => ({ type: "collection" as const, slug: record.slug, seed: record.seed })),
    ...products.map((record) => ({ type: "product" as const, slug: record.slug, seed: record.seed })),
  ];
}

/**
 * Explicit development/test-only operational command. It validates all fixtures
 * and checks all known conflicts before the first write; it never deletes data.
 */
export async function executeCatalogSeed(dataset: CatalogSeedDataset = developmentCatalogSeed): Promise<CatalogSeedResult> {
  assertDevelopmentWriteAllowed();
  const existingRecords = await readExistingSeedRecords();
  const plan = buildCatalogSeedPlan(dataset, existingRecords);
  await ensureCatalogIndexes();

  const brands = await getBrandRepository();
  const collections = await getCollectionRepository();
  const products = await getProductRepository();
  const brandIds = new Map<string, string>();
  const collectionIds = new Map<string, string>();

  for (const fixture of plan.dataset.brands) {
    const item = plan.items.find((candidate) => candidate.type === "brand" && candidate.key === fixture.key);
    if (!item) throw new Error(`Seed plan is missing brand fixture "${fixture.key}".`);
    const result = await brands.upsertSeed(fixture.input, metadata(fixture.key, item.fingerprint));
    brandIds.set(fixture.key, result.value.id);
  }

  for (const fixture of plan.dataset.collections) {
    const item = plan.items.find((candidate) => candidate.type === "collection" && candidate.key === fixture.key);
    if (!item) throw new Error(`Seed plan is missing collection fixture "${fixture.key}".`);
    const result = await collections.upsertSeed(fixture.input, metadata(fixture.key, item.fingerprint));
    collectionIds.set(fixture.key, result.value.id);
  }

  for (const fixture of plan.dataset.products) {
    const item = plan.items.find((candidate) => candidate.type === "product" && candidate.key === fixture.key);
    const brandId = brandIds.get(fixture.brandKey);
    const resolvedCollectionIds = fixture.collectionKeys.map((key) => collectionIds.get(key));
    if (!item || !brandId || resolvedCollectionIds.some((id) => !id)) {
      throw new Error(`Seed reference resolution failed for product fixture "${fixture.key}" before product persistence.`);
    }
    await products.upsertSeed(
      { ...fixture.input, brandId, collectionIds: resolvedCollectionIds as string[] },
      metadata(fixture.key, item.fingerprint),
    );
  }

  return { plan, summary: formatSeedSummary(plan, false), wrote: true };
}

export { dryRunCatalogSeed };
