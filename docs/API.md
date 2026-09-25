# API

The catalog remains server-rendered with no public Product API. Account
registration/profile and Stage 6.5 password-recovery endpoints are documented
in their stage-specific contracts below.

The available internal read contracts are `getPublicProductBySlug`, `listPublicProducts`, `getPublicBrandBySlug`, `getPublicCollectionBySlug`, `getCatalogBrowseData`, `getBrandBrowseData`, and `getCatalogDiscoveryData`. They validate route/query boundaries and return only active public records. `getCatalogDiscoveryData` accepts only the bounded allow-list `q`, `audience`, `brand`, `family`, `collection`, and `sort`; route scope is authoritative. Public services map canonical records to narrow card DTOs before Server Component rendering and never create a client endpoint.

Future route contracts will be defined alongside their feature phases with Zod validation, authenticated authorization checks, documented error shapes, idempotency requirements where relevant, and tests. Payment and webhook routes are reserved for Phase 8.

## Stage 6.5 account security endpoints

- `POST /api/auth/forgot-password` accepts only `{ email }`; responses are
  generic across unknown, disabled, and eligible accounts.
- `POST /api/auth/reset-password` accepts only `{ token, password }`; invalid,
  expired, or consumed links receive a generic invalid/expired response.
- The forgot-password route passes the validated `email` string to the
  password-reset service; malformed payloads retain the same generic response
  and do not invoke the service.
- Tokens never appear in logs or API responses. Reset links are delivered by
  the server-only Brevo adapter. A successful reset requires a subsequent
  sign-in with the new password.
