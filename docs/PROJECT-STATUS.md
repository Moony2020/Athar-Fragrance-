# ATHAR Project Status

**Last audited:** 2026-09-19  
**Current phase:** Phase 2 — Homepage Migration — Complete  
**Overall status:** **PHASE 2 COMPLETE WITH PRE-EXISTING REPOSITORY LINT DEBT.** The full static homepage is componentized in Next.js; functional catalog and commerce behavior remain deferred.

## Verified baseline

- The repository is a static HTML/CSS/vanilla-JavaScript homepage prototype, not an established application.
- Entry point: `index.html`.
- Styling is split across `styles.css`, `hero-details.css`, `sections.css`, `index-overrides.css`, and `responsive-rebuild.css`.
- Assets are local PNG/JPG files in the repository root and `assets/`.
- Google Fonts are loaded externally: Cormorant Garamond, DM Sans, and Playfair Display.
- The original prototype is now accompanied by a Next.js 16.3 App Router foundation with TypeScript, ESLint, Zod, and Playwright.
- `next.config.ts` enables Cache Components and Partial Prefetching. The production testing API is conditionally enabled only for local test builds through `EXPOSE_TESTING_API=1`.
- No missing local asset reference was found from the current `index.html` scan.

## Baseline evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Repository inventory | Pass | Static entry point, five stylesheets, local imagery, and a standalone banner experiment identified. |
| Git history | Pass | Four commits; latest is `4f5ec7e`. |
| Local asset reference scan | Pass | No unresolved local `src`/`href` reference from `index.html`. |
| TypeScript | Pass | `npm run typecheck` completed with zero errors. |
| Repository-wide lint | Fail (known baseline debt) | Only `test_bottle_size.js`, `test_final_bottle.js`, and `test_nojump.js` fail `@typescript-eslint/no-require-imports`; they are pre-existing, untracked root scripts. |
| Production build | Pass | Next.js 16.3.0-preview.10 built via Turbopack with Cache Components and Partial Prefetching enabled. |
| Browser/runtime verification | Pass | Agent Browser and `/_next/mcp` verified the public route, React runtime, route map, and zero compile/runtime errors. |
| Production navigation rig | Pass | Playwright's public homepage check and `instant()` smoke check both passed against the freshly built local artifact on port 3100. |

## Current implementation

The prototype contains a static hero, header/navigation, mobile menu, fragrance-note rail, collection cards, a bestsellers visual with hotspots, editorial story/banner content, fragrance-guide cards, footer, and small vanilla-JS menu/scroll controls. Links are fragment placeholders; account, search, wishlist, cart, catalog, checkout, and product interactions are not implemented.

## Current implementation

- `src/app` contains the App Router root layout and a verified static homepage shell.
- `src/styles` contains only global, token, typography, and animation layers; bespoke homepage styling is owned by component CSS Modules.
- Phase 1 added tokenized colour, spacing, layout, type, radius, elevation, and motion foundations; Next.js self-hosted Cormorant Garamond and DM Sans; and six reusable UI primitives under `src/components/ui`.
- `playwright.config.ts`, `tests/home-shell.spec.ts`, and `instant-nav.rig.md` establish the reusable local verification rig.
- `.gitignore` excludes generated build, test, and TypeScript output.
- The existing static prototype and its assets remain preserved as visual reference material.

## Known follow-up items

1. Obtain owner full-homepage visual approval before considering any Phase 3 catalog/product-discovery scope.
2. Confirm production licensing for the reused Hero imagery and third-party brand/product references before any production launch.
3. Select MongoDB/media-provider credentials before database-backed catalog work; no external data service has been configured.
4. `npm audit` reports two dependency vulnerabilities. They are not remediated automatically because an audit fix may change the dependency graph; address them in the dependency-security stage.

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
- **PHASE 2 — IMPLEMENTED AND TECHNICALLY VERIFIED. OWNER FULL-HOMEPAGE VISUAL APPROVAL REQUIRED.** Phase 3 has not begun.
