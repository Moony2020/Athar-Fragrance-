import { Bestsellers } from "@/components/home/Bestsellers/Bestsellers";
import { Collections } from "@/components/home/Collections/Collections";
import { FragranceGuide } from "@/components/home/FragranceGuide/FragranceGuide";
import { Hero } from "@/components/home/Hero/Hero";
import { Story } from "@/components/home/Story/Story";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Collections />
        <Bestsellers />
        <Story />
        <FragranceGuide />
      </main>
      <Footer />
    </>
  );
}
