/**
 * Planned AI renders — "Industrial Premium" line. See docs/IMAGE-RENDER-PROMPTS.md
 * for the prompts and the actual-vs-proposed table.
 *
 * HONESTY (enforced): an AI render is NOT a real photo and NOT completed work.
 * Every render is integrated as `status: "reference"` → badge "Imagen
 * referencial", NEVER "Trabajo realizado". Renders carry no third-party
 * attribution, so they are automatically excluded from /creditos (which lists
 * only assets that still have a `credit`).
 *
 * ACTIVATION (when a .webp finally exists):
 *   1. Drop the file at the `src` path below (under /images/reference/**).
 *   2. Add the asset id to ACTIVE_RENDERS.
 *   That single edit swaps the Wikimedia reference for the render — nothing else.
 *
 * While an id is NOT in ACTIVE_RENDERS, the site keeps serving the current
 * Wikimedia reference image. This file is therefore inert until you opt each id
 * in, so it can never point production at a missing file.
 */

/** Shown on the badge tooltip / credits in place of a third-party license. */
export const RENDER_LICENSE = "Render propio · Metal Motor Services SpA";

export type RenderEntry = {
  /** Final .webp path under /images/reference/** (must exist before activating). */
  readonly src: string;
  /** Definitive SEO ALT describing the render; keeps the "(imagen referencial)" tag. */
  readonly alt: string;
};

/**
 * One entry per existing media id (see src/data/media.ts). Paths and ALT are
 * final; only the .webp file and the ACTIVE_RENDERS opt-in are pending.
 */
export const RENDER_MANIFEST: Record<string, RenderEntry> = {
  // Hero
  "hero-workshop": {
    src: "/images/reference/hero/hero-workshop.webp",
    alt: "Producto metálico terminado, piezas de precisión y corte láser CNC de fibra en taller de fabricación (imagen referencial)",
  },

  // Servicios / Fabricamos
  "svc-corte-laser": {
    src: "/images/reference/services/svc-corte-laser.webp",
    alt: "Servicio de corte láser CNC de fibra sobre plancha de acero en Santiago (imagen referencial)",
  },
  "svc-paneles": {
    src: "/images/reference/services/svc-paneles.webp",
    alt: "Panel decorativo metálico cortado a láser instalado en quincho exterior moderno (imagen referencial)",
  },
  "svc-celosias": {
    src: "/images/reference/services/svc-celosias.webp",
    alt: "Celosía metálica de privacidad cortada a láser en cierre perimetral residencial (imagen referencial)",
  },
  "svc-portones": {
    src: "/images/reference/services/svc-portones.webp",
    alt: "Portón metálico corredera con panel cortado a láser de patrón hexagonal (imagen referencial)",
  },
  "svc-soldadura": {
    src: "/images/reference/services/svc-soldadura.webp",
    alt: "Soldadura MIG/TIG profesional sobre acero con arco eléctrico y chispas (imagen referencial)",
  },
  "svc-plegado": {
    src: "/images/reference/services/svc-plegado.webp",
    alt: "Plegadora CNC doblando chapa de acero en taller metalúrgico moderno (imagen referencial)",
  },
  "svc-fabricacion": {
    src: "/images/reference/services/svc-fabricacion.webp",
    alt: "Fabricación metálica industrial y ensamblaje estructural profesional (imagen referencial)",
  },
  "svc-cad": {
    src: "/images/reference/services/svc-cad.webp",
    alt: "Diseño CAD 3D de pieza metálica en estación de ingeniería (imagen referencial)",
  },

  // Productos destacados / secundarios
  "prod-celosias": {
    src: "/images/reference/products/prod-celosias.webp",
    alt: "Celosía decorativa negra mate cortada a láser, primer plano del patrón de precisión con luz cálida (imagen referencial)",
  },
  "prod-paneles": {
    src: "/images/reference/products/prod-paneles.webp",
    alt: "Panel decorativo metálico cortado a láser como separador en un living residencial moderno (imagen referencial)",
  },
  "prod-portones": {
    src: "/images/reference/products/prod-portones.webp",
    alt: "Portón corredera negro mate fabricado a medida en acceso vehicular al atardecer (imagen referencial)",
  },
  "prod-separadores": {
    src: "/images/reference/products/prod-separadores.webp",
    alt: "Separador de ambientes metálico cortado a láser dividiendo un interior moderno (imagen referencial)",
  },
  "prod-rejas": {
    src: "/images/reference/products/prod-rejas.webp",
    alt: "Detalle frontal de reja metálica moderna negra mate con geometría de corte exacta (imagen referencial)",
  },
  "prod-piezas": {
    src: "/images/reference/products/prod-piezas.webp",
    alt: "Piezas de acero cortadas a láser con precisión sobre fondo de estudio (imagen referencial)",
  },
  "prod-custom": {
    src: "/images/reference/products/prod-custom.webp",
    alt: "Fabricación metálica a medida en taller industrial premium (imagen referencial)",
  },

  // Taller / Capacidad productiva
  "workshop-machinery": {
    src: "/images/reference/workshop/workshop-machinery.webp",
    alt: "Parque de maquinaria industrial moderno con corte láser, plegado y soldadura (imagen referencial)",
  },
  "workshop-atmosphere": {
    src: "/images/reference/workshop/workshop-atmosphere.webp",
    alt: "Taller de fabricación metálica limpio y profesional con iluminación cálida (imagen referencial)",
  },
};

/**
 * Ids whose .webp render is present and should REPLACE the Wikimedia reference.
 * EMPTY = no render active yet (safe default; production is unchanged).
 * Add an id here ONLY after dropping its .webp file at the manifest `src` path.
 *
 * Example, once public/images/reference/hero/hero-workshop.webp exists:
 *   export const ACTIVE_RENDERS = new Set<string>(["hero-workshop"]);
 */
export const ACTIVE_RENDERS: ReadonlySet<string> = new Set<string>([
  "hero-workshop",
  "prod-celosias",
  "prod-paneles",
  "prod-portones",
  "prod-separadores",
  "svc-celosias",
  "svc-corte-laser",
  "svc-paneles",
  "svc-portones",
  // Excepción aprobada (2026-06-12): operador con máscara, sin rostro visible.
  "svc-soldadura",
]);
