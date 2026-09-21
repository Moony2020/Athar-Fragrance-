import "server-only";
import { readGuestWishlistId } from "@/server/commerce/guest-wishlist-cookie";
import { readGuestWishlist } from "@/server/commerce/guest-wishlist";
import { getCatalogBrowseData } from "@/server/catalog/services";
export async function readCurrentGuestWishlist() { const id = await readGuestWishlistId(); if (!id) return { availability: "available" as const, products: [] }; const state = await readGuestWishlist(id); if (state.availability === "unavailable") return { availability: state.availability, products: [] }; const catalog = await getCatalogBrowseData(); if (catalog.availability === "unavailable") return { availability: catalog.availability, products: [] }; return { availability: "available" as const, products: catalog.products.filter(product => state.productSlugs.includes(product.slug)) }; }
export async function isCurrentGuestWishlisted(productSlug: string) { const id = await readGuestWishlistId(); if (!id) return false; const state = await readGuestWishlist(id); return state.availability === "available" && state.productSlugs.includes(productSlug); }
