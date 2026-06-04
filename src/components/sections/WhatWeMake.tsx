import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CheckIcon } from "@/components/ui/icons";
import { FABRICATION_GROUPS } from "@/data/fabrication";

/** "Qué fabricamos" — concrete catalogue grouped by use case + custom CTA. */
export function WhatWeMake() {
  return (
    <Section id="que-fabricamos" className="bg-steel-900/40">
      <SectionHeading
        eyebrow="Qué fabricamos"
        title={
          <>
            Si es de metal,{" "}
            <span className="text-gradient-brand">lo fabricamos</span>
          </>
        }
        description="Desde piezas decorativas hasta estructuras y producción en serie."
      />

      <Stagger
        className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.08}
      >
        {FABRICATION_GROUPS.map((group) => (
          <StaggerItem key={group.title}>
            <div className="h-full rounded-2xl border border-white/10 bg-steel-900/60 p-6">
              <h3 className="text-base font-bold text-white">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-steel-300"
                  >
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-steel-900 to-steel-950 px-6 py-10 text-center">
        <h3 className="text-xl font-bold text-white sm:text-2xl">
          ¿No ves lo que buscas en la lista?
        </h3>
        <p className="max-w-xl text-steel-400">
          Trabajamos a medida según tu plano o idea. Cuéntanos tu proyecto y te
          cotizamos sin compromiso.
        </p>
        <WhatsAppCta label="Cotizar mi proyecto" />
      </div>
    </Section>
  );
}
