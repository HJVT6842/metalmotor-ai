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

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "contacto@metalmotor.cl";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://metalmotor.cl";

export const SITE = {
  name: "Metal Motor",
  legalName: "Metal Motor Services SpA",
  /** Short value proposition used in hero + meta description. */
  tagline: "Corte láser CNC y fabricación metálica de precisión",
  description:
    "Metal Motor Services SpA — corte láser CNC de fibra, paneles decorativos, celosías, plegado, soldadura MIG/TIG y diseño CAD. Soluciones metálicas a medida con acabado profesional.",
  url: SITE_URL,
  email: CONTACT_EMAIL,
  phoneDisplay: "+56 9 0000 0000",
  whatsappNumber: WHATSAPP_NUMBER,
  address: {
    city: "Santiago",
    region: "Región Metropolitana",
    country: "Chile",
  },
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
