const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();

  const widths = [700, 686, 620, 560, 545, 530, 420, 360];
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });

    await page.addStyleTag({
      content: `
        @media (max-width: 34rem) {
          .content {
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr) !important;
          }
          .bottleStage {
            justify-content: flex-end !important;
            align-self: end !important;
          }
          .bottle {
            filter: drop-shadow(0 1.2rem 1.8rem rgba(55, 32, 12, 0.42)) !important;
            max-height: min(32rem, 66svh) !important;
            transform: translateY(clamp(0.8rem, 2vw, 1.8rem)) !important;
            transform-origin: bottom center !important;
            width: min(165%, 30rem) !important;
          }
        }
      `
    });

    await page.waitForTimeout(150);
    await page.screenshot({ path: `C:/Users/Mymoon Dobaibi/.gemini/antigravity-ide/brain/f52526cb-04ac-4d66-b030-921db23a5125/test-nojump-${width}.png` });
    await ctx.close();
  }

  await browser.close();
  console.log('No-jump verification done');
})();
