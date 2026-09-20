# Stage 4.4 — Product Content, Fragrance Story & Details

## Audit result

The existing PDP was audited before editing. Product name, short description, long description, family, audience, structured notes, variants, prices, availability, media, brand, and related products are supplied by the public `CatalogProductDetail` DTO. `ProductGallery`, `ProductVariantSelector`, purchase preview controls, and Related fragrances were preserved.

| Content area | Result |
|---|---|
| Short description | Reuses canonical `shortDescription`; omitted when empty |
| Description / fragrance story | Reuses canonical `description`; no parallel hard-coded story added |
| Family | Canonical taxonomy key mapped for display (`amber-woody` → `Amber Woody`) |
| Audience | Canonical value mapped to `For Her`, `For Him`, or `Unisex` |
| Top / heart / base | Remain structured; empty groups are omitted |
| Ingredients | No canonical field exists; no ingredients section fabricated |
| Concentration | No canonical field exists; unsupported hard-coded value removed |
| How to wear | Unsupported static instruction removed |
| Product details | Size, availability, family, audience, and house come from public data |
| Service copy | Unsupported delivery/authenticity/gifting promises neutralized while layout preserved |
| Related fragrances | Preserved as pre-implemented catalog-backed merchandising |
| Commerce controls | Quantity/Add to bag/Wishlist preserved and inert |

## Focused verification

`STAGE-04.4.spec.ts` covers canonical copy, mapped family/audience, structured notes, omission of unsupported fields, neutral service wording, Related fragrances, and inert commerce controls.

Live Atlas Product-content reads remain unverified; no database write was performed.
