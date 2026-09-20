import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("development Product Gallery fixtures", () => {
  test.skip(!fixture, "Gallery fixture assertions run only in development.");

  test("multi-media Product starts with deterministic first media and supports pointer and keyboard selection", async ({ page }) => {
    await page.goto("/products/athar-test-no-01");

    const gallery = page.getByRole("region", { name: "Product media" });
    await expect(gallery.getByRole("img", { name: "Fictional ATHAR Test No. 01 front view" })).toBeVisible();
    const second = gallery.getByRole("button", { name: /Show product media 2: Fictional ATHAR Test No\. 01 detail view/ });
    await expect(second).toHaveAttribute("aria-pressed", "false");
    await second.click();
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(gallery.getByRole("img", { name: "Fictional ATHAR Test No. 01 detail view" })).toBeVisible();

    await page.getByRole("button", { name: /Show product media 1/ }).focus();
    await page.keyboard.press("Enter");
    await expect(gallery.getByRole("button", { name: /Show product media 1/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("Cedar Study exposes its ordered product-media rail and preserves PDP information", async ({ page }) => {
    await page.goto("/products/cedar-study");
    await expect(page.getByRole("img", { name: "Fictional Cedar Study bottle, front view" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Show product media/ })).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "Cedar Study" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "ATHAR Atelier" })).toHaveAttribute("href", "/brands/athar-atelier");
    await expect(page.getByRole("region", { name: "Fragrance notes" })).toContainText("Cedar");
  });

  test("No Media Study now uses its authored fictional media", async ({ page }) => {
    await page.goto("/products/no-media-study");
    await expect(page.getByRole("img", { name: "Fictional No Media Study bottle, front view" })).toBeVisible();
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
  await expect(page.getByText("ATHAR Test No. 01", { exact: true })).toHaveCount(0);
});
