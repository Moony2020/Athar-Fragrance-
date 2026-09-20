import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("Stage 5.3 Cart page and Header count", () => {
  test.skip(!fixture, "Cart management is verified against the fictional development catalog.");

  test("renders an empty bag, then preserves PDP-to-Header-to-Cart continuity", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "Your bag is empty" })).toBeVisible();
    await page.goto("/products/athar-test-no-01");
    await page.getByRole("region", { name: "Purchase options" }).getByRole("button", { name: "Add to bag" }).click();
    await expect(page.getByText(/Added to bag\. 1 item in bag\./)).toBeVisible();
    await expect(page.getByRole("link", { name: "Shopping bag, 1 item" })).toBeVisible();
    await page.getByRole("link", { name: "Shopping bag, 1 item" }).click();
    await expect(page.getByRole("heading", { name: "Your bag" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Eros", exact: true })).toHaveAttribute("href", "/products/athar-test-no-01");
    await expect(page.getByText("Subtotal", { exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: "Your bag" })).toContainText("1 299 kr");
    await page.getByRole("button", { name: "Decrease Eros quantity" }).click();
    await expect(page.getByRole("heading", { name: "Your bag is empty" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Shopping bag, 0 items" })).toBeVisible();
  });

  test("updates and removes a canonical line while keeping the Header count consistent", async ({ page }) => {
    await page.goto("/products/athar-test-no-01");
    const purchase = page.getByRole("region", { name: "Purchase options" });
    await purchase.getByRole("button", { name: "Increase quantity" }).click();
    await purchase.getByRole("button", { name: "Add to bag" }).click();
    await expect(page.getByText(/Added to bag\. 2 items in bag\./)).toBeVisible();
    await expect(page.getByRole("link", { name: "Shopping bag, 2 items" })).toBeVisible();
    await page.getByRole("link", { name: "Shopping bag, 2 items" }).click();
    await page.getByRole("button", { name: /Increase Eros quantity/ }).click();
    await expect(page.getByRole("link", { name: "Shopping bag, 3 items" })).toBeVisible();
    await page.getByRole("button", { name: /Remove Eros from bag/ }).click();
    await expect(page.getByRole("heading", { name: "Your bag is empty" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Shopping bag, 0 items" })).toBeVisible();
  });
});

test("production Cart route does not expose fictional Cart data", async ({ page }) => {
  test.skip(fixture, "Development intentionally uses the ephemeral Cart adapter.");
  await page.goto("/cart");
  await expect(page.getByText("Eros", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Shopping bag, 0 items" })).toBeVisible();
});
