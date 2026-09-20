# Stage 4.3 — Variant / Size Selection, Price & Availability

## Scope

Stage 4.3 adds PDP-only client-side selection of already server-rendered active variants. It updates the selected size, canonical minor-unit price, optional compare-at price, and availability copy without product refetches or mutations.

## Deterministic selection rule

The initial selected variant is the lowest-size available active variant; if none is available, it is the first active variant by size. The server-rendered `Eau de parfum` note follows the same rule, avoiding a hydration mismatch.

## Intentional deferrals

No cart, persistent wishlist, checkout, payment, inventory reservation, admin management, or data mutation is connected in this stage. At the owner's explicit visual request, `ProductPurchasePanel` renders the established quantity/add-to-bag/wishlist layout as an inert preview: every control is disabled and it owns no commerce state. The only active purchase-option state is `ProductVariantSelector`.

## Required checks

- `npm run typecheck`
- `npm run lint`
- `npm run test:catalog:seed:dry`
- `CATALOG_FIXTURE_RUNTIME=1 BASE_URL=http://127.0.0.1:3000 npx playwright test product-gallery.spec.ts product-detail.spec.ts --reporter=list`
- Agent Browser interaction test on `/products/athar-test-no-01`
- `/_next/mcp` compilation and runtime-error checks
