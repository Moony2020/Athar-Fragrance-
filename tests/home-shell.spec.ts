import { expect, test } from "@playwright/test";
import { instant } from "@next/playwright";

test("the public homepage shell contains the ATHAR hero", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Scents That Stay With You" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore the fragrance" })).toBeVisible();
  await expect(page.getByAltText("ATHAR Eau de Parfum bottle")).toBeVisible();
  await expect(page.getByRole("button", { name: "Watch our story is not available yet" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Shopping bag, 0 items" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shop by Collection" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bestselling Fragrances" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Discover Your Signature" })).toBeVisible();
});

test("the public homepage shell is available through the instant-navigation rig", async ({ page }) => {
  await instant(
    page,
    async () => {
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Scents That Stay With You" })).toBeVisible();
    },
    { baseURL: process.env.INSTANT_BASE_URL ?? process.env.BASE_URL ?? "http://127.0.0.1:3100" },
  );
});

test("Shop by Collection provides reachable presentation links without viewport overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Shop by Collection" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse For Her collection" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse For Him collection" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse Unisex collection" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse New Arrivals collection" })).toBeVisible();

  for (const width of [360, 430, 768, 1280, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("Bestselling Fragrances preserves the prototype product presentation with deferred links", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Bestselling Fragrances" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Dior Sauvage prototype presentation/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Versace Eros prototype presentation/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Yves Saint Laurent Libre prototype presentation/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Lancôme La Vie Est Belle prototype presentation/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Armani Acqua di Giò prototype presentation/ })).toBeVisible();

  for (const width of [360, 430, 768, 1280, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("Our Story preserves the prototype narrative and a deferred story link", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "More Than a Perfume, It’s a Feeling" })).toBeVisible();
  await expect(page.locator("blockquote").last()).toHaveText("“Fragrance turns moments into memories.”");
  await expect(page.locator("#story svg").last()).toBeVisible();
  await expect(page.getByRole("link", { name: "Discover Our Story" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("Fragrance Guide preserves the four prototype families with deferred links", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Discover Your Signature" })).toBeVisible();
  for (const family of ["Floral", "Woody", "Fresh", "Oriental"]) {
    await expect(page.getByRole("link", { name: `Explore ${family} fragrance family (not available yet)` })).toBeVisible();
  }

  for (const width of [360, 430, 768, 1280, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("the production footer preserves reachable homepage navigation without fake destinations", async ({ page }) => {
  await page.goto("/");

  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("heading", { name: "ATHAR" })).toBeVisible();
  await expect(footer.getByRole("navigation", { name: "Footer navigation" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Collections" })).toHaveAttribute("href", "#collections");
  await expect(footer.getByRole("link", { name: "Fragrance Guide" })).toHaveAttribute("href", "#guide");
  await expect(footer.getByText("Boutiques", { exact: true })).toBeVisible();
  await expect(footer.getByText("Contact", { exact: true })).toBeVisible();
  await expect(page.getByRole("main")).toHaveCount(1);

  for (const width of [360, 430, 768, 1280, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
