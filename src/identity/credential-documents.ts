import { ObjectId } from "mongodb";

export type UserCredentialDocument = {
  _id?: ObjectId;
  userId: string;
  passwordHash: string;
  disabledAt: Date | null;
  securityVersion: number;
  createdAt: Date;
  updatedAt: Date;
};
