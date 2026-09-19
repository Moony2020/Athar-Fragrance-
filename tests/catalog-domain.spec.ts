import { expect, test } from "@playwright/test";

import { toProduct, toProductDocument } from "../src/server/catalog/documents";
import { productCreateInputSchema } from "../src/server/catalog/schemas";

const fictionalProductInput = {
  slug: "athar-test-no-01",
  name: "ATHAR Test No. 01",
  brandId: "64b64c5f8b0e2d9f4d3b2a10",
  shortDescription: "A fictional catalog fixture.",
  description: "This record exists solely to validate ATHAR catalog-domain constraints.",
  audience: "unisex" as const,
  fragranceFamily: "amber-woody",
  notes: {
    top: ["Bergamot"],
    heart: ["Orange blossom"],
    base: ["Sandalwood"],
  },
  media: [
    {
      url: "https://media.example.test/athar-test-no-01.jpg",
      alt: "ATHAR Test No. 01 fictional bottle",
      position: 0,
      type: "image" as const,
    },
  ],
  variants: [
    {
      sku: "ATHAR-TEST-01-50",
      sizeMl: 50,
      priceMinor: 129_900,
      inventoryQuantity: 4,
      isActive: true,
    },
  ],
};

test("catalog product input normalizes canonical values and defaults to a draft", () => {
  const product = productCreateInputSchema.parse(fictionalProductInput);

  expect(product.slug).toBe("athar-test-no-01");
  expect(product.currency).toBe("SEK");
  expect(product.status).toBe("draft");
  expect(product.variants[0].priceMinor).toBe(129_900);
  expect(product.variants[0].sku).toBe("ATHAR-TEST-01-50");
});

test("catalog rejects invalid money, comparison prices, and duplicate variant SKUs", () => {
  expect(() =>
    productCreateInputSchema.parse({
      ...fictionalProductInput,
      variants: [
        fictionalProductInput.variants[0],
        { ...fictionalProductInput.variants[0], sizeMl: 100 },
      ],
    }),
  ).toThrow(/Variant SKUs must be unique/);

  expect(() =>
    productCreateInputSchema.parse({
      ...fictionalProductInput,
      variants: [
        { ...fictionalProductInput.variants[0], priceMinor: 10_000, compareAtPriceMinor: 10_000 },
      ],
    }),
  ).toThrow(/compareAtPriceMinor must be greater/);

  expect(() =>
    productCreateInputSchema.parse({
      ...fictionalProductInput,
      variants: [{ ...fictionalProductInput.variants[0], inventoryQuantity: -1 }],
    }),
  ).toThrow();
});

test("catalog persistence mapping keeps database identifiers separate from public slugs", () => {
  const input = productCreateInputSchema.parse(fictionalProductInput);
  const now = new Date("2026-09-19T12:00:00.000Z");
  const document = toProductDocument(input, now);
  const product = toProduct(document);

  expect(product.id).toMatch(/^[a-f\d]{24}$/);
  expect(product.id).not.toBe(product.slug);
  expect(product.brandId).toBe(fictionalProductInput.brandId);
  expect(product.variants[0].id).toMatch(/^[a-f\d]{24}$/);
  expect(product.createdAt).toEqual(now);
});
