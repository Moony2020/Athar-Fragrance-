const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();

  for (const width of [686, 620, 580, 545]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });

    await page.addStyleTag({
      content: `
        @media (max-width: 42.875rem) {
          .bottle {
            max-height: min(32.5rem, 67svh) !important;
            transform: translateY(clamp(0.8rem, 2vw, 1.8rem)) !important;
            width: min(165%, 31rem) !important;
          }
        }
      `
    });

    await page.waitForTimeout(200);
    await page.screenshot({ path: `C:/Users/Mymoon Dobaibi/.gemini/antigravity-ide/brain/f52526cb-04ac-4d66-b030-921db23a5125/test-bottle-size-${width}.png` });
    await ctx.close();
  }

  await browser.close();
  console.log('Bottle size test completed');
})();
