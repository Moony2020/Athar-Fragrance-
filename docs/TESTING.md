# Testing

## Current tooling

- TypeScript: `npm run typecheck`
- Repository-wide ESLint: `npm run lint`
- Production build: `npm run build`
- Browser regression and `instant()` navigation rig: `npm run test:instant`

## Stage verification records

Every implementation stage must add a dedicated, versioned verification record in `tests/` named `STAGE-XX.X.md`. The record must state the exact commands used (including `npm run` commands and any required local environment variables), what each command verifies, the expected result, the recorded pass/skip count, and any intentional separation between development fixtures and production. The current Phase 3 closure record is [Stage 3.6 Catalog Integration & QA](../tests/STAGE-03.6.md).

The Playwright suite includes homepage visual/semantic regression coverage and Stage 3.1 catalog-domain tests. Catalog tests use clearly fictional `ATHAR Test No. 01` data and verify normalization/defaults, money and variant constraints, slug/identifier separation, and database-document mapping. They never contact Atlas.

Stage 3.2 adds seed-pipeline tests for fictional fixture validation, reference resolution, cross-product SKU uniqueness, dry-run summaries, deterministic idempotent plans, changed-fixture updates, conflict detection, and public lifecycle eligibility. The seed command's dry-run is also run without database credentials to prove it makes no write or connectivity claim.

Stage 3.3 adds browser coverage for Shop, validated audience and collection routes, active-only fixture visibility, empty states, homepage catalog links, not-found responses, and responsive page overflow. Fixture assertions run against the development runtime (`CATALOG_FIXTURE_RUNTIME=1` selects them in Playwright); the local production suite instead proves missing database configuration renders the explicit unavailable state and never exposes fixture products.

Stage 3.4 adds the same separated evidence for `/brands` and `/brands/[slug]`: active-only fictional Brand discovery, semantic Brand links, products-by-Brand through the existing product grid, non-public/malformed Brand not-found behavior, active empty Brand state, responsive overflow, and safe production unavailability without fixture leakage.

## Atlas integration testing

No automated test connects to a production Atlas database. When an owner-provided development/test URI is available, a future non-destructive connectivity check may call the server connection layer and read server metadata only. It must not reset, seed, or delete an arbitrary database.

Required future evidence includes responsive visual checks, keyboard navigation, screen-reader semantics, validation failures, authorization checks, payment webhook idempotency, and checkout/order concurrency scenarios.
