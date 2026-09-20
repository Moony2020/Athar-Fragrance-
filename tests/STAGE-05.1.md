# Stage 5.1 — Cart & Wishlist Domain, Existing UI Audit & Commerce Foundation

## Scope and preservation

Stage 5.1 audits existing owner UI and adds the server/domain foundation only. It does not redesign or broadly activate the PDP, Shop, ProductCard, gallery, Header, Quantity, Add to bag, or Wishlist visuals.

## Verification

| Command | Result | Purpose |
| --- | --- | --- |
| `node --import tsx --test tests/stage-05.1-domain.test.ts` | 5 passed | Cart identity/merge/removal, quantity guardrails, eligibility, canonical price subtotal, and Wishlist deduplication/removal. |
| `CATALOG_FIXTURE_RUNTIME=1 BASE_URL=http://127.0.0.1:3000 playwright test tests/STAGE-05.1.spec.ts` | 2 passed | Preserved disabled PDP controls and ProductCard non-mutation behavior. |
| `npm run typecheck`, `npm run lint`, `npm run build` | passed with 0 lint errors/warnings | Static and production-build checks. |
| `npm run catalog:seed:dry` | passed: 3 Brands, 4 Collections, 7 Products, 0 conflicts | Fictional fixture validation without a database write. |

The Stage 5.1 domain has no persistence adapter: no Cookie, localStorage, database, API route, server action, or mutation was added. Live Atlas Cart/Wishlist persistence is not yet verified.

Final browser regression used one worker to avoid the known parallel-navigation flake: development fixture suite **61 passed / 6 skipped / 0 failed**; fresh production suite **40 passed / 27 skipped / 0 failed**. The production skips are deliberate fixture-only assertions. Next MCP returned `issues: []`, `configErrors: []`, and `sessionErrors: []`. Agent Browser Axe found 0 violations and 1 existing contrast-incomplete review for the owner gradient treatment.
