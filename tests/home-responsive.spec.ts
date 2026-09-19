import { expect, test } from "@playwright/test";

const viewports = [
  { name: "small mobile", width: 360, height: 800 },
  { name: "large mobile", width: 430, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
  { name: "wide desktop", width: 1600, height: 1000 },
];

for (const viewport of viewports) {
  test(`the hero has no horizontal overflow at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Scents That Stay With You" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore the fragrance" })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
