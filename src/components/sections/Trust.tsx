import { Counter } from "@/components/animations/Counter";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/ui/icons";
import { STATS } from "@/data/testimonials";

const CREDENTIALS = [
  "Años de experiencia",
  "Manufactura de precisión",
  "Diseño CAD",
  "Tecnología CNC",
  "Calidad industrial",
] as const;

/** Credibility band: animated counters + credential chips. */
export function Trust() {
  return (
    <section className="relative overflow-hidden bg-steel-900/40 py-16">
      <div className="bg-grid absolute inset-0 opacity-50" aria-hidden />
      <Container className="relative">
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="text-center">
              <dt className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                <Counter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dt>
              <dd className="mt-2 text-sm font-medium text-steel-400">
                {stat.label}
              </dd>
            </Reveal>
          ))}
        </dl>

        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {CREDENTIALS.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 text-sm text-steel-300"
            >
              <CheckIcon className="h-4 w-4 text-brand-400" />
              {item}
            </span>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
