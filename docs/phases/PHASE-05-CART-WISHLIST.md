# Phase 5 — Cart & Wishlist

## Stage 5.1 — Cart & Wishlist Domain, Existing UI Audit & Commerce Foundation

**Status:** foundation implemented locally; live Atlas Cart/Wishlist persistence is not yet verified.

### Existing owner UI audit

| Surface | Classification | Current behavior |
| --- | --- | --- |
| PDP quantity, Add to bag, purchase-panel Wishlist | A — UI-only | Native disabled controls; no state, request, persistence, or mutation. |
| PDP gallery Wishlist | B — local-only | Pressed visual state only; no persistence or request. |
| Shop/Related ProductCard size selector | B — local-only | Selects a presentational size and canonical public price in the card. |
| Shop/Related ProductCard bag and Wishlist | B — local-only | Pressed/check visual state only; no persistence or request. |
| Header bag counter and Wishlist | A — UI-only | Static visual affordances; bag counter remains zero. |

No owner-designed control was removed or redesigned.

### Cart contract

- A Cart line identity is `productSlug + publicVariantId`; names, size labels, array positions, and formatted prices are never identities.
- Cart state stores only canonical identity and bounded quantity. The maximum is **12** per line; quantities must be finite integers from 1 through 12.
- `addCartLine`, `updateCartLineQuantity`, `removeCartLine`, and `resolveCart` are pure domain services. The server adapter resolves each line through the canonical public PDP read before accepting it or calculating a subtotal.
- Current payable price is canonical `priceMinor`; `compareAtPriceMinor` is presentation-only. Subtotals use integer minor-unit arithmetic. No client price, total, availability, Product copy, Brand, or stock value is trusted.
- A Product must be public/active through the existing PDP boundary and its chosen Variant must be currently available. Raw inventory remains private.
- **Cart presence is not inventory reservation.** This stage neither decrements nor locks inventory and makes no availability guarantee for a later checkout.

### Wishlist contract

Wishlist is deliberately **Product-level**, matching the existing heart affordances. It stores canonical Product slug only; it has no quantity, price snapshot, or inventory semantics. Duplicate adds are idempotent and the canonical public Product resolver rejects unavailable/private Products.

### Guest persistence decision

Stage 5.1 deliberately introduces **no persistence**: no Mongo Cart schema, no cookie identifier, no localStorage, no server action, and no API endpoint. The validated domain is ready for a later guest adapter. The recommended next decision is an opaque, httpOnly, secure-in-production guest-session cookie backed by server storage, with canonical revalidation on every state-changing operation and an explicit future account-merge policy.

Local storage is not used as Cart truth. If used later as a convenience cache, it must contain only non-authoritative identity/quantity data and must be server-revalidated before Checkout.

If a Product is archived, a Variant is removed, or a price/availability changes after a future add, the future persistence adapter must re-resolve it, show a safe stale/unavailable line state, and require customer adjustment before Checkout. It must not preserve a stale client price as payable truth.

### Deferrals

Stage 5.1 does not implement Cart UI activation, Cart page/drawer, Checkout, Orders, payments, taxes, shipping, coupons, reservations, authentication, customer records, or inventory mutation. Stage 5.2 was not started.
