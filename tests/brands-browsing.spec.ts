import { expect, test } from "@playwright/test";

const usesFixtureRuntime = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("development Brand fixture runtime", () => {
  test.skip(!usesFixtureRuntime, "These assertions run against the development fixture source only.");

  test("brands index exposes only active fictional Brands as semantic links", async ({ page }) => {
    await page.goto("/brands");
    await expect(page.getByRole("heading", { name: "Brands at ATHAR" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse ATHAR Atelier fragrances" })).toHaveAttribute("href", "/brands/athar-atelier");
    await expect(page.getByRole("link", { name: "Browse Quiet Test House fragrances" })).toHaveAttribute("href", "/brands/quiet-test-house");
    await expect(page.getByText("North Test Parfums", { exact: true })).toHaveCount(0);
  });

  test("an active Brand reuses the public product grid and hides non-public products", async ({ page }) => {
    await page.goto("/brands/athar-atelier");
    await expect(page).toHaveTitle("ATHAR Atelier | ATHAR");
    await expect(page.getByRole("list", { name: "Catalog products" })).toBeVisible();
    await expect(page.getByRole("article", { name: "ATHAR Atelier ATHAR Test No. 01" })).toBeVisible();
    await expect(page.getByText("Cedar Study", { exact: true })).toBeVisible();
    await expect(page.getByText("Floral Study", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Archive Sample", { exact: true })).toHaveCount(0);
  });

  test("a valid active empty Brand renders a deliberate accessible empty state", async ({ page }) => {
    await page.goto("/brands/quiet-test-house");
    await expect(page.getByRole("heading", { name: "Quiet Test House" })).toBeVisible();
    await expect(page.getByRole("status")).toHaveText("This brand has no public fragrances yet.");
  });
});

test("invalid and non-public Brand routes render not-found", async ({ page }) => {
  await page.goto("/brands/NOT_VALID");
  await expect(page.getByRole("heading", { name: "This page is not available." })).toBeVisible();

  if (usesFixtureRuntime) {
    await page.goto("/brands/north-test-parfums");
    await expect(page.getByRole("heading", { name: "This page is not available." })).toBeVisible();
  }
});

test("production without canonical catalog data never exposes fixture Brands", async ({ page }) => {
  test.skip(usesFixtureRuntime, "The development fixture run deliberately exercises the non-production source.");
  await page.goto("/brands");
  await expect(page.getByRole("status")).toHaveText("Brand browsing is temporarily unavailable.");
  await expect(page.getByText("ATHAR Atelier", { exact: true })).toHaveCount(0);
});

for (const width of [360, 430, 768, 1280, 1600]) {
  test(`Brand browsing has no page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/brands");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
