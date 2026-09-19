import type { ComponentPropsWithoutRef } from "react";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = ComponentPropsWithoutRef<"div"> & {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description, className, ...props }: SectionHeadingProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} {...props}>
      {eyebrow ? <p className="type-label">{eyebrow}</p> : null}
      <h2 className="type-section-heading">{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
