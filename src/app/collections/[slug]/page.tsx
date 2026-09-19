import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog/CatalogPage/CatalogPage";
import { slugSchema } from "@/server/catalog/schemas";
import { getCatalogDiscoveryData, parsePublicDiscoveryQuery } from "@/server/catalog/services";

export const instant = false;

async function getCollectionBrowse(rawSlug: string, searchParams: Record<string, string | string[] | undefined> = {}) {
  const parsed = slugSchema.safeParse(rawSlug);
  if (!parsed.success) notFound();
  return getCatalogDiscoveryData(parsePublicDiscoveryQuery(searchParams), { collectionSlug: parsed.data });
}

type CollectionPageProps = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params, searchParams }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const browse = await getCollectionBrowse(slug);
  const collection = browse.collections.find((candidate) => candidate.slug === slug);
  if (!collection) return {};
  const query = parsePublicDiscoveryQuery(await searchParams);
  const base: Metadata = { title: `${collection.name} | ATHAR`, description: collection.description ?? "Browse an ATHAR fragrance collection." };
  return query.q || query.audience || query.brand || query.family || query.collection || query.sort !== "name-asc" ? { ...base, robots: { index: false, follow: true }, alternates: { canonical: `/collections/${slug}` } } : base;
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const browse = await getCollectionBrowse(slug, await searchParams);
  const collection = browse.collections.find((candidate) => candidate.slug === slug);
  if (browse.availability === "available" && !collection) notFound();
  return <CatalogPage browse={browse} discovery={browse} discoveryAction={`/collections/${slug}`} eyebrow="Collection" title={collection?.name ?? "Collection"} description={collection?.description ?? "Catalog browsing is temporarily unavailable."} emptyMessage="This collection has no public fragrances yet." />;
}
