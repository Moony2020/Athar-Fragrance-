import { customerCreateInputSchema } from "./contracts";
import { toPublicUser, type UserDocument } from "./documents";

export type CustomerRepository = {
  findByNormalizedEmail(email: string): Promise<UserDocument | null>;
  create(input: { email: string; passwordHash: string }): Promise<UserDocument>;
};

export async function createCustomer(input: unknown, repository: CustomerRepository) {
  const parsed = customerCreateInputSchema.parse(input);
  const existing = await repository.findByNormalizedEmail(parsed.email);
  if (existing) throw new Error("A customer already exists for this email.");
  return toPublicUser(await repository.create({ email: parsed.email, passwordHash: parsed.passwordHash }));
}
