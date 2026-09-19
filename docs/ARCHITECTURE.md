# Architecture

## Current state

ATHAR currently has no server-side application architecture. It is a browser-delivered HTML prototype with inline SVG, local imagery, CSS, and small inline JavaScript behaviours.

## Proposed production architecture (pending approval)

- Next.js App Router with React and TypeScript; server components, route handlers, and server actions form the application boundary.
- MongoDB Atlas for canonical business data.
- Auth.js for customer authentication.
- Stripe Payment Element for card collection; direct PayPal Orders API for PayPal.
- Verified webhooks for payment state.
- A transactional email provider and a media provider selected by the owner.

No separate Express application is proposed unless a later verified requirement requires one.

## Migration principle

The static prototype is visual reference material, not production architecture. Recreate approved design intent as accessible, componentized, responsive routes; do not copy CSS override layers forward.

## Design-system ownership

The App Router stays thin. Reusable visual primitives live in `src/components/ui`; future homepage sections belong in dedicated feature/component folders and may consume these primitives. `src/styles` provides global tokens, typography, base rules, and motion only. Tailwind v4 is installed for routine utilities, while CSS Modules own component-specific and editorial styling.
