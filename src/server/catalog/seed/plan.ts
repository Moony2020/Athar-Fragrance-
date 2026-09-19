import { createHash } from "node:crypto";

import {
  brandCreateInputSchema,
  collectionCreateInputSchema,
  productCreateInputSchema,
  slugSchema,
  type BrandCreateInput,
  type CollectionCreateInput,
  type ProductCreateInput,
} from "@/server/catalog/schemas";
import type { CatalogSeedDataset, SeedBrandFixture, SeedCollectionFixture, SeedProductFixture } from "@/server/catalog/seed/fixtures";

export type SeedEntityType = "brand" | "collection" | "product";
export type SeedAction = "create" | "update" | "unchanged";

export type SeedExistingRecord = {
  type: SeedEntityType;
  slug: string;
  seed?: { key: string; fingerprint: string; version: 1 };
};

export type ValidatedSeedDataset = {
  brands: Array<SeedBrandFixture & { input: BrandCreateInput }>;
  collections: Array<SeedCollectionFixture & { input: CollectionCreateInput }>;
  products: Array<SeedProductFixture & { input: Omit<ProductCreateInput, "brandId" | "collectionIds"> }>;
};

export type SeedPlanItem = {
  type: SeedEntityType;
  key: string;
  slug: string;
  fingerprint: string;
  action: SeedAction;
};

export type CatalogSeedPlan = {
  dataset: ValidatedSeedDataset;
  items: SeedPlanItem[];
  summary: Record<SeedEntityType, Record<SeedAction, number>>;
};

export class CatalogSeedValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogSeedValidationError";
  }
}

export class CatalogSeedConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogSeedConflictError";
  }
}

function fingerprint(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function assertUnique(label: string, values: string[]): void {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) {
    throw new CatalogSeedValidationError(`${label} must be unique. Duplicate: ${duplicates[0]}.`);
  }
}

function validateFixtureKeys(dataset: CatalogSeedDataset): void {
  for (const [type, fixtures] of Object.entries(dataset) as Array<[SeedEntityType, Array<{ key: string; input: { slug: string } }>]>) {
    const keys = fixtures.map((fixture) => slugSchema.parse(fixture.key));
    const slugs = fixtures.map((fixture) => slugSchema.parse(fixture.input.slug));
    assertUnique(`${type} fixture keys`, keys);
    assertUnique(`${type} fixture slugs`, slugs);
  }
}

export function validateCatalogSeedDataset(dataset: CatalogSeedDataset): ValidatedSeedDataset {
  validateFixtureKeys(dataset);
  const brands = dataset.brands.map((fixture) => ({ ...fixture, key: slugSchema.parse(fixture.key), input: brandCreateInputSchema.parse(fixture.input) }));
  const collections = dataset.collections.map((fixture) => ({ ...fixture, key: slugSchema.parse(fixture.key), input: collectionCreateInputSchema.parse(fixture.input) }));
  const brandKeys = new Set(brands.map((fixture) => fixture.key));
  const collectionKeys = new Set(collections.map((fixture) => fixture.key));
  const productSkus: string[] = [];
  const products = dataset.products.map((fixture) => {
    const key = slugSchema.parse(fixture.key);
    const brandKey = slugSchema.parse(fixture.brandKey);
    const collectionKeysForProduct = fixture.collectionKeys.map((collectionKey) => slugSchema.parse(collectionKey));
    if (!brandKeys.has(brandKey)) {
      throw new CatalogSeedValidationError(`Product fixture "${key}" references unknown brand key "${brandKey}".`);
    }
    if (new Set(collectionKeysForProduct).size !== collectionKeysForProduct.length) {
      throw new CatalogSeedValidationError(`Product fixture "${key}" contains duplicate collection references.`);
    }
    for (const collectionKey of collectionKeysForProduct) {
      if (!collectionKeys.has(collectionKey)) {
        throw new CatalogSeedValidationError(`Product fixture "${key}" references unknown collection key "${collectionKey}".`);
      }
    }
    const parsed = productCreateInputSchema.parse({
      ...fixture.input,
      brandId: "000000000000000000000001",
      collectionIds: collectionKeysForProduct.map((_, index) => `0000000000000000000000${String(index + 10).padStart(2, "0")}`),
    });
    productSkus.push(...parsed.variants.map((variant) => variant.sku));
    const input = { ...parsed };
    delete (input as Partial<ProductCreateInput>).brandId;
    delete (input as Partial<ProductCreateInput>).collectionIds;
    return { ...fixture, key, brandKey, collectionKeys: collectionKeysForProduct, input: input as Omit<ProductCreateInput, "brandId" | "collectionIds"> };
  });
  assertUnique("fixture variant SKUs", productSkus);
  return { brands, collections, products };
}

function emptySummary(): CatalogSeedPlan["summary"] {
  return {
    brand: { create: 0, update: 0, unchanged: 0 },
    collection: { create: 0, update: 0, unchanged: 0 },
    product: { create: 0, update: 0, unchanged: 0 },
  };
}

export function buildCatalogSeedPlan(dataset: CatalogSeedDataset, existingRecords: SeedExistingRecord[] = []): CatalogSeedPlan {
  const validated = validateCatalogSeedDataset(dataset);
  const existingByTypeAndSlug = new Map<string, SeedExistingRecord>();
  for (const record of existingRecords) {
    const slug = slugSchema.parse(record.slug);
    const mapKey = `${record.type}:${slug}`;
    if (existingByTypeAndSlug.has(mapKey)) {
      throw new CatalogSeedConflictError(`Multiple existing ${record.type} records use slug "${slug}".`);
    }
    existingByTypeAndSlug.set(mapKey, { ...record, slug });
  }

  const items: SeedPlanItem[] = [];
  const summary = emptySummary();
  const append = (type: SeedEntityType, key: string, slug: string, payload: unknown) => {
    const nextFingerprint = fingerprint(payload);
    const existing = existingByTypeAndSlug.get(`${type}:${slug}`);
    if (existing?.seed && existing.seed.key !== key) {
      throw new CatalogSeedConflictError(`Seed conflict for ${type} slug "${slug}": it is owned by "${existing.seed.key}" rather than "${key}".`);
    }
    if (existing && !existing.seed) {
      throw new CatalogSeedConflictError(`Seed conflict for ${type} slug "${slug}": the existing record is not seed-owned.`);
    }
    const action: SeedAction = !existing ? "create" : existing.seed?.fingerprint === nextFingerprint ? "unchanged" : "update";
    items.push({ type, key, slug, fingerprint: nextFingerprint, action });
    summary[type][action] += 1;
  };

  for (const fixture of validated.brands) append("brand", fixture.key, fixture.input.slug, fixture.input);
  for (const fixture of validated.collections) append("collection", fixture.key, fixture.input.slug, fixture.input);
  for (const fixture of validated.products) append("product", fixture.key, fixture.input.slug, fixture);
  return { dataset: validated, items, summary };
}

export function formatSeedSummary(plan: CatalogSeedPlan, dryRun: boolean): string {
  const prefix = dryRun ? "DRY RUN — no database writes performed" : "SEED WRITE";
  return ["brand", "collection", "product"]
    .reduce<string[]>((lines, type) => {
      const counts = plan.summary[type as SeedEntityType];
      lines.push(`${type}: created ${counts.create}, updated ${counts.update}, unchanged ${counts.unchanged}`);
      return lines;
    }, [prefix, "conflicts: 0"])
    .join("\n");
}
