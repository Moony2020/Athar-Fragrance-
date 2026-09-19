import "server-only";

import { databaseCollections } from "@/server/db/collections";
import { getDatabase } from "@/server/db/mongodb";
import type { BrandDocument, CollectionDocument, ProductDocument } from "@/server/catalog/documents";

/**
 * Idempotent catalog indexes. Invoke from a controlled deployment/migration
 * operation, never as an implicit homepage side effect.
 */
export async function ensureCatalogIndexes(): Promise<void> {
  const database = await getDatabase();
  const products = database.collection<ProductDocument>(databaseCollections.products);
  const brands = database.collection<BrandDocument>(databaseCollections.brands);
  const collections = database.collection<CollectionDocument>(databaseCollections.collections);

  await Promise.all([
    products.createIndexes([
      { key: { slug: 1 }, name: "product_slug_unique", unique: true },
      { key: { status: 1, createdAt: -1 }, name: "product_public_listing" },
      { key: { brandId: 1 }, name: "product_brand" },
      { key: { collectionIds: 1 }, name: "product_collections" },
      { key: { audience: 1 }, name: "product_audience" },
      { key: { fragranceFamily: 1 }, name: "product_fragrance_family" },
    ]),
    brands.createIndex({ slug: 1 }, { name: "brand_slug_unique", unique: true }),
    collections.createIndex({ slug: 1 }, { name: "collection_slug_unique", unique: true }),
  ]);
}
