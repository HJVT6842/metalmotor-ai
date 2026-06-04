import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ServiceGlyph } from "@/components/ui/icons";
import { SERVICES } from "@/data/services";

/** Grid of all 12 services with staggered reveal and hover glow. */
export function Services() {
  return (
    <Section id="servicios" className="relative bg-steel-950">
      <SectionHeading
        eyebrow="Servicios"
        title={
          <>
            Todo el proceso metálico,{" "}
            <span className="text-gradient-brand">un solo proveedor</span>
          </>
        }
        description="Del diseño CAD a la pieza terminada, con tecnología CNC y control de calidad industrial."
      />

      <Stagger
        className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {SERVICES.map((service) => (
          <StaggerItem key={service.slug}>
            <article className="group h-full rounded-2xl border border-white/10 bg-steel-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:bg-steel-900 hover:shadow-[0_0_40px_-12px_rgba(249,115,22,0.5)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-brand-400 ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                <ServiceGlyph name={service.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">
                {service.summary}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
