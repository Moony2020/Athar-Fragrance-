import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  size?: "default" | "compact";
  variant?: "primary" | "secondary" | "quiet";
};

type ButtonProps =
  | (ButtonBaseProps & ComponentPropsWithoutRef<"button"> & { href?: never })
  | (ButtonBaseProps & ComponentPropsWithoutRef<"a"> & { href: string });

export function Button({ className, children, size = "default", variant = "primary", ...props }: ButtonProps) {
  const buttonClassName = [styles.root, styles[variant], styles[size], className].filter(Boolean).join(" ");

  if ("href" in props && props.href) {
    const anchorProps = props as ComponentPropsWithoutRef<"a">;
    return <a className={buttonClassName} {...anchorProps}>{children}</a>;
  }

  const nativeButtonProps = props as ComponentPropsWithoutRef<"button">;
  return <button className={buttonClassName} type="button" {...nativeButtonProps}>{children}</button>;
}
