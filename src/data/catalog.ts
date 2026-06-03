import type { CatalogItem } from "@/types";

/**
 * Sample catalog of fabricated products.
 * Manually curated for the MVP; Phase 1 admin CRUD + later CSV import will
 * replace this with Supabase-backed data.
 */
export const CATALOG: readonly CatalogItem[] = [
  {
    slug: "celosia-hexagonal",
    name: "Celosía hexagonal",
    category: "Celosías",
    description:
      "Celosía de patrón hexagonal para fachadas ventiladas y control solar.",
    tags: ["Acero galvanizado", "Termolacado", "A medida"],
  },
  {
    slug: "panel-perforado-ondas",
    name: "Panel perforado «Ondas»",
    category: "Paneles decorativos",
    description:
      "Panel decorativo con perforación orgánica para revestimientos interiores.",
    tags: ["Acero", "Pintura electrostática"],
  },
  {
    slug: "panel-corten-jardin",
    name: "Panel Corten para jardín",
    category: "Paneles decorativos",
    description:
      "Panel de acero Corten para paisajismo y separadores de exterior.",
    tags: ["Acero Corten", "Exterior"],
  },
  {
    slug: "estructura-soldada-modular",
    name: "Estructura soldada modular",
    category: "Estructuras",
    description:
      "Bastidor soldado MIG a medida para mobiliario y soportes industriales.",
    tags: ["Acero", "Soldadura MIG", "A medida"],
  },
  {
    slug: "pieza-corte-laser-inox",
    name: "Pieza de corte láser en inox",
    category: "Corte láser",
    description:
      "Pieza de precisión cortada en acero inoxidable a partir de archivo CAD.",
    tags: ["Acero inoxidable", "Corte láser", "TIG"],
  },
  {
    slug: "celosia-vertical-privacidad",
    name: "Celosía vertical de privacidad",
    category: "Celosías",
    description:
      "Celosía de lamas verticales para terrazas y cierres perimetrales.",
    tags: ["Aluminio", "Liviana", "Exterior"],
  },
] as const;
