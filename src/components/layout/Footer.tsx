import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS, SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

const SERVICE_LINKS = [
  "Corte Láser CNC",
  "Celosías Metálicas",
  "Paneles Decorativos",
  "Soldadura MIG / TIG",
  "Diseño CAD",
] as const;

/** Site footer with brand, navigation, services and contact. */
export function Footer() {
  const year = new Date().getFullYear();
  const whatsappHref = buildWhatsAppUrl(SITE.whatsappNumber, quotationMessage());

  return (
    <footer className="bg-steel-950">
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600"
      />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo variant="horizontal" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel-400">
            {SITE.tagline}. Calidad industrial con acabado profesional en{" "}
            {SITE.address.country}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-steel-400 hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Servicios
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {SERVICE_LINKS.map((service) => (
              <li key={service}>
                <a
                  href="#servicios"
                  className="text-steel-400 hover:text-white"
                >
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="text-steel-400 hover:text-white"
              >
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-steel-400 hover:text-white"
              >
                WhatsApp: {SITE.phoneDisplay}
              </a>
            </li>
            <li className="text-steel-400">
              {SITE.address.city}, {SITE.address.country}
            </li>
            <li className="text-steel-400">{SITE.hours}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-steel-500 sm:flex-row">
          <p>
            © {year} {SITE.legalName}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/creditos" className="hover:text-steel-300">
              Créditos de imágenes
            </Link>
            <span>{SITE.address.city}, Chile</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
