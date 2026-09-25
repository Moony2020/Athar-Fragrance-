import "server-only";

import { normalizeEmail } from "@/identity/contracts";
import { verifyPassword } from "@/server/auth/passwords";
import { MongoCredentialRepository } from "@/server/identity/credential-repository";
import { MongoUserRepository } from "@/server/identity/user-repository";

export async function authorizeCredentials(
  email: string,
  password: string,
  repositories: { users: Pick<MongoUserRepository, "findByNormalizedEmail">; credentials: Pick<MongoCredentialRepository, "findByUserId"> } = {
    users: new MongoUserRepository(),
    credentials: new MongoCredentialRepository(),
  },
) {
  const user = await repositories.users.findByNormalizedEmail(normalizeEmail(email));
  if (!user) return null;
  const credential = await repositories.credentials.findByUserId(user.userId);
  if (!credential || credential.disabledAt || !(await verifyPassword(credential.passwordHash, password))) return null;
  return { id: user.userId, email: user.normalizedEmail, securityVersion: credential.securityVersion };
}
