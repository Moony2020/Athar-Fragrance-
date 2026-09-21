import { ObjectId } from "mongodb";

export type UserCredentialDocument = {
  _id?: ObjectId;
  userId: string;
  passwordHash: string;
  disabledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
