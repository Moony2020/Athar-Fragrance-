"use client";

import Image from "next/image";
import { useState } from "react";
import type { CatalogProductDetail } from "@/server/catalog/read-model";
import styles from "./ProductGallery.module.css";

type PublicMedia = CatalogProductDetail["media"][number];
const placeholderSrc = "/images/catalog/product-placeholder.svg";
const generatedMedia: Record<string, string> = {
  "athar-test-no-01": "/images/catalog/athar-test-no-01-v1.webp",
  "cedar-study": "/images/catalog/cedar-study-v1.webp",
  "no-media-study": "/images/catalog/no-media-study-v1.webp",
  "velvet-sillage": "/images/catalog/velvet-sillage-v1.webp",
  "luminous-fig": "/images/catalog/luminous-fig-v1.webp",
};

/**
 * The PDP stays server-rendered. This smallest client island owns only the
 * presentational selected-media index for Products with multiple images.
 */
export function ProductGallery({ media, productName }: { media: PublicMedia[]; productName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isWishlisted, setWishlisted] = useState(false);
  const selected = media[selectedIndex] ?? null;

  if (!selected) {
    return (
      <section className={styles.gallery} aria-label="Product media">
        <div className={styles.placeholder} role="img" aria-label={`${productName} media placeholder`}>
          <Image src={generatedMedia[slugFromName(productName)] ?? placeholderSrc} alt="" fill priority sizes="(max-width: 760px) 100vw, 28rem" />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.gallery} aria-label="Product media">
      {media.length > 1 ? (
        <div className={styles.thumbnailRail} aria-label="Choose product media" role="group">
          {media.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                aria-label={`Show product media ${index + 1}: ${item.alt}`}
                aria-pressed={isSelected}
                className={styles.thumbnail}
                key={`${item.position}-${item.url}`}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <span aria-hidden="true" className={`${styles.thumbnailImage} ${toneClass(item.position)}`}>
                  <GalleryImage media={item} />
                </span>
                <span className={styles.thumbnailLabel}>{`Media ${index + 1}${isSelected ? ", selected" : ""}`}</span>
              </button>
            );
          })}
        </div>
      ) : null}
      <div className={`${styles.primary} ${toneClass(selected.position)}`} aria-live="polite">
        <GalleryImage media={selected} priority={selectedIndex === 0} />
        <button aria-label={`${isWishlisted ? "Remove" : "Add"} ${productName} ${isWishlisted ? "from" : "to"} wishlist`} aria-pressed={isWishlisted} className={styles.primaryWishlist} onClick={() => setWishlisted((current) => !current)} type="button"><HeartIcon filled={isWishlisted} /></button>
      </div>
    </section>
  );
}

function HeartIcon({ filled }: { filled: boolean }) { return <svg aria-hidden="true" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24"><path d="M12 20.1 5.8 14.3a4.9 4.9 0 0 1 6.2-7.5 4.9 4.9 0 0 1 6.2 7.5L12 20.1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>; }


function GalleryImage({ media, priority = false }: { media: PublicMedia; priority?: boolean }) {
  // Product visuals are project-local ATHAR assets. Remote canonical media stays
  // data-only until its provider/domain is owner-approved.
  const generatedSlug = slugFromMedia(media.url);
  return <Image src={generatedSlug ? generatedMedia[generatedSlug] : placeholderSrc} alt={media.alt} fill priority={priority} sizes="(max-width: 760px) 100vw, 28rem" />;
}

function slugFromMedia(url: string) { return Object.keys(generatedMedia).find((slug) => url.includes(slug)); }
function slugFromName(name: string) { return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

function toneClass(position: number) {
  return position % 3 === 1 ? styles.toneOne : position % 3 === 2 ? styles.toneTwo : styles.toneZero;
}
