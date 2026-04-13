import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.resolve(__dirname, 'og-image.html');
const outputPath = path.resolve(__dirname, '..', 'public', 'og-image.png');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
await page.goto('file://' + templatePath);
// Wait for web fonts to load
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: outputPath, type: 'png', omitBackground: false });
await browser.close();
console.log('Wrote', outputPath);
