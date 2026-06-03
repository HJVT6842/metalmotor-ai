import { Section, SectionHeading } from "@/components/ui/Section";
import { CheckIcon, ServiceGlyph } from "@/components/ui/icons";
import { SERVICES } from "@/data/services";

/** Grid of core services with highlights. */
export function Services() {
  return (
    <Section id="servicios" className="bg-white">
      <SectionHeading
        eyebrow="Lo que hacemos"
        title="Servicios de fabricación metálica"
        description="Un proveedor para todo el proceso: del diseño CAD a la pieza terminada."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <article
            key={service.slug}
            className="group flex flex-col rounded-2xl border border-steel-200 bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-steel-900 text-brand-500 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <ServiceGlyph name={service.icon} className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-steel-900">
              {service.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              {service.summary}
            </p>
            <ul className="mt-4 space-y-2">
              {service.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2 text-sm text-steel-700"
                >
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
