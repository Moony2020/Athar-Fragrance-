import { ObjectId } from "mongodb";

import type { UserPublic } from "./contracts";

export type UserDocument = {
  _id?: ObjectId;
  userId: string;
  normalizedEmail: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export function toPublicUser(document: UserDocument): UserPublic {
  return { userId: document.userId, email: document.normalizedEmail };
}
