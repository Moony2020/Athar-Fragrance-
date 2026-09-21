import { ObjectId } from "mongodb";
import { z } from "zod";
import { cartStateSchema, wishlistStateSchema, type CartState, type WishlistState } from "@/commerce/contracts";

const ownerIdSchema = z.string().trim().min(32).max(128).regex(/^[A-Za-z0-9_-]+$/);
export const commerceOwnerSchema = z.discriminatedUnion("ownerType", [
  z.object({ ownerType: z.literal("guest"), ownerId: ownerIdSchema }).strict(),
  z.object({ ownerType: z.literal("user"), ownerId: ownerIdSchema }).strict(),
]);
export type CommerceOwner = z.output<typeof commerceOwnerSchema>;
export const DURABLE_COMMERCE_TTL_DAYS = 30;
const durableTtlMs = DURABLE_COMMERCE_TTL_DAYS * 24 * 60 * 60 * 1000;
export type DurableBase = { ownerType: CommerceOwner["ownerType"]; ownerId: string; revision: number; createdAt: Date; updatedAt: Date; expiresAt: Date };
export type DurableCartDocument = DurableBase & { state: CartState; _id?: ObjectId };
export type DurableWishlistDocument = DurableBase & { state: WishlistState; _id?: ObjectId };
export function guestCommerceOwner(guestId: string): CommerceOwner { return commerceOwnerSchema.parse({ ownerType: "guest", ownerId: guestId }); }
export function toDurableCartDocument(owner: CommerceOwner, state: CartState, now = new Date(), revision = 1): DurableCartDocument { return { _id: new ObjectId(), ...owner, revision, state: cartStateSchema.parse(state), createdAt: now, updatedAt: now, expiresAt: new Date(now.getTime() + durableTtlMs) }; }
export function toDurableWishlistDocument(owner: CommerceOwner, state: WishlistState, now = new Date(), revision = 1): DurableWishlistDocument { return { _id: new ObjectId(), ...owner, revision, state: wishlistStateSchema.parse(state), createdAt: now, updatedAt: now, expiresAt: new Date(now.getTime() + durableTtlMs) }; }
