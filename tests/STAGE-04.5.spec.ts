import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("Stage 4.5 Related fragrances merchandising", () => {
  test("excludes the current Product, deduplicates, bounds results, and uses canonical PDP links", async ({ page }) => {
    test.skip(!fixture, "Stage 4.5 assertions run only in development fixture mode.");
    await page.goto("/products/athar-test-no-01");
    const related = page.getByRole("region", { name: "Related fragrances" });
    const cards = related.getByRole("article");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(4);
    const names = await cards.evaluateAll((items) => items.map((item) => item.getAttribute("aria-label")));
    expect(new Set(names).size).toBe(names.length);
    expect(names).not.toContain("Versace Eros Eau de Parfum");
    for (const card of await cards.all()) {
      await expect(card.getByRole("link", { name: /View .+/ })).toHaveAttribute("href", /^\/products\/[a-z0-9-]+$/);
    }
  });

  test("preserves Related design and ProductCard size presentation across supported widths", async ({ page }) => {
    test.skip(!fixture, "Stage 4.5 assertions run only in development fixture mode.");
    for (const width of [360, 430, 768, 1280, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/products/cedar-study");
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    await expect(page.getByRole("region", { name: "Related fragrances" }).getByRole("group", { name: /Choose .+ size/ }).first()).toBeVisible();
  });

  test("production Product routes do not expose fictional Related fixtures", async ({ page }) => {
    test.skip(fixture, "Development intentionally uses fictional merchandising fixtures.");
    const response = await page.goto("/products/athar-test-no-01");
    expect([404, 200]).toContain(response?.status());
    await expect(page.getByRole("region", { name: "Related fragrances" })).toHaveCount(0);
    await expect(page.getByText("BOSS Bottled", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Eros", { exact: true })).toHaveCount(0);
  });
});
