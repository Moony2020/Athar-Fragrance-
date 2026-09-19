import Link from "next/link";
import { Container } from "@/components/ui/Container/Container";
import { Section } from "@/components/ui/Section/Section";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { TextLink } from "@/components/ui/TextLink/TextLink";
import styles from "./Collections.module.css";

type CollectionCard = {
  description: readonly string[];
  href: string;
  shape: string;
  slug: "her" | "him" | "unisex" | "new";
  title: string;
  image?: string;
};

const collections: readonly CollectionCard[] = [
  {
    description: ["Elegant.", "Feminine.", "Timeless."],
    href: "/shop/women",
    shape: "M32 44 C52 25 79 24 103 33 C127 42 147 26 172 26 C201 25 226 41 232 67 C237 92 231 117 233 145 C235 174 226 214 202 224 C181 233 159 207 136 210 C110 213 93 238 68 235 C40 232 21 213 14 186 C8 159 12 130 14 105 C15 76 17 59 32 44 Z",
    slug: "her",
    title: "For Her",
    image: "/images/home/forher.png",
  },
  {
    description: ["Bold.", "Refined.", "Distinctive."],
    href: "/shop/men",
    shape: "M112 16 C145 7 170 11 201 27 C225 43 236 70 237 101 C235 133 235 162 238 188 C241 213 236 232 214 242 C190 250 158 255 128 255 C98 255 66 250 43 238 C27 228 21 207 22 180 C23 151 20 124 26 99 C30 82 38 68 50 58 C67 38 90 23 112 16 Z",
    slug: "him",
    title: "For Him",
    image: "/images/home/forhim.png",
  },
  {
    description: ["Beyond", "Boundaries."],
    href: "/shop/unisex",
    shape: "M42 50 C75 20 115 6 150 12 C190 18 218 42 232 78 C242 110 240 145 230 180 C220 215 198 240 165 250 C130 260 88 255 60 240 C35 225 20 198 18 165 C16 130 20 95 30 70 C34 60 38 54 42 50 Z",
    slug: "unisex",
    title: "Unisex",
    image: "/images/home/unisex.png",
  },
  {
    description: ["Fresh", "Inspirations."],
    href: "#collections",
    shape: "M72 28 C90 16 112 10 132 18 C157 28 176 48 194 69 C216 94 234 126 237 159 C240 193 230 227 207 243 C184 259 151 260 119 258 C86 256 54 253 34 236 C17 221 13 193 14 161 C15 128 20 98 34 70 C45 48 57 36 72 28 Z",
    slug: "new",
    title: "New\nArrivals",
    image: "/images/home/newarrivals.png",
  },
];

export function Collections() {
  return (
    <Section className={styles.section} id="collections" aria-labelledby="collections-title">
      <Container>
        <div className={styles.headingRow}>
          <SectionHeading
            className={styles.heading}
            description="Find the fragrance that fits your story."
            id="collections-title"
            title="Shop by Collection"
          />
          <TextLink className={styles.exploreAll} href="#collections">Explore all <span aria-hidden="true">→</span></TextLink>
        </div>

        <div className={styles.grid}>
          {collections.map((collection) => (
            <Link
              aria-label={`Browse ${collection.title} collection`}
              className={`${styles.card} ${styles[collection.slug]} ${collection.image ? styles.hasImage : ""}`}
              href={collection.href}
              key={collection.slug}
            >
              <svg className={styles.shape} viewBox="0 0 240 260" preserveAspectRatio="none" aria-hidden="true">
                {collection.image ? (
                  <>
                    <defs>
                      <clipPath id={`clip-${collection.slug}`}>
                        <path d={collection.shape} />
                      </clipPath>
                    </defs>
                    <image href={collection.image} xlinkHref={collection.image} x="0" y="0" width="240" height="260" preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-${collection.slug})`} />
                    <path d={collection.shape} className={styles.imageBorder} />
                  </>
                ) : (
                  <path d={collection.shape} />
                )}
              </svg>
              <span className={styles.cardBody}>
                <span>
                  <span className={styles.cardTitle}>{collection.title}</span>
                  <span className={styles.cardDescription}>{collection.description.map((line) => <span key={line}>{line}</span>)}</span>
                </span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
