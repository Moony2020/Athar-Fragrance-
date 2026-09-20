"use client";

import { useState } from "react";
import type { CatalogProductDetail } from "@/server/catalog/read-model";
import styles from "./ProductInformationTabs.module.css";

type Props = { product: CatalogProductDetail };
type TabId = "details" | "reviews" | "questions";

/** PDP information stays in one purchase column, with tabs rather than repeated page sections. */
export function ProductInformationTabs({ product }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("details");

  return (
    <section className={styles.section} aria-label="Product information">
      <div className={styles.tabs} role="tablist" aria-label="Product details">
        <Tab id="details" label="Details" activeTab={activeTab} setActiveTab={setActiveTab} />
        <Tab id="reviews" label="Reviews" activeTab={activeTab} setActiveTab={setActiveTab} />
        <Tab id="questions" label="Q&A" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className={styles.panel} role="tabpanel" aria-live="polite">
        {activeTab === "details" ? <Details product={product} /> : null}
        {activeTab === "reviews" ? <EmptyState title="Reviews" text="There are no verified reviews for this fragrance yet." /> : null}
        {activeTab === "questions" ? <EmptyState title="Questions & answers" text="Questions about this fragrance will appear here once they are answered." /> : null}
      </div>
    </section>
  );
}

function Tab({ id, label, activeTab, setActiveTab }: { id: TabId; label: string; activeTab: TabId; setActiveTab: (id: TabId) => void }) {
  return <button aria-selected={activeTab === id} className={styles.tab} onClick={() => setActiveTab(id)} role="tab" type="button">{label}</button>;
}

function Details({ product }: { product: CatalogProductDetail }) {
  const sizes = product.variants.map((variant) => `${variant.sizeMl} ml`).join(" · ");
  const hasAvailableSize = product.variants.some((variant) => variant.availability === "available");
  const noteGroups = ([
    ["Top", product.notes.top],
    ["Heart", product.notes.heart],
    ["Base", product.notes.base],
  ] as const).filter(([, notes]) => notes.length > 0);
  return <div className={styles.details}>
    <div><h2>Product information</h2><p>{product.description}</p></div>
    <dl className={styles.facts}>
      <div><dt>Fragrance family</dt><dd>{formatFamily(product.fragranceFamily)}</dd></div>
      {product.fragranceType ? <div><dt>Fragrance type</dt><dd>{product.fragranceType}</dd></div> : null}
      <div><dt>Audience</dt><dd>{formatAudience(product.audience)}</dd></div>
      <div><dt>Available sizes</dt><dd>{sizes || "Not specified"}</dd></div>
      <div><dt>Availability</dt><dd>{hasAvailableSize ? "Available" : "Currently unavailable"}</dd></div>
      <div><dt>House</dt><dd>{product.brand.name}</dd></div>
    </dl>
    {noteGroups.length > 0 ? <div className={styles.notes} role="region" aria-label="Fragrance notes"><h3>Fragrance notes</h3><div>{noteGroups.map(([label, notes]) => <NoteGroup key={label} label={label} notes={notes} />)}</div></div> : null}
  </div>;
}

function formatFamily(value: string) { return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
function formatAudience(value: CatalogProductDetail["audience"]) { return value === "women" ? "For Her" : value === "men" ? "For Him" : "Unisex"; }
function NoteGroup({ label, notes }: { label: string; notes: string[] }) { return <div><span>{label}</span><p>{notes.join(", ")}</p></div>; }
function EmptyState({ title, text }: { title: string; text: string }) { return <div className={styles.empty}><h2>{title}</h2><p>{text}</p></div>; }
