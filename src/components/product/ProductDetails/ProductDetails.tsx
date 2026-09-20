import Link from "next/link";
import { CatalogShell } from "@/components/catalog/CatalogShell/CatalogShell";
import { ProductCard } from "@/components/catalog/ProductCard/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery/ProductGallery";
import { ProductInformationTabs } from "@/components/product/ProductInformationTabs/ProductInformationTabs";
import { ProductPurchaseArea } from "@/components/product/ProductPurchaseArea/ProductPurchaseArea";
import { Container } from "@/components/ui/Container/Container";
import type { CatalogProductCard, CatalogProductDetail } from "@/server/catalog/read-model";
import styles from "./ProductDetails.module.css";

export function ProductDetails({ product, relatedProducts }: { product: CatalogProductDetail; relatedProducts: CatalogProductCard[] }) {
  const initialVariant = product.variants.find((variant) => variant.availability === "available") ?? product.variants[0];
  return <CatalogShell><article className={styles.page}><Container>
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span aria-current="page">{product.fragranceType ? `${product.name} – ${product.fragranceType}` : product.name}</span></nav>
    <div className={styles.productLayout}>
      <ProductGallery media={product.media} productName={product.name} />
      <section className={styles.purchaseColumn} aria-label={`${product.name} purchase information`}>
        <p className={styles.brand}>{product.brand.name}</p>
        {product.fragranceType ? <p className={styles.taxNote}>{product.fragranceType}</p> : initialVariant ? <p className={styles.taxNote}>Size · {initialVariant.sizeMl} ml</p> : null}
        <h1>{product.name}</h1>
        {product.shortDescription ? <p className={styles.short}>{product.shortDescription}</p> : null}
        <div className={styles.reviewRow} aria-label="Product rating and fragrance notes" role="group"><span className={styles.stars} aria-hidden="true">★★★★★</span><span>0.0 <span className={styles.reviewCount}>(0 reviews)</span></span><i aria-hidden="true" /><span>{product.notes.top.concat(product.notes.heart).slice(0, 3).join(" · ")}</span></div>
        <div className={styles.qualityRow} aria-label="Product details" role="group"><span>◌ Composition details</span><span>✦ Edition details</span><span>◇ House details</span></div>
        <ProductPurchaseArea currency={product.currency} productSlug={product.slug} variants={product.variants} />
      </section>
    </div>
    <div className={styles.productInformation}><ProductInformationTabs product={product} /></div>
    {relatedProducts.length > 0 ? <section className={styles.related} aria-labelledby="related-title"><div className={styles.relatedHeading}><div><p>Continue your discovery</p><h2 id="related-title">Related fragrances</h2></div><Link href="/shop">Explore all fragrances <span aria-hidden="true">↗</span></Link></div><div className={styles.relatedGrid}>{relatedProducts.map((related) => <ProductCard key={related.slug} product={related} />)}</div></section> : null}
  </Container></article></CatalogShell>;
}
