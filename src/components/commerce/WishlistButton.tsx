"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleGuestWishlistAction } from "@/server/commerce/actions";

type WishlistButtonProps = {
  productSlug: string;
  productName: string;
  className: string;
  initialWishlisted?: boolean;
};

export function WishlistButton({ productSlug, productName, className, initialWishlisted = false }: WishlistButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialWishlisted);
  const [pending, start] = useTransition();

  useEffect(() => {
    const sync = (event: Event) => {
      const detail = (event as CustomEvent<{ productSlug: string; wishlisted: boolean }>).detail;
      if (detail.productSlug === productSlug) setSaved(detail.wishlisted);
    };
    window.addEventListener("athar:wishlist", sync);
    return () => window.removeEventListener("athar:wishlist", sync);
  }, [productSlug]);

  const toggle = () => start(async () => {
    const result = await toggleGuestWishlistAction({ productSlug });
    if (!result.ok) return;
    setSaved(result.wishlisted);
    window.dispatchEvent(new CustomEvent("athar:wishlist", { detail: { productSlug, wishlisted: result.wishlisted } }));
    if (!result.wishlisted) router.refresh();
  });

  return (
    <button
      aria-label={`${saved ? "Remove" : "Add"} ${productName} ${saved ? "from" : "to"} wishlist`}
      aria-pressed={saved}
      aria-busy={pending || undefined}
      className={className}
      disabled={pending}
      onClick={toggle}
      type="button"
    >
      <svg aria-hidden="true" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24">
        <path d="M12 20.1 5.8 14.3a4.9 4.9 0 1 6.2 7.5 4.9 4.9 0 1 6.2 7.5L12 20.1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    </button>
  );
}
