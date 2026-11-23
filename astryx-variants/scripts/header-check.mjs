// Renders just the header of each variant at several widths and reports
// whether the heading block is truncated. Usage: node scripts/header-check.mjs
import { chromium } from 'playwright-core';

const urls = [
  ['v1', 'http://localhost:5173/preview.html#/v1/home'],
  ['v2', 'http://localhost:5173/#/home'],
  ['v3', 'http://localhost:5173/preview.html#/v3/home'],
];
const widths = [
  [1440, 1],
  [1024, 1],
  [390, 2],
  [360, 2],
];
const browser = await chromium.launch({ channel: 'chrome' });
for (const [name, url] of urls) {
  for (const [w, scale] of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 }, deviceScaleFactor: scale });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        if (getComputedStyle(el).position === 'fixed' && el.textContent?.startsWith('Preview')) el.remove();
      }
    });
    const r = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const texts = [...nav.querySelectorAll('.astryx-top-nav-heading *')]
        .filter((e) => e.children.length === 0 && e.textContent.trim())
        .map((e) => ({ t: e.textContent.trim(), cut: e.scrollWidth > e.clientWidth + 1 }));
      return { nav: Math.round(nav.getBoundingClientRect().height), texts, overflow: nav.scrollWidth > nav.clientWidth };
    });
    console.log(name, w, JSON.stringify(r));
    await page.screenshot({ path: `/tmp/hdr-${name}-${w}.png`, clip: { x: 0, y: 0, width: w, height: r.nav + 8 } });
    await page.close();
  }
}
await browser.close();
