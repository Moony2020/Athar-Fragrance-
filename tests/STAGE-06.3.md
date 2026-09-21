# Stage 6.3 — Customer Account Shell & Profile

Baseline: `3e7840d4ae9d7f8b747f2672c735efeba83be7b4`

## Scope

- Protected `/account` shell backed by the Auth.js server session.
- Canonical User profile read through the repository boundary.
- Trimmed, bounded `displayName` updates only; email is read-only.
- Ownership comes from the server session public `userId`, never browser input.

## Excluded

Email/password changes, email changes, addresses, orders, cart or wishlist
merge, guest-to-account reconciliation, and Stage 6.4+.

## Verification

Focused domain and Browser E2E verification must cover unauthenticated redirect,
authenticated profile read/update, invalid input, privacy boundaries, and
sign-out. Mongo integration, when run, uses only `athar_stage55_test` and
disposable users. Live production Atlas verification is not claimed.

Status: **STAGE 6.3 COMPLETE — CUSTOMER ACCOUNT SHELL & PROFILE**

Closure evidence: the clean baseline build passed, and a temporary worktree
with only the Stage 6.3-owned diff also passed. The current working tree fails
on `/_not-found` because the preserved Owner Header/Wishlist change makes the
shared Header async and reads guest wishlist cookies during prerender. This is
an Owner/local build blocker, not a Stage 6.3 regression, and was not modified.

`STAGE-6.3-ONLY PRODUCTION BUILD — PASSED`

`CURRENT WORKING TREE PRODUCTION BUILD — BLOCKED BY PRESERVED OWNER HEADER/WISHLIST CHANGE, OUTSIDE STAGE 6.3`
