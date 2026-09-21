import "server-only";

import type { GuestCartStore } from "@/commerce/guest-cart-service";
import type { CartState } from "@/commerce/contracts";
import type { WishlistState } from "@/commerce/contracts";
import type { GuestWishlistStore } from "@/commerce/guest-wishlist-service";
import { MongoGuestCartStore, MongoGuestWishlistStore } from "@/server/commerce/mongo-store";

export type { GuestCartStore } from "@/commerce/guest-cart-service";

class EphemeralGuestCartStore implements GuestCartStore {
  private readonly carts = new Map<string, CartState>();
  private readonly locks = new Map<string, Promise<void>>();

  async read(guestId: string): Promise<CartState> {
    return this.carts.get(guestId) ?? { lines: [] };
  }

  async mutate(guestId: string, mutation: (current: CartState) => Promise<CartState>): Promise<CartState> {
    const previous = this.locks.get(guestId) ?? Promise.resolve();
    let release: (() => void) | undefined;
    const currentLock = new Promise<void>((resolve) => { release = resolve; });
    const queued = previous.then(() => currentLock);
    this.locks.set(guestId, queued);
    await previous;
    try {
      const next = await mutation(this.carts.get(guestId) ?? { lines: [] });
      this.carts.set(guestId, next);
      return next;
    } finally {
      release?.();
      if (this.locks.get(guestId) === queued) this.locks.delete(guestId);
    }
  }

  resetForTests() {
    this.carts.clear();
    this.locks.clear();
  }
}

const globalStore = globalThis as typeof globalThis & { atharEphemeralGuestCartStore?: EphemeralGuestCartStore };

/** Development/test only. Production must supply a deliberate durable adapter in a later stage. */
export function getEphemeralGuestCartStore(): GuestCartStore | null {
  if (process.env.NODE_ENV === "production") return null;
  globalStore.atharEphemeralGuestCartStore ??= new EphemeralGuestCartStore();
  return globalStore.atharEphemeralGuestCartStore;
}

function durableCommerceEnabled(): boolean {
  return process.env.ATHAR_COMMERCE_PERSISTENCE === "mongo" && Boolean(process.env.MONGODB_URI && process.env.MONGODB_DB_NAME);
}

const durableGlobal = globalThis as typeof globalThis & {
  atharMongoGuestCartStore?: MongoGuestCartStore;
  atharMongoGuestWishlistStore?: MongoGuestWishlistStore;
};

/** Explicit Mongo selection. Production never falls back to process memory. */
export function getGuestCartStore(): GuestCartStore | null {
  if (!durableCommerceEnabled()) return process.env.NODE_ENV === "production" ? null : getEphemeralGuestCartStore();
  durableGlobal.atharMongoGuestCartStore ??= new MongoGuestCartStore();
  return durableGlobal.atharMongoGuestCartStore;
}

/** Internal test helper only; it is never exposed through a route or action. */
export function resetEphemeralGuestCartStoreForTests() {
  globalStore.atharEphemeralGuestCartStore?.resetForTests();
}

class EphemeralGuestWishlistStore implements GuestWishlistStore {
  private readonly wishlists = new Map<string, WishlistState>();
  async read(guestId: string) { return this.wishlists.get(guestId) ?? { productSlugs: [] }; }
  async mutate(guestId: string, mutation: (current: WishlistState) => Promise<WishlistState>) { const next = await mutation(await this.read(guestId)); this.wishlists.set(guestId, next); return next; }
}
const wishlistGlobal = globalThis as typeof globalThis & { atharEphemeralGuestWishlistStore?: EphemeralGuestWishlistStore };
export function getEphemeralGuestWishlistStore(): GuestWishlistStore | null { if (process.env.NODE_ENV === "production") return null; wishlistGlobal.atharEphemeralGuestWishlistStore ??= new EphemeralGuestWishlistStore(); return wishlistGlobal.atharEphemeralGuestWishlistStore; }

export function getGuestWishlistStore(): GuestWishlistStore | null {
  if (!durableCommerceEnabled()) return process.env.NODE_ENV === "production" ? null : getEphemeralGuestWishlistStore();
  durableGlobal.atharMongoGuestWishlistStore ??= new MongoGuestWishlistStore();
  return durableGlobal.atharMongoGuestWishlistStore;
}
