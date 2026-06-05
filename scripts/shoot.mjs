/**
 * Captures full-page screenshots at desktop + mobile viewports.
 * Usage: node scripts/shoot.mjs <label> [baseUrl]
 * Scrolls through the page first so Framer whileInView reveals are triggered.
 * (Dev-only helper; Playwright is installed with --no-save.)
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const label = process.argv[2] || "shot";
const base = process.argv[3] || "http://localhost:3210";
const OUT = "docs/polish";
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "load", timeout: 60000 });
  // Trigger scroll-reveal animations across the whole page.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    const total = document.body.scrollHeight;
    for (let y = 0; y <= total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
  });
  await page.screenshot({ path: `${OUT}/${label}-${vp.name}.png`, fullPage: true });
  console.log(`✓ ${OUT}/${label}-${vp.name}.png`);
  await ctx.close();
}
await browser.close();
