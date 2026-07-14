import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { ProductCard } from "@/components/productos/ProductCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getFeaturedProducts } from "@/data/home-products";

/** Four curated products on the landing. Four-up on desktop, one-up on mobile. */
export function FeaturedProductsShowcase() {
  const featured = getFeaturedProducts();

  return (
    <Section className="bg-steel-950">
      <SectionHeading
        eyebrow="Destacados"
        title="Productos destacados"
        align="left"
      />

      <Stagger
        className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.06}
      >
        {featured.map((product, i) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} index={i} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
