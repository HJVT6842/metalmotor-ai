import { ProductGrid } from "@/components/productos/ProductGrid";
import { Section, SectionHeading } from "@/components/ui/Section";
import type { Product } from "@/data/home-products";

/** Same-category suggestions at the foot of a product page. */
export function RelatedProducts({
  products,
}: {
  readonly products: readonly Product[];
}) {
  if (products.length === 0) return null;

  return (
    <Section className="bg-steel-950">
      <SectionHeading eyebrow="También te puede gustar" title="Productos relacionados" align="left" />
      <div className="mt-12">
        <ProductGrid products={products} />
      </div>
    </Section>
  );
}
