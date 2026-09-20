# Stage 5.3 — Cart Page, Line Management & Header Count verification

`/cart` is server-first and `noindex`. Its public DTO re-resolves each stored canonical line against the current public catalog. Only available lines contribute integer-minor current-price subtotals; stale/unavailable lines are removable and excluded. Header count is total stored line quantity and is a safe visual projection, not Cart truth.

Focused verification:

- `node --import tsx --test tests/stage-05.3-service.test.ts` verifies canonical update bounds and identity-based stale removal.
- `CATALOG_FIXTURE_RUNTIME=1 BASE_URL=http://127.0.0.1:3000 playwright test --grep 'Stage 5\.3'` verifies empty state, PDP → Header → `/cart`, quantity update, remove, canonical product link, and count changes.
- Production has no durable adapter and therefore exposes no fictional Cart data or persistence claim.

The Cart remains session-scoped development/test memory. Server restart loses it. No Cart drawer, Wishlist persistence, ProductCard Add-to-bag, Checkout, payment, Order, account merge, or inventory reservation is included.

## Final regression closure — 2026-09-20

- Full fixture regression: `65 passed / 8 skipped / 0 failed` (`CATALOG_FIXTURE_RUNTIME=1`, sequential worker).
- Full production regression: `42 passed / 31 skipped / 0 failed` against the independent production server on port 3200. The skips are fixture-only assertions; production isolation, homepage instant navigation, PDP, gallery, and Cart no-fixture boundaries passed.
- Static verification passed through the project-local executables: typecheck, ESLint, production build, catalog dry-run, and `git diff --check`.
- Next MCP `get_compilation_issues` returned an empty issue list.
- Agent Browser verified PDP Add-to-bag → Header `1` → Cart line; then quantity `2` and total `2 598 kr`; then removal, Cart empty state, and Header `0`.
- The Cart decrement control removes its canonical line when its quantity is `1`; above that boundary it decrements normally.
- Agent Browser axe-core audit on settled `/cart`: `0 violations`, `0 incomplete`, `36 passes`. The initial audit found one serious contrast issue on the empty-state eyebrow; changing it to `#705921` resolved it.

Regression classifications resolved during this gate:

- A parallel fixture navigation timeout in `catalog-discovery` rendered the expected page and passed on a sequential rerun: Class C (environment/parallel timing), not a product regression.
- `home-shell` still expected the Header bag control to be a button. Stage 5.3 intentionally makes it a `/cart` link, so only that stale expectation was updated: Class B.

The global `npm run` wrapper is misconfigured after the system Agent Browser update, but the underlying project-local tools executed successfully and provided the evidence above. This is a local tool-wrapper configuration concern, not an application failure.
