# Changelog

## 2026-09-19 — Phase 2 / Stage 2.6 Footer Migration and Final Integration

- Replaced the final legacy Footer with the dedicated server-rendered `Footer` component and made the homepage composition explicit.
- Removed `HomeSections`, the migration-only legacy homepage stylesheet, and its global import after confirming no production component depended on them; original static prototype/reference files remain preserved.
- Preserved prototype Footer content and fragment navigation while keeping non-existent Boutiques and Contact destinations visibly deferred rather than fake links.
- Corrected final integration accessibility defects in the Hero definition list and nested scroller, then completed full responsive/runtime QA.
- **PHASE 2 — COMPLETE WITH PRE-EXISTING REPOSITORY LINT DEBT. OWNER FULL-HOMEPAGE VISUAL APPROVAL REQUIRED.**

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
