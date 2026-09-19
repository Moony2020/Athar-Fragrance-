# Security

## Current state

There is no authentication, backend, database, payment handling, or secret configuration in the prototype.

## Future baseline

- Keep secrets server-only and publish an `.env.example` without values.
- Validate untrusted input with Zod; enforce authorization server-side.
- Use secure session handling through the approved authentication design.
- Verify Stripe and PayPal webhook signatures; persist and deduplicate provider events.
- Never persist raw card data.
- Apply security headers, rate limits where appropriate, dependency review, and least-privilege access before production.
