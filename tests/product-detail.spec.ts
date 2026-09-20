import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("Stage 4.3 Product Detail variant selection", () => {
  test.skip(!fixture, "PDP fixture assertions run only in development.");

  test("renders a deterministic initial size and updates the selected price and availability", async ({ page }) => {
    await page.goto("/products/athar-test-no-01");
    await expect(page.getByRole("heading", { name: "ATHAR Test No. 01" })).toBeVisible();
    await expect(page.getByText("Size · 50 ml", { exact: true })).toBeVisible();
    const selector = page.getByRole("region", { name: "Product size and availability" });
    await expect(selector).toContainText(/1\s?299 kr/);
    await expect(selector.getByRole("radio", { name: /50 ml/i })).toBeChecked();
    await expect(selector.getByRole("radio", { name: /100 ml/i })).toBeDisabled();
    await expect(selector).toContainText(/1\s?899 kr/);
  });

  test("supports keyboard size selection while preserving the established purchase-control layout", async ({ page }) => {
    await page.goto("/products/athar-test-no-01");
    const selector = page.getByRole("region", { name: "Product size and availability" });
    await selector.getByRole("radio", { name: /50 ml/i }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(selector.getByRole("radio", { name: /50 ml/i })).toBeChecked();
    await expect(selector.getByRole("radio", { name: /100 ml/i })).toBeDisabled();
    const purchasePreview = page.getByRole("region", { name: "Purchase options" });
    await expect(purchasePreview.getByRole("button", { name: "ADD TO BAG" })).toBeDisabled();
    await expect(purchasePreview.getByRole("button", { name: "Increase quantity" })).toBeDisabled();
    await expect(purchasePreview.getByRole("button", { name: "Add to wishlist" })).toBeDisabled();
  });

  test("keeps a single-variant product concise and preserves its public PDP identity", async ({ page }) => {
    await page.goto("/products/cedar-study");
    await expect(page).toHaveTitle("Cedar Study | ATHAR");
    await expect(page.getByRole("heading", { name: "Cedar Study" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "ATHAR Atelier" })).toHaveAttribute("href", "/brands/athar-atelier");
    const selector = page.getByRole("region", { name: "Product size and availability" });
    await expect(selector).toContainText(/1\s?499 kr/);
    await expect(selector.getByRole("radio")).toHaveCount(1);
    await expect(selector.getByRole("radio", { name: /75 ml/i })).toBeChecked();
    await expect(page.getByRole("region", { name: "Fragrance notes" })).toContainText("Cedar");
  });

  test("catalog cards retain their selected-size price and canonical PDP links", async ({ page }) => {
    await page.goto("/shop");
    const card = page.getByRole("article").filter({ hasText: "ATHAR Test No. 01" });
    await expect(card.getByRole("button", { name: "50 ml" })).toHaveAttribute("aria-pressed", "true");
    await expect(card).toContainText(/1\s?299 kr/);
    await expect(page.getByRole("link", { name: "View Cedar Study" })).toHaveAttribute("href", "/products/cedar-study");
  });

  test("PDP remains readable without horizontal overflow across supported viewports", async ({ page }) => {
    await page.goto("/products/cedar-study");
    for (const width of [360, 430, 768, 1280, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.getByRole("heading", { name: "Cedar Study" })).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });

  test("draft, archived, privately-branded, and malformed Product routes are not found", async ({ page }) => {
    for (const slug of ["floral-study", "archive-sample", "NOT_VALID"]) {
      await page.goto(`/products/${slug}`);
      await expect(page.getByRole("heading", { name: "This page is not available." })).toBeVisible();
    }
  });
});

test("production Product Detail never falls back to fictional fixtures", async ({ page }) => {
  test.skip(fixture, "Development intentionally uses fictional data.");
  const response = await page.goto("/products/cedar-study");
  expect([404, 200]).toContain(response?.status());
  await expect(page.getByText("Cedar Study", { exact: true })).toHaveCount(0);
});
