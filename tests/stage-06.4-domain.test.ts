import assert from "node:assert/strict";
import test from "node:test";

import { reconcileCartStates, reconcileWishlistStates } from "../src/server/commerce/reconciliation";

const resolve = async (slug: string) => slug === "stale" ? { availability: "available" as const, product: null } : { availability: "available" as const, product: { slug, currency: "SEK", variants: [{ id: "v1", priceMinor: 100, availability: "available" as const }, { id: "v2", priceMinor: 200, availability: "available" as const }] } };

test("guest cart merge combines same line, caps at 12, preserves variants, and drops stale lines", async () => {
  const merged = await reconcileCartStates(
    { lines: [{ productSlug: "cedar", variantId: "v1", quantity: 10 }, { productSlug: "cedar", variantId: "v2", quantity: 2 }] },
    { lines: [{ productSlug: "cedar", variantId: "v1", quantity: 5 }, { productSlug: "stale", variantId: "v1", quantity: 4 }] },
    resolve,
  );
  assert.deepEqual(merged, { lines: [{ productSlug: "cedar", variantId: "v1", quantity: 12 }, { productSlug: "cedar", variantId: "v2", quantity: 2 }] });
});

test("repeating the same merge after guest state is cleared is idempotent", async () => {
  const once = await reconcileCartStates({ lines: [] }, { lines: [{ productSlug: "cedar", variantId: "v1", quantity: 2 }] }, resolve);
  const twice = await reconcileCartStates(once, { lines: [] }, resolve);
  assert.deepEqual(twice, once);
});

test("wishlist merge is a deduplicated union with stale reconciliation", async () => {
  const merged = await reconcileWishlistStates({ productSlugs: ["cedar", "stale"] }, { productSlugs: ["cedar", "luminous"] }, resolve);
  assert.deepEqual(merged, { productSlugs: ["cedar", "luminous"] });
});
