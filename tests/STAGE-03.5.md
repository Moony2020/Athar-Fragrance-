# Stage 3.5 — Discovery Verification Record

Run from `C:\coding-projects\Athar`.

```powershell
npm run typecheck
npm run lint
npm run build
npm run catalog:seed:dry
$env:BASE_URL='http://127.0.0.1:3000'
$env:CATALOG_FIXTURE_RUNTIME='1'
node .\node_modules\playwright\cli.js test 'tests/catalog-discovery.spec.ts'
```

These commands verify TypeScript, lint, route/build generation, no-write seed regression, and development search/filter/sort URL behavior. The development discovery result is **3 passed, 1 skipped**; the skipped assertion is production-only by design. The full local production suite, including `instant()`, recorded **36 passed, 9 skipped, 0 failed**. Fixture assertions are skipped there because production must not reveal fictional data.

Stage scope: GET URL state for `q`, `audience`, `brand`, `family`, `collection`, and `sort`; no price range or pagination UI was added. No Atlas write, Product Detail, commerce, Admin, or Stage 3.6 work is authorized.
