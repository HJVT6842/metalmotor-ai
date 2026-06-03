import { ContactForm } from "@/components/ContactForm";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SITE } from "@/data/site";

/** Contact section: lead form on the left, direct contact details on the right. */
export function ContactSection() {
  return (
    <Section id="contacto" className="bg-steel-50">
      <SectionHeading
        eyebrow="Contacto"
        title="Solicita tu cotización"
        description="Completa el formulario o escríbenos directamente por WhatsApp. Respondemos rápido."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-5">
        <div className="rounded-2xl border border-steel-200 bg-white p-6 sm:p-8 lg:col-span-3">
          <ContactForm />
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-steel-900 p-6 text-white sm:p-8">
            <h3 className="text-xl font-bold">Contacto directo</h3>
            <p className="mt-2 text-sm text-steel-300">
              ¿Prefieres hablar ahora? Estás a un clic de WhatsApp.
            </p>
            <div className="mt-5">
              <WhatsAppCta label="Escribir por WhatsApp" />
            </div>

            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-steel-400">Correo</dt>
                <dd>
                  <a href={`mailto:${SITE.email}`} className="hover:underline">
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-steel-400">Ubicación</dt>
                <dd>
                  {SITE.address.city}, {SITE.address.region}, {SITE.address.country}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-steel-400">Horario</dt>
                <dd>{SITE.hours}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
