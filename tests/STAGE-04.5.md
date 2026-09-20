# Stage 4.5 — Related Fragrances & Merchandising Audit

## Existing implementation audited

Related fragrances were already rendered in `ProductDetails` using the shared `ProductCard`. The original implementation used a broad catalog slice and slug filtering. Stage 4.5 preserves the section placement, styling, ProductCard, size-selection presentation, gallery, variant selector, Product information, and inert purchase controls.

## Final deterministic strategy

`getRelatedProductsData` performs a server-side bounded public-catalog read. Candidates are eligible only when they are active, have an active variant, and belong to a public active Brand. The current Product is excluded by canonical slug and Product identity. Candidates are scored by existing canonical signals: same fragrance family (4), same audience (2), same Brand (1), and shared collections (up to 2). Results are sorted by score descending, then name and slug, and capped at four.

No AI recommendations, popularity/rating inference, personalization, tracking, cross-sell commerce, or recommendation API was added. The ProductCard remains the shared card; selected-size price is local presentation state and does not affect the current PDP.

Zero results omit the Related section; one/few results use the same grid safely. Production without Atlas returns no fictional Related products. Fixture and repository paths use the same active/public eligibility, exclusion, deduplication, deterministic ordering, and limit semantics.

## Verification

`STAGE-04.5.spec.ts` verifies current-product exclusion, uniqueness, four-item bound, canonical `/products/[slug]` links, responsive widths, ProductCard size presentation, and production fixture isolation. Full fixture regression finished at 59 passed / 6 skipped / 0 failed; the responsive Related test passed when rerun in isolation after one parallel-run navigation timeout. Production isolation passed 3/3 against the fresh production build. Live Atlas Related reads remain unverified.

Static checks also passed: TypeScript, repository ESLint, Turbopack production build, and catalog seed dry-run (7 products, 4 collections, 3 brands, 0 conflicts). No commit or push was made during Stage 4.5.

Accessibility review of the representative PDP found 0 Axe violations; the only incomplete result is the known contrast review for the existing CSS gradient treatment. Live Atlas reads and live Atlas media remain unverified pending owner-provided least-privilege Atlas access.
