# Stage 4.1 — Product Detail Route, Public PDP Read Model & Page Foundation

| Command | Purpose | Recorded result |
| --- | --- | --- |
| `npm run typecheck` | TypeScript public DTO, route, server-only boundary, and component contracts | Pass |
| `npm run lint` | Repository ESLint | Pass |
| `$env:EXPOSE_TESTING_API='1'; npm run build` | Turbopack production build, Cache Components/Partial Prefetching route generation | Pass; `/products/[slug]` is a partial-prerendered dynamic route |
| `npm run catalog:seed:dry` | Validate fictional catalog data without any connection or write | Pass: 3 Brands, 4 Collections, 4 Products; 0 conflicts |
| `$env:CATALOG_FIXTURE_RUNTIME='1'; $env:BASE_URL='http://127.0.0.1:3000'; node .\node_modules\playwright\cli.js test product-detail.spec.ts --reporter=dot` | Development PDP: public data, Brand link, shared price rule, variants, notes, ProductCard identity, privacy/not-found, and 360/430/768/1280/1600 overflow | **5 passed, 1 skipped, 0 failed**; the skipped test is production-only by design |
| `$env:BASE_URL='http://127.0.0.1:3101'; node .\node_modules\playwright\cli.js test --reporter=dot` | Fresh local production artifact: Phase 1–3 regression, `instant()` smoke, PDP unavailable state, and fixture isolation | **37 passed, 15 skipped, 0 failed**; fixture-only assertions are intentionally skipped |

## Runtime and accessibility

- `/_next/mcp`: no compilation issues; route map includes `/products/[slug]`.
- Browser accessibility tree confirms one product H1, media region, accessible Brand link, sizes region, and structured notes region.
- Axe 4.12.1 on fictional fixture PDP: **0 violations, 0 incomplete**.
- Axe 4.12.1 on production unavailable PDP: **0 violations, 1 incomplete contrast check** across seven Header/status nodes. This is an automated-tool inconclusive result, not a WCAG certification; no blocking violation was reported.

## Evidence boundaries

- Fixture PDP evidence is development-only and uses fictional ATHAR records.
- Production evidence has no configured catalog source and proves `/products/cedar-study` renders the explicit unavailable state rather than fictional data.
- No Atlas read/write, seed write, commit, push, or GitHub change occurred.
