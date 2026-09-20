import type { BrandCreateInput, CollectionCreateInput, ProductCreateInput } from "@/server/catalog/schemas";

export type SeedBrandFixture = {
  key: string;
  input: BrandCreateInput;
};

export type SeedCollectionFixture = {
  key: string;
  input: CollectionCreateInput;
};

export type SeedProductFixture = {
  key: string;
  brandKey: string;
  collectionKeys: string[];
  input: Omit<ProductCreateInput, "brandId" | "collectionIds">;
};

export type CatalogSeedDataset = {
  brands: SeedBrandFixture[];
  collections: SeedCollectionFixture[];
  products: SeedProductFixture[];
};

/**
 * Development-only catalog data. Display names provide varied fragrance-house
 * examples; the records, prices, stock, and local imagery remain test data.
 */
export const developmentCatalogSeed: CatalogSeedDataset = {
  brands: [
    {
      key: "versace",
      input: {
        name: "Versace",
        slug: "versace",
        description: "Development catalog display data.",
        status: "active",
      },
    },
    {
      key: "hugo-boss",
      input: {
        name: "HUGO BOSS",
        slug: "hugo-boss",
        description: "Development catalog display data.",
        status: "active",
      },
    },
    {
      key: "giorgio-armani",
      input: {
        name: "Giorgio Armani",
        slug: "giorgio-armani",
        description: "Development catalog display data.",
        status: "active",
      },
    },
    { key: "yves-saint-laurent", input: { name: "Yves Saint Laurent", slug: "yves-saint-laurent", description: "Development catalog display data.", status: "active" } },
    { key: "prada", input: { name: "Prada", slug: "prada", description: "Development catalog display data.", status: "active" } },
    { key: "mugler", input: { name: "Mugler", slug: "mugler", description: "Development catalog display data.", status: "active" } },
    { key: "north-test-parfums", input: { name: "North Test Parfums", slug: "north-test-parfums", description: "Non-public development catalog data.", status: "draft" } },
  ],
  collections: [
    {
      key: "test-women",
      input: { name: "Test Women", slug: "test-women", description: "Fictional development collection.", status: "active", sortOrder: 10 },
    },
    {
      key: "test-men",
      input: { name: "Test Men", slug: "test-men", description: "Fictional development collection.", status: "active", sortOrder: 20 },
    },
    {
      key: "test-unisex",
      input: { name: "Test Unisex", slug: "test-unisex", description: "Fictional development collection.", status: "active", sortOrder: 30 },
    },
    {
      key: "test-new-arrivals",
      input: { name: "Test New Arrivals", slug: "test-new-arrivals", description: "Fictional development collection.", status: "draft", sortOrder: 40 },
    },
  ],
  products: [
    {
      key: "athar-test-no-01",
      brandKey: "versace",
      collectionKeys: ["test-unisex", "test-new-arrivals"],
      input: {
        slug: "athar-test-no-01",
        name: "Eros",
        fragranceType: "Eau de Parfum",
        shortDescription: "A fictional multi-size development fragrance.",
        description: "A safe test record used to verify the ATHAR catalog bootstrap pipeline.",
        audience: "unisex",
        fragranceFamily: "amber-woody",
        notes: { top: ["Bergamot"], heart: ["Orange blossom"], base: ["Cedar", "Vanilla"] },
        media: [
          { url: "https://fixtures.athar.test/catalog/athar-test-no-01-front.jpg", publicId: "fixture/athar-test-no-01-front", alt: "Eros front view", width: 1200, height: 1500, position: 0, type: "image" },
          { url: "https://fixtures.athar.test/catalog/athar-test-no-01-detail.jpg", publicId: "fixture/athar-test-no-01-detail", alt: "Eros detail view", width: 1200, height: 1500, position: 1, type: "image" },
          { url: "https://fixtures.athar.test/catalog/athar-test-no-01-atelier.jpg", publicId: "fixture/athar-test-no-01-atelier", alt: "Eros alternate view", width: 1200, height: 1500, position: 2, type: "image" },
        ],
        variants: [
          { sku: "ATHAR-TEST-01-50", sizeMl: 50, priceMinor: 129_900, inventoryQuantity: 12, isActive: true },
          { sku: "ATHAR-TEST-01-100", sizeMl: 100, priceMinor: 189_900, compareAtPriceMinor: 209_900, inventoryQuantity: 0, isActive: true },
        ],
        status: "active",
        featured: true,
        bestseller: false,
        currency: "SEK",
      },
    },
    {
      key: "cedar-study",
      brandKey: "hugo-boss",
      collectionKeys: ["test-men", "test-unisex"],
      input: {
        slug: "cedar-study",
        name: "BOSS Bottled",
        fragranceType: "Eau de Toilette",
        shortDescription: "A fictional single-variant woody study.",
        description: "A development record that exercises active product visibility and inventory.",
        audience: "men",
        fragranceFamily: "woody",
        notes: { top: ["Juniper"], heart: ["Cedar"], base: ["Vetiver", "Musk"] },
        media: [
          { url: "https://fixtures.athar.test/catalog/cedar-study-front.jpg", alt: "BOSS Bottled front view", position: 0, type: "image" },
          { url: "https://fixtures.athar.test/catalog/cedar-study-facet.jpg", alt: "BOSS Bottled side view", position: 1, type: "image" },
          { url: "https://fixtures.athar.test/catalog/cedar-study-detail.jpg", alt: "BOSS Bottled detail view", position: 2, type: "image" },
        ],
        variants: [{ sku: "CEDAR-STUDY-75", sizeMl: 75, priceMinor: 149_900, inventoryQuantity: 8, isActive: true }],
        status: "active",
        featured: false,
        bestseller: true,
        currency: "SEK",
      },
    },
    {
      key: "no-media-study",
      brandKey: "giorgio-armani",
      collectionKeys: ["test-unisex"],
      input: {
        slug: "no-media-study",
        name: "Acqua di Giò",
        fragranceType: "Eau de Parfum",
        shortDescription: "A fictional development record with intentionally absent media.",
        description: "A development record used to verify safe Product media fallback behavior.",
        audience: "unisex",
        fragranceFamily: "fresh",
        notes: { top: ["Lemon"], heart: ["Tea"], base: ["Musk"] },
        media: [
          { url: "https://fixtures.athar.test/catalog/no-media-study-front.jpg", alt: "Acqua di Giò front view", position: 0, type: "image" },
          { url: "https://fixtures.athar.test/catalog/no-media-study-facet.jpg", alt: "Acqua di Giò side view", position: 1, type: "image" },
          { url: "https://fixtures.athar.test/catalog/no-media-study-detail.jpg", alt: "Acqua di Giò detail view", position: 2, type: "image" },
        ],
        variants: [{ sku: "NO-MEDIA-STUDY-50", sizeMl: 50, priceMinor: 99_900, inventoryQuantity: 4, isActive: true }],
        status: "active",
        featured: false,
        bestseller: false,
        currency: "SEK",
      },
    },
    {
      key: "velvet-sillage",
      brandKey: "yves-saint-laurent",
      collectionKeys: ["test-women", "test-unisex"],
      input: {
        slug: "velvet-sillage",
        name: "Libre",
        fragranceType: "Eau de Parfum",
        shortDescription: "A fictional amber-floral evening composition.",
        description: "A development record exploring dark berry, rose and smoked amber in a soft, lingering trail.",
        audience: "unisex",
        fragranceFamily: "amber-floral",
        notes: { top: ["Blackcurrant"], heart: ["Rose"], base: ["Amber", "Sandalwood"] },
        media: [
          { url: "https://fixtures.athar.test/catalog/velvet-sillage-front.jpg", alt: "Fictional Velvet Sillage bottle, front view", position: 0, type: "image" },
          { url: "https://fixtures.athar.test/catalog/velvet-sillage-facet.jpg", alt: "Fictional Velvet Sillage bottle, faceted view", position: 1, type: "image" },
          { url: "https://fixtures.athar.test/catalog/velvet-sillage-detail.jpg", alt: "Fictional Velvet Sillage bottle, detail view", position: 2, type: "image" },
        ],
        variants: [{ sku: "VELVET-SILLAGE-50", sizeMl: 50, priceMinor: 169_900, inventoryQuantity: 6, isActive: true }],
        status: "active",
        featured: false,
        bestseller: false,
        currency: "SEK",
      },
    },
    {
      key: "luminous-fig",
      brandKey: "prada",
      collectionKeys: ["test-women", "test-unisex"],
      input: {
        slug: "luminous-fig",
        name: "Luna Rossa Carbon",
        fragranceType: "Eau de Toilette",
        shortDescription: "A fictional green-amber composition with a soft luminous trail.",
        description: "A development record exploring fresh fig, tea leaf and sandalwood in a polished, quietly modern fragrance.",
        audience: "unisex",
        fragranceFamily: "green-amber",
        notes: { top: ["Fig leaf"], heart: ["Black tea"], base: ["Sandalwood", "Amber"] },
        media: [
          { url: "https://fixtures.athar.test/catalog/luminous-fig-front.jpg", alt: "Fictional Luminous Fig bottle, front view", position: 0, type: "image" },
          { url: "https://fixtures.athar.test/catalog/luminous-fig-facet.jpg", alt: "Fictional Luminous Fig bottle, faceted view", position: 1, type: "image" },
          { url: "https://fixtures.athar.test/catalog/luminous-fig-detail.jpg", alt: "Fictional Luminous Fig bottle, detail view", position: 2, type: "image" },
        ],
        variants: [{ sku: "LUMINOUS-FIG-75", sizeMl: 75, priceMinor: 179_900, inventoryQuantity: 7, isActive: true }],
        status: "active",
        featured: false,
        bestseller: false,
        currency: "SEK",
      },
    },
    {
      key: "floral-study",
      brandKey: "north-test-parfums",
      collectionKeys: ["test-women"],
      input: {
        slug: "floral-study",
        name: "Floral Study",
        shortDescription: "A fictional draft floral development record.",
        description: "A draft fixture that must remain absent from public catalog reads.",
        audience: "women",
        fragranceFamily: "floral",
        notes: { top: ["Pear"], heart: ["Jasmine", "Rose"], base: ["Amber"] },
        media: [{ url: "https://fixtures.athar.test/catalog/floral-study.jpg", alt: "Fictional Floral Study bottle", position: 0, type: "image" }],
        variants: [{ sku: "FLORAL-STUDY-30", sizeMl: 30, priceMinor: 89_900, inventoryQuantity: 0, isActive: false }],
        status: "draft",
        featured: false,
        bestseller: false,
        currency: "SEK",
      },
    },
    {
      key: "archive-sample",
      brandKey: "north-test-parfums",
      collectionKeys: ["test-unisex"],
      input: {
        slug: "archive-sample",
        name: "Archive Sample",
        description: "A fictional archived record for public-visibility testing.",
        audience: "unisex",
        fragranceFamily: "fresh",
        notes: { top: ["Lemon"], heart: ["Tea"], base: ["Driftwood"] },
        media: [],
        variants: [{ sku: "ARCHIVE-SAMPLE-60", sizeMl: 60, priceMinor: 109_900, inventoryQuantity: 2, isActive: true }],
        status: "archived",
        featured: false,
        bestseller: false,
        currency: "SEK",
      },
    },
  ],
};
