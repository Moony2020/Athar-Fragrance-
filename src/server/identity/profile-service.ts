import "server-only";

import { displayNameSchema } from "@/identity/contracts";
import { toPublicUser } from "@/identity/documents";
import { MongoUserRepository } from "@/server/identity/user-repository";

export async function getCustomerProfile(userId: string, repository = new MongoUserRepository()) {
  const user = await repository.findByUserId(userId);
  return user ? toPublicUser(user) : null;
}

export async function updateCustomerDisplayName(userId: string, input: unknown, repository = new MongoUserRepository()) {
  const displayName = displayNameSchema.parse(input);
  const user = await repository.updateDisplayName(userId, displayName);
  return user ? toPublicUser(user) : null;
}
