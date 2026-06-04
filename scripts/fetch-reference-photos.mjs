/**
 * Fetches REAL industrial reference photography from Wikimedia Commons
 * (keyless API), filtered to commercial-use licenses, and downloads 1600px
 * versions into public/images/reference/**. Emits src/data/reference-manifest.ts
 * with full attribution (credit, license, source) for each asset id.
 *
 * Run: `node scripts/fetch-reference-photos.mjs`
 *
 * These are REFERENCE photos (status:"reference", "Imagen referencial" badge),
 * not Metal Motor's own work. Replace any image by dropping a file at the
 * asset's replacementPath and flipping status to "real" (see media.ts / README).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA =
  "MetalMotorAI-ReferenceFetch/1.0 (https://metalmotor.cl; contacto@metalmotor.cl)";
const API = "https://commons.wikimedia.org/w/api.php";

const dirForId = (id) =>
  id.startsWith("hero-")
    ? "hero"
    : id.startsWith("svc-")
      ? "services"
      : id.startsWith("prod-")
        ? "products"
        : "workshop";

/** Each topic fills one or more asset slots from the same search relevance. */
const TOPICS = [
  {
    queries: ["fiber laser cutting metal", "laser cutting steel sheet", "cnc laser cutting"],
    slots: ["hero-laser", "svc-corte-laser"],
  },
  {
    queries: ["metalworking lathe machine", "industrial milling machine", "machine tool factory", "cnc machining center"],
    slots: ["hero-workshop", "workshop-machinery", "workshop-atmosphere"],
  },
  {
    queries: ["steel structure fabrication", "steel fabrication welding factory", "steel beam construction"],
    slots: ["hero-structure", "svc-fabricacion"],
  },
  {
    queries: ["perforated metal panel facade", "perforated sheet metal", "metal cladding facade"],
    slots: ["svc-paneles", "prod-paneles"],
  },
  {
    queries: ["metal lattice facade", "decorative metal screen", "laser cut metal screen"],
    slots: ["svc-celosias", "prod-celosias"],
  },
  {
    queries: ["wrought iron gate", "metal gate", "steel gate fence"],
    slots: ["svc-portones", "prod-portones", "prod-rejas"],
  },
  {
    queries: ["MIG welding", "TIG welding", "welder welding steel"],
    slots: ["svc-soldadura"],
  },
  {
    queries: ["press brake sheet metal", "metal bending machine", "sheet metal forming"],
    slots: ["svc-plegado"],
  },
  {
    queries: ["CAD software engineering", "computer aided design screen", "technical drawing CAD"],
    slots: ["svc-cad"],
  },
  {
    queries: ["cnc machined aluminium part", "milled metal part", "lathe turned metal part"],
    slots: ["prod-piezas"],
  },
  {
    queries: ["custom metal fabrication", "metal fabrication welding shop", "steel fabrication work"],
    slots: ["prod-custom"],
  },
];

async function fetchRetry(url, opts, tries = 4) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, opts);
      if (res.ok) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 600 * (i + 1)));
  }
  throw lastErr;
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

async function search(query, limit = 30) {
  const u = new URL(API);
  u.search = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: String(limit),
    gsrsearch: `${query} -icon -logo -map -diagram`,
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1600",
  }).toString();
  const res = await fetchRetry(u, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.query?.pages ? Object.values(data.query.pages) : [];
}

// Drop obviously off-topic / non-photographic results regardless of query.
const TITLE_DENYLIST =
  /annotated|diagram|drawing|schematic|chart|graph|logo|icon|\bmap\b|sign\b|poster|portrait|tour|round table|ceremony|award|conference|meeting|speech|senator|secretary|president|minister|stamp|coin|seal\b/i;

function candidate(page) {
  const ii = page.imageinfo?.[0];
  if (!ii || !ii.thumburl) return null;
  if (!/image\/(jpeg|png)/.test(ii.mime || "")) return null;
  if ((ii.width || 0) < 1100) return null;
  if (TITLE_DENYLIST.test(page.title)) return null;
  const ext = ii.extmetadata || {};
  if (!licenseOk(ext)) return null;
  return {
    index: page.index ?? 999,
    title: page.title.replace(/^File:/, ""),
    thumburl: ii.thumburl,
    credit: stripHtml(ext.Artist?.value) || "Wikimedia Commons",
    license: ext.LicenseShortName?.value || ext.License?.value || "Wikimedia Commons",
    licenseUrl: ext.LicenseUrl?.value || "",
    source:
      ii.descriptionurl ||
      `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
  };
}

async function gather(queries, need) {
  const out = [];
  const seen = new Set();
  for (const q of queries) {
    if (out.length >= need) break;
    const pages = await search(q);
    pages.sort((a, b) => (a.index || 0) - (b.index || 0));
    for (const p of pages) {
      if (out.length >= need) break;
      const c = candidate(p);
      if (c && !seen.has(c.title)) {
        seen.add(c.title);
        out.push(c);
      }
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return out;
}

async function download(url, destAbs) {
  const res = await fetchRetry(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(destAbs), { recursive: true });
  writeFileSync(destAbs, buf);
  return buf.length;
}

const manifest = {};
for (const topic of TOPICS) {
  const cands = await gather(topic.queries, topic.slots.length);
  if (cands.length === 0) throw new Error(`No images for: ${topic.queries[0]}`);
  for (let i = 0; i < topic.slots.length; i++) {
    const slot = topic.slots[i];
    const c = cands[i] || cands[cands.length - 1];
    const ext = c.thumburl.split("?")[0].toLowerCase().endsWith(".png") ? "png" : "jpg";
    const rel = `/images/reference/${dirForId(slot)}/${slot}.${ext}`;
    const bytes = await download(c.thumburl, join(ROOT, "public", rel));
    manifest[slot] = {
      src: rel,
      title: c.title,
      credit: c.credit,
      source: c.source,
      license: c.license,
      licenseUrl: c.licenseUrl,
    };
    console.log(
      `✓ ${slot.padEnd(20)} ${String(Math.round(bytes / 1024)).padStart(4)}KB  ${c.license.padEnd(16)} ${c.title.slice(0, 50)}`,
    );
    await new Promise((r) => setTimeout(r, 200));
  }
}

const ts = `// AUTO-GENERATED by scripts/fetch-reference-photos.mjs — do not edit by hand.
// Real industrial reference photography from Wikimedia Commons (commercial-use
// licenses). Each entry carries attribution required by its license.

export type ReferenceManifestEntry = {
  readonly src: string;
  readonly title: string;
  readonly credit: string;
  readonly source: string;
  readonly license: string;
  readonly licenseUrl: string;
};

export const REFERENCE_MANIFEST: Record<string, ReferenceManifestEntry> = ${JSON.stringify(
  manifest,
  null,
  2,
)} as const;
`;
writeFileSync(join(ROOT, "src/data/reference-manifest.ts"), ts, "utf8");
console.log(`\nWrote src/data/reference-manifest.ts (${Object.keys(manifest).length} entries).`);
