export type FaqItem = {
  readonly question: string;
  readonly answer: string;
};

/** Frequently asked questions (es-CL). Also emitted as FAQPage JSON-LD for SEO/AEO. */
export const FAQS: readonly FaqItem[] = [
  {
    question: "¿Hacen trabajos a medida?",
    answer:
      "Sí. Fabricamos desde una pieza única hasta producción en serie, a partir de tus planos, medidas o una idea.",
  },
  {
    question: "¿Cuánto demora una cotización?",
    answer:
      "Respondemos la mayoría de las solicitudes en menos de 24 horas. La vía más rápida es WhatsApp con tu plano o descripción.",
  },
  {
    question: "¿Trabajan con planos o también con ideas?",
    answer:
      "Con ambos. Si no tienes plano, nuestro equipo de diseño CAD te ayuda a definir y optimizar la pieza para fabricación.",
  },
  {
    question: "¿Qué materiales y espesores cortan?",
    answer:
      "Cortamos acero, acero inoxidable, aluminio y galvanizado, en espesores aproximados de 0,5 a 20 mm con corte láser de fibra CNC.",
  },
  {
    question: "¿Atienden a empresas y a particulares?",
    answer:
      "Sí. Trabajamos con constructoras, arquitectos, diseñadores e industria, y también con clientes particulares que necesitan fabricación a medida.",
  },
  {
    question: "¿Realizan despacho?",
    answer:
      "Coordinamos despacho o retiro según el proyecto y la ubicación. Cuéntanos dónde necesitas tu pedido y lo gestionamos.",
  },
  {
    question: "¿Cuál es la cantidad mínima?",
    answer:
      "Desde una sola pieza. Nos adaptamos tanto a proyectos puntuales como a producción de volumen.",
  },
] as const;
