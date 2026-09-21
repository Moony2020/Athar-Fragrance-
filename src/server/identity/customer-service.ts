import "server-only";

import { createCustomer as createCustomerWithRepository } from "@/identity/customer-service";
import { MongoUserRepository } from "@/server/identity/user-repository";

/** Server entry point for customer creation; no Auth.js/session runtime is involved in Stage 6.1. */
export function createCustomer(input: unknown) {
  return createCustomerWithRepository(input, new MongoUserRepository());
}
