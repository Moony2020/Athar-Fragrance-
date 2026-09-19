# Phase 3 — Catalog Foundation

## Stage 3.1: Catalog Domain & Database Foundation

**Status:** **IMPLEMENTED — LIVE DATABASE CONNECTIVITY NOT YET VERIFIED.**

### Implemented

- Server-only MongoDB Atlas configuration and reusable connection lifecycle.
- Zod schemas for canonical Product, ProductVariant, Brand, Collection, media, slugs, money, notes, and bounded public-list inputs.
- Explicit `draft` / `active` / `archived` lifecycle. Public services read only `active` records.
- Integer minor-unit money (`priceMinor`) plus explicit product currency.
- Product variants with positive size, uppercase unique SKUs, non-negative inventory, active state, and valid comparison-price semantics.
- Normalized URL-safe slugs separate from persistence IDs.
- Structured top/heart/base notes and extensible normalized fragrance-family keys.
- Provider-reference media metadata; no image binary persistence.
- Repository/data-access layer, server-only public-read services, and controlled idempotent MongoDB indexes.
- Focused fictional domain tests; no commercial prototype content was used.

### Deliberately not implemented

- Atlas credentials, live database verification, seeding, or migrations that write data.
- Shop, Product Detail, product search/filter/sort UI, public catalog API, cart, wishlist, account, checkout, orders, or Admin CRUD.
- Canonical records for Dior, Versace, YSL, Lancôme, Armani, homepage prices, or homepage collection labels.

### Owner decisions still needed

1. Provide a least-privilege development/test Atlas URI and final database name for live, non-destructive verification.
2. Approve canonical brands, collections, products, prices, media licensing, and seed source before Stage 3.2.
3. Select the media provider before upload behavior is designed.

### Verification target

TypeScript, ESLint, production build, the full Playwright suite, and `instant()` must pass. Atlas status remains pending until a safe live connection is actually observed.

## Stage 3.2: Catalog Bootstrap, Seed Contract & Development Dataset

**Status:** **IMPLEMENTED — LIVE DATABASE EXECUTION NOT YET VERIFIED.**

### Seed contract

- `developmentCatalogSeed` is a small fictional dataset: ATHAR Atelier, North Test Parfums, four Test collections, and four Test/Study products. It is not production catalog content.
- Fixtures are validated through the Stage 3.1 schemas before a plan exists. Product fixture references use `brandKey` and `collectionKeys`, then resolve to canonical MongoDB IDs after Brand and Collection upserts.
- The plan matches canonical slugs and checks stored `seed.key` ownership. Duplicate fixture keys/slugs/SKUs, unknown references, unowned matching slugs, and conflicting ownership fail before write operations.
- A stable SHA-256 fixture fingerprint determines `create`, `update`, or `unchanged`. Writes set only explicit seed-owned fields and never delete records or replace arbitrary future fields.
- `npm run catalog:seed:dry` does not require MongoDB credentials and never writes. `npm run catalog:seed` requires `CATALOG_SEED_ALLOW_WRITE=1`, valid MongoDB variables, and a non-production `NODE_ENV`; production is rejected unconditionally.

### Deliberately not implemented

- No Atlas write, production seed, third-party data/image import, Shop UI, Product Detail UI, public API, or Admin tooling.
- No seed data from Dior, Versace, YSL, Lancôme, Armani, their products, homepage prices, or prototype imagery.

## Stage 3.3: Public Catalog Browsing

**Status:** **IMPLEMENTED — LIVE ATLAS READS NOT YET VERIFIED.**

### Implemented

- Public Server Component routes: `/shop`, `/shop/women`, `/shop/men`, `/shop/unisex`, and `/collections/[slug]`.
- A server-only browse/read model maps canonical records to a deliberately narrow card DTO. Inventory, lifecycle, seed metadata, and persistence IDs remain private.
- Public reads select active Products, Brands, Collections, and Variants only. Invalid audience and collection slugs render not-found; active empty collections show an accessible empty state.
- Development/test runtimes use the fictional Stage 3.2 dataset without a database. A production runtime with no valid database configuration, or with a failed read, shows an intentional unavailable state and never silently falls back to fixtures.
- Local placeholder product media is intentional until approved canonical assets exist. Prices are formatted from integer minor units; multi-variant products display `From` the lowest active price.
- Homepage Shop and the existing For Her / For Him / Unisex cards now lead to implemented browse routes. New Arrivals and other destinations remain deferred because no canonical route/query exists.
- The static `/shop` route preserves Cache Components behaviour. Dynamic audience and collection route parameters use `instant = false`, so runtime browse work is streamed safely. React request caching deduplicates a repeated browse read within a render; no persistent catalog cache policy has been introduced.

### Deliberately not implemented

- Product Detail pages, search, filters, sorting, pagination UI, cart, wishlist, account, checkout, Admin, public JSON endpoints, and real commercial catalog/media data.
- Atlas reads or writes in this implementation verification. Live connectivity and live catalog behavior remain owner/configuration dependent.

### Verification target

TypeScript, ESLint, production build, the local production Playwright suite, and a separate development-fixture browser pass must succeed. Production assertions specifically verify that missing catalog configuration does not expose fictional data.

## Stage 3.4: Brands Browsing & Brand Catalog Pages

**Status:** **IMPLEMENTED — LIVE ATLAS BRAND READS NOT YET VERIFIED.**

### Implemented

- Public Server Component routes at `/brands` and `/brands/[slug]` using canonical public Brand slugs only.
- Narrow public Brand cards expose only `slug`, `name`, optional description, and optional media alt metadata. Persistence IDs, lifecycle, timestamps, and seed metadata never enter React props.
- `BrandRepository.listPublic()` and the existing Product public-list query provide active Brand discovery and active Products by `brandId`; Brand pages reuse the existing `ProductCard` and `CatalogGrid` unchanged.
- An active Brand with no active public Products renders an accessible empty state. Invalid, missing, draft, and archived Brand slugs render not-found when the catalog source is available.
- Development/test uses only the fictional Stage 3.2 Brands, including a deliberate active empty Brand. Production without configured/readable canonical data renders a safe unavailable state and never exposes those fixtures.
- Brand cards use neutral local CSS presentation while approved Brand media is absent. Brand membership is catalog classification only and does not imply official partnership, authorization, distribution, or reseller status.
- `/brands` remains static; `/brands/[slug]` uses `instant = false` for streamed runtime reads under Cache Components. React request caching deduplicates same-render reads; persistent invalidation is deferred until mutations exist.

### Deliberately not implemented

- Product Detail, Brand search, A–Z navigation, filtering, sorting, pagination, cart, wishlist, account, checkout, Admin, uploads, Cloudinary, real commercial Brand imports, and third-party logos/media.

### Verification record

The exact local commands, browser checks, production/development-fixture split, and recorded results are maintained in [`tests/STAGE-03.4.md`](../../tests/STAGE-03.4.md). Future stages must add an equivalent `tests/STAGE-XX.X.md` record.

## Stage 3.5: Catalog Discovery

**Status:** **IMPLEMENTED — LIVE ATLAS SEARCH/FILTER/SORT QUERIES NOT YET VERIFIED.**

- `/shop` and scoped audience/collection routes accept validated GET URL state: `q`, `audience`, `brand`, `family`, `collection`, and deterministic `name-asc`, `name-desc`, `price-asc`, or `price-desc` sorting.
- Search is bounded to 80 normalized characters and uses portable case-insensitive literal substring matching over public product name/description/short description, active Brand name, and family. No user regex or Mongo operator is created. Unknown/repeated/malformed scalar parameters are ignored safely.
- Single-select filters compose with AND semantics. Route scope is injected server-side and cannot be overridden by URL filters. Price-range filtering and pagination are deliberately deferred because the existing bounded public list does not justify extra UI/contract complexity.
- Non-default query state has `noindex, follow` and canonical `/shop` metadata. Production unavailable remains distinct from valid zero matches. Current command record: [`tests/STAGE-03.5.md`](../../tests/STAGE-03.5.md).

## Stage 3.6: Integration, Regression QA & Closure

**Status:** **PHASE 3 — TECHNICALLY COMPLETE LOCALLY.**

- One server-only discovery flow validates URL state, enforces route scope, filters public records, sorts deterministically, then maps narrow DTOs before React.
- `/shop/[audience]`, `/collections/[slug]`, and `/brands/[slug]` preserve their own clean canonical route and add `noindex, follow` only for actual discovery state.
- Final local gate: TypeScript, ESLint, production build, seed dry run, production Playwright (**36 passed, 10 skipped**), fixture catalog/Brand/discovery regression (**10 passed**), `instant()`, and Turbopack compile/runtime checks pass.
- **LIVE ATLAS CONNECTIVITY / READS / DISCOVERY — NOT YET VERIFIED.** Production data/media approval, Product Detail, commerce, Admin, and Phase 4 remain pending.
