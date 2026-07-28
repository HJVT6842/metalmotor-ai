import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ProductMedia } from "@/components/productos/ProductMedia";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * The retail line, at a glance.
 *
 * TEMPORARY VISUAL — the definitive hero is a single wide editorial photograph
 * of the whole line together (parrilla + fogón + disco + accesorios in one
 * steel-and-fire scene). That shot doesn't exist yet, so we use the strongest
 * premium scene we already have and let the copy + the LINE index carry the
 * breadth: the reader learns "MetalMotor fabrica una línea completa en acero"
 * from the words, not from a single product. When the real photograph lands,
 * swap ONLY `HERO_IMAGE` — the composition, the frame and the layout stay.
 *
 * (Deliberately NOT a collage/mosaic: one dominant frame reads as a brand
 * statement; tiled category covers would read as a catalog thumbnail sheet.)
 */
const HERO_IMAGE = {
  src: "/images/productos/bbq/cover.webp",
  alt: "Productos MetalMotor en acero para el asado, el exterior y el hogar",
} as const;

/** The line, named — the Hero's breadth signal, not a decorative attribute list. */
const LINE = ["BBQ", "Fogones", "Cocina", "Hogar", "Accesorios"] as const;

/**
 * Premium landing hero for the retail line. Editorial two-column composition
 * skewed toward the image (7/12) so the photograph is the single loudest
 * element on the page: the promise on the left (eyebrow → title → description →
 * line → CTA), a dominant editorial scene on the right. Collapses to a stacked,
 * text-first single column below `lg`.
 */
export function ProductsHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"
        aria-hidden
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Promise */}
          <Reveal className="lg:col-span-5">
            <p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
              <span className="h-px w-6 bg-brand-500" aria-hidden />
              Productos MetalMotor
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Productos diseñados y fabricados por MetalMotor.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel-300 sm:text-xl">
              Una línea completa en acero, con fabricación propia.
            </p>

            {/* The line, named — this is what tells the reader we make MANY things. */}
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Nuestra línea">
              {LINE.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-steel-300 backdrop-blur-sm"
                >
                  {item}
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

          {/* Scene — dominant, the loudest element on the page. */}
          <Reveal delay={0.12} className="relative lg:col-span-7">
            {/* Molten bloom anchoring the shot to the brand, behind the frame. */}
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-brand-500/20 blur-3xl"
              aria-hidden
            />
            <ProductMedia
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              fit="cover"
              frame="wide"
              rounded="rounded-3xl"
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              background="bg-steel-900"
              className="border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] lg:aspect-[4/3]"
            >
              {/* Depth wash grounds the scene and lifts the frame off the grid. */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-steel-950/40 via-transparent to-transparent"
                aria-hidden
              />
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
