"use client";

import { useState } from "react";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel/ProductPurchasePanel";
import { ProductVariantSelector } from "@/components/product/ProductVariantSelector/ProductVariantSelector";
import type { CatalogProductDetailVariant } from "@/server/catalog/read-model";

type Props = { productSlug: string; productName: string; initialWishlisted: boolean; currency: string; variants: CatalogProductDetailVariant[] };

/** The smallest PDP client boundary: selected public variant is shared only by selector and purchase controls. */
export function ProductPurchaseArea({ productSlug, productName, initialWishlisted, currency, variants }: Props) {
  const initial = variants.find((variant) => variant.availability === "available") ?? variants[0];
  const [selectedId, setSelectedId] = useState(initial?.id ?? "");
  const selected = variants.find((variant) => variant.id === selectedId) ?? initial;
  if (!selected) return null;
  return <><ProductVariantSelector currency={currency} onSelect={setSelectedId} selectedId={selected.id} variants={variants} /><ProductPurchasePanel initialWishlisted={initialWishlisted} productName={productName} currency={currency} productSlug={productSlug} selectedVariant={selected} /></>;
}
