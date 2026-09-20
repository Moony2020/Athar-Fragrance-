import "server-only";

import {
  createGuestCartService,
  type CartLineInput,
} from "@/commerce/guest-cart-service";
import { resolvePublicCommerceProduct } from "@/server/commerce/services";
import { getEphemeralGuestCartStore } from "@/server/commerce/store";

export type { GuestCartMutationResult, GuestCartReadResult } from "@/commerce/guest-cart-service";

const defaultService = createGuestCartService(getEphemeralGuestCartStore(), resolvePublicCommerceProduct);

export function addToGuestCart(guestId: string, input: CartLineInput | unknown) {
  return defaultService.add(guestId, input);
}

export function readGuestCart(guestId: string) {
  return defaultService.read(guestId);
}
