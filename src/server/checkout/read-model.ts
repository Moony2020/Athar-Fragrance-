import "server-only";

import { buildCheckoutReadModel } from "@/checkout/domain";
import { readCurrentCommerceCart } from "@/server/commerce/cart-read";

/** Reads only the server-selected CommerceOwner Cart and resolves its current catalog values. */
export async function readCurrentCheckout() {
  return buildCheckoutReadModel(await readCurrentCommerceCart());
}
