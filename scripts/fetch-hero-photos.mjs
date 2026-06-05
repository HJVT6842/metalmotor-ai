/**
 * Targeted fetch for the 3 HERO background images: real CNC laser / plasma
 * metal-cutting scenes with sparks (dark, high-contrast). Downloads to
 * public/images/reference/hero/ and prints the manifest entries to paste into
 * src/data/reference-manifest.ts. Does NOT touch the other 16 reference images.
 *
 * Run: node scripts/fetch-hero-photos.mjs
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA = "MetalMotorAI-ReferenceFetch/1.0 (https://metalmotor.cl; contacto@metalmotor.cl)";
const API = "https://commons.wikimedia.org/w/api.php";

// The hero uses a single curated frame (hero-workshop): a fiber laser actively
// cutting steel with sparks. Re-running re-fetches the top-ranked candidate —
// verify the result visually before committing, as ranking can vary.
const SLOTS = ["hero-workshop"];
const QUERIES = [
  "fiber laser cutting sparks",
  "laser cutting steel sparks",
  "cnc laser cutting metal",
  "fiber laser cutting machine",
  "industrial laser cutting steel",
  "plasma cnc cutting steel",
];

// Exclude diagrams, people-centric and military/handheld scenes.
const DENY =
  /annotated|diagram|drawing|schematic|chart|graph|logo|icon|\bmap\b|sign\b|poster|portrait|ceremony|award|conference|meeting|stamp|coin|navy|sailor|airman|soldier|marine\b|army|military|uss |hull|firefighter|fireman|damage control|portable|hand-held|handheld|angle grinder|\bman\b|\bwoman\b|worker|people|crowd|operator/i;
const MACHINE_KW = /laser|cnc|plasma|fiber|fibre/i;

async function fetchRetry(url, opts, tries = 4) {
  let err;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, opts);
      if (r.ok) return r;
      err = new Error(`HTTP ${r.status}`);
    } catch (e) {
      err = e;
    }
    await new Promise((r) => setTimeout(r, 600 * (i + 1)));
  }
  throw err;
}

const stripHtml = (s) =>
  (s || "").replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();

function licenseOk(ext) {
  const code = (ext?.License?.value || "").toLowerCase();
  const short = ext?.LicenseShortName?.value || "";
  if (/nc|nd|noncommercial|noderiv/i.test(code) || /NC|ND/i.test(short)) return false;
  if (/^(cc0|cc-by(-sa)?(-[0-9.]+)?|pd|pd-.*|publicdomain|public domain)/.test(code)) return true;
  if (/public domain|cc0|cc[- ]by/i.test(short)) return true;
  return false;
}

async function search(query) {
  const u = new URL(API);
  u.search = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "40",
    gsrsearch: `${query} -icon -logo -diagram`,
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1920",
  }).toString();
  const res = await fetchRetry(u, { headers: { "User-Agent": UA, Accept: "application/json" } });
  const data = await res.json();
  return data?.query?.pages ? Object.values(data.query.pages) : [];
}

function candidate(page) {
  const ii = page.imageinfo?.[0];
  if (!ii || !ii.thumburl) return null;
  if (!/image\/(jpeg|png)/.test(ii.mime || "")) return null;
  if ((ii.width || 0) < 1300) return null;
  if (DENY.test(page.title)) return null;
  if (!licenseOk(ii.extmetadata || {})) return null;
  const landscape = (ii.width || 0) >= (ii.height || 1);
  const title = page.title.replace(/^File:/, "");
  const machine = MACHINE_KW.test(title) ? 5 : 0;
  const spark = /spark/i.test(title) ? 4 : 0;
  const metal = /steel|sheet metal|\bmetal\b|cutting/i.test(title) ? 1 : 0;
  const score =
    machine + spark + metal + (landscape ? 3 : -3) + ((ii.width || 0) >= 1920 ? 1 : 0);
  const ext = ii.extmetadata || {};
  return {
    score,
    index: page.index ?? 999,
    title,
    thumburl: ii.thumburl,
    credit: stripHtml(ext.Artist?.value) || "Wikimedia Commons",
    license: ext.LicenseShortName?.value || ext.License?.value || "Wikimedia Commons",
    licenseUrl: ext.LicenseUrl?.value || "",
    source: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
  };
}

const pool = new Map();
for (const q of QUERIES) {
  const pages = await search(q);
  for (const p of pages) {
    const c = candidate(p);
    if (c && !pool.has(c.title)) pool.set(c.title, c);
  }
  await new Promise((r) => setTimeout(r, 250));
}

const ranked = [...pool.values()].sort((a, b) => b.score - a.score || a.index - b.index);
if (ranked.length < SLOTS.length) throw new Error(`Only ${ranked.length} candidates found`);

// Clear old hero files so no stale extensions linger.
const heroDir = join(ROOT, "public/images/reference/hero");
mkdirSync(heroDir, { recursive: true });
for (const f of readdirSync(heroDir)) rmSync(join(heroDir, f));

const entries = {};
for (let i = 0; i < SLOTS.length; i++) {
  const slot = SLOTS[i];
  const c = ranked[i];
  const extn = c.thumburl.split("?")[0].toLowerCase().endsWith(".png") ? "png" : "jpg";
  const rel = `/images/reference/hero/${slot}.${extn}`;
  const res = await fetchRetry(c.thumburl, { headers: { "User-Agent": UA } });
  writeFileSync(join(ROOT, "public", rel), Buffer.from(await res.arrayBuffer()));
  entries[slot] = {
    src: rel,
    title: c.title,
    credit: c.credit,
    source: c.source,
    license: c.license,
    licenseUrl: c.licenseUrl,
  };
  console.log(`✓ ${slot.padEnd(16)} score=${c.score}  ${c.license.padEnd(14)} ${c.title.slice(0, 55)}`);
}

console.log("\n--- PASTE INTO reference-manifest.ts (replace the 3 hero entries) ---");
for (const slot of SLOTS) {
  console.log(`${JSON.stringify(slot)}: ${JSON.stringify(entries[slot], null, 2)},`);
}
