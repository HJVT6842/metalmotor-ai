import type { NavLink } from "@/types";

/**
 * Central, static site configuration.
 *
 * Public, non-secret values may be overridden via NEXT_PUBLIC_* env vars so the
 * same build can be re-pointed (e.g. staging vs prod) without code changes.
 * Sensible placeholders keep local dev and the build working without env setup —
 * replace them before going live.
 */

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "56900000000";

/** Formatea un móvil chileno (56 9 XXXX XXXX) para mostrarlo; deriva del WhatsApp. */
function formatClPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("569")) {
    const rest = d.slice(3);
    return `+56 9 ${rest.slice(0, 4)} ${rest.slice(4)}`;
  }
  return `+${d}`;
}

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "contacto@metalmotor.cl";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.metalmotor.cl";

export const SITE = {
  name: "Metal Motor",
  legalName: "Metal Motor Services SpA",
  /** Short value proposition used in hero + meta description. */
  tagline: "Corte láser CNC y fabricación metálica de precisión",
  description:
    "Metal Motor Services SpA — corte láser CNC de fibra, paneles decorativos, celosías, plegado, soldadura MIG/TIG y diseño CAD. Soluciones metálicas a medida con acabado profesional.",
  url: SITE_URL,
  email: CONTACT_EMAIL,
  phoneDisplay: formatClPhone(WHATSAPP_NUMBER),
  whatsappNumber: WHATSAPP_NUMBER,
  address: {
    city: "Santiago",
    region: "Región Metropolitana",
    country: "Chile",
  },
  /** Ciudades atendidas (SEO local). */
  serviceCities: ["Santiago", "Buin", "Puente Alto", "Maipú", "San Bernardo"],
  /** Texto de cobertura para microcopys (SEO local, sin afirmar dirección física). */
  coverage:
    "Atendemos Santiago, Buin y toda la Región Metropolitana. Despacho a regiones de Chile.",
  hours: "Lunes a viernes, 9:00 – 18:00 hrs",
} as const;

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Productos", href: "#destacados" },
  { label: "Fabricamos", href: "#fabricamos" },
  { label: "Capacidad", href: "#capacidad" },
  { label: "Trabajos", href: "#trabajos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
] as const;
