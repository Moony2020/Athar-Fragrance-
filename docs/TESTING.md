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

Stage 4.5 adds focused coverage for Related eligibility, current-product exclusion, duplicate protection, deterministic ordering, four-item bounding, canonical PDP links, responsive ProductCard reuse, and production fixture isolation.

Stage 5.1 adds pure domain coverage for canonical Cart-line merging, bounded integer quantity validation, unavailable/private Product and Variant rejection, canonical integer-minor price subtotal resolution, and Product-level Wishlist deduplication. Browser coverage confirms that the preserved PDP controls remain disabled and that ProductCard local affordances do not make commerce mutations.

Stage 5.2 adds pure guest-Cart service coverage for canonical merge/separate-variant behavior, integer-minor subtotals, price tampering, unavailable/private catalog targets, and explicit production-adapter absence. Browser coverage exercises bounded PDP Quantity, Add-to-bag, cookie attributes, selected available Variant use, blocked unavailable Variant behavior, and unchanged gallery/Wishlist boundaries. Its full regression record separates fixture development from production isolation and retains `instant()`, Turbopack, and Axe verification.

Stage 5.3 adds Cart page coverage for empty state, PDP-to-Header-to-Cart continuity, canonical product link/subtotal presentation, bounded quantity mutation, removal, and count updates. Pure coverage retains canonical identity and stale-line removal semantics. Production coverage confirms no fictional Cart data or development-memory persistence is claimed.

Stage 5.4 adds a real guest Wishlist flow: PDP/Gallery synchronization, Shop save, `/wishlist` server read, normal removal, immediate empty state, and fresh-navigation empty state. The focused flow passed 3 consecutive runs with no `revalidatePath` dependency; responsive hit-target checks passed at 360/430/768/1280/1600px. Full fixture regression passed 66/66 executed tests (8 skipped), production isolation passed 42/42 (32 skipped), and Axe reported 0 violations / 0 incomplete. Live Atlas and durable persistence are not covered.

Stage 5.5 is closed locally against the dedicated non-production `athar_stage55_test` database. Parser/owner tests pass 7/7; commerce domain/service tests pass 17/17; Mongo control covers Cart/Wishlist write-read-parse, guest isolation, CAS/revision and max-quantity-12 concurrency, TTL expiry/replacement, server-authoritative price/stale reconciliation, controlled failure handling, and separate-process restart persistence. Commerce indexes are verified. Full fixture Playwright passes 66/66 executed (8 skipped), production isolation passes 42/42 (32 skipped), TypeScript, ESLint, production Turbopack build, catalog seed dry-run, Agent Browser, Axe (0 violations / 0 incomplete), and `git diff --check` pass.

Stage 5.6 closes Phase 5 locally through an integrated commerce flow: Cart multi-line/quantity/Header behavior, Wishlist PDP/Gallery/ProductCard/Related/Header synchronization, guest and Cart/Wishlist isolation, responsive 360/430/768/1280/1600 checks, Cache Components/`instant()` coverage, security/privacy review, full fixture and production regressions, Agent Browser interaction, and DB/index checks. Axe reports 0 violations on Cart and Wishlist; gradient/image and disabled-symbol contrast findings remain documented manual reviews. Live production Atlas Cart/Wishlist, Auth/account merge, Checkout, payment, Orders, inventory reservation, and Stage 6 remain outside scope.

## Atlas integration testing

No automated test connects to a production Atlas database. When an owner-provided development/test URI is available, a future non-destructive connectivity check may call the server connection layer and read server metadata only. It must not reset, seed, or delete an arbitrary database.

Required future evidence includes responsive visual checks, keyboard navigation, screen-reader semantics, validation failures, authorization checks, payment webhook idempotency, and checkout/order concurrency scenarios.

Stage 6.4 verification adds pure reconciliation, real Mongo concurrency/retry
coverage, and an existing-account Browser E2E: guest Cart/Wishlist merge into
the authenticated user owner, `/cart` and `/wishlist` authenticated reads,
sign-out/sign-in repeat idempotency, and guest cleanup. The current-tree build
blocker is the preserved Owner Header/Wishlist dynamic-cookie change, not a
Stage 6.4 failure.

Stage 6.5 focused tests cover strict reset-token parsing, generic account
responses, disabled accounts, token-hash-only persistence, expiry/replacement,
password policy/Argon2id replacement, one-time/concurrent consumption, and
session security-version invalidation. All 8 focused auth/Mongo tests passed
against `athar_stage55_test`. Browser E2E passed the full protected test-mail
flow, including password replacement, prior-session invalidation, replay
rejection, and generic unknown/disabled responses. The request adapter has a
regression test for passing the validated email string to the reset service.
Post-run fixture audit found zero disposable users, credentials, and reset
tokens. Live Brevo delivery is not claimed and is not required for Stage 6.5
closure. Clean baseline and Stage-6.5-only production builds passed after the
route fix; full TypeScript, full ESLint, and `git diff --check` passed.
