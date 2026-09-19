import type { ReactNode } from "react";
import Image from "next/image";
import { TextLink } from "@/components/ui/TextLink/TextLink";
import styles from "./Story.module.css";

const storyCopy = "At ATHAR, we believe fragrance is more than a scent - it's a memory, a mood, and a part of who you are. We bring you the world's most loved fragrances, carefully selected to inspire every moment of your life.";

export function Story() {
  return (
    <section className={styles.root} id="story" aria-labelledby="story-title">
      <div className={styles.desktop}>
        <div className={styles.desktopArt} aria-hidden="true">
          <svg viewBox="0 0 1440 390" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
              <linearGradient id="story-ribbon" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#faf2e9" /><stop offset="45%" stopColor="#f2e6d6" /><stop offset="100%" stopColor="#e8dac8" /></linearGradient>
              <linearGradient id="story-dark" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1c1916" /><stop offset="55%" stopColor="#14120f" /><stop offset="100%" stopColor="#0e0c0a" /></linearGradient>
              <linearGradient id="story-gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#dfca9d" /><stop offset="50%" stopColor="#c5a059" /><stop offset="100%" stopColor="#f0dfba" /></linearGradient>
              <filter id="story-shadow" x="-15%" y="-15%" width="130%" height="130%"><feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#2d1e0f" floodOpacity="0.22" /></filter>
              <filter id="story-ribbon-shadow" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="14" stdDeviation="20" floodColor="#44280e" floodOpacity="0.1" /></filter>
              <clipPath id="story-left-clip"><path d="M 0 320 C 90 315, 190 335, 250 350 C 315 350, 400 285, 455 230 C 470 210, 465 190, 450 170 C 380 50, 150 15, 0 45 C 0 120, -2 230, 0 320 Z" /></clipPath>
              <clipPath id="story-right-clip"><path d="M 1440 10 C 1290 -10, 1040 30, 990 200 C 960 310, 1190 390, 1440 375 Z" /></clipPath>
            </defs>
            <path d="M 0 45 C 220 18, 460 10, 720 28 C 980 46, 1220 20, 1440 10 L 1440 375 C 1220 355, 980 390, 720 372 C 480 354, 220 388, 0 370 Z" fill="url(#story-ribbon)" filter="url(#story-ribbon-shadow)" />
            <g filter="url(#story-shadow)" transform="scale(0.936, 1)"><g clipPath="url(#story-left-clip)"><path d="M 0 320 C 90 315, 190 335, 250 350 C 315 350, 400 285, 455 230 C 470 210, 465 190, 450 170 C 380 50, 150 15, 0 45 C 0 120, -2 230, 0 320 Z" fill="url(#story-dark)" /><image href="/images/home/storyleftimg.png" xlinkHref="/images/home/storyleftimg.png" x="0" y="0" width="470" height="390" preserveAspectRatio="none" /></g><path d="M 0 320 C 90 315, 190 335, 250 350 C 315 350, 400 285, 455 230 C 470 210, 465 190, 450 170 C 380 50, 150 15, 0 45 C 0 120, -2 230, 0 320 Z" fill="none" stroke="url(#story-gold)" strokeWidth="1.5" /></g>
            <g filter="url(#story-shadow)"><g clipPath="url(#story-right-clip)"><path d="M 1440 10 C 1290 -10, 1040 30, 990 200 C 960 310, 1190 390, 1440 375 Z" fill="url(#story-dark)" /><image href="/images/home/storyrightimg.png" xlinkHref="/images/home/storyrightimg.png" x="960" y="0" width="480" height="390" preserveAspectRatio="none" /></g><path d="M 1440 10 C 1290 -10, 1040 30, 990 200 C 960 310, 1190 390, 1440 375 Z" fill="none" stroke="url(#story-gold)" strokeWidth="1.5" /></g>
          </svg>
        </div>
        <aside className={styles.desktopQuote}><Quote /></aside>
        <StoryContent className={styles.desktopContent} headingId="story-title" />
        <div className={styles.desktopPillars} aria-label="ATHAR prototype presentation values"><Pillars /></div>
      </div>

      <div className={styles.mobile}>
        <figure className={`${styles.mobileImage} ${styles.leftImage}`}>
          <svg viewBox="0 0 470 390" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: 'auto' }} aria-hidden="true">
            <defs>
              <clipPath id="story-left-clip-mobile">
                <path d="M 0 320 C 90 315, 190 335, 250 350 C 315 350, 400 285, 455 230 C 470 210, 465 190, 450 170 C 380 50, 150 15, 0 45 C 0 120, -2 230, 0 320 Z" />
              </clipPath>
            </defs>
            <image href="/images/home/storyleftimg.png" xlinkHref="/images/home/storyleftimg.png" x="0" y="0" width="470" height="390" clipPath="url(#story-left-clip-mobile)" preserveAspectRatio="xMidYMid slice" />
          </svg>
          <figcaption><Quote /></figcaption>
        </figure>
        <StoryContent className={styles.mobileContent} headingId="story-title-mobile" />
        <figure className={`${styles.mobileImage} ${styles.rightImage}`}>
          <Image src="/images/home/storyrightimg.png" alt="Prototype landscape reflected in water" height={390} sizes="(max-width: 48rem) 90vw, 480px" width={480} />
          <figcaption className={styles.mobilePillars} aria-label="ATHAR prototype presentation values"><Pillars /></figcaption>
        </figure>
      </div>
    </section>
  );
}

function StoryContent({ className, headingId }: { className: string; headingId: string }) {
  return <div className={className}>
    <p className={styles.eyebrow}>Our Story</p>
    <h2 className={styles.title} id={headingId}>More Than a Perfume,<br />{"It's a Feeling"}</h2>
    <p className={styles.description}>{storyCopy}</p>
    <TextLink className={styles.cta} href="#story">Discover Our Story <span aria-hidden="true"> </span></TextLink>
  </div>;
}

function Quote() {
  return <><span className={styles.quoteDash} aria-hidden="true" /><blockquote className={styles.quote}>{"“Fragrance turns moments into memories.”"}</blockquote><span className={styles.quoteDash} aria-hidden="true" /></>;
}

function Pillars() {
  return <>
    <Pillar icon="leaf">Authentic<br />Brands</Pillar><Pillar icon="gem">Curated<br />Selection</Pillar><Pillar icon="truck">Fast &amp; Secure<br />Delivery</Pillar><Pillar icon="heart">A More<br />Beautiful You</Pillar>
  </>;
}

function Pillar({ children, icon }: { children: ReactNode; icon: "leaf" | "gem" | "truck" | "heart" }) {
  const paths = { leaf: <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 2 6.5 5 8 .5-4.5 3-8 8-10M12 2c3.5 3 5 7 5 11 0 4-3 7-7 8M12 2c1 5 0 9-3 12" />, gem: <><polygon points="12 2 21 8.5 17 21 7 21 3 8.5 12 2" /><line x1="3" y1="8.5" x2="21" y2="8.5" /><polyline points="12 2 17 8.5 12 21 7 8.5 12 2" /></>, truck: <><rect x="1" y="4" width="14" height="12" rx="1" /><polygon points="15 8 19 8 22 11 22 16 15 16 15 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>, heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> };
  return <div className={styles.pillar}><svg aria-hidden="true" viewBox="0 0 24 24">{paths[icon]}</svg><span>{children}</span></div>;
}
