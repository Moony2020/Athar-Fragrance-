# Stage 3.4 — Brands Browsing: Verification Record

Run these commands from the project root (`C:\coding-projects\Athar`). They are local-only checks and do not seed Atlas, commit, push, or change GitHub.

## Static and production checks

```powershell
npm run typecheck
npm run lint
npm run build
npm run catalog:seed:dry
```

| Command | What it verifies | Expected result |
| --- | --- | --- |
| `npm run typecheck` | TypeScript contracts for Brand DTOs, routes, services, components, and tests | Zero errors |
| `npm run lint` | Repository-wide ESLint | Zero findings |
| `npm run build` | Optimized Next.js production build and Brand route generation | Successful build |
| `npm run catalog:seed:dry` | Fictional seed validation/planning only | `DRY RUN`, zero database writes |

## Production-style browser suite

Start a locally built production server on a temporary port, then run:

```powershell
$env:BASE_URL='http://127.0.0.1:3101'
$env:INSTANT_BASE_URL='http://127.0.0.1:3101'
npm run test:instant
```

This runs the complete Playwright suite, including the `instant()` smoke check. Fixture-specific assertions are intentionally skipped because production must never reveal fictional catalog or Brand records. Stage 3.4 recorded result: **35 passed, 6 skipped**.

## Development fixture browser suite

With `next dev` running at port 3000, run:

```powershell
$env:BASE_URL='http://127.0.0.1:3000'
$env:CATALOG_FIXTURE_RUNTIME='1'
node .\node_modules\playwright\cli.js test 'tests/brands-browsing.spec.ts'
```

This verifies fictional active Brand discovery, product association through the shared product grid, draft Brand hiding, valid empty Brand behaviour, metadata, and responsive overflow. Stage 3.4 recorded result: **9 passed, 1 skipped**. The skipped check is production-only by design.

## Manual runtime/browser checks

- `/brands` has one H1 and semantic Brand links.
- `/brands/athar-atelier` uses the existing product-grid semantics.
- `/brands/quiet-test-house` exposes the accessible empty state.
- `/brands/NOT_VALID` renders not-found.
- No horizontal page overflow at 360, 430, 768, 1280, or 1600px.
- Production `/brands` displays its unavailable state when Atlas is unconfigured and does not show fixture Brands.

## Scope guard

This record covers Stage 3.4 only. It does not authorize Atlas writes, Product Detail, search, filters, sorting, cart, wishlist, Admin, or Stage 3.5 work.
