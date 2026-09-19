import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("development Product Detail fixtures", () => {
  test.skip(!fixture, "PDP fixture assertions run only in development.");

  test("public Product Detail exposes only the approved PDP presentation", async ({ page }) => {
    await page.goto("/products/cedar-study");
    await expect(page).toHaveTitle("Cedar Study | ATHAR");
    await expect(page.getByRole("heading", { name: "Cedar Study" })).toBeVisible();
    await expect(page.getByRole("link", { name: "ATHAR Atelier" })).toHaveAttribute("href", "/brands/athar-atelier");
    await expect(page.getByRole("region", { name: "Available sizes" })).toContainText("75 ml");
    await expect(page.getByRole("region", { name: "Fragrance notes" })).toContainText("Cedar");
  });

  test("catalog cards link to the same canonical PDP identity", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("link", { name: /ATHAR Atelier Cedar Study/ })).toHaveAttribute("href", "/products/cedar-study");
  });

  test("non-public and malformed Product routes are not found", async ({ page }) => {
    await page.goto("/products/floral-study");
    await expect(page.getByRole("heading", { name: "This page is not available." })).toBeVisible();
    await page.goto("/products/NOT_VALID");
    await expect(page.getByRole("heading", { name: "This page is not available." })).toBeVisible();
  });
});

test("production Product Detail never falls back to fictional fixtures", async ({ page }) => {
  test.skip(fixture, "Development intentionally uses fictional data.");
  await page.goto("/products/cedar-study");
  await expect(page.getByRole("status")).toHaveText("Product browsing is temporarily unavailable.");
  await expect(page.getByText("Cedar Study", { exact: true })).toHaveCount(0);
});
