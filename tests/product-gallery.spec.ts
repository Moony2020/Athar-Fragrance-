import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("development Product Gallery fixtures", () => {
  test.skip(!fixture, "Gallery fixture assertions run only in development.");

  test("multi-media Product starts with deterministic first media and supports pointer and keyboard selection", async ({ page }) => {
    await page.goto("/products/athar-test-no-01");

    const gallery = page.getByRole("region", { name: "Product media" });
    await expect(gallery.getByRole("img", { name: "Eros front view" })).toBeVisible();
    const second = gallery.getByRole("button", { name: /Show product media 2: Eros detail view/ });
    await expect(second).toHaveAttribute("aria-pressed", "false");
    await second.click();
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(gallery.getByRole("img", { name: "Eros detail view" })).toBeVisible();

    await page.getByRole("button", { name: /Show product media 1/ }).focus();
    await page.keyboard.press("Enter");
    await expect(gallery.getByRole("button", { name: /Show product media 1/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("BOSS Bottled exposes its ordered product-media rail and preserves PDP information", async ({ page }) => {
    await page.goto("/products/cedar-study");
    await expect(page.getByRole("img", { name: "BOSS Bottled front view" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Show product media/ })).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "BOSS Bottled" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toHaveText(/Shop\s*\/\s*BOSS Bottled – Eau de Toilette/);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByText("ATHAR Atelier", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Fragrance notes" })).toContainText("Cedar");
  });

  test("Acqua di Giò now uses its authored development media", async ({ page }) => {
    await page.goto("/products/no-media-study");
    await expect(page.getByRole("img", { name: "Acqua di Giò front view" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Show product media/ })).toHaveCount(3);
  });

  test("gallery has no page overflow at supported viewports", async ({ page }) => {
    await page.goto("/products/athar-test-no-01");
    for (const width of [360, 430, 768, 1280, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });
});

test("production Product gallery never exposes fictional media", async ({ page }) => {
  test.skip(fixture, "Development intentionally uses fictional gallery data.");
  const response = await page.goto("/products/athar-test-no-01");
  expect([404, 200]).toContain(response?.status());
  await expect(page.getByRole("region", { name: "Product media" })).toHaveCount(0);
  await expect(page.getByText("Eros", { exact: true })).toHaveCount(0);
});
