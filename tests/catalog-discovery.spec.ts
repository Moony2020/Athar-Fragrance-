import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";
test.describe("development discovery fixtures", () => {
  test.skip(!fixture, "Discovery fixture assertions run only in development.");
  test("search, filters, sorting, and route scope use URL state", async ({ page }) => {
    await page.goto("/shop?q=cedar&sort=price-desc");
    await expect(page.getByText("Cedar Study", { exact: true })).toBeVisible();
    await expect(page.getByText("ATHAR Test No. 01", { exact: true })).toHaveCount(0);
    await page.goto("/shop?brand=athar-atelier&family=woody");
    await expect(page.getByText("Cedar Study", { exact: true })).toBeVisible();
    await page.goto("/shop?audience=unisex");
    await expect(page.getByText("ATHAR Test No. 01", { exact: true })).toBeVisible();
    await expect(page.getByText("Cedar Study", { exact: true })).toHaveCount(0);
    await page.goto("/shop?collection=test-men");
    await expect(page.getByText("Cedar Study", { exact: true })).toBeVisible();
    await page.goto("/shop?sort=price-asc");
    await expect(page.getByRole("article").first()).toContainText("No Media Study");
    await page.goto("/shop?sort=price-desc");
    await expect(page.getByRole("article").first()).toContainText("Luminous Fig");
    await page.goto("/shop/women?audience=men");
    await expect(page.getByText("ATHAR Test No. 01", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Cedar Study", { exact: true })).toHaveCount(0);
    await expect(page.getByText("No public fragrances are available in this selection.", { exact: true })).toBeVisible();
  });
  test("collection route scope cannot be replaced by URL collection state", async ({ page }) => {
    await page.goto("/collections/test-men?collection=test-unisex");
    await expect(page.getByText("Cedar Study", { exact: true })).toBeVisible();
    await expect(page.getByText("ATHAR Test No. 01", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Clear all" })).toHaveAttribute("href", "/collections/test-men");
  });
  test("brand route scope cannot be replaced by URL brand state", async ({ page }) => {
    await page.goto("/brands/athar-atelier?brand=quiet-test-house");
    await expect(page.getByText("Cedar Study", { exact: true })).toBeVisible();
    await expect(page.getByText("No fragrances match these filters.", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Clear all" })).toHaveAttribute("href", "/brands/athar-atelier");
  });
  test("safe malformed search and filters do not expose private products", async ({ page }) => {
    await page.goto("/shop?q=%5B%5E%24.*%5D&sort=invalid&brand=%24where");
    await expect(page.getByText("Floral Study", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Archive Sample", { exact: true })).toHaveCount(0);
    await page.goto(`/shop?q=${"x".repeat(81)}&audience=unknown&family=bad_value&collection=NOT_VALID&sort=drop`);
    await expect(page.getByText("ATHAR Test No. 01", { exact: true })).toBeVisible();
    await page.goto("/shop?q=cedar&sort=drop");
    await expect(page.getByText("Cedar Study", { exact: true })).toBeVisible();
  });
});

test("production query state preserves unavailable fixture isolation", async ({ page }) => {
  test.skip(fixture, "Development intentionally uses fictional data.");
  await page.goto("/shop?q=cedar&brand=athar-atelier&sort=price-desc");
  await expect(page.getByRole("status")).toHaveText("Catalog browsing is temporarily unavailable.");
  await expect(page.getByText("ATHAR Test No. 01", { exact: true })).toHaveCount(0);
});
