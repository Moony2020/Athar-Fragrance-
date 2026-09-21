import type { Metadata } from "next";
import Link from "next/link";
import { CatalogShell } from "@/components/catalog/CatalogShell/CatalogShell";
import { ProductCard } from "@/components/catalog/ProductCard/ProductCard";
import { Container } from "@/components/ui/Container/Container";
import { readCurrentGuestWishlist } from "@/server/commerce/wishlist-read";
import styles from "./WishlistPage.module.css";
export const metadata: Metadata = { title: "Wishlist | ATHAR", robots: { index: false, follow: false } };
export const instant = false;
export default async function WishlistPage() { const wishlist = await readCurrentGuestWishlist(); return <CatalogShell><main><Container className={styles.content}>{wishlist.products.length ? <section aria-labelledby="wishlist-title"><p>ATHAR</p><h1 id="wishlist-title">Your wishlist</h1><div>{wishlist.products.map(product => <ProductCard initialWishlisted key={product.slug} product={product} />)}</div></section> : <section aria-labelledby="wishlist-title"><p>ATHAR</p><h1 id="wishlist-title">Your wishlist is empty</h1><Link href="/shop">Explore fragrances ↗</Link></section>}</Container></main></CatalogShell>; }
