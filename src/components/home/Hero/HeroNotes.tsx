"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";

const notes = [
  { title: "Top notes", lines: ["Bergamot", "Pear", "Pink Pepper"], image: "/images/hero/top-note.png" },
  { title: "Middle notes", lines: ["Jasmine", "Orange Blossom", "Rose"], image: "/images/hero/middle-note.png" },
  { title: "Base notes", lines: ["Vanilla", "Sandalwood", "Musk"], image: "/images/hero/base-note.png" },
  { title: "Longevity", lines: ["8–10 Hours", "A lasting impression"], image: "/images/hero/longevity.png" },
];

export function HeroNotes() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateScrollableState = () => {
      setCanScroll(viewport.scrollWidth > viewport.clientWidth + 1);
    };
    const observer = new ResizeObserver(updateScrollableState);
    observer.observe(viewport);
    window.addEventListener("resize", updateScrollableState);
    requestAnimationFrame(updateScrollableState);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollableState);
    };
  }, []);

  const move = (direction: -1 | 1) => viewportRef.current?.scrollBy({ behavior: "smooth", left: direction * 280 });

  return <div className={styles.notesWrapper}>
    <div 
      className={styles.notesShell} 
      id="fragrance-notes"
      aria-label="Fragrance notes"
      onKeyDown={(event) => {
        if (!canScroll || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }}
      ref={viewportRef}
      role="group"
      tabIndex={canScroll ? 0 : -1}
    >
      <dl className={styles.notes}>
        {notes.map((note) => <div className={styles.note} key={note.title}>
          <Image alt="" className={styles.noteImage} height={96} src={note.image} width={96} />
          <div className={styles.noteContent}>
            <dt className={styles.noteTitle}>{note.title}</dt>
            <dd>
              {note.lines.map((line, i) => <span key={i} className={styles.noteLine}>{line}</span>)}
            </dd>
          </div>
        </div>)}
      </dl>
    </div>
    {canScroll ? <div className={styles.notesControls} aria-label="Fragrance notes navigation" role="group">
      <button aria-label="Previous fragrance notes" onClick={() => move(-1)} type="button">‹</button>
      <button aria-label="Next fragrance notes" onClick={() => move(1)} type="button">›</button>
    </div> : null}
  </div>;
}
