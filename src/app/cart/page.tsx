import type { Metadata } from "next";
import { Suspense } from "react";
import { CartPage } from "@/components/cart/CartPage/CartPage";
import { CatalogShell } from "@/components/catalog/CatalogShell/CatalogShell";
import { Container } from "@/components/ui/Container/Container";
import { readCurrentCommerceCart } from "@/server/commerce/cart-read";

export const metadata: Metadata = { title: "Your bag | ATHAR", robots: { index: false, follow: false } };

export default function CartRoute() { return <CatalogShell><Container><Suspense fallback={<section aria-label="Your bag" />}><CartContents /></Suspense></Container></CatalogShell>; }

async function CartContents() { return <CartPage cart={await readCurrentCommerceCart()} />; }
