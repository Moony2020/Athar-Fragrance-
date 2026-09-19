# Phase 1 — Design System Foundation

## Goal contract

Create the reusable visual and interaction foundation required before homepage production-component migration. Homepage sections are explicitly out of scope.

## Implemented

- Named colour, type, space, layout, shape, elevation, and motion tokens in `src/styles/tokens.css`.
- Responsive typography roles and reduced-motion handling.
- Next.js self-hosted Cormorant Garamond (editorial) and DM Sans (UI), matching the prototype's existing intent.
- Clean global CSS boundaries plus Tailwind v4 for routine utilities.
- Six semantic shared UI primitives in `src/components/ui` with tokenized interaction states.

## CSS and responsive rules

- Global styles are architectural only; homepage-specific CSS is prohibited there.
- CSS Modules own component-specific styling and future organic/editorial composition.
- Tailwind owns ordinary layout and responsive utility composition.
- Mobile is the base layout. Use fluid type, page gutters, and section spacing first; add component-local breakpoints only where layout requires them.

## Accessibility and motion rules

- Native links and buttons retain their native semantics.
- `:focus-visible` is globally visible.
- Disabled interactive controls communicate disabled state.
- Reduced-motion preference shortens animation and transition behavior.
- Motion is limited to short UI and entrance refinement; no scroll choreography, canvas, GSAP, or cinematic runtime is introduced.

## Verification ledger

| Check | Status | Evidence |
| --- | --- | --- |
| Typecheck | Pass | `npm run typecheck` completed with zero errors. |
| Lint | Pass | `npm run lint` completed with zero findings. |
| Production build | Pass | Next.js production build completed with Cache Components and Partial Prefetching enabled. |
| Playwright | Pass | Public homepage and `instant()` rig checks passed against the fresh production artifact. |
| Runtime / accessibility | Pass | `/_next/mcp` reported zero compile/runtime errors; Agent Browser snapshot and Axe audit reported zero violations on `/`. |

## Owner decision

**IMPLEMENTED — OWNER VISUAL APPROVAL REQUIRED.** The Cormorant Garamond / DM Sans pairing is technically implemented because it matches the prototype and has no local approved alternative. Confirm it as final brand typography before Phase 2.

## Stop point

Do not migrate Hero, collections, bestsellers, story, guide, header, or footer until the owner approves Phase 1 visual direction.
