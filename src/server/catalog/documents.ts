import { ObjectId } from "mongodb";

import type { Brand, Collection, Product, ProductVariant } from "@/server/catalog/domain";
import type { BrandCreateInput, CollectionCreateInput, ProductCreateInput } from "@/server/catalog/schemas";

export type SeedMetadata = {
  key: string;
  fingerprint: string;
  version: 1;
};

export type ProductDocument = Omit<Product, "id" | "brandId" | "collectionIds" | "variants"> & {
  _id: ObjectId;
  brandId: ObjectId;
  collectionIds: ObjectId[];
  variants: ProductVariant[];
  seed?: SeedMetadata;
};

export type BrandDocument = Omit<Brand, "id"> & { _id: ObjectId; seed?: SeedMetadata };
export type CollectionDocument = Omit<Collection, "id"> & { _id: ObjectId; seed?: SeedMetadata };

export function toProductDocument(input: ProductCreateInput, now = new Date()): ProductDocument {
  return {
    _id: new ObjectId(),
    ...input,
    brandId: new ObjectId(input.brandId),
    collectionIds: input.collectionIds.map((id) => new ObjectId(id)),
    variants: input.variants.map((variant) => ({ ...variant, id: new ObjectId().toHexString() })),
    createdAt: now,
    updatedAt: now,
  };
}

export function toBrandDocument(input: BrandCreateInput, now = new Date()): BrandDocument {
  return { _id: new ObjectId(), ...input, createdAt: now, updatedAt: now };
}

export function toCollectionDocument(input: CollectionCreateInput, now = new Date()): CollectionDocument {
  return { _id: new ObjectId(), ...input, createdAt: now, updatedAt: now };
}

export function toProduct(document: ProductDocument): Product {
  const product = { ...document };
  delete product.seed;
  return {
    ...product,
    id: document._id.toHexString(),
    brandId: document.brandId.toHexString(),
    collectionIds: document.collectionIds.map((id) => id.toHexString()),
  };
}

export function toBrand(document: BrandDocument): Brand {
  const brand = { ...document };
  delete brand.seed;
  return { ...brand, id: document._id.toHexString() };
}

export function toCollection(document: CollectionDocument): Collection {
  const collection = { ...document };
  delete collection.seed;
  return { ...collection, id: document._id.toHexString() };
}
