import { expect, test } from "@playwright/test";

const fixture = process.env.CATALOG_FIXTURE_RUNTIME === "1";

test.describe("Stage 5.4 guest wishlist", () => {
  test.skip(!fixture, "Wishlist activation uses development fixtures.");
  test("PDP and gallery hearts synchronize and wishlist removal reaches empty state", async ({ page, context }) => {
    await page.goto("/products/athar-test-no-01");
    const purchase = page.getByRole("region", { name: "Purchase options" });
    const gallery = page.getByRole("region", { name: "Product media" });
    await purchase.getByRole("button", { name: "Add Eros to wishlist" }).click();
    await expect(gallery.getByRole("button", { name: "Remove Eros from wishlist" })).toBeVisible();
    await gallery.getByRole("button", { name: "Remove Eros from wishlist" }).click();
    await expect(purchase.getByRole("button", { name: "Add Eros to wishlist" })).toBeVisible();
    await page.goto("/shop");
    const card = page.getByRole("article").filter({ hasText: "Eros" });
    await card.getByRole("button", { name: "Add Eros to wishlist" }).click();
    await expect(card.getByRole("button", { name: "Remove Eros from wishlist" })).toBeVisible();
    const wishlistCookie = (await context.cookies()).find((cookie) => cookie.name === "athar_guest_wishlist");
    expect(wishlistCookie?.value).toMatch(/^[A-Za-z0-9_-]{32,128}$/);
    expect(wishlistCookie).toMatchObject({ httpOnly: true, sameSite: "Lax", path: "/" });
    await page.goto("/wishlist");
    await expect(page.getByRole("link", { name: "View Eros", exact: true })).toHaveAttribute("href", "/products/athar-test-no-01");
    const wishlistCard = page.getByRole("article").filter({ hasText: "Eros" });
    await expect(wishlistCard).toHaveCount(1);
    const removeButton = wishlistCard.getByRole("button", { name: "Remove Eros from wishlist" });
    await expect(removeButton).toHaveCount(1);
    await removeButton.click();
    await expect(page.getByRole("heading", { name: "Your wishlist is empty" })).toBeVisible();
    await page.goto("/wishlist");
    await expect(page.getByRole("heading", { name: "Your wishlist is empty" })).toBeVisible();
  });
});
