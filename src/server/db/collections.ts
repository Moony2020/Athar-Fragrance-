import "server-only";

export const databaseCollections = {
  brands: "brands",
  collections: "collections",
  products: "products",
  carts: "carts",
  wishlists: "wishlists",
  users: "users",
  userCredentials: "user_credentials",
} as const;

export type DatabaseCollectionName = (typeof databaseCollections)[keyof typeof databaseCollections];
