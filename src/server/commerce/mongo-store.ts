import "server-only";

import { type Db } from "mongodb";

import { cartStateSchema, wishlistStateSchema, type CartState, type WishlistState } from "@/commerce/contracts";
import type { GuestCartStore } from "@/commerce/guest-cart-service";
import type { GuestWishlistStore } from "@/commerce/guest-wishlist-service";
import { databaseCollections } from "@/server/db/collections";
import { getDatabase } from "@/server/db/mongodb";
import { guestCommerceOwner, DURABLE_COMMERCE_TTL_DAYS, toDurableCartDocument, toDurableWishlistDocument, type CommerceOwner, type DurableCartDocument, type DurableWishlistDocument } from "@/commerce/durable-contracts";
import { parseCartDocument, parseWishlistDocument } from "@/commerce/durable-parser";

export type { DurableCartDocument, DurableWishlistDocument } from "@/commerce/durable-contracts";
const durableTtlMs = DURABLE_COMMERCE_TTL_DAYS * 24 * 60 * 60 * 1000;
const maxCasAttempts = 25;
function ownerFilter(owner: CommerceOwner) {
  return { ownerType: owner.ownerType, ownerId: owner.ownerId };
}

function isDuplicateKey(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code?: unknown }).code === 11000);
}

export class MongoGuestCartStore implements GuestCartStore {
  constructor(private readonly database: () => Promise<Db> = getDatabase) {}

  async read(guestId: string): Promise<CartState> {
    return this.readOwner(guestCommerceOwner(guestId));
  }

  async readOwner(owner: CommerceOwner): Promise<CartState> {
    const document = await (await this.database()).collection<DurableCartDocument>(databaseCollections.carts).findOne(ownerFilter(owner));
    if (!document || document.expiresAt <= new Date()) return { lines: [] };
    return parseCartDocument(document, owner).state;
  }

  async mutate(guestId: string, mutation: (current: CartState) => Promise<CartState>): Promise<CartState> {
    return this.mutateOwner(guestCommerceOwner(guestId), mutation);
  }

  async mutateOwner(owner: CommerceOwner, mutation: (current: CartState) => Promise<CartState>): Promise<CartState> {
    const collection = (await this.database()).collection<DurableCartDocument>(databaseCollections.carts);
    for (let attempt = 0; attempt < maxCasAttempts; attempt += 1) {
      const existing = await collection.findOne(ownerFilter(owner));
      const current = existing && existing.expiresAt > new Date() ? parseCartDocument(existing, owner).state : { lines: [] };
      const next = cartStateSchema.parse(await mutation(current));
      const now = new Date();
      if (!existing) {
        try { await collection.insertOne(toDurableCartDocument(owner, next, now)); return next; } catch (error) { if (isDuplicateKey(error)) continue; throw error; }
      }
      if (existing.expiresAt <= now) {
        const expiredResult = await collection.updateOne({ _id: existing._id, revision: existing.revision }, { $set: { state: next, updatedAt: now, expiresAt: new Date(now.getTime() + durableTtlMs) }, $inc: { revision: 1 } });
        if (expiredResult.matchedCount === 1) return next;
        continue;
      }
      const result = await collection.updateOne({ _id: existing._id, revision: existing.revision }, { $set: { state: next, updatedAt: now, expiresAt: new Date(now.getTime() + durableTtlMs) }, $inc: { revision: 1 } });
      if (result.matchedCount === 1) return next;
    }
    throw new Error("Durable Cart changed concurrently; retry the operation.");
  }
}

export class MongoGuestWishlistStore implements GuestWishlistStore {
  constructor(private readonly database: () => Promise<Db> = getDatabase) {}

  async read(guestId: string): Promise<WishlistState> {
    return this.readOwner(guestCommerceOwner(guestId));
  }

  async readOwner(owner: CommerceOwner): Promise<WishlistState> {
    const document = await (await this.database()).collection<DurableWishlistDocument>(databaseCollections.wishlists).findOne(ownerFilter(owner));
    if (!document || document.expiresAt <= new Date()) return { productSlugs: [] };
    return parseWishlistDocument(document, owner).state;
  }

  async mutate(guestId: string, mutation: (current: WishlistState) => Promise<WishlistState>): Promise<WishlistState> {
    return this.mutateOwner(guestCommerceOwner(guestId), mutation);
  }

  async mutateOwner(owner: CommerceOwner, mutation: (current: WishlistState) => Promise<WishlistState>): Promise<WishlistState> {
    const collection = (await this.database()).collection<DurableWishlistDocument>(databaseCollections.wishlists);
    for (let attempt = 0; attempt < maxCasAttempts; attempt += 1) {
      const existing = await collection.findOne(ownerFilter(owner));
      const current = existing && existing.expiresAt > new Date() ? parseWishlistDocument(existing, owner).state : { productSlugs: [] };
      const next = wishlistStateSchema.parse(await mutation(current));
      const now = new Date();
      if (!existing) {
        try { await collection.insertOne(toDurableWishlistDocument(owner, next, now)); return next; } catch (error) { if (isDuplicateKey(error)) continue; throw error; }
      }
      if (existing.expiresAt <= now) {
        const expiredResult = await collection.updateOne({ _id: existing._id, revision: existing.revision }, { $set: { state: next, updatedAt: now, expiresAt: new Date(now.getTime() + durableTtlMs) }, $inc: { revision: 1 } });
        if (expiredResult.matchedCount === 1) return next;
        continue;
      }
      const result = await collection.updateOne({ _id: existing._id, revision: existing.revision }, { $set: { state: next, updatedAt: now, expiresAt: new Date(now.getTime() + durableTtlMs) }, $inc: { revision: 1 } });
      if (result.matchedCount === 1) return next;
    }
    throw new Error("Durable Wishlist changed concurrently; retry the operation.");
  }
}
