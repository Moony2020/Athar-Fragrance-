import "server-only";
import { readGuestWishlistId } from "@/server/commerce/guest-wishlist-cookie";
import { readGuestWishlist } from "@/server/commerce/guest-wishlist";
import { getCatalogBrowseData } from "@/server/catalog/services";
import { readCurrentCommerceOwner } from "@/server/commerce/current-owner";
import { getGuestWishlistStore } from "@/server/commerce/store";
import { MongoGuestWishlistStore } from "@/server/commerce/mongo-store";
import { userCommerceOwner } from "@/commerce/durable-contracts";
export async function readCurrentGuestWishlist() { const id = await readGuestWishlistId(); if (!id) return { availability: "available" as const, products: [] }; const state = await readGuestWishlist(id); if (state.availability === "unavailable") return { availability: state.availability, products: [] }; const catalog = await getCatalogBrowseData(); if (catalog.availability === "unavailable") return { availability: catalog.availability, products: [] }; return { availability: "available" as const, products: catalog.products.filter(product => state.productSlugs.includes(product.slug)) }; }
export async function isCurrentGuestWishlisted(productSlug: string) { const id = await readGuestWishlistId(); if (!id) return false; const state = await readGuestWishlist(id); return state.availability === "available" && state.productSlugs.includes(productSlug); }

export async function readCurrentCommerceWishlist() {
  const owner = await readCurrentCommerceOwner();
  if (owner.ownerType === "guest") return readCurrentGuestWishlist();
  const store = getGuestWishlistStore();
  if (!(store instanceof MongoGuestWishlistStore)) return { availability: "unavailable" as const, products: [] };
  const state = await store.readOwner(userCommerceOwner(owner.ownerId));
  const catalog = await getCatalogBrowseData();
  if (catalog.availability === "unavailable") return { availability: catalog.availability, products: [] };
  return { availability: "available" as const, products: catalog.products.filter(product => state.productSlugs.includes(product.slug)) };
}

export async function isCurrentCommerceWishlisted(productSlug: string) {
  const owner = await readCurrentCommerceOwner();
  if (owner.ownerType === "guest") return isCurrentGuestWishlisted(productSlug);
  const store = getGuestWishlistStore();
  if (!(store instanceof MongoGuestWishlistStore)) return false;
  return (await store.readOwner(userCommerceOwner(owner.ownerId))).productSlugs.includes(productSlug);
}
