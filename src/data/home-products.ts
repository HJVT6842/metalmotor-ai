/**
 * Home / consumer product line ("Productos") — LOCAL MOCK DATA.
 *
 * This is the new retail line fabricated by MetalMotor (BBQ, exterior, kitchen,
 * home). It is intentionally decoupled from the industrial `featured-products.ts`
 * and `media.ts` catalogues.
 *
 * SHOPIFY SWAP (later): every screen reads the catalogue through the accessor
 * functions at the bottom of this file (getAllCategories, getProductBySlug…).
 * To go live with Shopify you only replace the CATEGORIES/PRODUCTS arrays (or
 * make the accessors async and fetch), and nothing in the UI has to change.
 *
 * IMAGES: `images` holds the photo paths under
 * `/public/images/productos/<categorySlug>/<slug>-N.webp` (see `imageSet`).
 * A product with no photos yet keeps an empty array and the UI renders a
 * premium gradient placeholder. Declaring the convention paths before the
 * files land is safe: <ProductMedia> falls back to that same placeholder if an
 * asset 404s, so a missing photo degrades gracefully instead of showing a
 * broken image. Drop the real `.webp` files to swap them in; no code change.
 */

export type StockStatus = "in_stock" | "made_to_order" | "coming_soon";

export type ProductCategory = {
  readonly slug: string;
  readonly name: string;
  /** One-line hook shown on the big category block. */
  readonly tagline: string;
  /** Short paragraph for the category hero. Keep it minimal. */
  readonly description: string;
  /** Future hero image path; empty → gradient placeholder. */
  readonly image: string;
};

export type Product = {
  readonly id: string;
  readonly sku: string;
  readonly categorySlug: string;
  readonly slug: string;
  readonly name: string;
  readonly material: string;
  readonly thickness: string;
  readonly dimensions: string;
  readonly shortDescription: string;
  readonly deliveryTime: string;
  readonly stockStatus: StockStatus;
  /** Placeholder price in CLP; null while pricing is pending. */
  readonly price: number | null;
  /** Future photo paths; empty → gradient placeholder. */
  readonly images: readonly string[];
  /** Curated highlights on the landing "Productos destacados" block. */
  readonly featured?: boolean;
};

export const CATEGORIES: readonly ProductCategory[] = [
  {
    slug: "bbq",
    name: "BBQ",
    tagline: "Parrillas y discos para el asado perfecto",
    description:
      "Parrillas, discos y accesorios en acero, diseñados para durar y pensados para el ritual del asado.",
    image: "",
  },
  {
    slug: "fogones-exterior",
    name: "Fogones y Exterior",
    tagline: "Fuego y acero para tus espacios al aire libre",
    description:
      "Fogones, braseros y leñeros que transforman el patio en un punto de encuentro.",
    image: "",
  },
  {
    slug: "cocina",
    name: "Cocina",
    tagline: "Planchas y utensilios de acero para cocinar",
    description:
      "Piezas de acero robusto que llevan la calidad del taller a tu cocina.",
    image: "",
  },
  {
    slug: "accesorios-bbq",
    name: "Accesorios BBQ",
    tagline: "Los detalles que completan tu asado",
    description:
      "Herramientas, rejillas y complementos fabricados con el mismo acero de nuestras parrillas.",
    image: "",
  },
  {
    slug: "hogar",
    name: "Hogar",
    tagline: "Diseño en acero para tu espacio",
    description:
      "Piezas de diseño propio, cortadas a láser, que dan carácter a cada rincón.",
    image: "",
  },
];

/**
 * Builds the convention image paths for a product:
 * `/images/productos/<categorySlug>/<slug>-N.webp` (N = 1..count).
 * Keeps the naming in one place so declaring photos is typo-proof.
 */
function imageSet(
  categorySlug: string,
  slug: string,
  count = 3,
): readonly string[] {
  return Array.from(
    { length: count },
    (_, i) => `/images/productos/${categorySlug}/${slug}-${i + 1}.webp`,
  );
}

export const PRODUCTS: readonly Product[] = [
  // ── BBQ ──────────────────────────────────────────────────────────────────
  {
    id: "bbq-parrilla-desarmable-60x40",
    sku: "MM-BBQ-001",
    categorySlug: "bbq",
    slug: "parrilla-desarmable-60x40",
    name: "Parrilla Desarmable 60x40",
    material: "Acero al carbono",
    thickness: "6 mm",
    dimensions: "60 × 40 × 25 cm",
    shortDescription:
      "Parrilla armable de acero macizo. Se guarda plana y se monta en segundos.",
    deliveryTime: "7 a 10 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: imageSet("bbq", "parrilla-desarmable-60x40"),
    featured: true,
  },
  {
    id: "bbq-parrilla-desarmable-300x300",
    sku: "MM-BBQ-004",
    categorySlug: "bbq",
    slug: "parrilla-desarmable-300x300",
    name: "Parrilla Desarmable 300x300",
    material: "Acero al carbono",
    thickness: "6 mm",
    dimensions: "30 × 30 × 25 cm",
    shortDescription:
      "Parrilla desarmable cuadrada de acero macizo. Compacta, se guarda plana y se monta en segundos.",
    deliveryTime: "7 a 10 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: imageSet("bbq", "parrilla-desarmable-300x300"),
    featured: true,
  },
  {
    id: "bbq-disco-asado-48-tapa",
    sku: "MM-BBQ-002",
    categorySlug: "bbq",
    slug: "disco-para-asado-48-con-tapa",
    name: "Disco para Asado 48 con Tapa",
    material: "Acero al carbono",
    thickness: "4 mm",
    dimensions: "Ø 48 cm",
    shortDescription:
      "Disco de cocción con tapa y agarraderas. Ideal para exterior.",
    deliveryTime: "7 a 10 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: imageSet("bbq", "disco-para-asado-48-con-tapa", 4),
    featured: true,
  },

  // ── Fogones y Exterior ─────────────────────────────────────────────────────
  {
    id: "fogon-multifuncion-60",
    sku: "MM-FOG-001",
    categorySlug: "fogones-exterior",
    slug: "fogon-multifuncion-60",
    name: "Fogón Multifunción 60",
    material: "Acero al carbono",
    thickness: "5 mm",
    dimensions: "60 × 60 × 40 cm",
    shortDescription:
      "Fogón, parrilla y mesa en una sola pieza. El centro del patio.",
    deliveryTime: "10 a 14 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: imageSet("fogones-exterior", "fogon-multifuncion-60", 5),
    featured: true,
  },
  {
    id: "fogon-brasero-circular-50",
    sku: "MM-FOG-002",
    categorySlug: "fogones-exterior",
    slug: "brasero-circular-50",
    name: "Brasero Circular 50",
    material: "Acero al carbono",
    thickness: "4 mm",
    dimensions: "Ø 50 × 35 cm",
    shortDescription: "Brasero de líneas limpias para calor y ambiente.",
    deliveryTime: "7 a 10 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: [],
  },
  {
    id: "fogon-lenero-acero",
    sku: "MM-FOG-003",
    categorySlug: "fogones-exterior",
    slug: "lenero-de-acero",
    name: "Leñero de Acero",
    material: "Acero al carbono",
    thickness: "3 mm",
    dimensions: "80 × 40 × 90 cm",
    shortDescription:
      "Organiza y luce tu leña con una pieza estructural minimalista.",
    deliveryTime: "10 a 14 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: [],
  },

  // ── Cocina ─────────────────────────────────────────────────────────────────
  {
    id: "cocina-plancha-40x30",
    sku: "MM-COC-001",
    categorySlug: "cocina",
    slug: "plancha-de-cocina-40x30",
    name: "Plancha de Cocina 40x30",
    material: "Acero al carbono",
    thickness: "6 mm",
    dimensions: "40 × 30 cm",
    shortDescription:
      "Plancha maciza de cocción uniforme para cocina o exterior.",
    deliveryTime: "7 a 10 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: [],
  },
  {
    id: "cocina-plancha-doble",
    sku: "MM-COC-002",
    categorySlug: "cocina",
    slug: "plancha-doble-quemador",
    name: "Plancha Doble Quemador",
    material: "Acero al carbono",
    thickness: "6 mm",
    dimensions: "60 × 30 cm",
    shortDescription:
      "Cubre dos quemadores. Superficie amplia para cocinar en grande.",
    deliveryTime: "7 a 10 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: [],
  },

  // ── Accesorios BBQ ───────────────────────────────────────────────────────────
  {
    id: "acc-set-herramientas",
    sku: "MM-ACC-001",
    categorySlug: "accesorios-bbq",
    slug: "set-de-herramientas-asador",
    name: "Set de Herramientas Asador",
    material: "Acero inoxidable",
    thickness: "3 mm",
    dimensions: "Pinza, tenedor y espátula",
    shortDescription:
      "Set esencial del asador, con acabado y peso profesional.",
    deliveryTime: "5 a 7 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: [],
  },
  {
    id: "acc-atizador",
    sku: "MM-ACC-002",
    categorySlug: "accesorios-bbq",
    slug: "atizador-de-acero",
    name: "Atizador de Acero",
    material: "Acero al carbono",
    thickness: "8 mm",
    dimensions: "70 cm",
    shortDescription: "Atizador robusto para controlar las brasas con precisión.",
    deliveryTime: "5 a 7 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: [],
  },
  {
    id: "acc-rejilla-60x40",
    sku: "MM-ACC-003",
    categorySlug: "accesorios-bbq",
    slug: "rejilla-adicional-60x40",
    name: "Rejilla Adicional 60x40",
    material: "Acero al carbono",
    thickness: "6 mm",
    dimensions: "60 × 40 cm",
    shortDescription: "Rejilla de repuesto o extra para tu parrilla desarmable.",
    deliveryTime: "5 a 7 días hábiles",
    stockStatus: "in_stock",
    price: null,
    images: [],
  },

  // ── Hogar ────────────────────────────────────────────────────────────────────
  {
    id: "hogar-numero-casa",
    sku: "MM-HOG-001",
    categorySlug: "hogar",
    slug: "numero-de-casa-personalizado",
    name: "Número de Casa Personalizado",
    material: "Acero corten / inoxidable",
    thickness: "3 mm",
    dimensions: "A medida",
    shortDescription:
      "Números y letras cortados a láser. Diseño propio, a tu medida.",
    deliveryTime: "7 a 10 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: imageSet("hogar", "numero-de-casa-personalizado"),
    featured: true,
  },
  {
    id: "hogar-repisa-flotante",
    sku: "MM-HOG-002",
    categorySlug: "hogar",
    slug: "repisa-flotante-de-acero",
    name: "Repisa Flotante de Acero",
    material: "Acero al carbono",
    thickness: "3 mm",
    dimensions: "60 × 20 cm",
    shortDescription: "Repisa minimalista de montaje oculto. Líneas puras.",
    deliveryTime: "7 a 10 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: [],
  },
  {
    id: "hogar-perchero-pared",
    sku: "MM-HOG-003",
    categorySlug: "hogar",
    slug: "perchero-de-pared-minimalista",
    name: "Perchero de Pared Minimalista",
    material: "Acero al carbono",
    thickness: "3 mm",
    dimensions: "50 × 12 cm",
    shortDescription: "Perchero de líneas limpias, cortado y plegado a medida.",
    deliveryTime: "5 a 7 días hábiles",
    stockStatus: "made_to_order",
    price: null,
    images: [],
  },
  {
    id: "hogar-portavelas",
    sku: "MM-HOG-004",
    categorySlug: "hogar",
    slug: "portavelas-geometrico",
    name: "Portavelas Geométrico",
    material: "Acero inoxidable",
    thickness: "2 mm",
    dimensions: "15 × 15 cm",
    shortDescription: "Objeto de diseño geométrico para dar calidez al espacio.",
    deliveryTime: "5 a 7 días hábiles",
    stockStatus: "in_stock",
    price: null,
    images: [],
  },
];

/** Human labels for the stock status (kept minimal — no loud badges). */
export const STOCK_LABEL: Record<StockStatus, string> = {
  in_stock: "Disponible",
  made_to_order: "Fabricación a pedido",
  coming_soon: "Muy pronto",
};

// ── Accessors (the ONLY surface the UI depends on — Shopify-swap ready) ───────

export function getAllCategories(): readonly ProductCategory[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllProducts(): readonly Product[] {
  return PRODUCTS;
}

export function getProductsByCategory(
  categorySlug: string,
): readonly Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function getProductBySlug(
  categorySlug: string,
  slug: string,
): Product | undefined {
  return PRODUCTS.find(
    (p) => p.categorySlug === categorySlug && p.slug === slug,
  );
}

export function getFeaturedProducts(): readonly Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

/** Same-category products, excluding the current one. */
export function getRelatedProducts(
  product: Product,
  limit = 3,
): readonly Product[] {
  return PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
  ).slice(0, limit);
}

/** Formats a CLP price, or a graceful placeholder while pricing is pending. */
export function formatPrice(price: number | null): string {
  if (price === null) return "Precio a confirmar";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}
