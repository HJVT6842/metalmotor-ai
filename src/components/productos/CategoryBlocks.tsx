import Link from "next/link";

import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductMedia } from "@/components/productos/ProductMedia";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getAllCategories, getProductsByCategory } from "@/data/home-products";

/**
 * Premium bento grid for the retail collection ("Explora por categoría").
 *
 * LAYOUT — a magazine-style bento where BBQ is the hero tile. The grid geometry
 * is data-order-independent: each category is placed by `slug` (see PLACEMENT),
 * so reordering CATEGORIES in `home-products.ts` never breaks the composition.
 *
 *   Desktop (lg, 3 cols × 3 rows, fixed height → zero CLS):
 *     ┌───────────────┬──────────┐
 *     │               │ Fogones  │
 *     │      BBQ      ├──────────┤
 *     │  (2×2 hero)   │ Cocina   │
 *     ├───────────────┼──────────┤
 *     │ Hogar (wide)  │ Accesor. │
 *     └───────────────┴──────────┘
 *   Tablet (sm, 2 cols): BBQ full-width hero, then paired rows.
 *   Mobile: single column — BBQ, Fogones, Cocina, Hogar, Accesorios.
 *
 * No-CLS strategy: mobile/tablet reserve height via aspect-ratio; desktop uses a
 * fixed-height grid whose tiles fill their track (`lg:h-full`), so tile height is
 * decided before any image loads.
 *
 * Hierarchy: the hero (BBQ) carries a solid molten CTA (the primary action);
 * secondaries use a text-link CTA. Inside every card the order is
 * title → description → product count → CTA, on ONE shared vertical rhythm so
 * cards never drift apart visually. Type scale echoes the site Hero
 * (extrabold + tracking-tight), stepped down for the secondary tiles.
 *
 * Motion: entrance is staggered via Framer Motion (<Stagger>). Hover micro-
 * interactions (zoom, lift, molten border/glow, CTA, arrow) are GPU-composited
 * CSS transitions on the shared site easing, gated by `motion-safe:` — no client
 * JS, no bundle cost, silenced under `prefers-reduced-motion`.
 *
 * Photography-ready: each tile reads `category.image` through
 * <ProductMedia fit="cover">; until real photos land it degrades to the premium
 * <Poster> gradient. The text scrim is tuned to hold AA contrast even over a
 * bright photo (text sits over the opaque foot of the gradient).
 */

/** Shared site easing (mirrors EASE_OUT in animations/variants). */
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

type Placement = {
  /** Grid area at sm/lg. Placed by slug so data order never matters. */
  readonly area: string;
  /** Source order on mobile/tablet (reset at lg where placement is explicit). */
  readonly order: string;
  /** The hero tile gets larger type, a bolder crop and the primary CTA. */
  readonly feature: boolean;
  /** Mobile/tablet aspect override; desktop always fills its track. */
  readonly shape: string;
  /** `next/image` sizes hint for this tile's footprint across breakpoints. */
  readonly sizes: string;
};

const SIDE_SIZES =
  "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw";
const WIDE_SIZES =
  "(min-width: 1024px) 62vw, (min-width: 640px) 50vw, 100vw";

const PLACEMENT: Record<string, Placement> = {
  bbq: {
    area: "sm:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-1",
    order: "order-1 lg:order-none",
    feature: true,
    shape: "aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-full",
    sizes: "(min-width: 1024px) 62vw, 100vw",
  },
  "fogones-exterior": {
    area: "lg:col-start-3 lg:row-start-1",
    order: "order-2 lg:order-none",
    feature: false,
    shape: "aspect-[4/3] lg:aspect-auto lg:h-full",
    sizes: SIDE_SIZES,
  },
  cocina: {
    area: "lg:col-start-3 lg:row-start-2",
    order: "order-3 lg:order-none",
    feature: false,
    shape: "aspect-[4/3] lg:aspect-auto lg:h-full",
    sizes: SIDE_SIZES,
  },
  hogar: {
    area: "lg:col-span-2 lg:col-start-1 lg:row-start-3",
    order: "order-4 lg:order-none",
    feature: false,
    shape: "aspect-[4/3] lg:aspect-auto lg:h-full",
    sizes: WIDE_SIZES,
  },
  "accesorios-bbq": {
    area: "lg:col-start-3 lg:row-start-3",
    order: "order-5 lg:order-none",
    feature: false,
    shape: "aspect-[4/3] lg:aspect-auto lg:h-full",
    sizes: SIDE_SIZES,
  },
};

/** Safe default so an unmapped category still renders as a clean single cell. */
const DEFAULT_PLACEMENT: Placement = {
  area: "",
  order: "",
  feature: false,
  shape: "aspect-[4/3] lg:aspect-auto lg:h-full",
  sizes: SIDE_SIZES,
};

function productCountLabel(slug: string): string {
  const count = getProductsByCategory(slug).length;
  return `${count} ${count === 1 ? "producto" : "productos"}`;
}

export function CategoryBlocks() {
  const categories = getAllCategories();

  return (
    <Section id="categorias" className="bg-steel-950">
      <SectionHeading
        eyebrow="Colecciones"
        title="Explora por categoría"
        description="Acero fabricado en casa para el asado, el fuego y el hogar. Elige una colección y descubre las piezas."
        align="left"
      />

      <Stagger
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:grid-rows-3 lg:gap-5 lg:h-[40rem] xl:h-[44rem]"
        stagger={0.08}
      >
        {categories.map((category, i) => {
          const place = PLACEMENT[category.slug] ?? DEFAULT_PLACEMENT;
          const countLabel = productCountLabel(category.slug);
          const feature = place.feature;

          return (
            <StaggerItem
              key={category.slug}
              className={`${place.area} ${place.order} lg:h-full`}
            >
              <Link
                href={`/productos/${category.slug}`}
                className={`group relative block rounded-3xl transition duration-300 ${EASE} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-steel-950 lg:h-full`}
                aria-label={`${category.name} — ver colección (${countLabel})`}
              >
                <ProductMedia
                  src={category.image}
                  alt={category.name}
                  index={i}
                  frame="landscape"
                  fit="cover"
                  rounded="rounded-3xl"
                  hoverZoom
                  sizes={place.sizes}
                  className={`border border-white/10 shadow-[0_10px_40px_-14px_rgba(0,0,0,0.75)] transition duration-300 ${EASE} group-hover:border-brand-500/60 group-hover:shadow-glow motion-safe:group-hover:-translate-y-1.5 ${place.shape}`}
                >
                  {/*
                   * Text scrim — opaque at the foot, fading up. Text is bottom-
                   * anchored, so it always sits over the ≥80% region, keeping AA
                   * contrast even when a bright photo replaces the placeholder.
                   */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-950/80 via-55% to-transparent"
                    aria-hidden
                  />
                  {/* Soft molten wash that blooms on hover — subtle brand cue. */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-500/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 ${EASE} group-hover:opacity-100`}
                    aria-hidden
                  />

                  <div
                    className={`absolute inset-0 flex flex-col justify-end ${
                      feature ? "p-8 sm:p-10" : "p-6 sm:p-7"
                    }`}
                  >
                    <h3
                      className={`font-extrabold tracking-tight text-white ${
                        feature
                          ? "text-3xl leading-[1.05] sm:text-4xl lg:text-[2.5rem]"
                          : "text-xl leading-tight sm:text-2xl"
                      }`}
                    >
                      {category.name}
                    </h3>

                    <p
                      className={`mt-3 leading-relaxed text-steel-300 ${
                        feature ? "max-w-md text-base" : "max-w-xs text-sm"
                      }`}
                    >
                      {category.tagline}
                    </p>

                    <span className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-steel-400 tabular-nums">
                      {countLabel}
                    </span>

                    {feature ? (
                      <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-steel-950 shadow-[0_8px_30px_-8px_rgba(249,115,22,0.65)] transition duration-300 ease-out group-hover:shadow-[0_12px_44px_-6px_rgba(249,115,22,0.85)] motion-safe:group-hover:brightness-110">
                        Explorar colección
                        <ArrowRightIcon className={`h-4 w-4 transition-transform duration-300 ${EASE} motion-safe:group-hover:translate-x-1`} />
                      </span>
                    ) : (
                      <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-400">
                        Explorar colección
                        <ArrowRightIcon className={`h-4 w-4 transition-transform duration-300 ${EASE} motion-safe:group-hover:translate-x-1.5`} />
                      </span>
                    )}
                  </div>
                </ProductMedia>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
