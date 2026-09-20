/** Shared presentation formatter for canonical integer minor-unit prices. */
export function formatMoneyMinor(value: number, currency: string): string {
  const major = value / 100;
  if (currency === "SEK") return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(major)} kr`;
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(major);
}
