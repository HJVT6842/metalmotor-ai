import Image from "next/image";

import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * The retail line hero, in the language of the site's main hero
 * (`sections/Hero` + `sections/HeroBanner`): a single full-bleed editorial
 * photograph as the background, text overlaid on the left — badge → title →
 * promise → CTA → a stat-style line index. The whole hero IS the image, so the
 * photograph is by far the loudest element on the page.
 *
 * DEFINITIVE SLOT — the background lives at its own dedicated path
 * (`/images/productos/hero.webp`), a single wide editorial scene of the whole
 * line together (cocina exterior + fogón + disco + accesorios in steel). To
 * change it, OVERWRITE that file — no code change.
 *
 * Static background on purpose: unlike the home hero we DON'T run infinite Ken
 * Burns / parallax / spark layers here — those are the compositor loops behind
 * the iOS 15PM flicker, and this hero doesn't need them to land.
 */
const HERO_IMAGE = {
  src: "/images/productos/hero.webp",
  alt: "Productos MetalMotor en acero: cocina exterior, fogón, disco de asado y accesorios",
} as const;

/** The line, named — breadth at a glance, echoing the home hero's stat row. */
const LINE = ["BBQ", "Fogones", "Cocina", "Hogar", "Accesorios"] as const;

export function ProductsHero() {
  return (
    <section className="relative flex min-h-[74dvh] items-center overflow-hidden bg-steel-950 sm:min-h-[78dvh]">
      {/* Full-bleed editorial scene — the whole line in a single composition. */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={HERO_IMAGE.src}
          alt=""
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Readability overlays — foreground text stays AA over any photo. */}
        <div className="absolute inset-0 bg-steel-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-steel-950 via-steel-950/70 to-steel-950/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-steel-950 to-transparent" />
      </div>

      {/* Engineering grid texture — same cue as the main hero. */}
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />

      <Container className="relative py-24">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden />
              Productos MetalMotor · Fabricación propia
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:mt-8 sm:text-6xl lg:text-7xl">
              Productos diseñados y fabricados por{" "}
              <span className="text-gradient-brand">MetalMotor</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-steel-300 sm:mt-6 sm:text-xl">
              Parrillas, fogones, discos, cocina y accesorios en acero,
              fabricados en nuestro propio taller.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 sm:mt-10">
              <LinkButton href="#categorias" variant="primary" size="lg">
                Explorar productos
                <ArrowRightIcon className="h-5 w-5" />
              </LinkButton>
            </div>
          </Reveal>

          {/* The line, named — stat-style row mirroring the home hero. */}
          <Reveal delay={0.24}>
            <ul
              className="mt-12 flex flex-wrap gap-x-6 gap-y-3 sm:mt-16"
              aria-label="Nuestra línea"
            >
              {LINE.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-brand-500/70 pl-3 text-sm font-semibold uppercase tracking-[0.15em] text-steel-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
