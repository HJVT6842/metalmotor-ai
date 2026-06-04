import type { Product } from "@/types";

/**
 * Premium product line for the product showcase.
 * `image` points at a generated reference visual (see src/data/media.ts and
 * public/images/reference/products). Replace with a real photo under
 * /images/real/products and the card upgrades automatically.
 */
export const PRODUCTS: readonly Product[] = [
  {
    slug: "celosias-decorativas",
    name: "Celosías Decorativas",
    description:
      "Control solar y privacidad con diseño arquitectónico, a medida para tu fachada.",
    image: "/images/reference/products/celosias-decorativas.svg",
    tags: ["Fachadas", "A medida"],
  },
  {
    slug: "paneles-metalicos",
    name: "Paneles Metálicos",
    description:
      "Paneles perforados y grabados para revestimientos interiores y exteriores.",
    image: "/images/reference/products/paneles-metalicos.svg",
    tags: ["Decorativo", "Termolacado"],
  },
  {
    slug: "portones",
    name: "Portones",
    description:
      "Portones modernos, robustos y seguros, fabricados para durar décadas.",
    image: "/images/reference/products/portones.svg",
    tags: ["Seguridad", "Residencial / Industrial"],
  },
  {
    slug: "rejas-modernas",
    name: "Rejas Modernas",
    description:
      "Rejas de diseño contemporáneo que combinan estética y protección.",
    image: "/images/reference/products/rejas-modernas.svg",
    tags: ["Diseño", "Exterior"],
  },
  {
    slug: "piezas-industriales",
    name: "Piezas Industriales",
    description:
      "Componentes y repuestos de precisión para mantención y producción.",
    image: "/images/reference/products/piezas-industriales.svg",
    tags: ["Precisión", "Repuestos"],
  },
  {
    slug: "fabricacion-a-medida",
    name: "Fabricación a Medida",
    description:
      "¿Tienes un plano o una idea? La transformamos en una pieza real.",
    image: "/images/reference/products/fabricacion-a-medida.svg",
    tags: ["Custom", "Llave en mano"],
  },
] as const;
