import type { ComponentPropsWithoutRef } from "react";
import styles from "./IconButton.module.css";

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "aria-label"> & { "aria-label": string };

export function IconButton({ className, type = "button", ...props }: IconButtonProps) {
  return <button className={[styles.root, className].filter(Boolean).join(" ")} type={type} {...props} />;
}
