// Trims transparent margins from a PNG (artwork untouched) using headless Chrome.
// Usage: node scripts/trim-logo.mjs <in.png> <out.png>
import { chromium } from 'playwright-core';
import { readFile, writeFile } from 'node:fs/promises';

const [input, output] = process.argv.slice(2);
const dataUrl = `data:image/png;base64,${(await readFile(input)).toString('base64')}`;
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const result = await page.evaluate(async (src) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  let minX = c.width, minY = c.height, maxX = -1, maxY = -1;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (data[(y * c.width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const w = maxX - minX + 1, h = maxY - minY + 1;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  out.getContext('2d').drawImage(c, minX, minY, w, h, 0, 0, w, h);
  return { url: out.toDataURL('image/png'), box: [minX, minY, w, h], size: [img.width, img.height] };
}, dataUrl);
await writeFile(output, Buffer.from(result.url.split(',')[1], 'base64'));
await browser.close();
console.log(JSON.stringify({ input, output, box: result.box, original: result.size }));
