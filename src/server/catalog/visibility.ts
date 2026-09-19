import type { CatalogStatus } from "@/server/catalog/domain";

/** The sole lifecycle rule for future public catalog reads. */
export function isPublicCatalogStatus(status: CatalogStatus): boolean {
  return status === "active";
}
