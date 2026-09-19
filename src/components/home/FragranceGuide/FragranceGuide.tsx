import Image from "next/image";

import { Container } from "@/components/ui/Container/Container";
import { Section } from "@/components/ui/Section/Section";
import { TextLink } from "@/components/ui/TextLink/TextLink";

import styles from "./FragranceGuide.module.css";

type FragranceGuideItem = {
  id: "floral" | "woody" | "fresh" | "oriental";
  title: "Floral" | "Woody" | "Fresh" | "Oriental";
  description: string;
  image: string;
  alt: string;
  href: "#guide";
};

const fragranceFamilies: readonly FragranceGuideItem[] = [
  {
    id: "floral",
    title: "Floral",
    description: "Romantic • Ethereal",
    image: "/images/home/guide-floral.jpg",
    alt: "White flower in bloom for the Floral fragrance family",
    href: "#guide",
  },
  {
    id: "woody",
    title: "Woody",
    description: "Warm • Grounded",
    image: "/images/home/guide-woody.jpg",
    alt: "Cedar and sandalwood for the Woody fragrance family",
    href: "#guide",
  },
  {
    id: "fresh",
    title: "Fresh",
    description: "Invigorating • Clean",
    image: "/images/home/guide-fresh.jpg",
    alt: "Water-covered stones for the Fresh fragrance family",
    href: "#guide",
  },
  {
    id: "oriental",
    title: "Oriental",
    description: "Opulent • Seductive",
    image: "/images/home/guide-oriental.jpg",
    alt: "Amber resin and smoke for the Oriental fragrance family",
    href: "#guide",
  },
];

export function FragranceGuide() {
  return (
    <Section className={styles.section} id="guide" aria-labelledby="guide-title">
      <Container>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <div>
              <p className={styles.eyebrow}>Fragrance Guide</p>
              <h2 className={styles.title} id="guide-title">Discover Your Signature</h2>
              <p className={styles.description}>
                Navigate through olfactive families to find the scent that harmonizes effortlessly with your mood, occasion, and persona.
              </p>
            </div>
            <TextLink className={styles.cta} href="#guide">Explore the Guide <span aria-hidden="true">→</span></TextLink>
          </div>

          {fragranceFamilies.map((family) => (
            <a className={styles.card} href={family.href} key={family.id} aria-label={`Explore ${family.title} fragrance family (not available yet)`}>
              <Image className={styles.image} src={family.image} alt={family.alt} fill sizes="(max-width: 860px) 25vw, (max-width: 1088px) 18vw, 16vw" />
              <span className={styles.overlay}>
                <span className={styles.cardTitle}>{family.title}</span>
                <span className={styles.cardDescription}>{family.description}</span>
              </span>
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}
