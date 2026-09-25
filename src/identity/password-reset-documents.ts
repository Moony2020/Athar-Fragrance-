import { ObjectId } from "mongodb";

export type PasswordResetTokenDocument = {
  _id?: ObjectId;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
};
