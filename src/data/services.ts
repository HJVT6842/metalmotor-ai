import type { Service } from "@/types";

/**
 * The full Metal Motor service catalogue (12 services).
 * Static for the MVP; later phases may source these from Supabase.
 */
export const SERVICES: readonly Service[] = [
  {
    slug: "corte-laser-cnc",
    title: "Corte Láser CNC de Fibra",
    summary:
      "Corte de alta precisión en acero, inoxidable, aluminio y galvanizado desde tus planos.",
    highlights: ["Tolerancias finas", "Espesores 0,5–20 mm"],
    icon: "laser",
  },
  {
    slug: "fabricacion-metalica",
    title: "Fabricación Metálica",
    summary:
      "Fabricación integral de piezas y conjuntos metálicos con acabado industrial.",
    highlights: ["Proyectos llave en mano", "Series y unitarios"],
    icon: "fabrication",
  },
  {
    slug: "paneles-decorativos",
    title: "Paneles Metálicos Decorativos",
    summary:
      "Paneles perforados y grabados para fachadas, interiores y mobiliario de diseño.",
    highlights: ["Diseños a medida", "Termolacado"],
    icon: "panel",
  },
  {
    slug: "celosias-metalicas",
    title: "Celosías Metálicas",
    summary:
      "Control solar, ventilación y privacidad con estética arquitectónica.",
    highlights: ["Patrones personalizados", "Livianas y resistentes"],
    icon: "lattice",
  },
  {
    slug: "portones",
    title: "Portones y Rejas",
    summary:
      "Portones y rejas modernas, seguras y a medida para hogar e industria.",
    highlights: ["Diseño contemporáneo", "Alta durabilidad"],
    icon: "gate",
  },
  {
    slug: "soldadura-mig",
    title: "Soldadura MIG",
    summary:
      "Soldadura MIG para producción y estructuras con uniones limpias y rápidas.",
    highlights: ["Ideal para series", "Estructuras de acero"],
    icon: "weld",
  },
  {
    slug: "soldadura-tig",
    title: "Soldadura TIG",
    summary:
      "Soldadura TIG de precisión para inoxidable y terminaciones finas.",
    highlights: ["Acabado de alta calidad", "Acero inoxidable"],
    icon: "weld",
  },
  {
    slug: "plegado-cnc",
    title: "Plegado CNC",
    summary:
      "Doblado de precisión en plegadora CNC con ángulos exactos y repetibles.",
    highlights: ["Repetibilidad", "Piezas multi-pliegue"],
    icon: "fold",
  },
  {
    slug: "piezas-a-medida",
    title: "Piezas Metálicas a Medida",
    summary:
      "Piezas personalizadas fabricadas según tus especificaciones exactas.",
    highlights: ["Prototipos y producción", "Cualquier complejidad"],
    icon: "parts",
  },
  {
    slug: "manufactura-industrial",
    title: "Manufactura Industrial",
    summary:
      "Producción seriada y soluciones de manufactura para empresas.",
    highlights: ["Volumen y consistencia", "Control de calidad"],
    icon: "industrial",
  },
  {
    slug: "diseno-cad",
    title: "Diseño CAD",
    summary:
      "Ingeniería y diseño CAD para llevar tu idea a un archivo listo para fabricar.",
    highlights: ["Modelado 2D y 3D", "Planos técnicos"],
    icon: "cad",
  },
  {
    slug: "ingenieria-inversa",
    title: "Ingeniería Inversa",
    summary:
      "Reconstruimos y digitalizamos piezas existentes para replicarlas o mejorarlas.",
    highlights: ["Digitalización", "Réplica y mejora"],
    icon: "reverse",
  },
] as const;
