import "server-only";

import type { CommerceProductResolver } from "@/commerce/domain";
import { getProductDetailData } from "@/server/catalog/services";

/** Canonical resolver used by future Cart/Wishlist mutation adapters; it never trusts a browser price or availability value. */
export const resolvePublicCommerceProduct: CommerceProductResolver = async (slug) => {
  const result = await getProductDetailData(slug);
  if (!result.product) return { availability: result.availability, product: null };
  return {
    availability: result.availability,
    product: {
      slug: result.product.slug,
      currency: result.product.currency,
      variants: result.product.variants.map((variant) => ({ id: variant.id, priceMinor: variant.priceMinor, availability: variant.availability })),
    },
  };
};
