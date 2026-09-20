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

At the Stage 5.1 closure, Cart UI activation, Cart page/drawer, Checkout, Orders, payments, taxes, shipping, coupons, reservations, authentication, customer records, and inventory mutation were not implemented. Stage 5.2 had not started at that checkpoint.

## Stage 5.2 — PDP Add-to-bag & Ephemeral Guest Cart

**Status:** implemented locally; durable production Cart persistence and live Atlas reads are not yet verified.

- Only the PDP size selection, bounded Quantity controls, and Add to bag control are active. The selected public Variant ID and quantity are submitted to one Next.js Server Action; client prices, totals, availability, inventory, and Product records are never accepted.
- The action validates a strict `productSlug + variantId + quantity` payload, obtains or creates an opaque `athar_guest_cart` identifier, and delegates through the canonical public Product resolver before mutation. It returns only a narrow safe success/error result.
- Development/test uses an in-memory, per-guest CartStore with serialized same-guest mutations. It intentionally disappears on a process restart. Production has no memory fallback: without a deliberate durable adapter the action returns a safe unavailable result rather than a fictional success.
- The guest cookie is session-scoped, opaque, `httpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` in production. It holds no price, cart contents, account identity, or inventory data.
- Existing PDP gallery behavior remains independent. PDP purchase Wishlist remains visibly preserved but disabled; gallery and ProductCard local affordances, Header count, Cart page/drawer, Checkout, persistence schema, account merge, payment, Orders, and inventory reservation remain deferred.

## Stage 5.3 — Cart Page, Line Management & Header Count

**Status:** implemented locally; durable production Cart persistence and live Atlas Cart reads remain unverified.

- `/cart` is a server-first private utility route (`noindex`). It reads the opaque guest cookie only in a Suspense-bounded server leaf, loads stored canonical identities, and re-resolves public Product/Variant data on every render.
- The public Cart DTO exposes only public product/brand/name/media, selected size, quantity, current canonical integer-minor price, line subtotal, and a safe available/unavailable/stale state. It never exposes cookie values, persistence IDs, raw inventory, lifecycle, or seed metadata.
- Quantity update and remove use the existing Server Action path and canonical `productSlug + variantId` identity. Updates require a currently available public Variant; removal intentionally works for stale lines. Valid lines alone contribute to `Subtotal`; no shipping, tax, promotion, payment fee, or final total is calculated.
- A previously removed/private Product or missing Variant renders as stale; an unavailable Variant renders unavailable. These lines have no payable price/subtotal and remain removable. Current catalog prices replace any prior browser-era price at every render.
- Header bag navigation now links to `/cart`. Its count is the sum of stored line quantities, including removable stale lines. A tiny visual client leaf consumes the server-provided initial count and the safe total returned by Cart actions; it is not a Cart store and never owns Cart truth.
- The guest Cart is still session-scoped development/test server memory: restart loses state, a new guest session starts a new Cart, and production intentionally has no memory fallback. Wishlist persistence, ProductCard Add-to-bag, Cart drawer, Checkout, payment, Orders, account merge, and inventory reservation remain deferred.
