import {
  cartLineInputSchema,
  cartStateSchema,
  CommerceError,
  MAX_CART_LINE_QUANTITY,
  quantitySchema,
  type CartLineInput,
  type CartLineState,
  type CartState,
  type WishlistItemInput,
  type WishlistState,
  wishlistItemInputSchema,
  wishlistStateSchema,
} from "./contracts";

export type CommerceVariant = { id: string; priceMinor: number; availability: "available" | "unavailable" };
export type CommerceProduct = { slug: string; currency: string; variants: CommerceVariant[] };
export type CommerceProductResolver = (slug: string) => Promise<{ availability: "available" | "unavailable"; product: CommerceProduct | null }>;

export type ResolvedCartLine = CartLineState & { priceMinor: number; currency: string; subtotalMinor: number };
export type ResolvedCart = { lines: ResolvedCartLine[]; subtotalMinor: number; currency: string | null };

function sameLine(left: CartLineState, right: Pick<CartLineState, "productSlug" | "variantId">) {
  return left.productSlug === right.productSlug && left.variantId === right.variantId;
}

async function resolveAddableVariant(input: CartLineInput, resolveProduct: CommerceProductResolver) {
  const result = await resolveProduct(input.productSlug);
  if (result.availability === "unavailable") throw new CommerceError("COMMERCE_SOURCE_UNAVAILABLE");
  if (!result.product) throw new CommerceError("PRODUCT_UNAVAILABLE");
  const variant = result.product.variants.find((candidate) => candidate.id === input.variantId);
  if (!variant || variant.availability !== "available") throw new CommerceError("VARIANT_UNAVAILABLE");
  return { product: result.product, variant };
}

/** Adds by canonical Product slug + public Variant ID; display names, size labels, and prices are never identities. */
export async function addCartLine(state: CartState, rawInput: CartLineInput, resolveProduct: CommerceProductResolver): Promise<CartState> {
  const cart = cartStateSchema.parse(state);
  const input = cartLineInputSchema.parse(rawInput);
  await resolveAddableVariant(input, resolveProduct);
  const existing = cart.lines.find((line) => sameLine(line, input));
  if (!existing) return { lines: [...cart.lines, input] };
  const quantity = existing.quantity + input.quantity;
  if (quantity > MAX_CART_LINE_QUANTITY) throw new CommerceError("INVALID_QUANTITY");
  return { lines: cart.lines.map((line) => sameLine(line, input) ? { ...line, quantity } : line) };
}

export async function updateCartLineQuantity(state: CartState, identity: Pick<CartLineState, "productSlug" | "variantId">, rawQuantity: number, resolveProduct: CommerceProductResolver): Promise<CartState> {
  const cart = cartStateSchema.parse(state);
  const quantity = quantitySchema.safeParse(rawQuantity);
  if (!quantity.success) throw new CommerceError("INVALID_QUANTITY");
  const line = cart.lines.find((candidate) => sameLine(candidate, identity));
  if (!line) throw new CommerceError("CART_LINE_NOT_FOUND");
  await resolveAddableVariant({ ...line, quantity: quantity.data }, resolveProduct);
  return { lines: cart.lines.map((candidate) => sameLine(candidate, identity) ? { ...candidate, quantity: quantity.data } : candidate) };
}

export function removeCartLine(state: CartState, identity: Pick<CartLineState, "productSlug" | "variantId">): CartState {
  const cart = cartStateSchema.parse(state);
  if (!cart.lines.some((line) => sameLine(line, identity))) throw new CommerceError("CART_LINE_NOT_FOUND");
  return { lines: cart.lines.filter((line) => !sameLine(line, identity)) };
}

/** Resolves current server-authoritative prices. Cart state contains identity + quantity only. */
export async function resolveCart(state: CartState, resolveProduct: CommerceProductResolver): Promise<ResolvedCart> {
  const cart = cartStateSchema.parse(state);
  const lines: ResolvedCartLine[] = [];
  for (const line of cart.lines) {
    const { product, variant } = await resolveAddableVariant(line, resolveProduct);
    lines.push({ ...line, priceMinor: variant.priceMinor, currency: product.currency, subtotalMinor: variant.priceMinor * line.quantity });
  }
  const currencies = new Set(lines.map((line) => line.currency));
  if (currencies.size > 1) throw new CommerceError("PRODUCT_UNAVAILABLE");
  return { lines, subtotalMinor: lines.reduce((total, line) => total + line.subtotalMinor, 0), currency: lines[0]?.currency ?? null };
}

/** Wishlist is Product-level by design; it has no quantity, price, or inventory reservation. */
export async function addWishlistItem(state: WishlistState, rawInput: WishlistItemInput, resolveProduct: CommerceProductResolver): Promise<WishlistState> {
  const wishlist = wishlistStateSchema.parse(state);
  const input = wishlistItemInputSchema.parse(rawInput);
  const result = await resolveProduct(input.productSlug);
  if (result.availability === "unavailable") throw new CommerceError("COMMERCE_SOURCE_UNAVAILABLE");
  if (!result.product) throw new CommerceError("PRODUCT_UNAVAILABLE");
  return wishlist.productSlugs.includes(input.productSlug) ? wishlist : { productSlugs: [...wishlist.productSlugs, input.productSlug] };
}

export function removeWishlistItem(state: WishlistState, rawInput: WishlistItemInput): WishlistState {
  const wishlist = wishlistStateSchema.parse(state);
  const input = wishlistItemInputSchema.parse(rawInput);
  return { productSlugs: wishlist.productSlugs.filter((slug) => slug !== input.productSlug) };
}
