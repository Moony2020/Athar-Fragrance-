# Phase 2 — Homepage Migration

## Homepage static-surface restoration

**Status:** PHASE 2 — IMPLEMENTED AND TECHNICALLY VERIFIED; OWNER FULL-HOMEPAGE VISUAL APPROVAL REQUIRED  
**Scope boundary:** Header, Hero, Shop by Collection, Bestselling Fragrances, Story, Fragrance Guide, and Footer are dedicated production components. Catalog, account, cart, search, wishlist, checkout, product data, and all commerce/data domains remain deferred.

## Architecture

- `src/app/page.tsx` composes a server-rendered `Header` and `Hero` inside the homepage shell.
- `src/components/layout/Header/` owns the semantic site header and navigation presentation.
- `src/components/home/Hero/` owns the static editorial Hero, product visual, and fragrance-note definition list.
- `src/components/home/Collections/`, `Bestsellers/`, `Story/`, and `FragranceGuide/` own their respective homepage sections; `src/components/layout/Footer/` owns the Footer.
- `Header` and `Hero` are Server Components. No client state, scroll effects, GSAP, canvas, video, parallax, or cinematic runtime was added.
- The shared `Container` and `Button` primitives, central type classes, motion policy, and named tokens are reused. The Hero's two-line heading uses the documented `--text-hero-display` token.

## Restored sections

- Shop by Collection restores the four original editorial collection cards.
- Bestselling Fragrances restores the local static product-stage image; its visual arrows do not claim an implemented carousel.
- Our Story restores the original editorial quote, story message, values treatment, and local imagery.
- Fragrance Guide restores the four olfactive-family cards and their local imagery.
- Footer restores ATHAR branding and the visual navigation inventory without dead links.

## Responsive strategy

- Desktop uses a viewport-contained two-column editorial layout: narrative copy at left, the bottle as the focal visual at right, the ghost wordmark biased behind the bottle, and the full fragrance-note glass rail visible without scrolling.
- Tablet reduces the grid while retaining the note rail as two columns.
- Mobile deliberately recomposes into product visual, narrative copy, reachable CTA, then notes. It does not scale down a desktop screenshot.
- No fixed Hero height, viewport-specific offset grid, or horizontal scrolling behavior is used.

## Asset usage and licensing

The following copied local assets are served from `public/images/hero/` while their root prototype originals are preserved:

- `hero-Athar.png` — decorative background scene.
- `atharperfume-img.png` — meaningful product image with descriptive alt text.
- `top-note.png`, `middle-note.png`, `base-note.png`, and `longevity.png` — decorative companions to adjacent text.

**PROTOTYPE / DEVELOPMENT ASSETS — LICENSE VERIFICATION REQUIRED.** No production license or official brand authorization is implied by this migration.

## Deferred behavior

- The Hero background now extends behind the absolutely layered Header, matching the prototype's full-bleed top composition.
- Only Home is a current functional navigation link. Shop, Collections, and Our Story remain non-interactive visual labels; they are hidden from the accessibility tree until their destinations exist.
- The prototype's Search, Account, Wishlist, Shopping Bag, and Watch Our Story affordances are restored visually at the owner's request. They are native disabled buttons with explicit unavailable labels, so they do not impersonate completed commerce or story functionality. The mobile menu remains deferred.
- The Hero CTA links to its existing fragrance-note content. It does not claim to open a catalog that has not been implemented.
- The inherited `8–10 Hours` copy is migrated prototype content, not a newly introduced performance claim; it requires commercial/content approval before production launch.

## Intentional differences from the prototype

| Category | Difference | Reason |
| --- | --- | --- |
| Responsive correction | Mobile flows product → copy → CTA → notes rather than preserving desktop overlap. | Prevents clipping, accidental overlap, and horizontal overflow. |
| Accessibility correction | Hero notes use a semantic definition list; decorative art is hidden from assistive technology; bottle has descriptive alt text. | Keeps meaning available without relying on position or imagery alone. |
| Architecture correction | Root prototype assets are copied into `public/images/hero/`, and Next `Image` supplies dimensions/sizes. | Enables static serving, responsive image handling, and layout stability. |
| Architecture correction | Deferred destinations/actions are not interactive. | Prevents fake commerce functionality and dead controls. |
| Visual fidelity correction | Header is layered over the Hero's preserved background art, including the top of the viewport; the ghost ATHAR wordmark sits behind the bottle on desktop. | Restores the intended prototype composition after owner review. |

## Verification ledger

| Check | Status | Evidence |
| --- | --- | --- |
| Typecheck | Pass | `npm run typecheck` completed with zero errors. |
| Repository-wide lint | Fail (known baseline debt) | Only the pre-existing untracked root scripts `test_bottle_size.js`, `test_final_bottle.js`, and `test_nojump.js` fail `@typescript-eslint/no-require-imports`. |
| Production build | Pass | Next.js 16.3.0-preview.10 Turbopack build completed; `/` is static and Cache Components/Partial Prefetching remain enabled. |
| Playwright | Pass | 7 tests passed: homepage semantics, Hero CTA/image, `instant()` smoke, and no horizontal overflow at 360, 430, 768, 1280, and 1600px. |
| Runtime | Pass | `/_next/mcp` reported `issues: []`, no config/session errors, and route `/`. |
| Browser / accessibility baseline | Pass | Live browser inspection confirmed header/nav/main/heading/link/image/definition-list semantics and no console warnings or errors at desktop and 390px mobile. |

## Visual review gate

The migrated Hero was compared with `reference.png` and inspected live at desktop and small-mobile widths. The visual intent is preserved, but this is the first Phase 2 visual acceptance point.

**Do not add catalog or commerce behavior until the owner approves the rendered full homepage surface and a subsequent functional scope is agreed.**

## Stage 2.2 — Shop by Collection

**Status:** IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED

### Architecture and presentation data

- `src/components/home/Collections/Collections.tsx` is a Server Component placed directly after `Hero` in the homepage composition.
- It owns a typed local presentation array for the approved prototype concepts: For Her, For Him, Unisex, and New Arrivals.
- The old collection markup is removed from `HomeSections`; that component continues to own the later legacy surfaces and is not part of this stage.

### Visual and responsive implementation

- The cards retain the prototype's four distinct inline-SVG organic silhouettes, warm light/dark treatment, editorial type, and restrained arrow treatment.
- No collection imagery exists in the approved prototype composition, so no unrelated imagery was introduced.
- Desktop renders four cards; tablet and mobile use a two-column reflow with no horizontal viewport overflow.
- Card hover/focus only refines the shadow and border treatment. Reduced-motion users receive no transition.

### Deferred destinations and asset status

- Card and “Explore all” destinations use the documented `#collections` placeholder until catalog routes are approved; no catalog, filtering, or backend collection functionality is implied.
- The inherited prototype vector shapes and any prototype assets remain **DEVELOPMENT-ONLY — LICENSE VERIFICATION REQUIRED**.

### Verification and approval

- Automated coverage verifies the heading, four semantic card links, keyboard-reachable anchors, and no horizontal overflow at 360, 430, 768, 1280, and 1600px.
- `npm run typecheck`, `npm run lint`, and `npm run build` pass. The production build remains a static `/` route with Cache Components and Partial Prefetching enabled.
- `npm run test:instant` passes all 8 Playwright checks, including the production `instant()` smoke test.
- Live browser review was performed at 1280px and 360px; `/_next/mcp` reports `issues: []`.
- Stage 2.3 Bestselling Fragrances has not been changed or started by this stage.

## Stage 2.3 — Bestselling Fragrances

**Status:** IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED

### Architecture and prototype presentation data

- `src/components/home/Bestsellers/Bestsellers.tsx` is a Server Component composed directly after `Collections`.
- A typed, local `FeaturedFragrance` presentation array defines the five prototype products: Dior Sauvage, Versace Eros, Yves Saint Laurent Libre, Lancôme La Vie Est Belle, and Armani Acqua di Giò.
- Brand, name, and price labels are inherited prototype presentation strings only. They are not canonical Product records, approved commercial prices, rankings, stock, availability, or sales claims.
- The old inline Bestsellers markup and its dedicated legacy CSS were removed. `HomeSections` continues to own only the later, untouched legacy surfaces. Its wrapper is now a `div`, avoiding a nested landmark inside the homepage `main`.

### Visual treatment and responsive behavior

- The existing local composite stage asset, `public/images/home/bestsellers-stage.png`, is reused through `next/image`; its bottles, sculptural/pedestal bases, shadows, crop, and editorial composition remain asset-authored rather than being reconstructed in CSS.
- Five semantic, keyboard-reachable overlay links preserve the prototype's product-region affordances. Hover/focus adds only a restrained radial refinement; reduced-motion users receive no transition.
- Desktop keeps the full editorial stage and decorative visual arrows. Below `48rem`, the stage has its source-supported internal horizontal scroll while arrows are hidden; the page itself never acquires horizontal overflow.
- `main { overflow-x: clip; }` is a non-visual containment correction for escaped legacy decorative geometry. It preserves intentional nested scrollers such as the Bestsellers stage.

### Deferred functionality and asset status

- Product and “Explore all bestsellers” links use the documented `#bestsellers` placeholder. No Product Detail route or catalog domain was created.
- No wishlist control or local wishlist behavior was added.
- The composite product/pedestal image, displayed brands, names, and prices remain **PROTOTYPE / DEVELOPMENT-ONLY — LICENSE VERIFICATION REQUIRED**. This migration does not imply trademark, media, commercial, or retailer authorization.

### Verification and approval

- TypeScript passes; the changed TypeScript/test files pass ESLint directly.
- The repository-wide `npm run lint` remains blocked by three pre-existing, untracked root scripts (`test_bottle_size.js`, `test_final_bottle.js`, `test_nojump.js`) that use CommonJS `require()`. They were not changed by this stage.
- Production build passes; `npm run test:instant` passes all 9 tests against a fresh isolated production server, including `instant()` and page-overflow coverage at 360, 430, 768, 1280, and 1600px.
- Live browser review covered the desktop editorial stage and 360px internal-scroll treatment. The accessibility tree exposes the section heading, deferred Explore link, and all five labelled product links. Next runtime reports no config, session, or compilation errors.
- Stage 2.4 Our Story was not started or changed.

## Stage 2.4 — Our Story

**Status:** IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED

### Architecture and prototype-content status

- `src/components/home/Story/Story.tsx` is a server-rendered homepage component placed directly after `Bestsellers`.
- The prototype headline, pull quote, narrative paragraph, prototype CTA label, and four value labels are migrated without editorial rewriting. They remain **design / presentation content**, not verified ATHAR history, policies, operational guarantees, or production-approved brand facts.
- The former inline Our Story markup was removed from `HomeSections`; Fragrance Guide and Footer remain untouched for later stages.

### Image, composition, and responsive reading order

- The desktop composition retains the prototype’s full-width silk ribbon, asymmetric left portrait/quote, central narrative, and right landscape/value treatment through the source SVG geometry and local story assets.
- At small widths, the DOM reading order is intentional: portrait and quote → narrative → landscape and prototype values. The right mobile shape uses a rounded organic frame rather than a clipping path so no value label is cut off.
- The mobile figures use optimized `next/image`; the desktop artwork uses the existing inline SVG composition because its assets are embedded within the source-defined masks.
- “Discover Our Story” is a semantic, keyboard-focusable `#story` placeholder link. No About route, CMS, Journal, or other editorial domain was created.

### Verification and asset status

- TypeScript passes. ESLint for every Stage 2.4 modified application/test file passes.
- Repository-wide `npm run lint` remains **FAIL** exclusively due to pre-existing untracked root scripts `test_bottle_size.js`, `test_final_bottle.js`, and `test_nojump.js`, each triggering `@typescript-eslint/no-require-imports` on `require()`. They are intentionally untouched baseline debt.
- Production build passes. The full Playwright suite passes **10/10** against an isolated fresh production server, including `instant()`, Our Story semantics, and no-overflow checks at 360, 430, 768, 1280, and 1600px.
- Browser inspection covered the desktop and 360px responsive compositions. Next runtime reports no config, session, or compilation errors.
- All story photography and visual value/brand copy remain **PROTOTYPE / DEVELOPMENT-ONLY — LICENSE VERIFICATION REQUIRED**.
- Stage 2.5 Fragrance Guide was not started.

## Stage 2.5 — Fragrance Guide

**Status:** IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED

### Architecture and prototype presentation data

- `src/components/home/FragranceGuide/FragranceGuide.tsx` is a Server Component placed directly after `Story`.
- Its typed local presentation data preserves the exact prototype family labels and order: Floral, Woody, Fresh, and Oriental. These are homepage presentation labels only, not a canonical catalog taxonomy.
- The guide's legacy markup and guide-specific CSS were removed from `HomeSections` and `legacy-home-sections.css`. `HomeSections` remains solely for the untouched legacy Footer until Stage 2.6.

### Visual, image, responsive, and accessibility behavior

- The source editorial panel, dark contrast, image-driven cards, original copy, card ordering, and restrained image-scale refinement are preserved with CSS Modules and optimized local `next/image` assets.
- Desktop retains the introductory panel and four-card composition. At intermediate widths labels shift into source-inspired vertical treatment; at mobile the design becomes a readable two-column image grid with a full-width introduction.
- Each family card is a semantic, keyboard-focusable link with an explicit unavailable destination label and documented `#guide` placeholder. Focus is visible, labels remain present without hover, and reduced-motion removes image transitions.
- All imagery and copy are **PROTOTYPE / DEVELOPMENT-ONLY — LICENSE VERIFICATION REQUIRED**. No perfume education claims, filtering, catalog routes, data schema, or commerce behavior was added.

### Verification and current lint truth

- TypeScript and Stage 2.5 changed-file ESLint pass. Production build, runtime inspection, and the full Playwright suite pass, including Guide semantics and no page-level overflow at 360, 430, 768, 1280, and 1600px.
- Repository-wide `npm run lint` remains **FAIL** only for the pre-existing untracked root scripts `test_bottle_size.js`, `test_final_bottle.js`, and `test_nojump.js`, each triggering `@typescript-eslint/no-require-imports` at `require()`.
- Live visual review covered desktop and 360px mobile composition, including the Story → Guide transition. Stage 2.6 Footer migration has not begun.

## Stage 2.6 — Footer Migration and Final Homepage Integration & QA

**Status:** PHASE 2 — COMPLETE

### Footer architecture and deferred destinations

- `src/components/layout/Footer/Footer.tsx` is a server-rendered semantic `<footer>` using the shared `Container` primitive and its own CSS Module.
- It preserves only source-prototype content: ATHAR / Haute Parfumerie branding; Collections, Bestsellers, Our Story, and Fragrance Guide fragment navigation; Boutiques and Contact presentation text; copyright; and the closing line.
- Existing homepage section fragments remain functional. Boutiques and Contact are intentionally non-interactive text because their destinations do not exist; no fake route, newsletter, social URL, legal statement, or commerce functionality was created.

### Cleanup, ownership, and integration audit

- `HomeSections` was deleted after its last runtime content migrated. `legacy-home-sections.css` and its global import were also deleted after verifying it contained only superseded homepage section/Footer styling. The static prototype CSS and reference files remain untouched.
- Global CSS now contains only base/global rules and shared token/type/animation imports. Header, Hero, Collections, Bestsellers, Story, Fragrance Guide, and Footer own bespoke styling through CSS Modules. No new reusable token was justified.
- The final composition is explicit: Header → Hero → Collections → Bestsellers → Story → Fragrance Guide → Footer. The only earlier-component changes are accessibility corrections to the Hero note rail and static group semantics in Header/Story.

### Accessibility, responsive, performance, and content status

- The Hero notes use valid definition-list groups and offer keyboard arrow access when their intentional internal scroller is active. The final homepage has one main landmark, semantic header/nav/sections/footer landmarks, visible focus treatment, and no page-level overflow at 360, 430, 768, 1280, and 1600px.
- Live full-page inspection covered desktop and mobile. Axe found zero violations after the corrections; color contrast remains a manual-review item for image/overlay artwork, not a claim of WCAG certification.
- All homepage sections remain Server Components except the pre-existing `HeroNotes` client interaction needed for its scroll controls. Cache Components, Partial Prefetching, static `/`, responsive Next Image usage, and the `instant()` rig remain intact. Hero imagery is prioritized; below-the-fold images are not broadly prioritized.
- Prototype imagery, story/value copy, product brands, prices, bestsellers/new-arrivals language, longevity copy, and Guide imagery remain **PROTOTYPE / DEVELOPMENT-ONLY — LICENSE VERIFICATION REQUIRED**. They are presentation content, not canonical commercial claims.

### Verification and completion

- TypeScript, Stage 2.6 changed-file lint, production build, runtime inspection, full Playwright suite, `instant()`, and responsive overflow checks pass.
- The legacy root screenshot scripts that previously caused `@typescript-eslint/no-require-imports` findings were removed after confirming that no package script, test, or production path referenced them. Repository-wide `npm run lint` now passes.
- **PHASE 2 — COMPLETE.** Owner full-homepage visual approval remains required. Phase 3 has not begun.
