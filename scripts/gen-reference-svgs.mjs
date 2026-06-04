/**
 * Generates premium industrial SVG reference assets under
 * public/images/reference/**. Run: `node scripts/gen-reference-svgs.mjs`.
 *
 * These are label-free, abstract industrial visuals (legally ours, free for
 * commercial use). They are flagged `status: "reference"` in src/data/media.ts
 * and surfaced with an "Imagen referencial" badge — never as completed work.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 1600;
const H = 1000;

const TONES = {
  steel: ["#1e293b", "#020617"],
  graphite: ["#172033", "#0c0a09"],
  night: ["#0f172a", "#020617"],
  iron: ["#1f2937", "#0a0a0a"],
};

function grid(id, step = 48) {
  return `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
    <path d="M${step} 0H0V${step}" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="1"/>
  </pattern>`;
}

// ---- Motifs (return SVG markup; accent = orange highlight) ----
const motifs = {
  laser: () => `
    <rect x="380" y="360" width="840" height="300" rx="10" fill="rgba(148,163,184,0.06)" stroke="rgba(203,213,225,0.18)"/>
    <line x1="200" y1="120" x2="900" y2="520" stroke="url(#beam)" stroke-width="5"/>
    <circle cx="900" cy="520" r="10" fill="#fb923c"/>
    <g fill="#fb923c" opacity="0.85">
      <circle cx="930" cy="540" r="3"/><circle cx="870" cy="560" r="2.5"/>
      <circle cx="950" cy="500" r="2"/><circle cx="905" cy="575" r="2.5"/>
    </g>
    <path d="M520 510 q120 -60 240 0" fill="none" stroke="rgba(249,115,22,0.5)" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>`,
  panels: () => {
    let dots = "";
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 16; c++)
        dots += `<circle cx="${180 + c * 80}" cy="${160 + r * 80}" r="${(r + c) % 3 === 0 ? 12 : 7}" fill="rgba(203,213,225,0.12)"/>`;
    return `<rect x="120" y="110" width="1360" height="780" rx="14" fill="rgba(148,163,184,0.04)"/>${dots}
      <rect x="120" y="110" width="1360" height="780" rx="14" fill="none" stroke="rgba(249,115,22,0.25)" stroke-width="2"/>`;
  },
  celosias: () => {
    let lines = "";
    for (let i = -10; i < 26; i++) {
      const x = i * 90;
      lines += `<line x1="${x}" y1="0" x2="${x + 500}" y2="${H}" stroke="rgba(203,213,225,0.12)" stroke-width="10"/>`;
      lines += `<line x1="${x + 500}" y1="0" x2="${x}" y2="${H}" stroke="rgba(249,115,22,0.07)" stroke-width="10"/>`;
    }
    return lines;
  },
  gates: () => {
    let bars = "";
    for (let c = 0; c < 12; c++)
      bars += `<rect x="${260 + c * 95}" y="220" width="14" height="560" rx="7" fill="rgba(203,213,225,0.14)"/>`;
    return `${bars}
      <rect x="240" y="200" width="1130" height="600" rx="10" fill="none" stroke="rgba(203,213,225,0.25)" stroke-width="14"/>
      <line x1="240" y1="500" x2="1370" y2="500" stroke="rgba(249,115,22,0.5)" stroke-width="10"/>`;
  },
  welding: () => `
    <radialGradient id="arc" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fed7aa"/><stop offset="0.4" stop-color="#fb923c"/>
      <stop offset="1" stop-color="rgba(249,115,22,0)"/>
    </radialGradient>
    <line x1="300" y1="780" x2="760" y2="500" stroke="rgba(203,213,225,0.5)" stroke-width="16" stroke-linecap="round"/>
    <circle cx="800" cy="470" r="120" fill="url(#arc)"/>
    <g stroke="#fb923c" stroke-width="3" stroke-linecap="round" opacity="0.9">
      <line x1="800" y1="470" x2="900" y2="380"/><line x1="800" y1="470" x2="920" y2="500"/>
      <line x1="800" y1="470" x2="860" y2="600"/><line x1="800" y1="470" x2="700" y2="560"/>
    </g>
    <line x1="560" y1="640" x2="1240" y2="640" stroke="rgba(148,163,184,0.18)" stroke-width="40"/>`,
  bending: () => `
    <polygon points="300,640 820,520 820,760 300,880" fill="rgba(148,163,184,0.10)" stroke="rgba(203,213,225,0.2)"/>
    <polygon points="820,520 1300,360 1300,560 820,760" fill="rgba(148,163,184,0.05)" stroke="rgba(203,213,225,0.18)"/>
    <line x1="820" y1="520" x2="820" y2="760" stroke="#fb923c" stroke-width="4"/>
    <path d="M880 470 a120 120 0 0 1 60 110" fill="none" stroke="rgba(249,115,22,0.5)" stroke-width="3" stroke-dasharray="2 12"/>`,
  fabrication: () => `
    <g stroke="rgba(203,213,225,0.16)" stroke-width="12" fill="none">
      <path d="M250 800 L500 360 L750 800 L1000 360 L1250 800 L1350 600"/>
      <line x1="250" y1="800" x2="1350" y2="800"/>
    </g>
    <circle cx="1150" cy="300" r="80" fill="none" stroke="rgba(249,115,22,0.4)" stroke-width="14" stroke-dasharray="22 14"/>
    <circle cx="1150" cy="300" r="26" fill="rgba(249,115,22,0.3)"/>`,
  cad: () => `
    <g stroke="rgba(148,163,184,0.35)" stroke-width="2.5" fill="none">
      <path d="M520 360 L980 360 L1080 280 L620 280 Z"/>
      <path d="M520 360 L520 660 L980 660 L980 360"/>
      <path d="M980 360 L1080 280 L1080 580 L980 660"/>
      <path d="M520 660 L620 580 L1080 580 M620 280 L620 580"/>
    </g>
    <g stroke="rgba(249,115,22,0.6)" stroke-width="2">
      <line x1="500" y1="710" x2="980" y2="710"/><line x1="500" y1="700" x2="500" y2="720"/><line x1="980" y1="700" x2="980" y2="720"/>
    </g>
    <circle cx="520" cy="360" r="6" fill="#fb923c"/><circle cx="980" cy="660" r="6" fill="#fb923c"/>`,
  workshop: () => `
    <g fill="rgba(148,163,184,0.10)" stroke="rgba(203,213,225,0.16)">
      <rect x="180" y="560" width="300" height="300" rx="10"/>
      <rect x="560" y="480" width="260" height="380" rx="10"/>
      <rect x="900" y="600" width="220" height="260" rx="10"/>
      <rect x="1200" y="520" width="240" height="340" rx="10"/>
    </g>
    <g stroke="rgba(249,115,22,0.5)" stroke-width="6" stroke-linecap="round">
      <line x1="300" y1="160" x2="340" y2="160"/><line x1="690" y1="120" x2="730" y2="120"/>
      <line x1="1010" y1="180" x2="1050" y2="180"/><line x1="1320" y1="140" x2="1360" y2="140"/>
    </g>
    <ellipse cx="320" cy="200" rx="120" ry="40" fill="rgba(249,115,22,0.10)"/>
    <ellipse cx="710" cy="160" rx="120" ry="40" fill="rgba(249,115,22,0.10)"/>`,
  structure: () => `
    <g stroke="rgba(203,213,225,0.18)" stroke-width="10" fill="none">
      <rect x="300" y="220" width="1000" height="600"/>
      <line x1="300" y1="220" x2="1300" y2="820"/><line x1="1300" y1="220" x2="300" y2="820"/>
      <line x1="800" y1="220" x2="800" y2="820"/><line x1="300" y1="520" x2="1300" y2="520"/>
    </g>
    <circle cx="300" cy="220" r="8" fill="#fb923c"/><circle cx="1300" cy="820" r="8" fill="#fb923c"/>`,
};

function buildSvg(motifKey, toneKey) {
  const [from, to] = TONES[toneKey] ?? TONES.steel;
  const motif = motifs[motifKey] ?? motifs.structure;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fdba74"/><stop offset="1" stop-color="#ea580c"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="12%" r="60%">
      <stop offset="0" stop-color="rgba(249,115,22,0.22)"/><stop offset="1" stop-color="rgba(249,115,22,0)"/>
    </radialGradient>
    <radialGradient id="vig" cx="50%" cy="50%" r="75%">
      <stop offset="55%" stop-color="rgba(0,0,0,0)"/><stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
    </radialGradient>
    ${grid("g")}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${motif()}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;
}

const FILES = [
  ["reference/hero/hero-laser.svg", "laser", "night"],
  ["reference/hero/hero-workshop.svg", "workshop", "graphite"],
  ["reference/hero/hero-structure.svg", "structure", "steel"],
  ["reference/services/cnc-laser-cutting.svg", "laser", "steel"],
  ["reference/services/decorative-panels.svg", "panels", "graphite"],
  ["reference/services/celosias.svg", "celosias", "night"],
  ["reference/services/metal-gates.svg", "gates", "iron"],
  ["reference/services/welding.svg", "welding", "graphite"],
  ["reference/services/cnc-bending.svg", "bending", "steel"],
  ["reference/services/industrial-fabrication.svg", "fabrication", "iron"],
  ["reference/services/cad-design.svg", "cad", "night"],
  ["reference/workshop/workshop-machinery.svg", "workshop", "iron"],
  ["reference/workshop/workshop-atmosphere.svg", "structure", "graphite"],
  ["reference/products/celosias-decorativas.svg", "celosias", "steel"],
  ["reference/products/paneles-metalicos.svg", "panels", "night"],
  ["reference/products/portones.svg", "gates", "graphite"],
  ["reference/products/rejas-modernas.svg", "gates", "steel"],
  ["reference/products/piezas-industriales.svg", "fabrication", "graphite"],
  ["reference/products/fabricacion-a-medida.svg", "laser", "iron"],
];

let count = 0;
for (const [rel, motif, tone] of FILES) {
  const out = join(ROOT, "public/images", rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buildSvg(motif, tone), "utf8");
  count += 1;
}
console.log(`Generated ${count} reference SVG assets.`);
