import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("Stage 4.4 Product content audit", () => {
  test.skip(!fixture, "Stage 4.4 content assertions run only in development fixture mode.");

  test("renders canonical description, mapped family/audience, and structured notes", async ({ page }) => {
    await page.goto("/products/athar-test-no-01");
    const information = page.getByRole("region", { name: "Product information" });
    await expect(information).toContainText("A safe test record used to verify the ATHAR catalog bootstrap pipeline.");
    await expect(information).toContainText("Amber Woody");
    await expect(information).toContainText("Unisex");
    await expect(information.getByRole("region", { name: "Fragrance notes" })).toContainText("Top");
    await expect(information.getByRole("region", { name: "Fragrance notes" })).toContainText("Heart");
    await expect(information.getByRole("region", { name: "Fragrance notes" })).toContainText("Base");
  });

  test("does not fabricate unsupported concentration, ingredients, or operational claims", async ({ page }) => {
    await page.goto("/products/cedar-study");
    const information = page.getByRole("region", { name: "Product information" });
    await expect(information.getByText("Concentration", { exact: true })).toHaveCount(0);
    await expect(information.getByText("Ingredients", { exact: true })).toHaveCount(0);
    await expect(information.getByText("How to wear", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Purchase options" })).toContainText("Delivery information varies by order.");
    await expect(page.getByRole("region", { name: "Purchase options" })).toContainText("House");
    await expect(page.getByRole("region", { name: "Purchase options" })).not.toContainText("guaranteed");
  });

  test("preserves related catalog links and inert future-commerce controls", async ({ page }) => {
    await page.goto("/products/athar-test-no-01");
    await expect(page.getByRole("region", { name: "Related fragrances" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Purchase options" }).getByRole("button", { name: "ADD TO BAG" })).toBeDisabled();
    await expect(page.getByRole("region", { name: "Purchase options" }).getByRole("button", { name: "Add to wishlist" })).toBeDisabled();
  });
});
