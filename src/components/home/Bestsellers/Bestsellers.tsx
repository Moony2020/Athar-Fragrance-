import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container/Container";
import { Section } from "@/components/ui/Section/Section";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { TextLink } from "@/components/ui/TextLink/TextLink";
import styles from "./Bestsellers.module.css";

type FeaturedFragrance = {
  alt: string;
  brand: string;
  href: string;
  id: string;
  name: string;
  priceLabel: string;
};

// Prototype presentation data only. It is not a production product, price,
// inventory, or bestseller record; canonical catalog data belongs to Phase 3.
const featuredFragrances: readonly FeaturedFragrance[] = [
  { id: "sauvage", brand: "Dior", name: "Sauvage", priceLabel: "1 299 kr", alt: "Dior Sauvage prototype presentation", href: "#bestsellers" },
  { id: "versace-eros", brand: "Versace", name: "Versace Eros", priceLabel: "899 kr", alt: "Versace Eros prototype presentation", href: "#bestsellers" },
  { id: "ysl-libre", brand: "Yves Saint Laurent", name: "Libre", priceLabel: "1 249 kr", alt: "Yves Saint Laurent Libre prototype presentation", href: "#bestsellers" },
  { id: "lancome-la-vie", brand: "Lancôme", name: "La Vie Est Belle", priceLabel: "1 099 kr", alt: "Lancôme La Vie Est Belle prototype presentation", href: "#bestsellers" },
  { id: "armani-gio", brand: "Armani", name: "Acqua di Giò", priceLabel: "1 099 kr", alt: "Armani Acqua di Giò prototype presentation", href: "#bestsellers" },
];

export function Bestsellers() {
  return (
    <Section className={styles.section} id="bestsellers" aria-labelledby="bestsellers-title">
      <Container>
        <div className={styles.headingRow}>
          <SectionHeading
            className={styles.heading}
            description="Our most coveted and iconic creations"
            id="bestsellers-title"
            title="Bestselling Fragrances"
          />
          <TextLink className={styles.exploreAll} href="#bestsellers">
            Explore all bestsellers <span aria-hidden="true">→</span>
          </TextLink>
        </div>

        <div className={styles.stageViewport}>
          <div className={styles.stage}>
            <Image
              alt=""
              className={styles.stageImage}
              height={170}
              sizes="(max-width: 48rem) 38rem, min(100vw - 2rem, 83.75rem)"
              src="/images/home/bestsellers-stage.png"
              width={662}
            />
            <div className={styles.productLinks}>
              {featuredFragrances.map((fragrance) => (
                <Link
                  aria-label={`${fragrance.alt}. Product details are not available yet.`}
                  className={styles.productLink}
                  href={fragrance.href}
                  key={fragrance.id}
                >
                  <span className={styles.srOnly}>
                    {fragrance.brand} {fragrance.name}, {fragrance.priceLabel}. Prototype presentation only.
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <span className={`${styles.direction} ${styles.previous}`} aria-hidden="true">‹</span>
          <span className={`${styles.direction} ${styles.next}`} aria-hidden="true">›</span>
        </div>
      </Container>
    </Section>
  );
}
