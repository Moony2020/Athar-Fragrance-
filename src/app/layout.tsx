import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "@/styles/globals.css";

const displayFont = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], display: "swap" });
const uiFont = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "ATHAR — Haute Parfumerie",
  description: "A premium fragrance experience.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
