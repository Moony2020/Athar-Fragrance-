import type { ComponentPropsWithoutRef } from "react";
import styles from "./Container.module.css";

type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className, ...props }: ContainerProps) {
  return <div className={[styles.root, className].filter(Boolean).join(" ")} {...props} />;
}
