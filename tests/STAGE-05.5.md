# Stage 5.5 — Durable Guest Cart/Wishlist Persistence & Account-Ready Ownership

## Status

**STAGE 5.5 COMPLETE — DURABLE GUEST COMMERCE PERSISTENCE VERIFIED LOCALLY**

Starting checkpoint: `5c3d92d checkpoint: close ATHAR Stage 5.4` on `backup/phase-4-3-current`.

## Implemented locally

- Added an explicit `CommerceOwner` contract: `guest | user` with an opaque owner ID. The `user` branch is a future account boundary; no authentication or account merge is implemented.
- Added Mongo-backed Cart and Wishlist stores behind the existing `GuestCartStore` and `GuestWishlistStore` contracts. Selection requires `ATHAR_COMMERCE_PERSISTENCE=mongo` plus valid server-only Mongo configuration.
- Cart documents persist only owner identity, canonical Product/Variant identity, quantity, revision, timestamps, and expiry. Wishlist documents persist only owner identity, Product slugs, revision, timestamps, and expiry.
- Added unique owner indexes and TTL indexes through explicit `ensureCommerceIndexes()`; importing the app does not create indexes.
- Added optimistic revision compare-and-set updates with retry, including safe replacement of records awaiting TTL deletion. No price, subtotal, inventory, Product copy, Mongo `_id`, or account email is exposed to the browser.
- Guest cookies remain `athar_guest_cart` and `athar_guest_wishlist` for backward compatibility and now receive a deliberate 30-day lifetime when issued. They remain independent to preserve clearing/privacy boundaries.

## Adapter and environment policy

- Development/test defaults remain the existing ephemeral process-memory stores unless `ATHAR_COMMERCE_PERSISTENCE=mongo` is explicitly selected.
- Production returns unavailable when durable Mongo configuration/selection is absent; it never falls back to process memory.
- Verification used only the dedicated non-production database `athar_stage55_test`; no production database was contacted.

## Verification so far

- TypeScript passes.
- Repository ESLint passes with zero errors.
- Parser and durable owner/record tests pass 7/7.
- Existing commerce domain/service tests pass 17/17.
- Mongo control passes Cart/Wishlist write-read-parse, guest isolation, CAS revision concurrency, max-quantity-12 concurrency, TTL expiry/replacement, server-authoritative price reconciliation, and controlled failure handling.
- Separate-process restart persistence passes for a Cart record; all test records are cleaned up after verification.
- `carts` and `wishlists` contain the expected unique owner and TTL indexes.
- Full fixture Playwright regression passes 66/66 executed tests (8 skipped); production isolation passes 42/42 executed tests (32 skipped).
- Production Turbopack build passes with durable credentials disabled for the static build gate; catalog seed dry-run passes with zero conflicts.
- Agent Browser snapshot and Axe audit on `/wishlist`: 0 violations, 0 incomplete, 35 passes.
- `git diff --check` passes.

## Closure boundary

- `.env.local` contains the non-production connection locally and remains ignored/uncommitted; no secret is documented or printed.
- Auth, Checkout, payment, Orders, inventory reservation, account merge, and Stage 5.6 remain outside scope.

No Checkout, Auth implementation, UI redesign, or Stage 5.6 work is included.
