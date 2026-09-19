import type { ComponentPropsWithoutRef } from "react";
import styles from "./Section.module.css";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  spacing?: "default" | "compact";
};

export function Section({ className, spacing = "default", ...props }: SectionProps) {
  const sectionClassName = [styles.root, spacing === "compact" ? styles.compact : "", className]
    .filter(Boolean)
    .join(" ");

  return <section className={sectionClassName} {...props} />;
}
