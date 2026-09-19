import type { Brand, Collection, FragranceNotes, Product, ProductMedia } from "@/server/catalog/domain";

export type CatalogProductCard = {
  slug: string;
  brandName: string;
  name: string;
  priceLabel: string;
  variantLabel: string;
  mediaAlt: string | null;
  isAvailable: boolean;
};

export type CatalogCollectionCard = {
  slug: string;
  name: string;
  description: string | null;
};

/** Deliberately narrow public Brand presentation model. */
export type CatalogBrandCard = {
  slug: string;
  name: string;
  description: string | null;
  mediaAlt: string | null;
};

export type CatalogProductDetailVariant = {
  sizeMl: number;
  priceMinor: number;
  compareAtPriceMinor: number | null;
  priceLabel: string;
  availability: "available" | "unavailable";
};

/** Rich public PDP model; it intentionally remains separate from the compact catalog-card contract. */
export type CatalogProductDetail = {
  slug: string;
  name: string;
  brand: Pick<CatalogBrandCard, "slug" | "name">;
  shortDescription: string | null;
  description: string;
  audience: Product["audience"];
  fragranceFamily: string;
  notes: FragranceNotes;
  media: Pick<ProductMedia, "url" | "alt" | "width" | "height" | "position">[];
  variants: CatalogProductDetailVariant[];
  priceLabel: string;
  isAvailable: boolean;
};

export function formatMoneyMinor(value: number, currency: string): string {
  const major = value / 100;
  if (currency === "SEK") {
    return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(major)} kr`;
  }
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(major);
}

export function toCatalogProductCard(product: Product, brand: Brand | null): CatalogProductCard {
  const activeVariants = product.variants.filter((variant) => variant.isActive);
  const lowestPrice = activeVariants.reduce<number | null>(
    (lowest, variant) => (lowest === null || variant.priceMinor < lowest ? variant.priceMinor : lowest),
    null,
  );
  const variantLabel = activeVariants.length === 1 ? `${activeVariants[0].sizeMl} ml` : activeVariants.length > 1 ? `${activeVariants.length} sizes` : "Unavailable";
  const price = lowestPrice === null ? "Unavailable" : formatMoneyMinor(lowestPrice, product.currency);

  return {
    slug: product.slug,
    brandName: brand?.name ?? "ATHAR",
    name: product.name,
    priceLabel: activeVariants.length > 1 && lowestPrice !== null ? `From ${price}` : price,
    variantLabel,
    mediaAlt: product.media.at(0)?.alt ?? null,
    isAvailable: activeVariants.length > 0,
  };
}

export function toCatalogProductDetail(product: Product, brand: Brand): CatalogProductDetail {
  const variants = product.variants
    .filter((variant) => variant.isActive)
    .sort((left, right) => left.sizeMl - right.sizeMl)
    .map((variant) => ({
      sizeMl: variant.sizeMl,
      priceMinor: variant.priceMinor,
      compareAtPriceMinor: variant.compareAtPriceMinor ?? null,
      priceLabel: formatMoneyMinor(variant.priceMinor, product.currency),
      availability: variant.inventoryQuantity > 0 ? "available" as const : "unavailable" as const,
    }));
  const lowestPrice = Math.min(...variants.map((variant) => variant.priceMinor));
  return {
    slug: product.slug,
    name: product.name,
    brand: { slug: brand.slug, name: brand.name },
    shortDescription: product.shortDescription ?? null,
    description: product.description,
    audience: product.audience,
    fragranceFamily: product.fragranceFamily,
    notes: product.notes,
    media: product.media
      .slice()
      .sort((left, right) => left.position - right.position)
      .map(({ url, alt, width, height, position }) => ({ url, alt, width, height, position })),
    variants,
    priceLabel: variants.length > 1 ? `From ${formatMoneyMinor(lowestPrice, product.currency)}` : variants[0].priceLabel,
    isAvailable: variants.some((variant) => variant.availability === "available"),
  };
}

export function toCatalogCollectionCard(collection: Collection): CatalogCollectionCard {
  return { slug: collection.slug, name: collection.name, description: collection.description ?? null };
}

export function toCatalogBrandCard(brand: Brand): CatalogBrandCard {
  return {
    slug: brand.slug,
    name: brand.name,
    description: brand.description ?? null,
    mediaAlt: brand.logo?.alt ?? null,
  };
}
