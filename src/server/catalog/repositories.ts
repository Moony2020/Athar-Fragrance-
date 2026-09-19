import "server-only";

import { ObjectId, type Collection as MongoCollection, type Filter } from "mongodb";
import { isDeepStrictEqual } from "node:util";

import { databaseCollections } from "@/server/db/collections";
import { getDatabase } from "@/server/db/mongodb";
import type { Brand, Collection, Product } from "@/server/catalog/domain";
import { isPublicCatalogStatus } from "@/server/catalog/visibility";
import {
  toBrand,
  toBrandDocument,
  toCollection,
  toCollectionDocument,
  toProduct,
  toProductDocument,
  type BrandDocument,
  type CollectionDocument,
  type ProductDocument,
  type SeedMetadata,
} from "@/server/catalog/documents";
import {
  brandCreateInputSchema,
  collectionCreateInputSchema,
  objectIdSchema,
  productCreateInputSchema,
  publicProductListQuerySchema,
  slugSchema,
  type BrandCreateInput,
  type CollectionCreateInput,
  type ProductCreateInput,
  type PublicProductListQuery,
} from "@/server/catalog/schemas";

export type SeedWriteResult<T> = {
  action: "created" | "updated" | "unchanged";
  value: T;
};

function assertSeedOwnership(existing: { seed?: SeedMetadata }, seed: SeedMetadata, slug: string): void {
  if (existing.seed?.key !== seed.key) {
    throw new Error(`Seed conflict for slug "${slug}". The existing record is not owned by seed key "${seed.key}".`);
  }
}

export class ProductRepository {
  constructor(private readonly products: MongoCollection<ProductDocument>) {}

  async create(rawInput: ProductCreateInput): Promise<Product> {
    const input = productCreateInputSchema.parse(rawInput);
    const document = toProductDocument(input);
    await this.products.insertOne(document);
    return toProduct(document);
  }

  async findPublicBySlug(rawSlug: string): Promise<Product | null> {
    const slug = slugSchema.parse(rawSlug);
    const document = await this.products.findOne({ slug, status: "active" });
    return document && isPublicCatalogStatus(document.status) ? toProduct(document) : null;
  }

  async listPublic(rawQuery: PublicProductListQuery = { limit: 24 }): Promise<Product[]> {
    const { limit, audience, brandId, collectionId } = publicProductListQuerySchema.parse(rawQuery);
    const filter: Filter<ProductDocument> = { status: "active" };
    if (audience) filter.audience = audience;
    if (brandId) filter.brandId = new ObjectId(brandId);
    if (collectionId) filter.collectionIds = new ObjectId(collectionId);
    const documents = await this.products.find(filter).sort({ createdAt: -1, _id: -1 }).limit(limit).toArray();
    return documents.filter((document) => isPublicCatalogStatus(document.status)).map(toProduct);
  }

  async upsertSeed(rawInput: ProductCreateInput, seed: SeedMetadata): Promise<SeedWriteResult<Product>> {
    const input = productCreateInputSchema.parse(rawInput);
    const existing = await this.products.findOne({ slug: input.slug });
    const document = toProductDocument(input);
    document.seed = seed;

    if (!existing) {
      await this.products.insertOne(document);
      return { action: "created", value: toProduct(document) };
    }

    assertSeedOwnership(existing, seed, input.slug);
    const variants = document.variants.map((variant) => ({
      ...variant,
      id: existing.variants.find((existingVariant) => existingVariant.sku === variant.sku)?.id ?? variant.id,
    }));
    const ownedFields = { ...document, _id: existing._id, createdAt: existing.createdAt, updatedAt: existing.updatedAt, variants };

    if (isDeepStrictEqual(existing, ownedFields)) {
      return { action: "unchanged", value: toProduct(existing) };
    }

    await this.products.updateOne({ _id: existing._id }, { $set: { ...ownedFields, updatedAt: new Date() } });
    return { action: "updated", value: toProduct({ ...ownedFields, updatedAt: new Date() }) };
  }
}

export class BrandRepository {
  constructor(private readonly brands: MongoCollection<BrandDocument>) {}

  async create(rawInput: BrandCreateInput): Promise<Brand> {
    const input = brandCreateInputSchema.parse(rawInput);
    const document = toBrandDocument(input);
    await this.brands.insertOne(document);
    return toBrand(document);
  }

  async findPublicBySlug(rawSlug: string): Promise<Brand | null> {
    const slug = slugSchema.parse(rawSlug);
    const document = await this.brands.findOne({ slug, status: "active" });
    return document && isPublicCatalogStatus(document.status) ? toBrand(document) : null;
  }

  async findPublicById(rawId: string): Promise<Brand | null> {
    const id = objectIdSchema.parse(rawId);
    const document = await this.brands.findOne({ _id: new ObjectId(id), status: "active" });
    return document && isPublicCatalogStatus(document.status) ? toBrand(document) : null;
  }

  async listPublic(): Promise<Brand[]> {
    const documents = await this.brands.find({ status: "active" }).sort({ name: 1, _id: 1 }).toArray();
    return documents.filter((document) => isPublicCatalogStatus(document.status)).map(toBrand);
  }

  async upsertSeed(rawInput: BrandCreateInput, seed: SeedMetadata): Promise<SeedWriteResult<Brand>> {
    const input = brandCreateInputSchema.parse(rawInput);
    const existing = await this.brands.findOne({ slug: input.slug });
    const document = { ...toBrandDocument(input), seed };

    if (!existing) {
      await this.brands.insertOne(document);
      return { action: "created", value: toBrand(document) };
    }

    assertSeedOwnership(existing, seed, input.slug);
    const ownedFields = { ...document, _id: existing._id, createdAt: existing.createdAt, updatedAt: existing.updatedAt };
    if (isDeepStrictEqual(existing, ownedFields)) {
      return { action: "unchanged", value: toBrand(existing) };
    }

    await this.brands.updateOne({ _id: existing._id }, { $set: { ...ownedFields, updatedAt: new Date() } });
    return { action: "updated", value: toBrand({ ...ownedFields, updatedAt: new Date() }) };
  }
}

export class CollectionRepository {
  constructor(private readonly collections: MongoCollection<CollectionDocument>) {}

  async create(rawInput: CollectionCreateInput): Promise<Collection> {
    const input = collectionCreateInputSchema.parse(rawInput);
    const document = toCollectionDocument(input);
    await this.collections.insertOne(document);
    return toCollection(document);
  }

  async findPublicBySlug(rawSlug: string): Promise<Collection | null> {
    const slug = slugSchema.parse(rawSlug);
    const document = await this.collections.findOne({ slug, status: "active" });
    return document && isPublicCatalogStatus(document.status) ? toCollection(document) : null;
  }

  async listPublic(): Promise<Collection[]> {
    const documents = await this.collections.find({ status: "active" }).sort({ sortOrder: 1, _id: 1 }).toArray();
    return documents.filter((document) => isPublicCatalogStatus(document.status)).map(toCollection);
  }

  async upsertSeed(rawInput: CollectionCreateInput, seed: SeedMetadata): Promise<SeedWriteResult<Collection>> {
    const input = collectionCreateInputSchema.parse(rawInput);
    const existing = await this.collections.findOne({ slug: input.slug });
    const document = { ...toCollectionDocument(input), seed };

    if (!existing) {
      await this.collections.insertOne(document);
      return { action: "created", value: toCollection(document) };
    }

    assertSeedOwnership(existing, seed, input.slug);
    const ownedFields = { ...document, _id: existing._id, createdAt: existing.createdAt, updatedAt: existing.updatedAt };
    if (isDeepStrictEqual(existing, ownedFields)) {
      return { action: "unchanged", value: toCollection(existing) };
    }

    await this.collections.updateOne({ _id: existing._id }, { $set: { ...ownedFields, updatedAt: new Date() } });
    return { action: "updated", value: toCollection({ ...ownedFields, updatedAt: new Date() }) };
  }
}

export async function getProductRepository(): Promise<ProductRepository> {
  const database = await getDatabase();
  return new ProductRepository(database.collection<ProductDocument>(databaseCollections.products));
}

export async function getBrandRepository(): Promise<BrandRepository> {
  const database = await getDatabase();
  return new BrandRepository(database.collection<BrandDocument>(databaseCollections.brands));
}

export async function getCollectionRepository(): Promise<CollectionRepository> {
  const database = await getDatabase();
  return new CollectionRepository(database.collection<CollectionDocument>(databaseCollections.collections));
}
