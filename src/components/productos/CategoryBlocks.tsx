import Link from "next/link";

import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProductMedia } from "@/components/productos/ProductMedia";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getAllCategories } from "@/data/home-products";

const BLOCK_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/**
 * Large, visual category blocks. The first two span wide on desktop for an
 * editorial, non-grid feel; the rest fill a clean three-up row. Mobile: stacked.
 */
export function CategoryBlocks() {
  const categories = getAllCategories();

  return (
    <Section id="categorias" className="bg-steel-950">
      <SectionHeading
        eyebrow="Categorías"
        title="Explora por categoría"
        align="left"
      />

      <Stagger
        className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6"
        stagger={0.08}
      >
        {categories.map((category, i) => {
          // First two blocks span half the 6-col grid; last three span a third.
          const span = i < 2 ? "lg:col-span-3" : "lg:col-span-2";
          return (
            <StaggerItem key={category.slug} className={span}>
              <Link
                href={`/productos/${category.slug}`}
                className="group block"
              >
                <ProductMedia
                  src={category.image}
                  alt={category.name}
                  index={i}
                  frame="landscape"
                  rounded="rounded-3xl"
                  fit="cover"
                  hoverZoom
                  sizes={BLOCK_SIZES}
                  className="flex flex-col justify-end border border-white/10 sm:aspect-[3/2]"
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-steel-950 via-steel-950/40 to-transparent"
                    aria-hidden
                  />
                  <div className="relative p-6 sm:p-8">
                    <h3 className="text-2xl font-semibold tracking-tight text-white">
                      {category.name}
                    </h3>
                    <p className="mt-1 max-w-xs text-sm text-steel-300">
                      {category.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-400">
                      Ver productos
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
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
