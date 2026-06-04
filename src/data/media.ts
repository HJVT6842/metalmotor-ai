/**
 * Central media catalogue.
 *
 * LEGAL / HONESTY RULES (enforced in UI):
 * - `status: "reference"` assets are illustrative industrial visuals, NOT photos
 *   of work performed by Metal Motor. They render with an "Imagen referencial"
 *   badge and must NEVER be presented as completed client work.
 * - `status: "real"` assets are the company's own authorized photos and render
 *   with a "Trabajo realizado" badge.
 *
 * The current reference set is locally generated SVG (license: own, free for
 * commercial use). To swap in a real photo: drop the file at `replacementPath`,
 * point `src` to it, and change `status` to "real" (see public/images/README.md).
 */

export type MediaStatus = "reference" | "real";

export type MediaAsset = {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly src: string;
  readonly alt: string;
  /** Author/source when downloaded from a stock provider; omit for own assets. */
  readonly credit?: string;
  readonly source?: string;
  readonly license: string;
  /** Where the asset is used in the UI. */
  readonly usage: string;
  readonly status: MediaStatus;
  /** Path where the owner's real photo should be placed to replace this asset. */
  readonly replacementPath: string;
};

/** License note shared by all locally-generated reference SVGs. */
const GEN_LICENSE =
  "Recurso visual generado por Metal Motor (SVG) · uso comercial libre · sin atribución requerida";
const GEN_CREDIT = "Metal Motor (generado)";

export const HERO_MEDIA: readonly MediaAsset[] = [
  {
    id: "hero-laser",
    title: "Corte láser CNC",
    category: "Hero",
    src: "/images/reference/hero/hero-laser.svg",
    alt: "Representación de corte láser CNC de fibra sobre placa de acero",
    credit: GEN_CREDIT,
    license: GEN_LICENSE,
    usage: "hero",
    status: "reference",
    replacementPath: "/images/real/workshop/hero-laser.webp",
  },
  {
    id: "hero-workshop",
    title: "Taller industrial",
    category: "Hero",
    src: "/images/reference/hero/hero-workshop.svg",
    alt: "Representación de un taller de fabricación metálica con maquinaria",
    credit: GEN_CREDIT,
    license: GEN_LICENSE,
    usage: "hero",
    status: "reference",
    replacementPath: "/images/real/workshop/hero-workshop.webp",
  },
  {
    id: "hero-structure",
    title: "Estructura metálica",
    category: "Hero",
    src: "/images/reference/hero/hero-structure.svg",
    alt: "Representación de una estructura metálica fabricada",
    credit: GEN_CREDIT,
    license: GEN_LICENSE,
    usage: "hero",
    status: "reference",
    replacementPath: "/images/real/workshop/hero-structure.webp",
  },
];

type ServiceSeed = {
  readonly id: string;
  readonly title: string;
  readonly file: string;
  readonly alt: string;
};

const SERVICE_SEEDS: readonly ServiceSeed[] = [
  {
    id: "svc-corte-laser",
    title: "Corte Láser CNC",
    file: "cnc-laser-cutting",
    alt: "Representación de corte láser CNC de fibra en acero",
  },
  {
    id: "svc-paneles",
    title: "Paneles Decorativos",
    file: "decorative-panels",
    alt: "Representación de panel metálico decorativo perforado",
  },
  {
    id: "svc-celosias",
    title: "Celosías Metálicas",
    file: "celosias",
    alt: "Representación de celosía metálica arquitectónica",
  },
  {
    id: "svc-portones",
    title: "Portones Metálicos",
    file: "metal-gates",
    alt: "Representación de portón metálico moderno",
  },
  {
    id: "svc-soldadura",
    title: "Soldadura MIG / TIG",
    file: "welding",
    alt: "Representación de proceso de soldadura MIG/TIG con arco",
  },
  {
    id: "svc-plegado",
    title: "Plegado CNC",
    file: "cnc-bending",
    alt: "Representación de plegado CNC de plancha metálica",
  },
  {
    id: "svc-fabricacion",
    title: "Fabricación Industrial",
    file: "industrial-fabrication",
    alt: "Representación de fabricación industrial metálica",
  },
  {
    id: "svc-cad",
    title: "Diseño CAD",
    file: "cad-design",
    alt: "Representación de modelo CAD 3D para fabricación metálica",
  },
];

export const SERVICE_MEDIA: readonly MediaAsset[] = SERVICE_SEEDS.map((s) => ({
  id: s.id,
  title: s.title,
  category: s.title,
  src: `/images/reference/services/${s.file}.svg`,
  alt: s.alt,
  credit: GEN_CREDIT,
  license: GEN_LICENSE,
  usage: `service:${s.file}`,
  status: "reference" as const,
  replacementPath: `/images/real/portfolio/${s.file}.webp`,
}));

type ProductSeed = {
  readonly id: string;
  readonly title: string;
  readonly file: string;
  readonly alt: string;
};

const PRODUCT_SEEDS: readonly ProductSeed[] = [
  {
    id: "prod-celosias",
    title: "Celosías Decorativas",
    file: "celosias-decorativas",
    alt: "Representación de celosías decorativas metálicas",
  },
  {
    id: "prod-paneles",
    title: "Paneles Metálicos",
    file: "paneles-metalicos",
    alt: "Representación de paneles metálicos decorativos",
  },
  {
    id: "prod-portones",
    title: "Portones",
    file: "portones",
    alt: "Representación de portón metálico a medida",
  },
  {
    id: "prod-rejas",
    title: "Rejas Modernas",
    file: "rejas-modernas",
    alt: "Representación de rejas metálicas de diseño moderno",
  },
  {
    id: "prod-piezas",
    title: "Piezas Industriales",
    file: "piezas-industriales",
    alt: "Representación de piezas industriales metálicas de precisión",
  },
  {
    id: "prod-custom",
    title: "Fabricación a Medida",
    file: "fabricacion-a-medida",
    alt: "Representación de fabricación metálica a medida",
  },
];

export const PRODUCT_MEDIA: readonly MediaAsset[] = PRODUCT_SEEDS.map((p) => ({
  id: p.id,
  title: p.title,
  category: p.title,
  src: `/images/reference/products/${p.file}.svg`,
  alt: p.alt,
  credit: GEN_CREDIT,
  license: GEN_LICENSE,
  usage: `product:${p.file}`,
  status: "reference" as const,
  replacementPath: `/images/real/products/${p.file}.webp`,
}));

export const WORKSHOP_MEDIA: readonly MediaAsset[] = [
  {
    id: "workshop-machinery",
    title: "Maquinaria de taller",
    category: "Taller",
    src: "/images/reference/workshop/workshop-machinery.svg",
    alt: "Representación de maquinaria de taller de fabricación metálica",
    credit: GEN_CREDIT,
    license: GEN_LICENSE,
    usage: "workshop",
    status: "reference",
    replacementPath: "/images/real/workshop/workshop-machinery.webp",
  },
  {
    id: "workshop-atmosphere",
    title: "Ambiente de taller",
    category: "Taller",
    src: "/images/reference/workshop/workshop-atmosphere.svg",
    alt: "Representación del ambiente industrial de un taller metálico",
    credit: GEN_CREDIT,
    license: GEN_LICENSE,
    usage: "workshop",
    status: "reference",
    replacementPath: "/images/real/workshop/workshop-atmosphere.webp",
  },
];

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
