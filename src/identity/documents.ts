import { ObjectId } from "mongodb";

import type { UserPublic } from "./contracts";

export type UserDocument = {
  _id?: ObjectId;
  userId: string;
  normalizedEmail: string;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
};

export function toPublicUser(document: UserDocument): UserPublic {
  return { userId: document.userId, email: document.normalizedEmail, displayName: document.displayName?.trim() || document.normalizedEmail.split("@")[0] };
}
