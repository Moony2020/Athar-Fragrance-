import { readCurrentGuestCartCount } from "@/server/commerce/cart-read";
import { HeaderCartCount } from "./HeaderCartCount";

/** Request-aware leaf only: cookie access is kept out of the root layout and the rest of Header. */
export async function HeaderCartLink() {
  const count = await readCurrentGuestCartCount();
  return <HeaderCartCount initialCount={count} />;
}
