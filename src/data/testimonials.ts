import type { Stat, Testimonial } from "@/types";

/** Trust counters for the credibility section. */
export const STATS: readonly Stat[] = [
  { value: 500, prefix: "+", label: "Proyectos completados" },
  { value: 100, prefix: "+", label: "Clientes satisfechos" },
  { value: 99, suffix: "%", label: "Satisfacción" },
  { value: 24, suffix: "h", label: "Tiempo de respuesta" },
] as const;

/**
 * Representative Chilean client testimonials.
 * NOTE: illustrative examples for the MVP — replace with real, authorized
 * client quotes before relying on them commercially.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: "Camila Rojas",
    role: "Arquitecta",
    company: "Estudio RA Arquitectura",
    location: "Santiago",
    quote:
      "El nivel de detalle en las celosías superó lo que esperábamos. Cumplieron los plazos y el acabado es impecable.",
    rating: 5,
  },
  {
    name: "Joaquín Herrera",
    role: "Jefe de Proyectos",
    company: "Constructora Andes",
    location: "Providencia",
    quote:
      "Trabajan con precisión real de CNC. Los paneles llegaron exactos a plano y la instalación fue directa.",
    rating: 5,
  },
  {
    name: "Daniela Soto",
    role: "Diseñadora Industrial",
    company: "Soto Design",
    location: "Ñuñoa",
    quote:
      "Convirtieron mis bocetos en piezas metálicas perfectas. La asesoría en diseño CAD marcó la diferencia.",
    rating: 5,
  },
  {
    name: "Rodrigo Muñoz",
    role: "Jefe de Mantención",
    company: "Planta Industrial Maipú",
    location: "Maipú",
    quote:
      "Respuesta en menos de 24 horas y repuestos a medida que nos evitaron parar la línea. Muy recomendados.",
    rating: 5,
  },
] as const;
