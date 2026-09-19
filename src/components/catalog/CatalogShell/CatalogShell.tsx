import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";

export function CatalogShell({ children }: { children: ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}
