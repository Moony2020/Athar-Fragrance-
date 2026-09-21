import { ObjectId } from "mongodb";
import { z } from "zod";

import { cartStateSchema, wishlistStateSchema } from "./contracts";
import type { CommerceOwner, DurableCartDocument, DurableWishlistDocument, DurableBase } from "./durable-contracts";
import { commerceOwnerSchema } from "./durable-contracts";

const durableBaseSchema = z.object({
  ownerType: z.enum(["guest", "user"]),
  ownerId: z.string().trim().min(32).max(128).regex(/^[A-Za-z0-9_-]+$/),
  revision: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date(),
}).strict();

const durableCartDocumentSchema = durableBaseSchema.extend({
  _id: z.instanceof(ObjectId).optional(),
  state: cartStateSchema,
}).strict();

const durableWishlistDocumentSchema = durableBaseSchema.extend({
  _id: z.instanceof(ObjectId).optional(),
  state: wishlistStateSchema,
}).strict();

function assertDocumentBase(document: DurableBase, owner: CommerceOwner): void {
  commerceOwnerSchema.parse({ ownerType: document.ownerType, ownerId: document.ownerId });
  if (document.ownerType !== owner.ownerType || document.ownerId !== owner.ownerId) throw new Error("Commerce owner mismatch.");
}

export function parseCartDocument(raw: DurableCartDocument, owner: CommerceOwner): DurableCartDocument {
  const parsed = durableCartDocumentSchema.parse(raw);
  const { state, _id, ...base } = parsed;
  assertDocumentBase(base, owner);
  return { ...base, state, _id };
}

export function parseWishlistDocument(raw: DurableWishlistDocument, owner: CommerceOwner): DurableWishlistDocument {
  const parsed = durableWishlistDocumentSchema.parse(raw);
  const { state, _id, ...base } = parsed;
  assertDocumentBase(base, owner);
  return { ...base, state, _id };
}
