# Stage 3.6 — Catalog Integration, Regression QA & Phase 3 Closure

| Command | Purpose | Result |
| --- | --- | --- |
| `npm run typecheck` | TypeScript contract and server/client imports | Pass |
| `npm run lint` | Repository ESLint | Pass |
| `npm run build` | Turbopack production build and route generation | Pass |
| `npm run catalog:seed:dry` | Fixture validation and no-write plan | Pass: 3 Brands, 4 Collections, 4 Products; 0 conflicts |
| `$env:BASE_URL='http://127.0.0.1:3101'; node .\\node_modules\\playwright\\cli.js test --reporter=dot` | Fresh production server without fixtures | **36 passed, 10 skipped, 0 failed** |
| `$env:CATALOG_FIXTURE_RUNTIME='1'; $env:BASE_URL='http://127.0.0.1:3000'; node .\\node_modules\\playwright\\cli.js test --grep 'development catalog fixture runtime|development Brand fixture runtime|development discovery fixtures' --reporter=dot` | Fixture catalog, Brand, and discovery semantics | **10 passed, 0 skipped, 0 failed** |

The production skips are intentional fixture-only assertions. The full production suite includes the `instant()` smoke test.

## Runtime and accessibility

- `/_next/mcp` route map: `/`, `/brands`, `/brands/[slug]`, `/collections/[slug]`, `/shop`, `/shop/[audience]`; no Product Detail route or public JSON API.
- Turbopack compilation and runtime errors: none.
- Axe 4.12.1: zero violations on `/shop` and valid empty Brand state. Shop has two incomplete contrast checks on decorative `aria-hidden` placeholder-media text; this is not WCAG certification.

## Corrections and pending owner decisions

- Brand discovery scope is authoritative; scoped query fields cannot escape the route. Invalid URL fields no longer discard valid siblings. Empty scope and zero-result filtering have distinct wording. Scoped query URLs preserve their own canonical route.
- Live Atlas connectivity/reads/discovery, canonical production catalog/prices/taxonomy, licensed media/media provider, Product Detail, commerce, Admin, and Phase 4 remain pending.
- No commit, push, seed write, destructive Git operation, or GitHub change was performed.
