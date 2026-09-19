# ATHAR Master Plan

## Product direction

ATHAR is a luxury fragrance ecommerce experience: warm ivory palette, editorial serif display type, restrained sans-serif interface type, asymmetric imagery, generous spacing, and subtle interactions. The hero remains static photography; scroll storytelling, canvas runtimes, frame sequences, video sequences, and GSAP-driven cinematic behaviour are out of scope.

## Delivery governance

Each phase has a goal contract, implementation ledger, evidence, documentation, verification, and explicit owner sign-off. A phase is not complete merely because code exists. Where evidence cannot run, record **IMPLEMENTED — NOT YET VERIFIED** rather than a pass.

## Planned phases

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Repository audit, baseline, documentation | In progress |
| 1 | Application architecture, design system, domain foundation | Pending owner sign-off |
| 2 | Homepage | Planned |
| 3 | Catalog, brands, collections, discovery | Planned |
| 4 | Product detail and merchandising | Planned |
| 5 | Cart and wishlist | Planned |
| 6 | Authentication and customer account | Planned |
| 7 | Checkout foundation | Planned |
| 8 | Stripe cards, direct PayPal, webhooks | Planned |
| 9 | Canonical orders and transactional email | Planned |
| 10 | Admin platform | Planned |
| 11 | Content, journal, legal, customer experience | Planned |
| 12 | Security, performance, accessibility, SEO | Planned |
| 13 | Production readiness | Planned |

## Permanent domain invariants

- Products, brands, collections, inventory, merchandising flags, and prices are canonical data—not hard-coded JSX.
- Monetary values use integer minor units. Images are stored by a media provider with metadata in the database; image binaries do not live in MongoDB.
- Future card payments use Stripe Payment Element. PayPal uses the direct PayPal Orders API; it is not routed through Stripe.
- A durable local `paymentAttempt` must hold the provider identifier before customer payment progresses. Provider webhooks and trusted provider state, never a browser redirect, prove payment.
- ATHAR owns customer order numbers in the form `ATH-YYYY-XXXXXX`; Stripe and PayPal identifiers are internal payment references.
- Commercial claims such as bestseller, stock, authorisation, ratings, and discounts require approved canonical data.

## Phase 0 exit contract

Phase 0 exits only after the owner approves the proposed migration from the static prototype to the selected production stack. No Phase 1 implementation begins automatically.
