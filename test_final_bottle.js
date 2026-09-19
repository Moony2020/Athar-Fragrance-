const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();

  const widths = [686, 620, 580, 545, 500];
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({ path: `C:/Users/Mymoon Dobaibi/.gemini/antigravity-ide/brain/f52526cb-04ac-4d66-b030-921db23a5125/final-bottle-${width}.png` });
    await ctx.close();
  }

  await browser.close();
  console.log('Final bottle screenshots captured');
})();
