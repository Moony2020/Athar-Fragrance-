import "server-only";

import type { Db } from "mongodb";
import { cartStateSchema, wishlistStateSchema, MAX_CART_LINE_QUANTITY, type CartState, type WishlistState } from "@/commerce/contracts";
import { userCommerceOwner, guestCommerceOwner } from "@/commerce/durable-contracts";
import { MongoGuestCartStore, MongoGuestWishlistStore } from "@/server/commerce/mongo-store";
import { resolvePublicCommerceProduct } from "@/server/commerce/services";
import { databaseCollections } from "@/server/db/collections";
import { getDatabase } from "@/server/db/mongodb";

type MergeRecord = { _id: string; userId: string; guestId: string; kind: "cart" | "wishlist"; status: "in_progress" | "completed"; updatedAt: Date };
type ReconciliationStores = { database: () => Promise<Db>; cart: MongoGuestCartStore; wishlist: MongoGuestWishlistStore };

function mergeKey(userId: string, kind: "cart" | "wishlist", guestId: string) { return `${userId}:${kind}:${guestId}`; }

export async function reconcileCartStates(current: CartState, guest: CartState, resolveProduct = resolvePublicCommerceProduct): Promise<CartState> {
  const combined = [...current.lines];
  for (const incoming of guest.lines) {
    const existing = combined.find((line) => line.productSlug === incoming.productSlug && line.variantId === incoming.variantId);
    if (existing) existing.quantity = Math.min(MAX_CART_LINE_QUANTITY, existing.quantity + incoming.quantity);
    else combined.push({ ...incoming, quantity: Math.min(MAX_CART_LINE_QUANTITY, incoming.quantity) });
  }
  const valid = [];
  for (const line of combined) {
    const resolved = await resolveProduct(line.productSlug);
    const variant = resolved.product?.variants.find((candidate) => candidate.id === line.variantId);
    if (resolved.availability === "available" && variant?.availability === "available") valid.push(line);
  }
  return cartStateSchema.parse({ lines: valid });
}

export async function reconcileWishlistStates(current: WishlistState, guest: WishlistState, resolveProduct = resolvePublicCommerceProduct): Promise<WishlistState> {
  const candidates = [...new Set([...current.productSlugs, ...guest.productSlugs])];
  const valid: string[] = [];
  for (const productSlug of candidates) {
    const resolved = await resolveProduct(productSlug);
    if (resolved.availability === "available" && resolved.product) valid.push(productSlug);
  }
  return wishlistStateSchema.parse({ productSlugs: valid });
}

async function claimMerge(database: () => Promise<Db>, userId: string, kind: "cart" | "wishlist", guestId: string): Promise<boolean> {
  const collection = (await database()).collection<MergeRecord>(databaseCollections.commerceMerges);
  const key = mergeKey(userId, kind, guestId);
  try {
    await collection.insertOne({ _id: key, userId, guestId, kind, status: "in_progress", updatedAt: new Date() });
    return true;
  } catch (error) {
    if (!error || typeof error !== "object" || !("code" in error) || (error as { code?: number }).code !== 11000) throw error;
    const existing = await collection.findOne({ _id: key });
    if (existing?.status === "completed") return false;
    if (existing?.status === "in_progress" && existing.updatedAt.getTime() < Date.now() - 5_000) {
      const takeover = await collection.updateOne({ _id: key, status: "in_progress", updatedAt: existing.updatedAt }, { $set: { updatedAt: new Date() } });
      if (takeover.matchedCount === 1) return true;
    }
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const retry = await collection.findOne({ _id: key });
      if (retry?.status === "completed") return false;
    }
    throw new Error("Commerce merge is already in progress.");
  }
}

export async function mergeGuestCommerceForUser(userId: string, guestIds: { cartId?: string | null; wishlistId?: string | null }, stores?: ReconciliationStores) {
  const cart = stores?.cart ?? new MongoGuestCartStore(stores?.database ?? getDatabase);
  const wishlist = stores?.wishlist ?? new MongoGuestWishlistStore(stores?.database ?? getDatabase);
  const database = stores?.database ?? getDatabase;
  const owner = userCommerceOwner(userId);
  const guestOwners: Array<{ kind: "cart" | "wishlist"; id: string }> = [];
  if (guestIds.cartId) guestOwners.push({ kind: "cart", id: guestIds.cartId });
  if (guestIds.wishlistId) guestOwners.push({ kind: "wishlist", id: guestIds.wishlistId });
  if (!guestOwners.length) return { merged: false, cart: false, wishlist: false };
  const claimed: Array<{ kind: "cart" | "wishlist"; id: string }> = [];
  try {
    for (const entry of guestOwners) if (await claimMerge(database, userId, entry.kind, entry.id)) claimed.push(entry);
    for (const entry of claimed) {
      if (entry.kind === "cart") {
        const guestState = await cart.readOwner(guestCommerceOwner(entry.id));
        await cart.mutateOwner(owner, (current) => reconcileCartStates(current, guestState));
        await cart.mutateOwner(guestCommerceOwner(entry.id), async () => ({ lines: [] }));
      } else {
        const guestState = await wishlist.readOwner(guestCommerceOwner(entry.id));
        await wishlist.mutateOwner(owner, (current) => reconcileWishlistStates(current, guestState));
        await wishlist.mutateOwner(guestCommerceOwner(entry.id), async () => ({ productSlugs: [] }));
      }
      await (await database()).collection<MergeRecord>(databaseCollections.commerceMerges).updateOne({ _id: mergeKey(userId, entry.kind, entry.id) }, { $set: { status: "completed", updatedAt: new Date() } });
    }
    return { merged: claimed.length > 0, cart: claimed.some((entry) => entry.kind === "cart"), wishlist: claimed.some((entry) => entry.kind === "wishlist") };
  } catch (error) {
    const collection = (await database()).collection<MergeRecord>(databaseCollections.commerceMerges);
    await Promise.allSettled(claimed.map((entry) => collection.deleteOne({ _id: mergeKey(userId, entry.kind, entry.id), status: "in_progress" })));
    throw error;
  }
}
