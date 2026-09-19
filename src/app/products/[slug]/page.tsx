import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product/ProductDetails/ProductDetails";
import { CatalogShell } from "@/components/catalog/CatalogShell/CatalogShell";
import { Container } from "@/components/ui/Container/Container";
import { getProductDetailData } from "@/server/catalog/services";

export const instant = false;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductDetailData(slug);
  if (!result.product) return {};
  return { title: `${result.product.name} | ATHAR`, description: result.product.shortDescription ?? result.product.description, alternates: { canonical: `/products/${result.product.slug}` } };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const result = await getProductDetailData(slug);
  if (result.availability === "unavailable") return <ProductUnavailable />;
  if (!result.product) notFound();
  return <ProductDetails product={result.product} />;
}

function ProductUnavailable() { return <CatalogShell><main><Container><p role="status">Product browsing is temporarily unavailable.</p></Container></main></CatalogShell>; }
