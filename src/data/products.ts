import type { Product } from "@/types";

/**
 * Premium product line for the product showcase. Imagery comes from the media
 * catalogue via `mediaId` (see src/data/media.ts → PRODUCT_MEDIA), which carries
 * the reference photo, status badge and attribution.
 */
export const PRODUCTS: readonly Product[] = [
  {
    slug: "celosias-decorativas",
    name: "Celosías Decorativas",
    description:
      "Control solar y privacidad con diseño arquitectónico, a medida para tu fachada.",
    mediaId: "prod-celosias",
    tags: ["Fachadas", "A medida"],
  },
  {
    slug: "paneles-metalicos",
    name: "Paneles Metálicos",
    description:
      "Paneles perforados y grabados para revestimientos interiores y exteriores.",
    mediaId: "prod-paneles",
    tags: ["Decorativo", "Termolacado"],
  },
  {
    slug: "portones",
    name: "Portones",
    description:
      "Portones modernos, robustos y seguros, fabricados para durar décadas.",
    mediaId: "prod-portones",
    tags: ["Seguridad", "Residencial / Industrial"],
  },
  {
    slug: "rejas-modernas",
    name: "Rejas Modernas",
    description:
      "Rejas de diseño contemporáneo que combinan estética y protección.",
    mediaId: "prod-rejas",
    tags: ["Diseño", "Exterior"],
  },
  {
    slug: "piezas-industriales",
    name: "Piezas Industriales",
    description:
      "Componentes y repuestos de precisión para mantención y producción.",
    mediaId: "prod-piezas",
    tags: ["Precisión", "Repuestos"],
  },
  {
    slug: "fabricacion-a-medida",
    name: "Fabricación a Medida",
    description:
      "¿Tienes un plano o una idea? La transformamos en una pieza real.",
    mediaId: "prod-custom",
    tags: ["Custom", "Llave en mano"],
  },
] as const;
