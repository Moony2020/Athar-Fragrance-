# ATHAR Project Status

**Last audited:** 2026-09-20
**Current phase:** Phase 5 — Cart & Wishlist, Stage 5.3 complete
**Overall status:** **STAGE 5.3 COMPLETE — CART PAGE, LINE MANAGEMENT & HEADER COUNT IMPLEMENTED LOCALLY.**

## Current project state

- ATHAR is a Next.js 16.3 App Router application with a server-first Phase 3 catalog and a locally complete Phase 4 Product Detail flow.
- Stage 5.1 provides the Cart/Wishlist domain foundation. Stages 5.2–5.3 provide PDP Add-to-bag, `/cart`, line management, current-price subtotals, and a safe Header count through an ephemeral development/test guest Cart.
- Durable production Cart persistence, Wishlist persistence, a Cart page/drawer, Checkout, payment, Orders, inventory reservation, and live Atlas Cart/Wishlist verification are not implemented.
- The original static prototype and local assets are preserved as historical visual reference material; they are not the current application architecture.

### Stage 4.3 closure boundary (2026-09-20)

- Product variant selection is domain/read-model backed: stable public variant IDs, deterministic ordering, initial available-size selection, price/compare-at display, and availability labels are implemented and covered by fixture tests.
- The existing PDP quantity, Add to bag, Wishlist, and Shop-card bag/Wishlist controls are preserved as owner-designed visual boundaries. They are disabled/non-persistent previews; no cart, wishlist, cookie, localStorage, or mutation request was added.
- Related fragrances remain catalog-backed merchandising. Product gallery media remains independent from variant selection and no URL variant parameter was introduced.
- The live Atlas adapter and licensed production media are intentionally not claimed as verified in this stage.

### Stage 4.4 audit boundary (2026-09-20)

- Existing Product content is preserved and audited through the public PDP DTO. Descriptions, family, audience, structured notes, variants, brand, media, and Related fragrances remain domain-backed.
- Family and audience are display-mapped only; empty note groups are omitted. Ingredients and concentration remain pending canonical data and are not fabricated.
- Unsupported static operational/authenticity/gifting wording was neutralized without removing the visual service layout. Commerce controls remain disabled and non-persistent.

### Stage 4.5 audit boundary (complete)

- Related fragrances are preserved as catalog-backed merchandising using the shared ProductCard.
- The server-side related read now applies public eligibility, current-product exclusion, deterministic family/audience/Brand/collection scoring, stable tie-breakers, deduplication, and a four-item bound.
- No recommendation engine, personalization, tracking, or cross-sell commerce was introduced.
- Fixture verification: 59 passed, 6 skipped, 0 failed in the full Playwright suite; the focused Stage 4.5/PDP/gallery/content set passed with one isolated 30-second navigation timeout rerunning green.
- Production isolation: 3 passed against the fresh production build; unavailable production reads may return the framework's 200 unavailable shell or 404, but never fictional product or Related content.
- TypeScript, ESLint, Turbopack production build, catalog seed dry-run, runtime compilation/error checks, responsive overflow, and accessibility checks are green within the documented environment limits.

### Stage 4.6 closure boundary (complete locally)

- Phase 4 architecture was audited and preserved: server-first PDP route, public DTO, canonical repositories/fixtures, ProductGallery and ProductVariantSelector client islands, and server-rendered Product content plus Related ProductCards.
- No new commerce, recommendation, authentication, CMS, upload, structured-data, or Phase 5 feature was introduced.
- Production fixture isolation, unavailable/not-found distinction, canonical metadata, responsive PDP/Shop behavior, security/privacy boundaries, and future-commerce UI classification were re-verified.
- Live Atlas Product Detail, media, variant, content, and Related reads remain unverified; owner production catalog/media/business-policy decisions remain pending.

### Stage 5.1 commerce-foundation boundary (historical closure)

- Existing owner commerce-looking UI was inventoried and preserved. PDP purchase controls remain disabled UI-only; gallery and ProductCard hearts/bags remain local presentation-only controls; Header affordances remain static.
- Cart domain lines use canonical Product slug plus public Variant ID and bounded integer quantity; Wishlist is Product-level. Both resolve public Product/Variant eligibility and current integer-minor-unit price through a server-only adapter.
- No persistence, cookie, localStorage, server action, API route, Cart page, Checkout, payment, Order, reservation, or inventory mutation was added. Live Atlas Cart/Wishlist persistence remains not yet verified.

### Stage 5.2 PDP guest-cart boundary (complete locally)

- PDP Quantity and Add to bag now submit only public Product/Variant identity plus a bounded integer quantity through a Next Server Action. The server re-resolves public eligibility and current integer-minor price before mutating a Cart.
- Development/test uses an explicitly ephemeral server-memory guest Cart keyed by an opaque, httpOnly session cookie. It is not durable and intentionally has no production memory fallback.
- ProductGallery, ProductCard bag/hearts, Header counter, and Wishlist persistence remain outside this activation. No Cart route/drawer, Checkout, payment, Order, account merge, inventory reservation, or Atlas Cart read/write was added or claimed.

### Stage 5.3 Cart-management boundary (complete locally)

- `/cart` re-resolves current public Product/Variant data server-side and shows only safe public Cart DTO fields. Valid canonical lines use current integer-minor prices; stale/unavailable lines are excluded from Subtotal and can be removed.
- Quantity updates and removals use existing Server Actions and canonical line identity. Header bag navigation targets `/cart`; its count is total line quantity, not distinct-line count.
- The narrow Header count leaf keeps the root layout free of direct cookie reads, preserving Cache Components/Partial Prefetching architecture. It is visual synchronization from safe action results, not a second Cart source of truth.
- Durable production Cart persistence, live Atlas Cart reads/writes, Wishlist persistence, ProductCard Add-to-bag, Cart drawer, Checkout, payment, Orders, account merge, and inventory reservation remain deferred.

## Historical Phase 0 baseline

- At the Phase 0 audit, the repository was a static HTML/CSS/vanilla-JavaScript homepage prototype.
- Entry point: `index.html`.
- Styling is split across `styles.css`, `hero-details.css`, `sections.css`, `index-overrides.css`, and `responsive-rebuild.css`.
- Assets are local PNG/JPG files in the repository root and `assets/`.
- Google Fonts are loaded externally: Cormorant Garamond, DM Sans, and Playfair Display.
- This baseline predates the current Next.js 16.3 App Router, catalog, PDP, and Stage 5 implementation.
- `next.config.ts` enables Cache Components and Partial Prefetching. The production testing API is conditionally enabled only for local test builds through `EXPOSE_TESTING_API=1`.
- Stage 4.1 adds the server-rendered `/products/[slug]` foundation through the same server-only catalog read model. Development/test uses fictional fixtures; production without configured data renders an unavailable state rather than fake catalog content.
- No missing local asset reference was found from the current `index.html` scan.

## Historical baseline evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Repository inventory | Pass | Static entry point, five stylesheets, local imagery, and a standalone banner experiment identified. |
| Git history | Pass | Historical audit snapshot: local and remote `master` pointed to owner checkpoint `68500a7` at that time. This is not a current Git-state claim. |
| Local asset reference scan | Pass | No unresolved local `src`/`href` reference from `index.html`. |
| TypeScript | Pass | `npm run typecheck` completed with zero errors. |
| Repository-wide lint | Pass | `npm run lint` completes with zero findings after obsolete root screenshot scripts were removed. |
| Production build | Pass | Next.js 16.3.0-preview.10 built via Turbopack with Cache Components and Partial Prefetching enabled. |
| Browser/runtime verification | Pass | Agent Browser and `/_next/mcp` verified the public route, React runtime, route map, and zero compile/runtime errors. |
| Production navigation rig | Pass | Playwright's public homepage check and `instant()` smoke check both passed against the freshly built local artifact on port 3100. |

## Historical pre-App-Router implementation snapshot

At the initial audit, the prototype contained a static hero, header/navigation, mobile menu, fragrance-note rail, collection cards, a bestsellers visual with hotspots, editorial story/banner content, fragrance-guide cards, footer, and small vanilla-JS menu/scroll controls. The then-unimplemented interaction statement is historical and superseded by the catalog, PDP, and limited Stage 5.2 PDP Add-to-bag implementation above.

## Current implementation

- `src/app` contains the Next.js App Router homepage, catalog routes, Brand/collection browsing, and server-rendered Product Detail routes.
- `src/styles` contains only global, token, typography, and animation layers; bespoke homepage styling is owned by component CSS Modules.
- Phase 1 added tokenized colour, spacing, layout, type, radius, elevation, and motion foundations; Next.js self-hosted Cormorant Garamond and DM Sans; and six reusable UI primitives under `src/components/ui`.
- The public catalog, PDP read model, gallery, variant selection, Product content, Related merchandising, and the bounded PDP guest-Cart Add-to-bag flow are implemented locally on their documented server/client boundaries.
- `playwright.config.ts`, `tests/home-shell.spec.ts`, `tests/STAGE-05.2.spec.ts`, and `instant-nav.rig.md` establish the reusable local verification rig.
- `.gitignore` excludes generated build, test, and TypeScript output.
- The existing static prototype and its assets remain preserved as visual reference material.

## Current follow-up items

1. Select and implement durable production Cart storage before making any production Cart readiness claim.
2. Confirm production licensing for the reused Hero imagery and third-party brand/product references before any production launch.
3. Provide a least-privilege development/test MongoDB Atlas URI and final database name for non-destructive catalog and future Cart/Wishlist integration verification.
4. Define Wishlist persistence, Cart presentation, Checkout, payment, Order, and inventory-reservation stages before activating those surfaces.
5. `npm audit` reports two dependency vulnerabilities. They are not remediated automatically because an audit fix may change the dependency graph; address them in the dependency-security stage.

## Historical stage records

The records below preserve earlier-stage evidence. Statements such as “has not begun,” old test counts, and old UI boundaries describe their respective historical checkpoints, not the current Stage 5.2 state.

## Stage 2.2 status

- `Collections` is a dedicated server-rendered production component directly after the Hero.
- It uses typed local presentation data and the prototype's four maintainable organic SVG silhouettes.
- Catalog destinations remain documented fragment placeholders; no product, catalog, or database work was introduced.
- Stage 2.2 verification: typecheck, lint, production build, 8 Playwright checks (including `instant()`), responsive overflow coverage, live browser review, and the Next runtime check all pass.
- **IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED.** Stage 2.3 has not begun.

## Stage 2.3 status

- `Bestsellers` is a dedicated server-rendered component directly after `Collections`, with a typed local prototype-presentation array rather than a Product/Catalog schema.
- It reuses `public/images/home/bestsellers-stage.png`, whose product bottles and pedestal/base presentation are part of the approved prototype composite. Product routes and wishlist behavior remain deferred; fragment links are explicitly temporary.
- Prototype price labels, visual product references, and third-party trademarks are development-only presentation content pending licensing and owner approval.
- Verification: typecheck and build pass; the edited TypeScript files pass ESLint directly; all 9 Playwright checks pass against an isolated fresh production server, including `instant()` and five viewport overflow checks. The full repository lint command is blocked solely by three pre-existing untracked CommonJS test scripts in the root and was left untouched.
- **IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED.** Stage 2.4 has not begun.

## Stage 2.4 status

- `Story` is a dedicated server-rendered component following `Bestsellers`. It retains the source prototype’s asymmetric ribbon, portrait/quote, editorial narrative, landscape, and value treatment.
- Prototype story copy and visual value labels are preserved as design/presentation content only. No factual ATHAR history, sourcing, business, delivery, or product claim was added or verified.
- The CTA remains a documented `#story` placeholder; no About page, Journal, CMS, database, or editorial functionality was introduced.
- Verification: typecheck, Stage 2.4 changed-file lint, production build, Next runtime inspection, and all 10 Playwright checks (including `instant()` and responsive overflow coverage) pass.
- Repository-wide lint remains **FAIL** only because of the same three pre-existing untracked root CommonJS scripts: `test_bottle_size.js`, `test_final_bottle.js`, and `test_nojump.js`.
- **IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED.** Stage 2.5 has not begun.

## Stage 2.5 status

- `FragranceGuide` is a dedicated server-rendered component after `Story`; `HomeSections` now retains only the legacy Footer.
- It preserves the prototype's local Floral, Woody, Fresh, and Oriental presentation cards, introductory editorial panel, imagery, and deferred `#guide` links. No catalog taxonomy, filter, or route was introduced.
- Guide imagery and copy remain **PROTOTYPE / DEVELOPMENT-ONLY — LICENSE VERIFICATION REQUIRED**.
- Verification: typecheck, Stage 2.5 changed-file lint, production build, Next runtime inspection, and the full Playwright suite pass. Repository-wide lint remains **FAIL** only for `test_bottle_size.js`, `test_final_bottle.js`, and `test_nojump.js`, each triggering `@typescript-eslint/no-require-imports`.
- **IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED.** Stage 2.6 has not begun.

## Stage 2.6 status

- `src/components/layout/Footer/` is the final server-rendered homepage component. It preserves the prototype brand, section links, deferred Boutiques/Contact text, copyright, and closing line.
- `HomeSections` and `legacy-home-sections.css` were removed because they had no valid remaining production responsibility. No original static prototype/reference files were removed.
- Final integration also corrected accessibility defects in the existing Hero notes rail: valid definition-list grouping, keyboard access for an intentional nested scroller, and labelled groups for static action/value clusters.
- The homepage order is Header → Hero → Collections → Bestsellers → Story → Fragrance Guide → Footer, with one `main` landmark and no page-level overflow across 360, 430, 768, 1280, and 1600px.
- Prototype imagery, story/value copy, product brands/prices, performance copy, bestsellers/new-arrivals language, and Guide imagery remain **PROTOTYPE / DEVELOPMENT-ONLY — LICENSE VERIFICATION REQUIRED**.
- **PHASE 2 — COMPLETE. OWNER FULL-HOMEPAGE VISUAL APPROVAL REQUIRED.** Phase 3 has not begun.

## Stage 3.1 status

- `src/server/env.ts` validates `MONGODB_URI` and `MONGODB_DB_NAME` only when a database operation is requested; no secret is bundled into client code.
- `src/server/db/` owns a reused MongoDB client, named collections, and controlled idempotent index definitions. `src/server/catalog/` owns canonical domain types, schemas, persistence mapping, repositories, and public-read services.
- Products have a lifecycle (`draft`, `active`, `archived`), normalized unique slugs, integer minor-unit variant prices, explicit currency, structured notes, extensible fragrance-family keys, provider-reference media, and variant-level inventory foundations. Brand and Collection records have separate IDs, unique slugs, lifecycle, timestamps, and optional media.
- Public read methods return active records only. No public route handler exists yet, no prototype visual content is canonical data, and no catalog seed, Shop, Product Detail, Admin, or Phase 4 work has begun.
- Focused Playwright catalog-domain tests use `ATHAR Test No. 01` fictional fixtures only. Atlas connectivity remains **NOT YET VERIFIED** until safe owner-provided development/test configuration is tested.

## Stage 3.2 status

- A development-only bootstrap pipeline now separates fictional fixture data, validation, plan/conflict detection, dry-run reporting, and guarded write execution.
- The dataset contains only fictional ATHAR Test / Study records. It covers active, draft, and archived lifecycle states; different audiences/families; structured notes; one and multiple variants; positive and zero stock; inactive variants; multi-media; and a valid comparison price. No homepage prototype commercial content is canonical data.
- Fixture relationships are authored with readable seed keys and resolved to actual canonical Brand/Collection IDs only at write time. Identical reruns are unchanged; fixture changes update seed-owned fields; non-seed or differently owned matching slugs fail before writes. No seed operation deletes data.
- `npm run catalog:seed:dry` works without Atlas credentials and prints a no-write summary. `npm run catalog:seed` requires a non-production environment, valid MongoDB configuration, and `CATALOG_SEED_ALLOW_WRITE=1`.
- **STAGE 3.2 IMPLEMENTED — LIVE DATABASE EXECUTION NOT YET VERIFIED.** No database write has been performed.

## Stage 3.3 status

- Added public Server Component catalog browsing at `/shop`, `/shop/women`, `/shop/men`, `/shop/unisex`, and `/collections/[slug]`, including active-only results, validated params, accessible empty/unavailable states, and no Product Detail route.
- Catalog cards consume a narrow public read model that formats integer minor-unit prices and does not expose persistence IDs, variants, inventory, lifecycle, or seed metadata. Placeholder media remains deliberate until canonical assets are approved.
- Development/test browsing uses only fictional Stage 3.2 fixtures. Production does not fall back to them: unavailable configuration/read failures render a safe unavailable state. No Atlas read or write has occurred.
- Homepage Shop and supported audience collection links now target real routes; New Arrivals and unsupported destinations remain deferred. The Hero, navbar styling, responsive Hero ranges, and below-Hero visual style were not changed.
- **STAGE 3.3 IMPLEMENTED — LIVE ATLAS READ/WRITE NOT YET VERIFIED.**

## Stage 3.4 status

- Added server-rendered `/brands` and `/brands/[slug]` pages on the existing catalog service/repository boundary. Brand cards are narrow public DTOs; Brand pages reuse the existing ProductCard and CatalogGrid for active public products.
- Public visibility includes active Brands only. Draft/archived/missing or malformed Brand slugs render not-found when the data source is available; a valid active Brand with zero eligible products renders an accessible empty state.
- Development/test uses only fictional Stage 3.2 Brands, including an active empty fixture Brand. Production without configured/readable canonical data renders a safe unavailable state and never reveals fixture Brands. **LIVE ATLAS BRAND READS — NOT YET VERIFIED.**
- No Product Detail, search, filtering, sorting, pagination, cart, wishlist, Admin, third-party logos/media, or commercial prototype Brand data was added. Brand membership does not claim retailer, partner, distributor, or authorization status.
- **STAGE 3.4 IMPLEMENTED LOCALLY — OWNER APPROVAL PENDING.**

## Stage 3.5 status

- `/shop` now has server-rendered GET discovery controls backed by one Zod-validated query model: bounded `q`, public audience/Brand/family/collection filters, and name/lowest-active-price sorting. The URL is the source of truth; ProductCard and CatalogGrid remain shared.
- Route scope is authoritative: audience and collection paths inject their fixed scope and URL values cannot escape it. Valid zero matches use a distinct resettable empty state; unavailable production data remains unavailable and never exposes fixtures.
- Query matching is a bounded portable literal substring operation over public fields only; raw Mongo operators and regex execution are not accepted. Price range and pagination are deferred as disproportionate to the current bounded listing.
- Query URLs use `noindex, follow` plus canonical browse metadata. **LIVE ATLAS SEARCH/FILTER/SORT QUERIES — NOT YET VERIFIED.**
- **STAGE 3.5 IMPLEMENTED LOCALLY — OWNER APPROVAL PENDING.**
