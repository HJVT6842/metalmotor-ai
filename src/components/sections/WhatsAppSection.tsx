import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SITE } from "@/data/site";
import { buildWhatsAppUrl, quotationMessage } from "@/lib/whatsapp";

/** Large, unmissable WhatsApp conversion band. */
export function WhatsAppSection() {
  const href = buildWhatsAppUrl(SITE.whatsappNumber, quotationMessage());

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* Molten gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700"
      />
      <div className="bg-grid absolute inset-0 opacity-20" aria-hidden />
      <div
        aria-hidden
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"
      />

      <Container className="relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            ¿Necesitas una cotización rápida?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            Escríbenos por WhatsApp con tu plano o idea y te respondemos en menos
            de 24 horas.
          </p>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-steel-900 shadow-2xl transition-transform duration-300 hover:scale-105"
          >
            <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
            Enviar WhatsApp
          </a>

          <p className="mt-5 text-sm font-medium text-white/80">
            o llámanos: {SITE.phoneDisplay}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
