# Phase 4 — Product Detail & Merchandising

## Stage 4.1 — Product Detail Route, public read model and page foundation

**Status:** implemented locally; live Atlas Product Detail reads are not yet verified.

### Public route and read boundary

- `/products/[slug]` is a Server Component route using only canonical product slugs.
- `getProductDetailData()` remains server-only. It reads the existing Product and Brand repositories in production, and the clearly fictional development source only outside production.
- The route maps canonical domain records explicitly to `CatalogProductDetail`. React does not receive Mongo IDs, lifecycle/seed metadata, timestamps, raw inventory quantities, or repository records.
- A public Product must be active, belong to an active Brand, and have at least one active variant. Draft, archived, malformed, missing, and privately-branded Products are not found without exposing their existence.
- A missing/unreadable production catalog source produces the explicit unavailable state; it never falls back to fixtures.

### PDP public presentation

- The detail model contains public Brand identity, canonical product copy, audience, fragrance family, structured top/heart/base notes, ordered public media fields, and active variants.
- Variant availability is a safe `available`/`unavailable` value derived server-side. Raw stock counts are not public.
- Integer minor-unit prices use the shared `formatMoneyMinor()` formatter. The default PDP price is the same lowest active variant rule as `ProductCard` (`From` where there are multiple active sizes).
- Product media is a stable, non-interactive first-image presentation. Existing fictional fixture URLs are development/test-only; no production media provider, import, upload, or advanced gallery is introduced.
- Brand identity links to the canonical public `/brands/[slug]` route. Fragrance family and notes render only canonical values; no ingredients, performance claims, reviews, or generated product stories are added.

### SEO, cache, and accessibility

- Public PDP metadata uses factual public name/copy and canonical `/products/[slug]`. Missing/private Products do not generate product metadata.
- Product schema.org structured data is deferred: the current model has no owner-approved offer/media/brand-authorization facts needed for a truthful Product schema.
- The dynamic route follows the existing Cache Components strategy with `instant = false` and request-scoped React deduplication. Persistent caching/invalidation is deferred until canonical mutations exist.
- The page has one logical product H1, a text Brand link, descriptive media alt text, semantic size and notes sections, non-hover-only information, and visible keyboard focus for ProductCard links.
- The PDP uses a responsive editorial two-column layout that stacks below 760px. It is checked at 360px, 430px, 768px, 1280px, and 1600px for overflow and readable composition.

### Explicitly deferred

Stage 4.1 does not add Cart, Wishlist, checkout/payment, inventory reservation, interactive variant selection, advanced/swipe/zoom gallery, reviews/ratings, related products, recently viewed, Admin, uploads, Cloudinary, CMS, or production commercial imports. Homepage Bestsellers remain independent non-canonical prototype content, so their hotspots are not activated as PDP links.

### External status

**LIVE ATLAS PRODUCT DETAIL READS — NOT YET VERIFIED.** No Atlas data was read or written, and no GitHub operation belongs to this stage.

## Stage 4.2 — Product Gallery & Media Experience

**Status:** implemented locally; live Atlas Product media reads are not yet verified.

- `ProductDetails` remains a Server Component. Its only client boundary is `ProductGallery`, which stores a presentational selected-media index when a Product has multiple media entries. There is no client product fetch or client state outside this gallery selection.
- The existing `CatalogProductDetail.media` contract is reused and sanitized before presentation. Items must be images with an HTTP(S) URL; order is `position`, then URL, then alt text for deterministic ties. Only public URL/alt/dimensions/position fields reach React.
- Multiple media render an inline primary image and real thumbnail buttons. Buttons expose a factual accessible name, keyboard activation, `aria-pressed`, visible focus, and a screen-reader selected-state label. Single-media Products show no thumbnail UI. Products with no media show an intentional ATHAR placeholder that preserves layout without claiming product photography.
- `next/image` renders only a local neutral placeholder asset because no remote production media provider/domain is approved. Fixture/provider URLs remain public data for later approved delivery but are not requested by the browser. There are no wildcard remote patterns, external commercial images, Cloudinary integration, upload code, zoom, lightbox, video, or carousel library.
- The gallery uses an inline horizontal thumbnail rail, contained scrolling, aspect-ratio media composition, mobile-first stacking, restrained opacity transition, and `prefers-reduced-motion` fallback. It is checked at 360px, 430px, 768px, 1280px, and 1600px.
- Stage 4.1 product information, ProductCard canonical identity, unavailable/not-found behavior, metadata, cache strategy, and fixture isolation remain unchanged. Cart, Wishlist, and Stage 4.3 interactive variant selection remain deferred.

**LIVE ATLAS PRODUCT MEDIA READS — NOT YET VERIFIED.**
