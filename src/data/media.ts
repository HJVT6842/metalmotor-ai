import { REFERENCE_MANIFEST } from "@/data/reference-manifest";
import {
  ACTIVE_RENDERS,
  RENDER_LICENSE,
  RENDER_MANIFEST,
} from "@/data/render-manifest";

/**
 * Central media catalogue.
 *
 * LEGAL / HONESTY RULES (enforced in UI):
 * - `status: "reference"` assets are real industrial photographs sourced from
 *   Wikimedia Commons under commercial-use licenses (attribution recorded per
 *   asset and shown on /creditos). They illustrate capabilities and are NOT
 *   photos of work performed by Metal Motor → "Imagen referencial" badge.
 * - `status: "real"` assets are the company's own authorized photos → "Trabajo
 *   realizado" badge.
 *
 * The reference src/credit/license/source come from the auto-generated
 * `reference-manifest.ts` (run `node scripts/fetch-reference-photos.mjs`).
 *
 * TO REPLACE ANY IMAGE WITH YOUR OWN PHOTO:
 *   1. Drop the file at the descriptor's `replacementPath` (under /images/real).
 *   2. In the descriptor below set `src: "<that path>"` and `status: "real"`.
 *   The badge flips to "Trabajo realizado" automatically (see README).
 */

export type MediaStatus = "reference" | "real";

export type MediaAsset = {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly src: string;
  readonly alt: string;
  readonly credit?: string;
  readonly source?: string;
  readonly license: string;
  readonly licenseUrl?: string;
  readonly usage: string;
  readonly status: MediaStatus;
  readonly replacementPath: string;
};

type Descriptor = {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly alt: string;
  readonly usage: string;
  readonly replacementPath: string;
  /** Set these two to swap in your own real photo (status becomes "real"). */
  readonly src?: string;
  readonly status?: MediaStatus;
};

/** Merge a descriptor with its reference-manifest entry (or an own-photo override). */
function build(d: Descriptor): MediaAsset {
  const ref = REFERENCE_MANIFEST[d.id];
  const isReal = d.status === "real" && Boolean(d.src);

  if (isReal) {
    return {
      id: d.id,
      title: d.title,
      category: d.category,
      alt: d.alt,
      src: d.src as string,
      license: "Fotografía propia · Metal Motor Services SpA",
      usage: d.usage,
      status: "real",
      replacementPath: d.replacementPath,
    };
  }

  // AI render opted-in (its .webp exists and the id is in ACTIVE_RENDERS).
  // It STAYS "reference" → badge "Imagen referencial" (never "Trabajo
  // realizado"). No credit/source → it is excluded from /creditos automatically.
  const render = ACTIVE_RENDERS.has(d.id) ? RENDER_MANIFEST[d.id] : undefined;
  if (render) {
    return {
      id: d.id,
      title: d.title,
      category: d.category,
      alt: render.alt,
      src: render.src,
      license: RENDER_LICENSE,
      usage: d.usage,
      status: "reference",
      replacementPath: d.replacementPath,
    };
  }

  return {
    id: d.id,
    title: d.title,
    category: d.category,
    alt: d.alt,
    src: d.src ?? ref?.src ?? "",
    credit: ref ? `${ref.credit} · Wikimedia Commons` : undefined,
    source: ref?.source,
    license: ref?.license ?? "Imagen referencial",
    licenseUrl: ref?.licenseUrl || undefined,
    usage: d.usage,
    status: "reference",
    replacementPath: d.replacementPath,
  };
}

// Single, strongest hero frame: a fiber laser actively cutting steel with
// sparks (high contrast). Parallax + Ken Burns still animate it.
const HERO: readonly Descriptor[] = [
  {
    id: "hero-workshop",
    title: "Corte láser CNC",
    category: "Hero",
    alt: "Corte láser CNC de fibra cortando acero con chispas (imagen referencial)",
    usage: "hero",
    replacementPath: "/images/real/workshop/hero-corte-laser.webp",
  },
];

const SERVICE: readonly Descriptor[] = [
  {
    id: "svc-corte-laser",
    title: "Corte Láser CNC",
    category: "Corte Láser",
    alt: "Corte láser CNC de fibra sobre metal (imagen referencial)",
    usage: "service:corte-laser",
    replacementPath: "/images/real/portfolio/corte-laser.webp",
  },
  {
    id: "svc-paneles",
    title: "Paneles Decorativos",
    category: "Paneles",
    alt: "Panel metálico perforado (imagen referencial)",
    usage: "service:paneles",
    replacementPath: "/images/real/portfolio/paneles.webp",
  },
  {
    id: "svc-celosias",
    title: "Celosías Metálicas",
    category: "Celosías",
    alt: "Celosía / pantalla metálica decorativa (imagen referencial)",
    usage: "service:celosias",
    replacementPath: "/images/real/portfolio/celosias.webp",
  },
  {
    id: "svc-portones",
    title: "Portones",
    category: "Portones",
    alt: "Portón metálico (imagen referencial)",
    usage: "service:portones",
    replacementPath: "/images/real/portfolio/portones.webp",
  },
  {
    id: "svc-soldadura",
    title: "Soldadura MIG / TIG",
    category: "Soldadura",
    alt: "Proceso de soldadura MIG/TIG con arco (imagen referencial)",
    usage: "service:soldadura",
    replacementPath: "/images/real/portfolio/soldadura.webp",
  },
  {
    id: "svc-plegado",
    title: "Plegado CNC",
    category: "Plegado",
    alt: "Plegadora CNC (press brake) (imagen referencial)",
    usage: "service:plegado",
    replacementPath: "/images/real/portfolio/plegado.webp",
  },
  {
    id: "svc-fabricacion",
    title: "Fabricación Industrial",
    category: "Fabricación",
    alt: "Fabricación metálica industrial (imagen referencial)",
    usage: "service:fabricacion",
    replacementPath: "/images/real/portfolio/fabricacion.webp",
  },
  {
    id: "svc-cad",
    title: "Diseño CAD",
    category: "Diseño CAD",
    alt: "Diseño CAD e ingeniería (imagen referencial)",
    usage: "service:cad",
    replacementPath: "/images/real/portfolio/cad.webp",
  },
];

const PRODUCT: readonly Descriptor[] = [
  {
    id: "prod-celosias",
    title: "Celosías Decorativas",
    category: "Celosías Decorativas",
    alt: "Celosía decorativa metálica (imagen referencial)",
    usage: "product:celosias",
    replacementPath: "/images/real/products/celosias.webp",
  },
  {
    id: "prod-paneles",
    title: "Paneles Metálicos",
    category: "Paneles Metálicos",
    alt: "Panel metálico perforado (imagen referencial)",
    usage: "product:paneles",
    replacementPath: "/images/real/products/paneles.webp",
  },
  {
    id: "prod-portones",
    title: "Portones",
    category: "Portones",
    alt: "Portón metálico (imagen referencial)",
    usage: "product:portones",
    replacementPath: "/images/real/products/portones.webp",
  },
  {
    id: "prod-rejas",
    title: "Rejas Modernas",
    category: "Rejas",
    alt: "Reja metálica (imagen referencial)",
    usage: "product:rejas",
    replacementPath: "/images/real/products/rejas.webp",
  },
  {
    id: "prod-piezas",
    title: "Piezas Industriales",
    category: "Piezas",
    alt: "Pieza metálica mecanizada CNC (imagen referencial)",
    usage: "product:piezas",
    replacementPath: "/images/real/products/piezas.webp",
  },
  {
    id: "prod-custom",
    title: "Fabricación a Medida",
    category: "A Medida",
    alt: "Fabricación metálica a medida (imagen referencial)",
    usage: "product:custom",
    replacementPath: "/images/real/products/custom.webp",
  },
];

const WORKSHOP: readonly Descriptor[] = [
  {
    id: "workshop-machinery",
    title: "Maquinaria de taller",
    category: "Taller",
    alt: "Maquinaria de taller metalúrgico (imagen referencial)",
    usage: "workshop",
    replacementPath: "/images/real/workshop/machinery.webp",
  },
  {
    id: "workshop-atmosphere",
    title: "Ambiente de taller",
    category: "Taller",
    alt: "Ambiente de taller metalúrgico con torno y banco (imagen referencial)",
    usage: "workshop",
    replacementPath: "/images/real/workshop/atmosphere.webp",
  },
];

export const HERO_MEDIA: readonly MediaAsset[] = HERO.map(build);
export const SERVICE_MEDIA: readonly MediaAsset[] = SERVICE.map(build);
export const PRODUCT_MEDIA: readonly MediaAsset[] = PRODUCT.map(build);
export const WORKSHOP_MEDIA: readonly MediaAsset[] = WORKSHOP.map(build);

export const ALL_MEDIA: readonly MediaAsset[] = [
  ...HERO_MEDIA,
  ...SERVICE_MEDIA,
  ...PRODUCT_MEDIA,
  ...WORKSHOP_MEDIA,
];

/** Showcase set for the portfolio-style gallery (services + workshop). */
export const SHOWCASE_MEDIA: readonly MediaAsset[] = [
  ...SERVICE_MEDIA,
  ...WORKSHOP_MEDIA,
];

export function getMediaById(id: string): MediaAsset | undefined {
  return ALL_MEDIA.find((m) => m.id === id);
}

/** UI badge label — enforces the honesty rule in one place. */
export function mediaBadgeLabel(status: MediaStatus): string {
  return status === "real" ? "Trabajo realizado" : "Imagen referencial";
}
