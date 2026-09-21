import Link from "next/link";
import Image from "next/image";
import { formatMoneyMinor } from "@/lib/money";
import type { PublicCart } from "@/server/commerce/cart-read";
import { CartLineControls } from "./CartLineControls";
import styles from "./CartPage.module.css";

export function CartPage({ cart }: { cart: PublicCart }) {
  if (cart.availability === "unavailable") return <section className={styles.page} aria-labelledby="cart-title"><h1 id="cart-title">Your bag</h1><p role="status">Bag details are temporarily unavailable.</p></section>;
  if (cart.lines.length === 0) return <section className={styles.empty} aria-labelledby="cart-title"><p>ATHAR</p><h1 id="cart-title">Your bag is empty</h1><p>Discover a fragrance to make it yours.</p><Link href="/shop">Explore fragrances <span aria-hidden="true">↗</span></Link></section>;
  return <section className={styles.page} aria-labelledby="cart-title">
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span aria-current="page">Your bag</span></nav>
    <header className={styles.heading}><div><p>ATHAR</p><h1 id="cart-title">Your bag</h1></div><span>{cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}</span></header>
    <div className={styles.layout}><div><div className={styles.listHeader}><span>Selected fragrances</span><Link href="/shop">Continue shopping <span aria-hidden="true">↗</span></Link></div><div className={styles.lines} aria-label="Bag items" role="list">
      {cart.lines.map((line) => <div className={styles.line} data-availability={line.availability} key={`${line.productSlug}:${line.variantId}`} role="listitem">
        {line.media ? <Link aria-label={`View ${line.productName ?? "fragrance"}`} className={styles.media} href={`/products/${line.productSlug}`}><Image alt={line.media.alt} fill sizes="(max-width: 680px) 5.5rem, 8rem" src={line.media.src} /></Link> : <div aria-label="Product media unavailable" className={styles.placeholder} role="img">ATHAR</div>}
        <div className={styles.detail}>
          {line.productName ? <><p>{line.brandName}</p><Link href={`/products/${line.productSlug}`}><h2>{line.productName}</h2></Link></> : <h2>Unavailable fragrance</h2>}
          <span>{[line.fragranceType, line.sizeMl ? `${line.sizeMl} ml` : "Size unavailable"].filter(Boolean).join(" · ")}</span>
          {line.availability === "available" && line.priceMinor !== null ? <strong>{formatMoneyMinor(line.priceMinor, line.currency ?? "SEK")}</strong> : <small role="status">This item is currently unavailable and is excluded from subtotal.</small>}
        </div>
        <CartLineControls line={line} />
      </div>)}</div></div>
      <aside aria-label="Order summary" className={styles.summary} role="region"><p className={styles.summaryKicker}>Order summary · {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}</p><div><span>Subtotal</span><strong>{cart.currency ? formatMoneyMinor(cart.subtotalMinor, cart.currency) : "Unavailable"}</strong></div><div><span>Delivery</span><em>Calculated later</em></div><div className={styles.summaryTotal}><span>Total</span><strong>{cart.currency ? formatMoneyMinor(cart.subtotalMinor, cart.currency) : "Unavailable"}</strong></div><Link className={styles.checkout} href="/shop">Continue shopping <span aria-hidden="true">↗</span></Link><small>Prices are current. Delivery, tax, and payment are not calculated in the bag.</small><ul className={styles.assurances}><li>Current catalog prices</li><li>Complementary delivery may apply</li></ul></aside>
    </div>
  </section>;
}
