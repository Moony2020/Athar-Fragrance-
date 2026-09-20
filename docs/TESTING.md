# Testing

## Current tooling

- TypeScript: `npm run typecheck`
- Repository-wide ESLint: `npm run lint`
- Production build: `npm run build`
- Browser regression and `instant()` navigation rig: `npm run test:instant`

## Stage verification records

Every implementation stage must add a dedicated, versioned verification record in `tests/` named `STAGE-XX.X.md`. The record must state the exact commands used (including `npm run` commands and any required local environment variables), what each command verifies, the expected result, the recorded pass/skip count, and any intentional separation between development fixtures and production. The current records include [Stage 3.6 Catalog Integration & QA](../tests/STAGE-03.6.md) and Stage 4.1 Product Detail (added with its final verification evidence).

The Playwright suite includes homepage visual/semantic regression coverage and Stage 3.1 catalog-domain tests. Catalog tests use clearly fictional `ATHAR Test No. 01` data and verify normalization/defaults, money and variant constraints, slug/identifier separation, and database-document mapping. They never contact Atlas.

Stage 3.2 adds seed-pipeline tests for fictional fixture validation, reference resolution, cross-product SKU uniqueness, dry-run summaries, deterministic idempotent plans, changed-fixture updates, conflict detection, and public lifecycle eligibility. The seed command's dry-run is also run without database credentials to prove it makes no write or connectivity claim.

Stage 3.3 adds browser coverage for Shop, validated audience and collection routes, active-only fixture visibility, empty states, homepage catalog links, not-found responses, and responsive page overflow. Fixture assertions run against the development runtime (`CATALOG_FIXTURE_RUNTIME=1` selects them in Playwright); the local production suite instead proves missing database configuration renders the explicit unavailable state and never exposes fixture products.

Stage 3.4 adds the same separated evidence for `/brands` and `/brands/[slug]`: active-only fictional Brand discovery, semantic Brand links, products-by-Brand through the existing product grid, non-public/malformed Brand not-found behavior, active empty Brand state, responsive overflow, and safe production unavailability without fixture leakage.

Stage 4.1 adds development-fixture PDP coverage for name, Brand link, shared lowest-active-price presentation, active public variants, family/structured notes, ProductCard navigation, and non-public/malformed Product routes. Its production-style assertion proves a fictional PDP is never shown when canonical access is unavailable.

Stage 4.2 adds fixture coverage for deterministic ordered multi-media selection, button/keyboard selected state, single-media restraint, zero-media placeholders, viewport overflow, and production media isolation. It also exercises equal media positions at the read-model boundary.

Stage 4.3 adds fixture coverage for deterministic initial variant selection, stable public IDs, price/compare-at and availability rendering, disabled unavailable sizes, keyboard semantics, canonical PDP links, responsive overflow, and the preserved disabled purchase-control boundary. The closing gate also records production build, TypeScript, ESLint, catalog seed dry-run, full Playwright, instant/Turbopack, runtime diagnostics, and Axe checks; live Atlas Product reads remain unverified.

The reconciled full fixture regression completed at **54 passed, 5 skipped, 0 failed**. Production fixture-isolation checks completed at **2 passed, 0 failed**. The `instant()` homepage smoke test passed in isolation and remains part of the suite.

Stage 4.4 adds focused coverage for canonical descriptions, family/audience display mapping, structured notes and empty-group handling, absence of fabricated ingredients/concentration, neutral service wording, Related fragrances, and inert future-commerce controls.

After the Stage 4.4 changes, the complete fixture regression completed at **57 passed, 5 skipped, 0 failed** (62 tests total). The isolated catalog-discovery timeout was rerun successfully; no implementation regression was found.

## Atlas integration testing

No automated test connects to a production Atlas database. When an owner-provided development/test URI is available, a future non-destructive connectivity check may call the server connection layer and read server metadata only. It must not reset, seed, or delete an arbitrary database.

Required future evidence includes responsive visual checks, keyboard navigation, screen-reader semantics, validation failures, authorization checks, payment webhook idempotency, and checkout/order concurrency scenarios.
