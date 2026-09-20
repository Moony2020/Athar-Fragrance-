import "server-only";

import type { GuestCartStore } from "@/commerce/guest-cart-service";
import type { CartState } from "@/commerce/contracts";

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

/** Internal test helper only; it is never exposed through a route or action. */
export function resetEphemeralGuestCartStoreForTests() {
  globalStore.atharEphemeralGuestCartStore?.resetForTests();
}
