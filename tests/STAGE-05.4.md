# Stage 5.4 — Guest Wishlist

## Status

**STAGE 5.4 COMPLETE — REAL GUEST WISHLIST ACTIVATED LOCALLY**

The implementation is verified against development fixtures and production fixture isolation. Durable/live Atlas Wishlist reads and writes are not implemented or verified.

## Continuity investigation

The initial symptom was that the ProductCard heart reported a successful save, but the `/wishlist` browser test reported that the product was missing. The initial classification was **A — suspected real read-after-write regression**.

The temporary server-only diagnostic proved that this was not a cookie, guest identity, process, adapter, store write, store read, or canonical reconciliation failure:

- The action and `/wishlist` used the same guest fingerprint: `cbc981f546`.
- Both requests ran in process `13584`.
- Both used `EphemeralGuestWishlistStore` and `wishlist-store-1`.
- The action read back `athar-test-no-01` after writing it.
- `/wishlist` read the same slug before catalog reconciliation.
- Canonical reconciliation returned `athar-test-no-01` and matched it.

Final classification: **B — stale/incorrect test expectation**.

The failing test expected a link named exactly `Eros`, but the approved fixture display name is `Eros` and the current ProductCard markup exposes its accessible link as `View Eros`.

- Identity: `athar-test-no-01`
- Display name: `Eros`
- Accessible ProductCard link: `View Eros`

The test now follows the canonical fixture identity and accessible UI. No Wishlist application behavior was changed, and no commercial Product data was added to the fixture.

Temporary diagnostics were removed from `store.ts`, `guest-wishlist.ts`, `actions.ts`, and `wishlist-read.ts`.

## Removal UI regression gate

The removal gate reproduced a separate real regression. The remove action returned `wishlisted: false`, and the immediate store read-back contained no `athar-test-no-01`, but a fresh `/wishlist` request still returned Eros. This classified the failure as **B — server read/cache refresh**, not a mutation or client identity failure.

The control gate removed `revalidatePath("/wishlist")`; the same focused flow passed 3/3, so it remains removed. `router.refresh()` plus the server read boundary is sufficient. No global invalidation or client-side global Wishlist store was added.

The raw-store control test found no separate personalized read-model cache boundary: raw and read-model slugs matched. Invocation tracing clarified that the observed `ADD → REMOVE → ADD` sequence was `PDP ADD → Gallery REMOVE → Shop ProductCard ADD`; it was not an automatic re-add after Wishlist removal.

The final invocation gate proved the actual boundary: the first Wishlist card was rendered at `y=60`, while the absolute Header `.inner` occupied the hit target at the button center. The normal click was intercepted before the client handler and Server Action. The narrow fix adds top spacing to the Wishlist page so the card starts below the Header; no mutation, store, or cache contract changed.

The focused end-to-end flow passed 3 consecutive times without `revalidatePath`: PDP/Gallery synchronization, Shop save, `/wishlist` removal, immediate empty state, and fresh `/wishlist` empty state. Responsive hit-target checks passed at 360, 430, 768, 1280, and 1600px. Full fixture regression passed 66/66 executed tests (8 skipped); production isolation passed 42/42 executed tests (32 skipped). Typecheck, ESLint, seed dry-run, Turbopack production build, Agent Browser flow, and Axe passed (0 violations, 0 incomplete, 20 passes on `/wishlist`).

## Scope boundaries

This stage does not add durable production persistence, live Atlas verification, account Wishlist merging, ProductCard Add-to-Bag behavior, Checkout, Payment, Order, or Stage 5.5.
