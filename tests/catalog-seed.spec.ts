import { expect, test } from "@playwright/test";

import { developmentCatalogSeed } from "../src/server/catalog/seed/fixtures";
import {
  buildCatalogSeedPlan,
  CatalogSeedConflictError,
  CatalogSeedValidationError,
  validateCatalogSeedDataset,
} from "../src/server/catalog/seed/plan";
import { dryRunCatalogSeed } from "../src/server/catalog/seed/dry-run";
import { isPublicCatalogStatus } from "../src/server/catalog/visibility";

test("development catalog fixtures validate and produce a deterministic dry-run plan", () => {
  const result = dryRunCatalogSeed(developmentCatalogSeed);

  expect(result.wrote).toBe(false);
  expect(result.summary).toContain("DRY RUN — no database writes performed");
  expect(result.plan.summary.brand).toEqual({ create: 7, update: 0, unchanged: 0 });
  expect(result.plan.summary.collection).toEqual({ create: 4, update: 0, unchanged: 0 });
  expect(result.plan.summary.product).toEqual({ create: 7, update: 0, unchanged: 0 });
  expect(result.plan.dataset.products.find((product) => product.key === "athar-test-no-01")?.brandKey).toBe("versace");
});

test("an identical fixture rerun plans as unchanged, while a changed owned fixture plans as an update", () => {
  const first = buildCatalogSeedPlan(developmentCatalogSeed);
  const existing = first.items.map((item) => ({
    type: item.type,
    slug: item.slug,
    seed: { key: item.key, fingerprint: item.fingerprint, version: 1 as const },
  }));
  const second = buildCatalogSeedPlan(developmentCatalogSeed, existing);
  expect(second.items.every((item) => item.action === "unchanged")).toBe(true);

  const changed = structuredClone(developmentCatalogSeed);
  changed.products[0].input.description = "A changed fictional fixture description.";
  const changedPlan = buildCatalogSeedPlan(changed, existing);
  expect(changedPlan.items.find((item) => item.key === "athar-test-no-01")?.action).toBe("update");
});

test("seed planning refuses unrelated slug ownership conflicts before any write", () => {
  expect(() =>
    buildCatalogSeedPlan(developmentCatalogSeed, [
      { type: "brand", slug: "versace" },
    ]),
  ).toThrow(CatalogSeedConflictError);

  expect(() =>
    buildCatalogSeedPlan(developmentCatalogSeed, [
      { type: "product", slug: "cedar-study", seed: { key: "another-fixture", fingerprint: "abc", version: 1 } },
    ]),
  ).toThrow(/owned by/);
});

test("fixture validation catches bad references and cross-product SKU duplication", () => {
  const badReference = structuredClone(developmentCatalogSeed);
  badReference.products[0].brandKey = "missing-test-brand";
  expect(() => validateCatalogSeedDataset(badReference)).toThrow(CatalogSeedValidationError);

  const duplicateSku = structuredClone(developmentCatalogSeed);
  duplicateSku.products[1].input.variants[0].sku = "ATHAR-TEST-01-50";
  expect(() => validateCatalogSeedDataset(duplicateSku)).toThrow(/fixture variant SKUs must be unique/);
});

test("fictional fixture lifecycle covers public and non-public catalog states", () => {
  const statuses = developmentCatalogSeed.products.map((fixture) => fixture.input.status);
  expect(statuses.filter((status) => isPublicCatalogStatus(status)).length).toBe(5);
  expect(isPublicCatalogStatus("draft")).toBe(false);
  expect(isPublicCatalogStatus("archived")).toBe(false);
});
