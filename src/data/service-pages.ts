/**
 * Dedicated SEO landing pages per service (top-level routes like /corte-laser-cnc).
 * Content is keyword-rich and Chile-local. Imagery reuses the media catalogue.
 * These pages are additive — they do not alter the main landing.
 */

export type ServicePage = {
  readonly slug: string;
  /** H1 / nombre del servicio. */
  readonly name: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly keywords: readonly string[];
  /** Id en src/data/media.ts para la imagen principal. */
  readonly mediaId: string;
  /** Párrafos de introducción (con keywords locales naturales). */
  readonly intro: readonly string[];
  /** "¿Qué incluye?" — viñetas. */
  readonly includes: readonly string[];
  /** Slugs de servicios relacionados (enlazado interno). */
  readonly related: readonly string[];
};

export const SERVICE_PAGES: readonly ServicePage[] = [
  {
    slug: "corte-laser-cnc",
    name: "Corte Láser CNC",
    metaTitle: "Corte Láser CNC en Santiago y Buin | Acero, Inox y Aluminio",
    metaDescription:
      "Servicio de corte láser CNC de fibra en Santiago, Buin y Región Metropolitana. Cortamos acero, inoxidable, aluminio y galvanizado con precisión. Cotiza por WhatsApp.",
    keywords: [
      "corte láser cnc chile",
      "corte láser cnc santiago",
      "corte láser cnc buin",
      "corte láser fibra",
      "corte láser acero inoxidable",
    ],
    mediaId: "svc-corte-laser",
    intro: [
      "En Metal Motor realizamos corte láser CNC de fibra en Santiago, Buin y toda la Región Metropolitana, con entrega y despacho a regiones de Chile. Transformamos tus planos o ideas en piezas metálicas de precisión.",
      "Cortamos acero, acero inoxidable, aluminio y acero galvanizado en espesores aproximados de 0,5 a 20 mm, con bordes limpios y tolerancias finas para producción seriada o piezas únicas.",
    ],
    includes: [
      "Corte de alta precisión en metales ferrosos y no ferrosos",
      "Optimización de material para series",
      "A partir de tus archivos CAD (DXF/DWG) o de un boceto",
      "Asesoría técnica para fabricación",
    ],
    related: ["celosias-metalicas", "portones-metalicos", "diseno-cad"],
  },
  {
    slug: "celosias-metalicas",
    name: "Celosías Metálicas",
    metaTitle: "Celosías Metálicas a Medida en Santiago | Fachadas y Diseño",
    metaDescription:
      "Fabricación de celosías metálicas decorativas a medida en Santiago y Región Metropolitana. Control solar, privacidad y diseño arquitectónico. Cotiza por WhatsApp.",
    keywords: [
      "celosías metálicas",
      "celosías metálicas santiago",
      "celosías decorativas",
      "celosías para fachada",
    ],
    mediaId: "prod-celosias",
    intro: [
      "Fabricamos celosías metálicas decorativas a medida en Santiago, Buin y la Región Metropolitana, ideales para fachadas ventiladas, control solar, privacidad y proyectos arquitectónicos.",
      "Cortadas con láser CNC a partir de tu diseño o de nuestros patrones, en acero, galvanizado o aluminio, con terminaciones pintadas o termolacadas para interior y exterior.",
    ],
    includes: [
      "Patrones personalizados o de catálogo",
      "Estructuras livianas y resistentes",
      "Terminaciones para exterior",
      "Instalación en fachadas y cierres",
    ],
    related: ["paneles-decorativos", "corte-laser-cnc", "portones-metalicos"],
  },
  {
    slug: "portones-metalicos",
    name: "Portones Metálicos",
    metaTitle: "Portones Metálicos a Medida en Santiago y Buin | Rejas Modernas",
    metaDescription:
      "Fabricación de portones metálicos y rejas modernas a medida en Santiago, Buin y Región Metropolitana. Diseño contemporáneo, seguros y duraderos. Cotiza por WhatsApp.",
    keywords: [
      "portones metálicos",
      "portones metálicos santiago",
      "rejas metálicas modernas",
      "portones a medida",
    ],
    mediaId: "prod-portones",
    intro: [
      "Diseñamos y fabricamos portones metálicos y rejas modernas a medida en Santiago, Buin y la Región Metropolitana, para viviendas, edificios e industria.",
      "Combinamos corte láser, plegado y soldadura para entregar portones seguros, robustos y de estética contemporánea, fabricados para durar.",
    ],
    includes: [
      "Diseño contemporáneo a medida",
      "Alta durabilidad y seguridad",
      "Acabados resistentes a la intemperie",
      "Residencial e industrial",
    ],
    related: ["celosias-metalicas", "soldadura-mig-tig", "corte-laser-cnc"],
  },
  {
    slug: "soldadura-mig-tig",
    name: "Soldadura MIG / TIG",
    metaTitle: "Soldadura MIG y TIG en Santiago | Estructuras e Inoxidable",
    metaDescription:
      "Servicio de soldadura MIG y TIG en Santiago, Buin y Región Metropolitana. Estructuras de acero, acero inoxidable y terminaciones de precisión. Cotiza por WhatsApp.",
    keywords: [
      "soldadura mig tig",
      "soldadura mig tig santiago",
      "soldadura acero inoxidable",
      "soldadura estructuras metálicas",
    ],
    mediaId: "svc-soldadura",
    intro: [
      "Realizamos soldadura MIG y TIG en Santiago, Buin y la Región Metropolitana, para estructuras de acero, conjuntos soldados y piezas de acero inoxidable.",
      "La soldadura MIG nos permite producción rápida y limpia; la TIG, terminaciones finas y de alta calidad en inoxidable. Armamos y ensamblamos conjuntos completos.",
    ],
    includes: [
      "Soldadura MIG para producción",
      "Soldadura TIG para terminaciones finas",
      "Estructuras y conjuntos de acero",
      "Acero inoxidable",
    ],
    related: ["corte-laser-cnc", "portones-metalicos", "diseno-cad"],
  },
  {
    slug: "diseno-cad",
    name: "Diseño CAD Industrial",
    metaTitle: "Diseño CAD Industrial en Santiago | Planos para Fabricación",
    metaDescription:
      "Diseño CAD industrial 2D y 3D en Santiago y Región Metropolitana. Optimizamos tu pieza para corte láser y plegado, con planos listos para fabricación. Cotiza por WhatsApp.",
    keywords: [
      "diseño cad industrial",
      "diseño cad santiago",
      "planos para fabricación metálica",
      "ingeniería inversa",
    ],
    mediaId: "svc-cad",
    intro: [
      "Ofrecemos diseño CAD industrial en Santiago, Buin y la Región Metropolitana, para llevar tu idea a un archivo listo para fabricación.",
      "Modelamos en 2D y 3D, optimizamos la pieza para corte láser y plegado, y entregamos planos técnicos. También realizamos ingeniería inversa de piezas existentes.",
    ],
    includes: [
      "Modelado 2D y 3D",
      "Optimización para corte y plegado",
      "Entrega de planos técnicos",
      "Ingeniería inversa",
    ],
    related: ["corte-laser-cnc", "soldadura-mig-tig", "celosias-metalicas"],
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return SERVICE_PAGES.find((p) => p.slug === slug);
}
