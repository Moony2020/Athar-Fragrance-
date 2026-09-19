import { developmentCatalogSeed, type CatalogSeedDataset } from "@/server/catalog/seed/fixtures";
import { buildCatalogSeedPlan, formatSeedSummary, type CatalogSeedPlan, type SeedExistingRecord } from "@/server/catalog/seed/plan";

export type CatalogSeedDryRunResult = {
  plan: CatalogSeedPlan;
  summary: string;
  wrote: false;
};

/** Validates and plans entirely in memory. No database configuration or write is required. */
export function dryRunCatalogSeed(
  dataset: CatalogSeedDataset = developmentCatalogSeed,
  existingRecords: SeedExistingRecord[] = [],
): CatalogSeedDryRunResult {
  const plan = buildCatalogSeedPlan(dataset, existingRecords);
  return { plan, summary: formatSeedSummary(plan, true), wrote: false };
}
