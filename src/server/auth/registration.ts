import "server-only";

import { registrationInputSchema } from "@/identity/contracts";
import { MongoCredentialRepository } from "@/server/identity/credential-repository";
import { MongoUserRepository } from "@/server/identity/user-repository";
import { hashPassword } from "@/server/auth/passwords";

export class RegistrationError extends Error {
  constructor() {
    super("Unable to create account.");
    this.name = "RegistrationError";
  }
}

type RegistrationDependencies = {
  users: Pick<MongoUserRepository, "create" | "deleteByUserId">;
  credentials: Pick<MongoCredentialRepository, "create" | "deleteByUserId">;
  hashPassword: typeof hashPassword;
};

export async function registerCustomer(input: unknown, dependencies?: RegistrationDependencies) {
  const parsed = registrationInputSchema.parse(input);
  const users = dependencies?.users ?? new MongoUserRepository();
  const credentials = dependencies?.credentials ?? new MongoCredentialRepository();
  const hash = dependencies?.hashPassword ?? hashPassword;
  let createdUserId: string | undefined;
  try {
    const user = await users.create({ email: parsed.email });
    createdUserId = user.userId;
    await credentials.create({ userId: user.userId, passwordHash: await hash(parsed.password) });
    return { userId: user.userId, email: user.normalizedEmail };
  } catch {
    if (createdUserId) {
      await Promise.allSettled([credentials.deleteByUserId(createdUserId), users.deleteByUserId(createdUserId)]);
    }
    throw new RegistrationError();
  }
}
