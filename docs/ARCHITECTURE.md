# Architecture

## Current state

ATHAR is a Next.js App Router application with React, TypeScript, Cache Components, and Partial Prefetching. The homepage remains a static, componentized presentation route. Its original HTML/CSS/vanilla-JavaScript prototype remains in the repository as reference material.

## Application and catalog architecture

- Next.js App Router with React and TypeScript; Server Components are the default boundary for future catalog reads.
- MongoDB Atlas is the approved canonical catalog database. Stage 3.1 uses the official MongoDB Node.js driver rather than an ODM because no prior persistence pattern existed and the current scope needs a small, explicit data-access layer.
- `src/server/env.ts` owns server-only database environment validation.
- `src/server/db/` owns the reusable MongoDB client, named collections, and idempotent index initialization.
- `src/server/catalog/` owns domain types, Zod boundary schemas, database-document mapping, repositories, public-read services, a development/test fixture source, and public browse-card mapping.
- `src/server/catalog/seed/` separates fictional fixture authoring, all-fixture validation, deterministic planning/conflict detection, dry-run reporting, and guarded server-only execution. `scripts/catalog-seed.ts` is an operational entry point, not a public API.
- Persistence modules import `server-only`; client components must never import them.

Phase 3 closes over one public discovery flow: **route → validated scope + validated GET discovery query → server-only service → repository or development fixture source → narrow public DTO → ProductCard/BrandCard → shared grid**. Stage 4.1 adds the analogous PDP flow: **`/products/[slug]` → validated slug → server-only detail service → public Product + Brand repository reads → `CatalogProductDetail` → server-rendered ProductDetails**. Scoped audience, collection, and Brand routes replace conflicting matching query values and retain their own clean canonical URLs. Production returns an explicit unavailable state rather than fixtures when configuration/reads are unavailable. There is no route handler, client API, Cart, Wishlist, checkout, Admin, or client-side database access.

Stage 4.2 adds one deliberately small client island: `ProductGallery`. It receives already-mapped public media from the Server Component and owns only selected-thumbnail presentation state; it does not fetch Product data or own variants, prices, availability, Cart, or Wishlist state.

Stage 4.3 adds `ProductVariantSelector` as the domain-backed variant read boundary. The Server Component maps catalog variants to stable public IDs; the client island owns only selected-variant presentation and renders price/compare-at/availability. Existing purchase and wishlist controls remain preserved visual-only boundaries (disabled and non-persistent), while Related fragrances continue to use catalog-backed read data. No cart, wishlist, cookie, localStorage, or mutation state is introduced.

Stage 4.5 keeps Related selection server-side in `getRelatedProductsData`. It reads the public catalog, applies canonical eligibility and identity exclusion, scores family/audience/Brand/collection signals deterministically, deduplicates, and caps the result at four before mapping to the existing `CatalogProductCard` DTO. Related cards reuse `ProductCard`; no client fetch or recommendation state is introduced.

## Planned integrations

- Auth.js for customer authentication.
- Stripe Payment Element for card collection; direct PayPal Orders API for PayPal.
- Verified webhooks for payment state.
- A transactional email provider and a media provider selected by the owner.

No separate Express application is proposed unless a later verified requirement requires one.

## Migration principle

The static prototype is visual reference material, not production architecture. Recreate approved design intent as accessible, componentized, responsive routes; do not copy CSS override layers forward.

## Design-system ownership

The App Router stays thin. Reusable visual primitives live in `src/components/ui`; future homepage sections belong in dedicated feature/component folders and may consume these primitives. `src/styles` provides global tokens, typography, base rules, and motion only. Tailwind v4 is installed for routine utilities, while CSS Modules own component-specific and editorial styling.
