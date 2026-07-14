import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Premium, airy hero for the /productos landing. Product line, not services. */
export function ProductsHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"
        aria-hidden
      />

      <Container className="relative flex min-h-[72vh] flex-col justify-center py-24 sm:py-32">
        <Reveal className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-brand-400">
            <span className="h-px w-8 bg-brand-500" aria-hidden />
            Productos MetalMotor
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Productos diseñados y fabricados por MetalMotor.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel-300 sm:text-xl">
            Diseño en acero para el hogar, quinchos y exteriores.
          </p>
          <div className="mt-10">
            <LinkButton href="#categorias" variant="primary" size="lg">
              Explorar productos
              <ArrowRightIcon className="h-5 w-5" />
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
