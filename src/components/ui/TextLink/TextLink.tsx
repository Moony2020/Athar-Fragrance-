import type { ComponentPropsWithoutRef } from "react";
import styles from "./TextLink.module.css";

type TextLinkProps = ComponentPropsWithoutRef<"a">;

export function TextLink({ className, children, ...props }: TextLinkProps) {
  return <a className={[styles.root, className].filter(Boolean).join(" ")} {...props}>{children}</a>;
}
