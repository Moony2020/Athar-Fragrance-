import { developmentCatalogSeed } from "../src/server/catalog/seed/fixtures";
import { dryRunCatalogSeed } from "../src/server/catalog/seed/dry-run";
import { executeCatalogSeed } from "../src/server/catalog/seed/execute";

const write = process.argv.includes("--write");

async function main(): Promise<void> {
  const result = write ? await executeCatalogSeed(developmentCatalogSeed) : dryRunCatalogSeed(developmentCatalogSeed);
  console.log(result.summary);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown catalog seed failure.";
  console.error(`Catalog seed failed: ${message}`);
  process.exitCode = 1;
});
