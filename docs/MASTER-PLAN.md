# ATHAR Master Plan

## Product direction

ATHAR is a luxury fragrance ecommerce experience: warm ivory palette, editorial serif display type, restrained sans-serif interface type, asymmetric imagery, generous spacing, and subtle interactions. The hero remains static photography; scroll storytelling, canvas runtimes, frame sequences, video sequences, and GSAP-driven cinematic behaviour are out of scope.

## Delivery governance

Each phase has a goal contract, implementation ledger, evidence, documentation, verification, and explicit owner sign-off. A phase is not complete merely because code exists. Where evidence cannot run, record **IMPLEMENTED — NOT YET VERIFIED** rather than a pass.

## Planned phases

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Repository audit, baseline, documentation | In progress |
| 1 | Application architecture, design system, domain foundation | Pending owner sign-off |
| 2 | Homepage | Planned |
| 3 | Catalog, brands, collections, discovery | Stages 3.1–3.5 implemented locally; live Atlas execution and Stage 3.6 final integration/QA pending |
| 4 | Product detail and merchandising | Planned |
| 5 | Cart and wishlist | Planned |
| 6 | Authentication and customer account | Stages 6.1–6.5 complete locally; Stage 6.6 not started |
| 7 | Checkout foundation | Planned |
| 8 | Stripe cards, direct PayPal, webhooks | Planned |
| 9 | Canonical orders and transactional email | Planned |
| 10 | Admin platform | Planned |
| 11 | Content, journal, legal, customer experience | Planned |
| 12 | Security, performance, accessibility, SEO | Planned |
| 13 | Production readiness | Planned |

### Phase 6 stage map

| Stage | Scope | Status |
| --- | --- | --- |
| 6.1 | Customer Identity & Account Foundation | Complete locally |
| 6.2 | Auth.js Credentials Runtime + Email/Password Registration & Sign-In | Complete locally |
| 6.3 | Customer Account Shell & Profile | Complete locally |
| 6.4 | Guest-to-Account Commerce Reconciliation | Complete locally |
| 6.5 | Account Security & Password Recovery | Complete locally |
| 6.6 | Phase 6 Integration & Closure | Not started |

### Phase 6 fixed decisions

- Email + Password only.
- Auth.js is the authentication framework.
- Credentials is the future authentication method.
- OAuth/social login is not used.
- Clerk is not used.
- Brevo is the transactional email provider.
- Required email verification is not implemented.
- Password reset is required and is implemented in Stage 6.5.
- Future order confirmation emails must use Brevo.
- Stage 6.1 baseline: `1cc405bf77e44777cae20b1e2998bfbdf5366bcd`.
- Guest-to-account commerce merge is implemented server-side with canonical
  re-resolution, CAS-safe idempotency, and post-success guest-state clearing.
- Stage 6.2 uses Auth.js Credentials only with Argon2id password hashing.
- Credentials persist separately from canonical User records; sessions carry
  only the public opaque `userId`.
- Stage 6.3 baseline: `3e7840d4ae9d7f8b747f2672c735efeba83be7b4`.
- Stage 6.3 permits server-session-owned `displayName` updates only; email is
  read-only and account addresses, orders, password changes, and guest merge
  remain deferred.
- Stage 6.3 closure evidence: Stage-6.3-only production build passed. The
  current-tree build blocker is a preserved Owner Header/Wishlist change and
  is outside this stage.
- Stage 6.4 merges guest Cart/Wishlist into the authenticated public `userId`
  owner with canonical re-resolution, CAS-safe idempotency, and post-success
  guest-state clearing only.
- Stage 6.4 closure evidence: pure/domain and dedicated Mongo tests pass;
  existing-account Browser E2E proves merge, authenticated owner reads,
  sign-out/sign-in repeat idempotency, and guest-state cleanup. Clean baseline
  and Stage-6.4-only production builds pass; only the current tree is blocked
  at `/_not-found` by the preserved Owner Header/Wishlist dynamic-cookie
  change outside this stage. Stage 6.5 is complete locally.

- Stage 6.5 verification update (2026-09-24): isolated baseline and
  Stage-6.5-only production builds pass. The current-tree build remains blocked
  at `/_not-found` by the preserved Owner Header/Wishlist request-time read
  outside Suspense. The reset page now awaits `searchParams` within Suspense.
  Dedicated Mongo verification passed against `athar_stage55_test`. Earlier TLS
  failures followed a switch from mobile hotspot to hotel Wi-Fi while the active
  network IP was not on Atlas IP Access List; the owner subsequently reported
  two consecutive successful pings on hotel Wi-Fi. Final Browser E2E now passes
  the protected test-mail reset flow, old/new password checks, prior-session
  invalidation, reused-token rejection, and generic unknown/disabled responses.
  The route-shape defect that prevented outbox capture was fixed and covered by
  a focused regression. Disposable fixtures were confirmed absent afterward.
  Final Stage 6.5 focused tests passed 8/8; domain/auth regressions passed
  36/36 with one separately executed live Mongo case, and Stages 6.1, 6.2, and
  6.4 live Mongo regressions passed. After the production fix, clean baseline
  and Stage-6.5-only production builds passed. Full TypeScript, full ESLint,
  and `git diff --check` passed. Current-tree build attribution remains the
  previously identified preserved Owner Header/Wishlist runtime-read issue,
  outside Stage 6.5. Live Brevo delivery remains unverified and is not a
  closure blocker. Stage 6.5 is complete locally; Stage 6.6 is not started.

### Stage 6.5 contract and current implementation

Baseline: `87b9993d9d0a6bb76d6eb88b3909f90591750ff0`.

- Provide Forgot Password and Reset Password pages/routes; forgot responses do
  not disclose whether an account exists.
- Create 256-bit random, single-use tokens with a 30-minute expiry. Persist only
  SHA-256 token hashes in `password_reset_tokens`; replacing a user's token
  invalidates the prior token. TTL and unique indexes are explicit/idempotent.
- Send branded transactional email through the server-only Brevo HTTP API.
  Credentials are `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, optional
  `BREVO_SENDER_NAME`, and `NEXT_PUBLIC_SITE_URL`; production never selects a
  mock mail adapter implicitly.
- Apply the Stage 6.2 password policy (15–128 characters) and Argon2id
  parameters (timeCost 3, memoryCost 65536, parallelism 4).
- Atomically consume a valid token, update the active credential, increment a
  private `securityVersion`, and consume sibling reset tokens in a Mongo
  transaction. Auth.js checks the version server-side so prior sessions are
  rejected without exposing it in public User/session DTOs.
- Email verification, signed-in password change, OAuth, Clerk, Stage 6.6,
  checkout, payments, and orders remain out of scope.
- Dedicated test Mongo transaction/index verification passed; live Brevo
  delivery remains unverified. Do not claim provider delivery or production
  persistence.

## Permanent domain invariants

- Products, brands, collections, inventory, merchandising flags, and prices are canonical data—not hard-coded JSX.
- Monetary values use integer minor units. Images are stored by a media provider with metadata in the database; image binaries do not live in MongoDB.
- Future card payments use Stripe Payment Element. PayPal uses the direct PayPal Orders API; it is not routed through Stripe.
- A durable local `paymentAttempt` must hold the provider identifier before customer payment progresses. Provider webhooks and trusted provider state, never a browser redirect, prove payment.
- ATHAR owns customer order numbers in the form `ATH-YYYY-XXXXXX`; Stripe and PayPal identifiers are internal payment references.
- Commercial claims such as bestseller, stock, authorisation, ratings, and discounts require approved canonical data.

## Phase 0 exit contract

Phase 0 exits only after the owner approves the proposed migration from the static prototype to the selected production stack. No Phase 1 implementation begins automatically.
