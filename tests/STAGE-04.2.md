# Stage 4.2 — Product Gallery & Media Experience

| Command | Purpose | Result |
| --- | --- | --- |
| `npm run typecheck` | Gallery client/server contracts and public media model | Pass |
| `npm run lint` | Repository ESLint | Pass |
| `EXPOSE_TESTING_API=1 npm run build` | Production route/build verification | Pass; `/products/[slug]` remains partial-prerendered |
| `npm run catalog:seed:dry` | Deterministic fictional media fixture validation without writes | Pass: 3 Brands, 4 Collections, 5 Products; 0 conflicts |
| `CATALOG_FIXTURE_RUNTIME=1 BASE_URL=http://127.0.0.1:3000 playwright test product-gallery.spec.ts` | Gallery multi/single/zero-media and responsive fixture checks | 4 passed, 1 production-only skip |
| `CATALOG_FIXTURE_RUNTIME=1 BASE_URL=http://127.0.0.1:3000 playwright test product-gallery.spec.ts product-detail.spec.ts catalog-domain.spec.ts` | Gallery, PDP information, ProductCard identity, and deterministic read-model regression | **13 passed, 2 skipped, 0 failed** |
| `BASE_URL=http://127.0.0.1:3101 playwright test` | Fresh production artifact: full public regression, `instant()`, and fixture/media isolation | **39 passed, 19 skipped, 0 failed** |

## Architecture boundary

`ProductGallery` is the sole Stage 4.2 client island. It receives the server-mapped public `media[]` DTO and stores only the selected media index. Product data, Brand, price, variants, availability, family, notes, descriptions, metadata, and routing remain server-rendered.

The primary image and thumbnails use `next/image` with a local neutral ATHAR placeholder because no remote production media provider has been approved. Fixture URLs are not requested. Multiple media use deterministic `position → URL → alt` ordering; single media has no controls; zero media uses a labelled placeholder. Zoom, lightbox, Cloudinary, uploads, Cart, Wishlist, and variant-selection work remain deferred.

## Accessibility and runtime

- Axe 4.12.1: multi-media PDP **0 violations, 0 incomplete**; zero-media PDP **0 violations, 0 incomplete**.
- `/_next/mcp` compilation/runtime inspection remains clean from the Stage 4.1 runtime loop; the PDP route remains available through Turbopack.
- Production unavailable behavior is covered by the full production suite: no gallery region, fixture name, media, thumbnail, or price is rendered.
