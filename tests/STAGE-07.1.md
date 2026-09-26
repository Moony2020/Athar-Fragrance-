# Stage 7.1 — Checkout Domain & Server-Authoritative Foundation

## Status

**COMPLETE LOCALLY — READY FOR CHECKPOINT.**

Official baseline: `5c4ec8139a358568509bd1fffb6041d2925ac0e8`.

## Contract

- Checkout reads the current Cart through the server-selected `CommerceOwner`:
  authenticated session `userId`, or existing opaque guest identity.
- Server Cart reads re-resolve canonical Product/Variant, current availability,
  current integer-minor-unit price, and currency. Browser-supplied identity,
  price, subtotal, total, or owner is never accepted as checkout input.
- The Checkout read model explicitly separates eligible and stale/unavailable/
  invalid lines; it computes the eligible subtotal from canonical unit price and
  bounded quantity, checks currency consistency, and returns safe block reasons.
- Stale/unavailable lines remain visible, are excluded from the eligible
  subtotal, and block continuing. Empty, unreadable, invalid, and mixed-currency
  carts also block.
- `/checkout` is a server-first review route with the request-time read scoped
  below Suspense for Cache Components.
- No durable checkout draft is needed yet: this stage defines no resumable
  checkout lifecycle or user-entered checkout data. No collection/repository/
  index is added.

## Out of scope

Stage 7.2+ contact/address, shipping choice/rates, VAT/tax, discounts, inventory
reservation/decrement, Stripe/PayPal, provider IDs, payment attempts, webhooks,
canonical Orders, order numbers, and order email are not implemented.

## Verification record

Stage 7.1 implementation and required local verification are complete; this
document records the closure evidence. No commit or push has been made.
Browser tests that need durable guest/user Cart fixtures may write only to
`athar_stage55_test`; each fixture is scoped to random test-only owner IDs and
removed in `finally`. The implementation itself performs no checkout-specific
Mongo writes.

### Final environment recovery and UI re-verification — 2026-09-26

`npm ci --no-audit --no-fund` restored dependencies from the existing lockfile
using a temporary npm cache; the `package-lock.json` SHA-256 remained unchanged.
The Stage 7.1 domain tests passed 6/6, Phase 5/6 focused regressions passed
42 with one separately gated Mongo transaction test skipped, and the dedicated
`athar_stage55_test` Browser E2E passed 2/2 with fixture cleanup assertions.
TypeScript passed; full ESLint reported zero errors and one existing
`SignInForm.tsx` warning; `git diff --check` passed. A clean baseline plus
Stage-7.1-only isolated production build passed.

Agent Browser verified the empty Cart and Checkout presentations. Both omit
the redundant ATHAR eyebrow and offer one primary “Explore fragrances” action
to `/shop`; the empty Checkout no longer links back to the same empty Cart.
Next MCP reported no compilation issues. Its only runtime diagnostic was the
preserved Header/`not-found.tsx` dynamic-value issue outside Stage 7.1; it did
not prevent the checkout route or either CTA from rendering and working.
