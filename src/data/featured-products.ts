/**
 * Featured products grid (home, directly below the hero).
 *
 * Each card shows a main render and, on hover-capable devices, crossfades to a
 * related second view (`hoverMediaId`). Both ids resolve through the central
 * media catalogue (src/data/media.ts). A hover id MUST be an ACTIVE render —
 * never a Wikimedia reference, never an unactivated id — so the second view is
 * always a render propio. featured-products.test.ts enforces this.
 */
export type FeaturedProduct = {
  readonly mediaId: string;
  readonly name: string;
  /** Optional second image shown on hover/focus (hover-capable devices only). */
  readonly hoverMediaId?: string;
};

export const FEATURED_PRODUCTS: readonly FeaturedProduct[] = [
  { mediaId: "prod-celosias", name: "Celosías Decorativas", hoverMediaId: "svc-celosias" },
  { mediaId: "prod-portones", name: "Portones", hoverMediaId: "svc-portones" },
  { mediaId: "prod-paneles", name: "Paneles Decorativos", hoverMediaId: "svc-paneles" },
  // prod-separadores: sin hover — prod-separadores-oficina sigue en reserva
  // (renders-output/approved-reserve/), aún sin wiring en el catálogo.
  { mediaId: "prod-separadores", name: "Separadores de Ambientes" },
];
