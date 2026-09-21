# Stage 6.4 — Guest-to-Account Commerce Reconciliation

Baseline: `2851f06308c82c6eeeb25f12154f92fd82a7ac00`

## Contract

Guest Cart and Wishlist state merges into the authenticated public `userId`
owner after registration or Credentials sign-in. Cart identity is
`productSlug + variantId`; same-line quantities add with a cap of 12 and
canonical prices/availability are re-resolved. Wishlist is a deduplicated
product-slug union. Guest state is cleared only after success.

## Verification

Pure reconciliation tests cover additive quantities, cap 12, variant
separation, stale-item removal, wishlist deduplication, and repeated-merge
idempotency. Real Mongo verification passed against `athar_stage55_test`,
including concurrent merge, post-success guest cleanup, and retry idempotency.
Browser E2E registration and existing-account sign-in/sign-out with disposable
guest Cart/Wishlist state passed. Authenticated reads and mutations resolve
`{ type: "user", id: publicUserId }`; guest cookies are used only without a
session. Repeated sign-in leaves quantity unchanged and guest records are
zeroed only after successful merge.

Status: **STAGE 6.4 COMPLETE — GUEST-TO-ACCOUNT COMMERCE RECONCILIATION**

Build attribution passed: clean baseline and Stage-6.4-only builds passed.
Only the current working tree fails at `/_not-found` because of the preserved
Owner Header/Wishlist dynamic-cookie change outside Stage 6.4.
