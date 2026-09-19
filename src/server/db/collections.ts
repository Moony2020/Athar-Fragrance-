import "server-only";

export const databaseCollections = {
  brands: "brands",
  collections: "collections",
  products: "products",
} as const;

export type DatabaseCollectionName = (typeof databaseCollections)[keyof typeof databaseCollections];
