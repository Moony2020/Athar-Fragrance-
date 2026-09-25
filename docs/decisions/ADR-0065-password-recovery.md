# ADR-0065: Password recovery tokens and session revocation

## Status

Accepted and implemented for Stage 6.5. Focused live Mongo verification and
Browser reset-flow/session-revocation E2E pass against the dedicated test
database. Live Brevo delivery is not verified.

## Context

ATHAR uses Auth.js Credentials, Argon2id credentials separate from canonical
User records, public opaque user IDs, and Brevo as the approved transactional
email provider. Password recovery must avoid email enumeration, raw-token
persistence, token replay, and continued use of sessions authenticated with an
old password.

## Decision

- Generate 256-bit random reset tokens and persist only SHA-256 hashes.
- Tokens expire after 30 minutes; one active token per user is maintained by
  replacement. Explicit unique indexes protect user ownership and token hash;
  TTL removes expired records asynchronously.
- Send reset URLs only through the server-only Brevo adapter. Missing provider
  configuration never selects a fake production mailer.
- Consume the token, update the active Argon2id credential, remove sibling
  tokens, and increment private credential `securityVersion` in a Mongo
  transaction.
- Validate the private security version during Auth.js JWT processing so old
  sessions are rejected; do not expose the version in public DTOs or session
  responses.

## Consequences

Mongo deployments must support transactions for atomic password reset.
Dedicated database verification and actual Brevo delivery still need evidence.
