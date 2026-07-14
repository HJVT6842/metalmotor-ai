import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import type { ProductCategory } from "@/data/home-products";

/** Airy category header: name + one short line. Product does the talking below. */
export function CategoryHero({
  category,
  count,
}: {
  readonly category: ProductCategory;
  readonly count: number;
}) {
  return (
    <section className="border-b border-white/10 bg-steel-950">
      <Container className="py-14 sm:py-20">
        <Reveal className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-brand-400">
            {count} {count === 1 ? "producto" : "productos"}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-steel-300">
            {category.description}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
