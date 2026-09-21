# Changelog

## 2026-09-21 — Phase 5 / Stage 5.4 Guest Wishlist activation

- Activated Product-level guest Wishlist continuity across PDP, Gallery, Shop cards, Header navigation, and `/wishlist` through an opaque httpOnly guest cookie and canonical public Product validation.
- Added request-time Wishlist rendering (`instant = false`), cross-surface synchronization, removal-to-empty behavior, responsive hit-target coverage, and Axe/Agent Browser verification.
- Durable/live Atlas Wishlist persistence remains unimplemented and unverified; no Stage 5.5 work started.

## 2026-09-21 — Phase 5 / Stage 5.5 Durable persistence foundation

- Added account-ready `CommerceOwner` contracts, Mongo Cart/Wishlist document mappings, explicit durable adapter selection, owner/TTL indexes, optimistic revisions, and 30-day guest cookie lifetime.
- Preserved the existing Cart/Wishlist UI and server-authoritative catalog validation; production never falls back to process memory.
- Live Atlas connectivity, writes, indexes, and restart persistence remain pending; Auth, Checkout, and Stage 5.6 were not started.

## 2026-09-21 — Phase 5 / Stage 5.5 Durable persistence verification

- Fixed strict durable Cart/Wishlist document parsing to allow only the legal Mongo `_id` and typed `state` fields while rejecting unexpected top-level data and malformed state.
- Verified the dedicated non-production `athar_stage55_test` database for Cart/Wishlist CRUD, guest isolation, CAS/revision and max-quantity concurrency, TTL expiry/replacement, server-authoritative reconciliation, controlled failure handling, indexes, and separate-process restart persistence.
- Full fixture regression passed 66/66 executed (8 skipped), production isolation 42/42 (32 skipped), production build, TypeScript, ESLint, seed dry-run, Agent Browser, Axe, and diff checks passed. Auth, Checkout, and Stage 5.6 remain unstarted.

## 2026-09-20 — Phase 5 / Stage 5.3 Cart Page, Line Management & Header Count

- Added server-first `/cart`, current-catalog Cart presentation DTO, safe stale/unavailable reconciliation, canonical quantity update/remove Server Actions, valid-line subtotal, and restrained empty state.
- Activated the existing Header bag as `/cart` navigation with total-quantity count synchronization from safe Cart action results; root layout remains free of direct cookie reads.
- Kept development/test guest storage ephemeral and production unavailable. Wishlist, ProductCard Add-to-bag, drawer, Checkout, payment, Orders, and inventory reservation remain deferred.

## 2026-09-20 — Phase 5 / Stage 5.2 PDP Add-to-bag & Ephemeral Guest Cart

- Activated only PDP Quantity and Add to bag through a strict Server Action, canonical public Product/Variant revalidation, and server-derived integer-minor pricing.
- Added a development/test-only in-memory guest Cart keyed by an opaque httpOnly session cookie; production safely reports unavailable until a durable adapter exists.
- Preserved the owner PDP design and deferred Cart UI, Header count, ProductCard interactions, Wishlist persistence, Checkout, Orders, payment, and inventory mutation.

## 2026-09-20 — Phase 4 / Stage 4.2 Product Gallery & Media

- Added a reusable `ProductGallery` client island over the existing public PDP media DTO, deterministic media ordering, accessible thumbnail selection, local neutral fallback media, and multi/single/zero-media fixture coverage.
- Kept canonical data reads and PDP information server-rendered. No remote image domain was opened, and no Cloudinary, upload, zoom, lightbox, Cart, Wishlist, or variant-selection work was introduced.

## 2026-09-20 — Phase 4 / Stage 4.1 Product Detail Foundation

- Added the server-rendered canonical `/products/[slug]` route, narrow public PDP DTO, safe active Product/Brand/variant visibility boundary, factual metadata/canonical URL, and ProductCard navigation to the real PDP.
- Added basic editorial product media, family, structured notes, public size/price/availability presentation, distinct unavailable/not-found states, fixture-isolation coverage, and Stage 4 documentation. Cart, Wishlist, checkout, interactive variant selection, advanced gallery, product schema data, and commercial media remain deferred.

## 2026-09-20 — Phase 3 / Stage 3.6 Catalog Integration & Closure

- Reconciled public discovery into one server-only flow, added authoritative Brand route scope, independent malformed-field handling, scoped canonical/noindex metadata, and consistent clean-empty versus filtered-zero-result semantics.
- Re-ran the local Phase 3 gate: typecheck, lint, production build, no-write seed dry run, production fixture-isolation suite, fixture discovery suite, `instant()`, Turbopack runtime checks, and representative axe checks. Phase 3 is technically complete locally; live Atlas and owner production data/media remain pending.

## 2026-09-19 — Phase 3 / Stage 3.5 Catalog Discovery

- Added server-first GET search, active public filters, deterministic factual sorting, URL state, scoped route precedence, query-safe empty/unavailable handling, and noindex query metadata while reusing ProductCard/CatalogGrid.
- Added discovery verification coverage and Stage-specific command record; Product Detail, commerce, Admin, price-range UI, pagination, and Atlas Search remain deferred.

## 2026-09-19 — Phase 3 / Stage 3.4 Brands Browsing & Brand Pages

- Added `/brands` and `/brands/[slug]` over the existing server-only catalog boundary, including narrow public Brand cards, active-only Brand visibility, products-by-Brand, not-found, empty, and production-unavailable states.
- Reused ProductCard, CatalogGrid, money formatting, fixture isolation, and production safety; no Product Detail, search, filters, sorting, Admin, external media, or real commercial Brand data was introduced.
- Added fictional Brand browsing coverage and documentation. Brand classification conveys no authorization, distribution, partnership, or retailer claim.

## 2026-09-19 — Phase 3 / Stage 3.3 Public Catalog Browsing

- Added server-rendered Shop, audience, and collection browse routes with validated route parameters, active-only public visibility, not-found handling, and accessible empty/unavailable states.
- Added a server-only public card read model, development/test fixture source, responsive catalog cards/grid, and intentional placeholder-media treatment; production never falls back to fictional fixtures when catalog configuration is absent.
- Activated only homepage catalog links with implemented destinations and left unsupported destinations deferred.
- Preserved Hero/navbar/under-Hero visual styling and the protected 430–545px responsive range; no Git commit or remote update was made.

## 2026-09-19 — Phase 3 / Stage 3.2 Catalog Bootstrap and Development Dataset

- Added a fictional, validated catalog bootstrap dataset and a deterministic `validate → plan/dry-run → guarded write` pipeline.
- Added seed ownership/fingerprint metadata, idempotent update handling, explicit slug conflicts, readable fixture reference resolution, and development/test-only production guards.
- Added `catalog:seed:dry` and guarded `catalog:seed` commands using development-only `tsx`; no database write or Atlas connectivity claim was made.
- Added seed-pipeline test coverage and documentation. **No production catalog data has been approved or seeded.**

## 2026-09-19 — Phase 3 / Stage 3.1 Catalog Domain & Database Foundation

- Added the official MongoDB Node.js driver, a server-only environment/connection boundary, named collection ownership, and controlled idempotent catalog indexes.
- Added canonical Product, ProductVariant, Brand, Collection, media, notes, money, slug, lifecycle, document-mapping, repository, and public service contracts using Zod validation.
- Added fictional catalog-domain coverage without seeding any homepage prototype brands, products, or prices.
- Added the Phase 3 ledger and reconciled database, architecture, API, security, testing, environment, and status documentation.
- **IMPLEMENTED — LIVE DATABASE CONNECTIVITY NOT YET VERIFIED. No Shop, Product Detail, Admin, public API, or seed work was started.**

## 2026-09-19 — Maintenance: obsolete test-script cleanup

- Removed three unreferenced root screenshot scripts that injected temporary Hero CSS and wrote to stale local paths.
- Preserved the current Story presentation while correcting JSX escaping and aligning its automated assertion with current copy.
- Repository-wide lint, TypeScript, production build, and all 12 Playwright checks now pass.

## 2026-09-19 — Phase 2 / Stage 2.6 Footer Migration and Final Integration

- Replaced the final legacy Footer with the dedicated server-rendered `Footer` component and made the homepage composition explicit.
- Removed `HomeSections`, the migration-only legacy homepage stylesheet, and its global import after confirming no production component depended on them; original static prototype/reference files remain preserved.
- Preserved prototype Footer content and fragment navigation while keeping non-existent Boutiques and Contact destinations visibly deferred rather than fake links.
- Corrected final integration accessibility defects in the Hero definition list and nested scroller, then completed full responsive/runtime QA.
- **PHASE 2 — COMPLETE. OWNER FULL-HOMEPAGE VISUAL APPROVAL REQUIRED.**

## 2026-09-19 — Phase 2 / Stage 2.5 Fragrance Guide

- Replaced the legacy inline Fragrance Guide with the dedicated server-rendered `FragranceGuide` component directly after Our Story.
- Preserved the source prototype's Floral, Woody, Fresh, and Oriental local image cards, editorial introductory panel, copy, and restrained responsive treatment; the legacy Footer remains untouched.
- Added semantic deferred family links, optimized local images, focused responsive/overflow coverage, and corrected current-status documentation to state the known repository-wide lint debt truthfully.
- **IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED.**

## 2026-09-19 — Phase 2 / Stage 2.4 Our Story

- Replaced the legacy inline Our Story section with the server-rendered `Story` component directly after Bestselling Fragrances.
- Preserved source prototype editorial composition and local story photography across desktop and a clear mobile reading order; the mobile right-side organic treatment was adjusted only to prevent clipped value labels.
- Kept story text, CTA, and value labels as documented prototype presentation content. No unverified company facts, About route, CMS, or editorial domain was added.
- Added responsive semantic coverage for the Story section. Typecheck, changed-file lint, build, runtime checks, and 10 Playwright tests pass; the documented global-lint baseline debt is unchanged.
- **IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED.**

## 2026-09-19 — Phase 2 / Stage 2.3 Bestselling Fragrances

- Replaced the legacy inline Bestsellers section with the server-rendered `Bestsellers` component immediately after `Collections`.
- Preserved the source prototype's composite bottle-and-pedestal art direction with `next/image`, typed local presentation data, accessible deferred product-region links, and responsive internal scrolling on small screens.
- Kept prototype product names, brands, and prices as non-canonical development-only presentation content; no Product domain, product pages, wishlist, inventory, or commerce behavior was added.
- Added stage-specific Playwright coverage, an isolated production-server test configuration for `instant()`, and page-level overflow containment without changing intentional nested scrollers.
- **IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED.**

## 2026-09-18 — Phase 2 / Stage 2.2 Shop by Collection

- Replaced the legacy inline collection section with the dedicated server-rendered `Collections` component, composed directly after the Hero.
- Preserved the approved four organic prototype silhouettes using typed local presentation data, CSS Modules, semantic anchors, and restrained focus/hover feedback.
- Added responsive collection coverage for semantic links and viewport overflow across representative widths.
- Kept catalog destinations as documented `#collections` placeholders; no catalog, bestsellers, product, data, or commerce scope was added.
- **IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED.**

## 2026-09-18 — Homepage continuity restoration

- Restored the prototype's Shop by Collection, Bestselling Fragrances, Story, Fragrance Guide, and Footer surfaces after owner feedback identified that a Hero-only homepage was incomplete.
- Added `HomeSections` as a server-rendered Next.js component and served the existing local visual assets from `public/images/home/`.
- Kept unavailable navigation, catalog, carousel, and commerce actions visually present only where needed; no fake product, cart, account, or checkout behavior was introduced.

## 2026-09-18 — Phase 2 / Stage 2.1 Header and static Hero

- Migrated only the homepage Header and static ATHAR Hero into server-rendered Next.js components with component-local CSS Modules.
- Reused the prototype Hero scene, bottle, and fragrance-note images through `public/images/hero/`; original root prototype assets remain untouched.
- Added a focused Hero display token and responsive layout rules for mobile through wide desktop.
- Added meaningful Hero/header and multi-viewport overflow Playwright coverage; all seven production-rig checks pass.
- Deferred catalog navigation, search, account, wishlist, cart, mobile menu, collections, other homepage sections, and all commerce/data domains.
- **IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED** before Stage 2.2.

## 2026-09-18 — Stage 2.1 owner visual correction

- Restored the full-bleed Hero backdrop behind the Header.
- Restored the visual Watch Our Story, Search, Account, Wishlist, and Shopping Bag affordances.
- Marked deferred controls as native disabled buttons with explicit unavailable labels; no premature domain functionality was added.

## 2026-09-18 — Phase 1 design-system foundation

- Added named visual tokens, responsive typography roles, restrained motion, and global accessibility conventions.
- Added Next.js self-hosted Cormorant Garamond and DM Sans, preserving the prototype's type direction without runtime Google-font requests.
- Added Tailwind v4 for routine utility/layout work and CSS Modules for component-local styling.
- Added the shared UI foundation: Button, Container, Section, SectionHeading, TextLink, and IconButton.
- Did not migrate or redesign homepage sections.

## 2026-09-18 — Next.js 16.3 foundation and verification rig

- Added the Next.js 16.3 App Router foundation with TypeScript, linting, Zod, Cache Components, and Partial Prefetching.
- Added a local production-style Playwright rig, including a public homepage check and an `instant()` smoke test.
- Added conditional test-only exposure of Next's testing API and documented the rig in `instant-nav.rig.md`.
- Verified typechecking, linting, production build, `/_next/mcp`, Agent Browser, and both Playwright checks.
- Added `.gitignore` rules for generated build, test, and TypeScript output.

## 2026-09-18 — Phase 0 documentation baseline

- Audited the static ATHAR prototype and recorded its verified technical baseline.
- Added project governance, architecture, design, data, API, security, and testing documentation.
- Added the Phase 0 ledger and architecture decision record.
- No application feature implementation or dependency changes were made.
## 2026-09-20 — Phase 4 / Stage 4.3 Variant / Size Selection

- Added catalog-backed Product variant read mapping with stable public IDs, deterministic initial-size rules, price/compare-at values, availability labels, and disabled unavailable-size semantics.
- Preserved the owner-designed PDP and Shop purchase/Wishlist UI as disabled, non-persistent visual boundaries; no commerce mutations or persistence were introduced.
- Preserved catalog-backed Related fragrances and independent Product gallery behavior; documented the live Atlas verification boundary.
## 2026-09-20 — Phase 4 / Stage 4.4 Product Content Audit

- Audited and preserved the canonical PDP content layer and public DTO boundary.
- Added display-only family/audience mappings and graceful omission of empty note groups.
- Removed unsupported hard-coded concentration/how-to-wear content and neutralized service wording while preserving the owner UI.
- Added Stage 4.4 focused coverage and documented the pending ingredients/Live Atlas boundaries.
## 2026-09-20 — Phase 4 / Stage 4.5 Related Merchandising Audit

- Preserved the existing Related fragrances section and shared ProductCard.
- Added a bounded server-side deterministic merchandising read using canonical family, audience, Brand, and collection signals.
- Enforced public eligibility, current-product exclusion, deduplication, stable ordering, canonical PDP links, and empty-section omission without recommendation or commerce systems.
## 2026-09-20 — Phase 4 / Stage 4.6 Final Integration & Closure

- Audited and preserved the complete Product Detail architecture without adding new product features or commerce behavior.
- Re-verified visibility, DTO privacy, gallery, variants, pricing, availability, content, Related merchandising, responsive behavior, production fixture isolation, and future-commerce UI boundaries.
- Closed Phase 4 locally; live Atlas catalog/media/variant/content/Related reads and owner production policy decisions remain pending.
## 2026-09-20 — Phase 5 / Stage 5.1 Cart & Wishlist Foundation

- Audited and preserved existing owner-designed commerce UI without activating checkout or redesigning PDP/Shop.
- Added a tested persistence-free Cart/Wishlist domain with canonical Product/Variant identity, bounded quantity validation, server-authoritative public eligibility, integer-minor pricing, and Product-level Wishlist semantics.
- Deferred Cart UI activation, guest persistence, Cart database schema, Checkout, payment, Orders, and inventory reservation.
