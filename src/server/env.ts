import "server-only";

import { z } from "zod";

const mongoConnectionStringSchema = z
  .string()
  .trim()
  .url()
  .refine(
    (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
    "MONGODB_URI must use the mongodb:// or mongodb+srv:// scheme.",
  );

const serverEnvironmentSchema = z.object({
  MONGODB_URI: mongoConnectionStringSchema,
  MONGODB_DB_NAME: z
    .string()
    .trim()
    .min(1, "MONGODB_DB_NAME is required.")
    .max(63, "MONGODB_DB_NAME must be 63 characters or fewer.")
    .regex(/^[a-zA-Z0-9_-]+$/, "MONGODB_DB_NAME may contain letters, numbers, underscores, and hyphens only."),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export class ServerEnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerEnvironmentError";
  }
}

/**
 * Reads database configuration only when a server-side database operation is
 * requested. This keeps the static homepage buildable without Atlas credentials
 * while failing clearly if a database-backed route is enabled without them.
 */
export function getServerEnvironment(): ServerEnvironment {
  const parsed = serverEnvironmentSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  });

  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new ServerEnvironmentError(
      `Database configuration is invalid or missing (${fields}). Set MONGODB_URI and MONGODB_DB_NAME in the server environment.`,
    );
  }

  return parsed.data;
}
