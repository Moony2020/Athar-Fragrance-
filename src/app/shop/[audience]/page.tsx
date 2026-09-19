import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog/CatalogPage/CatalogPage";
import type { Audience } from "@/server/catalog/domain";
import { getCatalogDiscoveryData, parsePublicDiscoveryQuery } from "@/server/catalog/services";

export const instant = false;

const audienceCopy: Record<Audience, { label: string; description: string }> = {
  women: { label: "For Her", description: "Browse the current ATHAR selection for her." },
  men: { label: "For Him", description: "Browse the current ATHAR selection for him." },
  unisex: { label: "Unisex", description: "Browse the current ATHAR unisex selection." },
};

function parseAudience(value: string): Audience | null {
  return value === "women" || value === "men" || value === "unisex" ? value : null;
}

type AudiencePageProps = { params: Promise<{ audience: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params, searchParams }: AudiencePageProps): Promise<Metadata> {
  const { audience: rawAudience } = await params;
  const audience = parseAudience(rawAudience);
  if (!audience) return {};
  const query = parsePublicDiscoveryQuery(await searchParams);
  const base: Metadata = { title: `${audienceCopy[audience].label} | ATHAR`, description: audienceCopy[audience].description };
  return query.q || query.audience || query.brand || query.family || query.collection || query.sort !== "name-asc" ? { ...base, robots: { index: false, follow: true }, alternates: { canonical: `/shop/${audience}` } } : base;
}

export default async function AudiencePage({ params, searchParams }: AudiencePageProps) {
  const { audience: rawAudience } = await params;
  const audience = parseAudience(rawAudience);
  if (!audience) notFound();
  const query = parsePublicDiscoveryQuery(await searchParams);
  const browse = await getCatalogDiscoveryData(query, { audience });
  const copy = audienceCopy[audience];
  return <CatalogPage browse={browse} discovery={browse} discoveryAction={`/shop/${audience}`} eyebrow="Shop by audience" title={copy.label} description={copy.description} emptyMessage="No public fragrances are available in this selection." />;
}
