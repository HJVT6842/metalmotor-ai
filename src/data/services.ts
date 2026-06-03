import type { Service } from "@/types";

/**
 * Core services offered by Metal Motor Services SpA.
 * Static for the MVP; later phases may source these from Supabase.
 */
export const SERVICES: readonly Service[] = [
  {
    slug: "corte-laser-cnc",
    title: "Corte láser CNC de fibra",
    summary:
      "Corte de alta precisión en acero, acero inoxidable, aluminio y galvanizado a partir de tus planos.",
    highlights: [
      "Tolerancias finas y bordes limpios",
      "Espesores desde 0,5 hasta 20 mm",
      "Optimización de material para series",
    ],
    icon: "laser",
  },
  {
    slug: "paneles-decorativos",
    title: "Paneles decorativos",
    summary:
      "Paneles metálicos perforados y grabados para fachadas, interiores y mobiliario de diseño.",
    highlights: [
      "Diseños a medida o catálogo",
      "Acabados pintados y termolacados",
      "Aplicaciones arquitectónicas",
    ],
    icon: "panel",
  },
  {
    slug: "celosias",
    title: "Celosías",
    summary:
      "Celosías metálicas para control solar, ventilación y privacidad con estética arquitectónica.",
    highlights: [
      "Patrones personalizados",
      "Estructuras livianas y resistentes",
      "Instalación en fachadas y cierres",
    ],
    icon: "lattice",
  },
  {
    slug: "plegado-cnc",
    title: "Plegado CNC (press brake)",
    summary:
      "Doblado de precisión en plegadora CNC para piezas y estructuras con ángulos exactos.",
    highlights: [
      "Repetibilidad en producción seriada",
      "Piezas complejas multi-pliegue",
      "Compatible con tu corte láser",
    ],
    icon: "fold",
  },
  {
    slug: "soldadura-mig-tig",
    title: "Soldadura MIG / TIG",
    summary:
      "Uniones soldadas de calidad para estructuras, conjuntos y piezas de acero inoxidable.",
    highlights: [
      "Soldadura MIG para producción",
      "Soldadura TIG para terminaciones finas",
      "Armado y ensamblaje de conjuntos",
    ],
    icon: "weld",
  },
  {
    slug: "diseno-cad",
    title: "Diseño CAD",
    summary:
      "Ingeniería y diseño CAD para llevar tu idea a un archivo listo para fabricación.",
    highlights: [
      "Modelado 2D y 3D",
      "Optimización para corte y plegado",
      "Entrega de planos técnicos",
    ],
    icon: "cad",
  },
] as const;
