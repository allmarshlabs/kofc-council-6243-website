// Full-page captures of design variants at desktop and mobile widths, for Figma.
// Usage: node scripts/capture.mjs [baseUrl] [variant:page ...]
//   e.g. node scripts/capture.mjs http://localhost:5173/ v2:home v1:contact
// Needs the dev server running (npm run dev). Variants 1 and 3 live on
// preview.html; Variant 2 (the live site) is index.html.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://localhost:5173/';
const pages = ['home', 'calendar', 'join', 'gallery', 'contact'];
const targets = process.argv.slice(3).length
  ? process.argv.slice(3).map((t) => t.split(':'))
  : ['v1', 'v2', 'v3'].flatMap((v) => pages.map((p) => [v, p]));
const sizes = [
  { name: 'desktop', width: 1440, height: 900, scale: 1 },
  { name: 'mobile', width: 390, height: 844, scale: 2 },
];
const urlFor = (v, p) =>
  v === 'v2' ? `${base}#/${p}` : `${base}preview.html#/${v}/${p}`;

await mkdir('captures', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
for (const size of sizes) {
  const ctx = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.scale,
    colorScheme: 'light',
  });
  const page = await ctx.newPage();
  for (const [v, p] of targets) {
    await page.goto(urlFor(v, p), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Hide the preview-only variant switcher so it isn't in the capture.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        if (getComputedStyle(el).position === 'fixed' && el.textContent?.startsWith('Preview')) {
          el.remove();
        }
      }
    });
    await page.waitForTimeout(600);
    const file = `captures/${v}-${p}-${size.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    results.push({ file, width: size.width, height: h });
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results));
