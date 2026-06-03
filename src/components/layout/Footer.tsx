import { Container } from "@/components/ui/Container";
import { NAV_LINKS, SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

/** Site footer with contact details, navigation and legal line. */
export function Footer() {
  const year = new Date().getFullYear();
  const whatsappHref = buildWhatsAppUrl(SITE.whatsappNumber, quotationMessage());

  return (
    <footer className="mt-auto border-t border-steel-800 bg-steel-950 text-steel-300">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white font-bold text-steel-900">
              M
            </span>
            <span className="text-lg font-bold text-white">{SITE.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-steel-400">
            {SITE.legalName}. {SITE.tagline}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
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
              <a href={`mailto:${SITE.email}`} className="hover:text-white">
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
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

      <div className="border-t border-steel-800">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-steel-500 sm:flex-row">
          <p>
            © {year} {SITE.legalName}. Todos los derechos reservados.
          </p>
          <p>Corte láser CNC · Fabricación metálica · Santiago, Chile</p>
        </Container>
      </div>
    </footer>
  );
}
