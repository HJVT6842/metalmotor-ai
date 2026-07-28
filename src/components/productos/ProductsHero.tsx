import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ProductMedia } from "@/components/productos/ProductMedia";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Attributes the hero must transmit at a glance — quiet, not a collage. */
const ATTRS = ["BBQ", "Exterior", "Acero", "Fabricación nacional"] as const;

/**
 * Premium landing hero for the retail line. Editorial two-column composition:
 * the promise on the left (eyebrow → title → description → attributes → CTA),
 * a single protagonist product shot on the right. Collapses to a stacked,
 * text-first single column below `lg`. Image is drawn from the existing catalog
 * (`bbq/cover.webp`) — no stock, no collage.
 */
export function ProductsHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"
        aria-hidden
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Promise */}
          <Reveal className="max-w-xl">
            <p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
              <span className="h-px w-6 bg-brand-500" aria-hidden />
              Productos MetalMotor
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Productos diseñados y fabricados por MetalMotor.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel-300 sm:text-xl">
              Fabricados en acero para el hogar, el quincho y el exterior.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Atributos">
              {ATTRS.map((attr) => (
                <li
                  key={attr}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-steel-300 backdrop-blur-sm"
                >
                  {attr}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <LinkButton href="#categorias" variant="primary" size="lg">
                Explorar productos
                <ArrowRightIcon className="h-5 w-5" />
              </LinkButton>
            </div>
          </Reveal>

          {/* Protagonist */}
          <Reveal delay={0.12} className="relative">
            {/* Molten bloom anchoring the shot to the brand, behind the frame. */}
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-brand-500/20 blur-3xl"
              aria-hidden
            />
            <ProductMedia
              src="/images/productos/bbq/cover.webp"
              alt="Producto MetalMotor en acero, fabricación nacional"
              fit="cover"
              frame="square"
              rounded="rounded-3xl"
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              background="bg-steel-900"
              className="border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] lg:aspect-[4/5]"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10"
                aria-hidden
              />
            </ProductMedia>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
