# Stage 5.2 — PDP Add-to-bag & Ephemeral Guest Cart verification

Recorded locally on 2026-09-20. This stage uses fictional development catalog data only; it does not claim a live Atlas Cart or durable production persistence.

| Command | Purpose | Recorded result |
| --- | --- | --- |
| `node --import tsx --test tests/stage-05.1-domain.test.ts` | Preserve Cart/Wishlist domain foundation | 5 passed, 0 failed |
| `node --import tsx --test tests/stage-05.2-service.test.ts` | Canonical guest Cart service, price tampering, unavailable targets, and no production memory fallback | 3 passed, 0 failed |
| `CATALOG_FIXTURE_RUNTIME=1 BASE_URL=http://127.0.0.1:3000 playwright test --grep 'Stage 5\\.2' --reporter=list` | PDP quantity bounds, canonical Add-to-bag merge, cookie attributes, selected Variant, gallery and Wishlist boundaries | 2 passed, 1 intentionally skipped production-only assertion |
| `CATALOG_FIXTURE_RUNTIME=1 BASE_URL=http://127.0.0.1:3000 playwright test` | Full fictional development regression, including `instant()` | 63 passed, 7 skipped, 0 failed |
| `BASE_URL=http://127.0.0.1:3102 playwright test` | Fresh production-build fixture-isolation regression | 41 passed, 29 skipped, 0 failed |
| `tsc --noEmit` | Static TypeScript safety | pass |
| Next `/_next/mcp`: `get_compilation_issues`, `get_errors`, `get_routes` | Turbopack compile/runtime and route safety | zero issues; zero configuration/session errors; no Cart route introduced |
| Agent Browser + Axe WCAG 2 A/AA | Real PDP interaction and accessibility audit | Add-to-bag success observed; 0 violations, 1 existing color-contrast manual-review incomplete |

The local guest Cart is process memory for development/test and is intentionally unavailable in production until a durable adapter is selected. No Atlas Cart/Wishlist reads or writes, Cart page/drawer, Checkout, payment, Orders, account merge, ProductCard mutation, Header count update, or inventory reservation is included.
