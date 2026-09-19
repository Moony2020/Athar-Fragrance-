"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        className={styles.menuToggle}
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <line x1="3.5" y1="6.5" x2="20.5" y2="6.5" />
          <line x1="3.5" y1="12" x2="16" y2="12" />
          <line x1="3.5" y1="17.5" x2="20.5" y2="17.5" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={styles.menuBackdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.mobileMenuDrawer} ${isOpen ? styles.mobileMenuOpen : ""}`}
        aria-label="Mobile menu"
        aria-hidden={!isOpen}
      >
        {/* Left Side-rail with vertical ATHAR & emblem */}
        <div className={styles.mobileMenuRailWrap} aria-hidden="true">
          <span className={styles.mobileMenuRailText}>ATHAR</span>
          <span className={styles.railBadge}>A</span>
        </div>
        <span className={styles.mobileMenuRailLine} aria-hidden="true" />
        
        {/* Main drawer content */}
        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileMenuHead}>
            <button
              className={styles.mobileMenuClose}
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              ×
            </button>
          </div>

          <nav className={styles.mobileMenuNav} aria-label="Mobile Navigation">
            <Link
              className={styles.mobileMenuItem}
              href="/shop"
              onClick={closeMenu}
            >
              <span>SHOP</span>
            </Link>

            {/* COLLECTIONS Expandable */}
            <button
              className={styles.mobileMenuItem}
              type="button"
              aria-expanded={collectionsExpanded}
              onClick={() => setCollectionsExpanded(!collectionsExpanded)}
            >
              <span>COLLECTIONS</span>
              <span
                className={`${styles.menuChevron} ${
                  collectionsExpanded ? styles.menuChevronExpanded : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {collectionsExpanded && (
              <div className={styles.mobileMenuSub}>
                <Link href="#collections" onClick={closeMenu}>
                  SIGNATURE COLLECTION
                </Link>
                <Link href="#collections" onClick={closeMenu}>
                  DISCOVERY SETS
                </Link>
              </div>
            )}

            {/* Regular links & disabled items */}
            <Link
              className={styles.mobileMenuItem}
              href="#collections"
              onClick={closeMenu}
            >
              <span>NEW ARRIVALS</span>
            </Link>

            <span className={`${styles.mobileMenuItem} ${styles.menuItemDisabled}`}>
              <span>MAKEUP</span>
              <small>SOON</small>
            </span>

            <span className={`${styles.mobileMenuItem} ${styles.menuItemDisabled}`}>
              <span>INSPIRATION</span>
              <small>SOON</small>
            </span>
          </nav>

          <div className={styles.mobileMenuAbout}>
            <span className={styles.aboutTag}>ABOUT</span>
            <span className={styles.aboutText}>ATHAR — LUXURY FRAGRANCE HOUSE</span>
          </div>
        </div>
      </aside>
    </>
  );
}
