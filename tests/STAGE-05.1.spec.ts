import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("Stage 5.1 commerce-boundary audit", () => {
  test.skip(!fixture, "Owner-UI assertions run against the fictional development catalog.");

  test("preserves the PDP control design before the later bounded Add-to-bag activation", async ({ page }) => {
    await page.goto("/products/cedar-study");
    const purchase = page.getByRole("region", { name: "Purchase options" });
    await expect(purchase.getByRole("button", { name: "Increase quantity" })).toBeEnabled();
    await expect(purchase.getByRole("button", { name: "Add to bag" })).toBeEnabled();
    await expect(purchase.getByRole("button", { name: /wishlist/i })).toBeDisabled();
    await expect(purchase.getByRole("group", { name: "Quantity" })).toBeVisible();
  });

  test("keeps ProductCard local affordances free of commerce mutations", async ({ page }) => {
    const nonReadRequests: string[] = [];
    page.on("request", (request) => {
      if (!["GET", "HEAD"].includes(request.method())) nonReadRequests.push(`${request.method()} ${request.url()}`);
    });
    await page.goto("/shop");
    const card = page.getByRole("article").filter({ hasText: "Cedar Study" });
    await card.getByRole("button", { name: /wishlist/i }).click();
    await expect(card.getByRole("button", { name: /Remove Cedar Study from wishlist/ })).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => nonReadRequests).toEqual([]);
  });
});
