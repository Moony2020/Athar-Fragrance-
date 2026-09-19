export const catalogStatuses = ["draft", "active", "archived"] as const;
export type CatalogStatus = (typeof catalogStatuses)[number];

export const audiences = ["women", "men", "unisex"] as const;
export type Audience = (typeof audiences)[number];

export type FragranceNotes = {
  top: string[];
  heart: string[];
  base: string[];
};

/** References provider-hosted media; image binary data is never stored in MongoDB. */
export type ProductMedia = {
  url: string;
  publicId?: string;
  alt: string;
  width?: number;
  height?: number;
  position: number;
  type: "image";
};

export type ProductVariant = {
  id: string;
  sku: string;
  sizeMl: number;
  priceMinor: number;
  compareAtPriceMinor?: number;
  inventoryQuantity: number;
  isActive: boolean;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: ProductMedia;
  status: CatalogStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  media?: ProductMedia;
  status: CatalogStatus;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  shortDescription?: string;
  description: string;
  audience: Audience;
  /** A normalized taxonomy key, e.g. "floral" or "amber-woody". */
  fragranceFamily: string;
  notes: FragranceNotes;
  media: ProductMedia[];
  variants: ProductVariant[];
  status: CatalogStatus;
  featured: boolean;
  bestseller: boolean;
  launchAt?: Date;
  collectionIds: string[];
  /** ISO 4217 currency for all variant money fields, e.g. SEK. */
  currency: string;
  createdAt: Date;
  updatedAt: Date;
};
