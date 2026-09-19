# API

No public API routes currently exist, by design. Stage 3.3 adds server-rendered catalog browse pages, not `/api/products` or any other network endpoint.

The available internal read contracts are `getPublicProductBySlug`, `listPublicProducts`, `getPublicBrandBySlug`, `getPublicCollectionBySlug`, `getCatalogBrowseData`, `getBrandBrowseData`, and `getCatalogDiscoveryData`. They validate route/query boundaries and return only active public records. `getCatalogDiscoveryData` accepts only the bounded allow-list `q`, `audience`, `brand`, `family`, `collection`, and `sort`; route scope is authoritative. Public services map canonical records to narrow card DTOs before Server Component rendering and never create a client endpoint.

Future route contracts will be defined alongside their feature phases with Zod validation, authenticated authorization checks, documented error shapes, idempotency requirements where relevant, and tests. Payment and webhook routes are reserved for Phase 8.
