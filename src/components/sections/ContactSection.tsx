import { ContactForm } from "@/components/ContactForm";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { Reveal } from "@/components/animations/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SITE } from "@/data/site";

/** Contact section: lead form + direct contact details. */
export function ContactSection() {
  return (
    <Section id="contacto" className="bg-steel-950">
      <SectionHeading
        eyebrow="Contacto"
        title={
          <>
            Solicita tu <span className="text-gradient-brand">cotización</span>
          </>
        }
        description="Completa el formulario o escríbenos directamente por WhatsApp. Respondemos rápido."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-5">
        <Reveal className="rounded-2xl border border-white/10 bg-steel-900/50 p-6 sm:p-8 lg:col-span-3">
          <ContactForm />
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-br from-steel-900 to-steel-950 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white">Contacto directo</h3>
            <p className="mt-2 text-sm text-steel-400">
              ¿Prefieres hablar ahora? Estás a un clic de WhatsApp.
            </p>
            <div className="mt-5">
              <WhatsAppCta label="Escribir por WhatsApp" />
            </div>

            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-steel-500">Correo</dt>
                <dd>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-steel-200 hover:text-white"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-steel-500">Ubicación</dt>
                <dd className="text-steel-200">
                  {SITE.address.city}, {SITE.address.region},{" "}
                  {SITE.address.country}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-steel-500">Horario</dt>
                <dd className="text-steel-200">{SITE.hours}</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
