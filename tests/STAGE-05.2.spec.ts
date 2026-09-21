import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("Stage 5.2 PDP Add-to-bag", () => {
  test.skip(!fixture, "PDP Cart activation is verified with the fictional development catalog.");

  test("quantity stays bounded, Add-to-bag merges canonical lines, and creates an opaque httpOnly guest cookie", async ({ page, context }) => {
    await page.goto("/products/athar-test-no-01");
    const purchase = page.getByRole("region", { name: "Purchase options" });
    const increase = purchase.getByRole("button", { name: "Increase quantity" });
    const decrease = purchase.getByRole("button", { name: "Decrease quantity" });
    await expect(decrease).toBeDisabled();
    for (let index = 0; index < 11; index += 1) await increase.click();
    await expect(increase).toBeDisabled();
    await expect(purchase.getByRole("group", { name: "Quantity: 12" })).toBeVisible();
    for (let index = 0; index < 10; index += 1) await decrease.click();
    await expect(purchase.getByRole("group", { name: "Quantity: 2" })).toBeVisible();
    await purchase.getByRole("button", { name: "Add to bag" }).click();
    await expect(purchase.getByText(/Added to bag\. 2 items in bag\./)).toBeVisible();
    await increase.click();
    await purchase.getByRole("button", { name: "Add to bag" }).click();
    await expect(purchase.getByText(/Added to bag\. 5 items in bag\./)).toBeVisible();
    const cookie = (await context.cookies()).find((candidate) => candidate.name === "athar_guest_cart");
    expect(cookie).toMatchObject({ httpOnly: true, sameSite: "Lax", path: "/" });
    expect(cookie?.value).toMatch(/^[A-Za-z0-9_-]{32,128}$/);
  });

  test("available selected Variant is used, unavailable sizes stay blocked, and gallery/wishlist behavior is unchanged", async ({ page }) => {
    await page.goto("/products/athar-test-no-01");
    const media = page.getByRole("region", { name: "Product media" });
    const purchase = page.getByRole("region", { name: "Purchase options" });
    await media.getByRole("button", { name: /Show product media 2/ }).click();
    await expect(media.getByRole("button", { name: /Show product media 2/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("radio", { name: /100 ml/ })).toBeDisabled();
    await purchase.getByRole("button", { name: "Add to bag" }).click();
    await expect(purchase.getByText(/Added to bag\. 1 item in bag\./)).toBeVisible();
    await expect(page.getByRole("radio", { name: /50 ml/ })).toBeChecked();
    await expect(purchase.getByRole("button", { name: "Add Eros to wishlist" })).toBeEnabled();
  });

});

test("production without a durable Cart adapter cannot report a fictional add success", async ({ page }) => {
  test.skip(fixture, "Development intentionally uses the ephemeral Cart adapter.");
  await page.goto("/products/athar-test-no-01");
  await expect(page.getByText("Eros", { exact: true })).toHaveCount(0);
});
