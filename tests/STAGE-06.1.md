# Stage 6.1 — Customer Identity & Account Foundation

Baseline: `1cc405bf77e44777cae20b1e2998bfbdf5366bcd`

Stage 6.1 establishes the server-side User identity foundation without starting
Auth.js runtime, registration/sign-in, profile UI, or Stage 6.2.

## Implemented

- Opaque public `userId` generation and normalized email contract.
- Strict Mongo User document parser that allows storage `_id` but rejects
  unexpected fields and keeps password hashes out of public DTOs.
- Mongo User repository with lookup by normalized email/user ID and creation.
- Explicit `ensureIdentityIndexes()` with unique `users_email_unique` index.
- Customer creation service with normalized-email uniqueness preflight.
- `userCommerceOwner()` helper preserving the existing `CommerceOwner` contract.

## Verification

- `node --import tsx --test tests/stage-06.1-domain.test.ts`: 4 passed.
- Real Mongo verification against dedicated `athar_stage55_test`: passed.
  CRUD, strict parser, `CommerceOwner.user`, unique `normalizedEmail` and
  `userId` indexes, and duplicate-email concurrency (1 winner / 7 rejected).
- `tsc --noEmit`: passed.
- Full ESLint: passed.
- Production Turbopack build: passed in an isolated build context with the
  ignored `.env.local` temporarily withheld; it was restored unchanged.
- `git diff --check`: passed.
- No Auth.js runtime, OAuth, Clerk, email verification, password reset, or
  guest-to-account merge was started.
