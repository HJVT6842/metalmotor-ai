import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ServiceGlyph } from "@/components/ui/icons";
import { PROCESS } from "@/data/process";

/** Visual 6-step timeline from plan to delivery. */
export function Process() {
  return (
    <Section id="proceso" className="bg-steel-900/40">
      <SectionHeading
        eyebrow="Proceso"
        title={
          <>
            De la idea a la pieza,{" "}
            <span className="text-gradient-brand">en 6 pasos</span>
          </>
        }
        description="Un flujo claro y trazable, con control en cada etapa."
      />

      <Stagger
        className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        stagger={0.1}
      >
        {PROCESS.map((step) => (
          <StaggerItem key={step.step}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-steel-900/50 p-6 transition-colors duration-300 hover:border-brand-500/40">
              <span
                aria-hidden
                className="absolute -right-2 -top-3 text-7xl font-black text-white/5 transition-colors group-hover:text-brand-500/10"
              >
                {step.step}
              </span>
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 ring-1 ring-inset ring-brand-500/30">
                  <ServiceGlyph name={step.icon} className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-400">
                  Paso {step.step}
                </p>
                <h3 className="mt-1 text-base font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-400">
                  {step.description}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
