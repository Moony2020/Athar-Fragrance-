import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage/CatalogPage";
import { getCatalogDiscoveryData, parsePublicDiscoveryQuery } from "@/server/catalog/services";

export const instant = false;

type ShopPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const query = parsePublicDiscoveryQuery(await searchParams);
  const base: Metadata = { title: "Shop | ATHAR", description: "Browse the ATHAR fragrance catalog." };
  return query.q || query.audience || query.brand || query.family || query.collection || query.sort !== "name-asc" ? { ...base, robots: { index: false, follow: true }, alternates: { canonical: "/shop" } } : base;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const query = parsePublicDiscoveryQuery(await searchParams);
  const browse = await getCatalogDiscoveryData(query);
  return <CatalogPage browse={browse} discovery={browse} eyebrow="The collection" title="Shop ATHAR" description="Fragrances composed for presence, intimacy and the moments that remain." emptyMessage="No public fragrances are available at the moment." />;
}
