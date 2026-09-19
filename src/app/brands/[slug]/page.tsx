import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandPage } from "@/components/catalog/BrandPage/BrandPage";
import { slugSchema } from "@/server/catalog/schemas";
import { getBrandBrowseData, getCatalogDiscoveryData, parsePublicDiscoveryQuery } from "@/server/catalog/services";

export const instant = false;

type BrandRouteProps = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

async function getBrandBrowse(rawSlug: string) {
  const parsed = slugSchema.safeParse(rawSlug);
  if (!parsed.success) notFound();
  return getBrandBrowseData(parsed.data);
}

export async function generateMetadata({ params, searchParams }: BrandRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const browse = await getBrandBrowse(slug);
  if (!browse.brand) return {};
  const query = parsePublicDiscoveryQuery(await searchParams);
  const base: Metadata = { title: `${browse.brand.name} | ATHAR`, description: browse.brand.description ?? `Browse ${browse.brand.name} fragrances at ATHAR.` };
  return query.q || query.audience || query.brand || query.family || query.collection || query.sort !== "name-asc" ? { ...base, robots: { index: false, follow: true }, alternates: { canonical: `/brands/${slug}` } } : base;
}

export default async function BrandRoute({ params, searchParams }: BrandRouteProps) {
  const { slug } = await params;
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) notFound();
  const discovery = await getCatalogDiscoveryData(parsePublicDiscoveryQuery(await searchParams), { brandSlug: parsed.data });
  const brand = discovery.options.brands.find((candidate) => candidate.slug === parsed.data) ?? null;
  if (discovery.availability === "available" && !brand) notFound();
  return <BrandPage browse={{ availability: discovery.availability, brand, products: discovery.products }} discovery={discovery} discoveryAction={`/brands/${parsed.data}`} />;
}
