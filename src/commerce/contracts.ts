import { z } from "zod";
import { slugSchema } from "@/server/catalog/schemas";

/** A deliberately conservative guardrail until checkout can validate availability again. */
export const MAX_CART_LINE_QUANTITY = 12;

export const publicVariantIdSchema = z.string().trim().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/, "Expected a public variant identifier.");
export const quantitySchema = z.number().int().min(1).max(MAX_CART_LINE_QUANTITY);

export const cartLineInputSchema = z.object({
  productSlug: slugSchema,
  variantId: publicVariantIdSchema,
  quantity: quantitySchema,
}).strict();

export const cartLineStateSchema = cartLineInputSchema;
export const cartStateSchema = z.object({ lines: z.array(cartLineStateSchema).max(50) }).strict();
export const wishlistItemInputSchema = z.object({ productSlug: slugSchema }).strict();
export const wishlistStateSchema = z.object({ productSlugs: z.array(slugSchema).max(100) }).strict();

export type CartLineInput = z.output<typeof cartLineInputSchema>;
export type CartLineState = z.output<typeof cartLineStateSchema>;
export type CartState = z.output<typeof cartStateSchema>;
export type WishlistItemInput = z.output<typeof wishlistItemInputSchema>;
export type WishlistState = z.output<typeof wishlistStateSchema>;

export type CommerceErrorCode = "COMMERCE_SOURCE_UNAVAILABLE" | "PRODUCT_UNAVAILABLE" | "VARIANT_UNAVAILABLE" | "INVALID_QUANTITY" | "CART_LINE_NOT_FOUND";

/** Safe domain error values; database details never cross this boundary. */
export class CommerceError extends Error {
  constructor(public readonly code: CommerceErrorCode) {
    super(code);
    this.name = "CommerceError";
  }
}
