# Stage 4.4 — Shop Card and PDP Responsive Composition

## Scope

Local-only visual and interaction refinement for the Shop product card and Product Detail layout. This stage introduces project-local ATHAR product visuals, contained product-card actions, exact variant-size selection, and responsive gallery composition. No cart, wishlist, review, payment, or external media persistence is added.

## Acceptance rules exercised

- A Shop card contains its wishlist and bag actions within its own visual bounds.
- A card exposes the exact selected size and matching price; a multi-size product is not reduced to an ambiguous `From` label alone.
- The PDP displays a single-variant size once in its product identity line; it does not render a redundant size-choice control.
- The PDP uses horizontal thumbnails on wide displays, vertical thumbnails beside the image at medium widths, and a stacked mobile composition only on small screens.
- Gallery and product layout remain free of horizontal page overflow at the supported test widths.

## Commands run

| Command | Purpose | Result |
| --- | --- | --- |
| `& 'C:\Program Files\nodejs\npm.cmd' run typecheck` | Verify read-model, product cards, PDP, and client components | Pass |
| `& 'C:\Program Files\nodejs\npm.cmd' run lint` | Verify source and test linting | Pass |
| `CATALOG_FIXTURE_RUNTIME=1 BASE_URL=http://127.0.0.1:3000 npx playwright test tests/product-gallery.spec.ts tests/product-detail.spec.ts` | Exercise fixture PDP/gallery flows and responsive overflow assertions | Started locally; rerun after final visual sign-off |

## Deliberate boundaries

The bag and wishlist controls remain local client-preview controls until a persistent commerce state is explicitly introduced. Generated ATHAR imagery is stored in `public/images/catalog/`; no third-party commercial perfume imagery or remote provider is used.
