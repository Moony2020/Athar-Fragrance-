import "server-only";

import { createHash } from "node:crypto";

import type { Brand, Collection, Product } from "@/server/catalog/domain";
import { developmentCatalogSeed } from "@/server/catalog/seed/fixtures";
import { validateCatalogSeedDataset } from "@/server/catalog/seed/plan";

function deterministicId(key: string): string {
  return createHash("sha256").update(`athar-development:${key}`).digest("hex").slice(0, 24);
}

const fixtureDataset = validateCatalogSeedDataset(developmentCatalogSeed);
const now = new Date("2026-09-19T00:00:00.000Z");

const brands: Brand[] = fixtureDataset.brands.map((fixture) => ({
  id: deterministicId(`brand:${fixture.key}`),
  ...fixture.input,
  createdAt: now,
  updatedAt: now,
}));

const collections: Collection[] = fixtureDataset.collections.map((fixture) => ({
  id: deterministicId(`collection:${fixture.key}`),
  ...fixture.input,
  createdAt: now,
  updatedAt: now,
}));

const products: Product[] = fixtureDataset.products.map((fixture) => ({
  id: deterministicId(`product:${fixture.key}`),
  ...fixture.input,
  brandId: deterministicId(`brand:${fixture.brandKey}`),
  collectionIds: fixture.collectionKeys.map((key) => deterministicId(`collection:${key}`)),
  variants: fixture.input.variants.map((variant) => ({ ...variant, id: deterministicId(`variant:${variant.sku}`) })),
  createdAt: now,
  updatedAt: now,
}));

export function getDevelopmentBrands(): Brand[] {
  return brands.filter((brand) => brand.status === "active");
}

export function getDevelopmentCollections(): Collection[] {
  return collections.filter((collection) => collection.status === "active").sort((left, right) => left.sortOrder - right.sortOrder);
}

export function getDevelopmentProducts(): Product[] {
  const activeBrandIds = new Set(getDevelopmentBrands().map((brand) => brand.id));
  return products.filter((product) => product.status === "active" && activeBrandIds.has(product.brandId));
}
