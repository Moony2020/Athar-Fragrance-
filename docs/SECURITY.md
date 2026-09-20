# Security

## Current state

There is no authentication, payment handling, public API, or configured live database connection. Stage 3.1 adds a server-only MongoDB contract; no credentials are present in source control.

## Catalog data boundary

- `MONGODB_URI` and `MONGODB_DB_NAME` are server-only variables and must never use the `NEXT_PUBLIC_` prefix.
- Database, repository, and catalog-service modules import `server-only`, producing a build-time failure if a Client Component imports them.
- Zod validates product, variant, brand, collection, media, slug, money, and bounded public-list inputs before persistence/query use.
- Repositories construct fixed MongoDB filters from validated values; arbitrary client-provided Mongo operators are not accepted.
- Discovery accepts only allow-listed scalar URL fields; `q` is normalized and capped at 80 characters, uses literal substring matching, and never becomes a Mongo `$` operator or a regular expression.
- PDP slug input is validated before the server-only Product repository read. Its public DTO omits Mongo IDs, seed/lifecycle fields, timestamps, raw inventory quantities, and internal repository metadata. Private/missing Products remain indistinguishable to public routing; unavailable infrastructure is represented separately without a fixture fallback.
- Database errors are allowed to surface to trusted server-side callers, but connection strings are not interpolated into application errors or logs.
- `ensureCatalogIndexes()` is not a public endpoint and must be run only through a controlled deployment/migration process.
- The catalog seed is developer/operations tooling, not a route handler. Its write path rejects `NODE_ENV=production`, requires `CATALOG_SEED_ALLOW_WRITE=1`, and validates every fixture before the first write.
- Matching an existing slug is insufficient authority to overwrite it: seed records must carry the expected operational seed key. Conflicts fail rather than replacing unrelated records, and the pipeline deletes nothing.

## Future baseline

- Keep secrets server-only and publish an `.env.example` without values.
- Validate untrusted input with Zod; enforce authorization server-side.
- Use secure session handling through the approved authentication design.
- Verify Stripe and PayPal webhook signatures; persist and deduplicate provider events.
- Never persist raw card data.
- Apply security headers, rate limits where appropriate, dependency review, and least-privilege access before production.
