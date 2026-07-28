import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { ProductCard } from "@/components/productos/ProductCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getFeaturedProducts } from "@/data/home-products";

/**
 * Curated products on the landing. A centered flex row keeps the group balanced
 * for ANY count — an incomplete last row centers instead of leaving a lone
 * orphan hanging left (as a fixed 4-col grid would with 5 items). Each item
 * carries a responsive basis so cards stay uniform: 1-up mobile, 2-up tablet,
 * 5-up desktop.
 */
export function FeaturedProductsShowcase() {
  const featured = getFeaturedProducts();

  return (
    <Section className="bg-steel-950">
      <SectionHeading
        eyebrow="Destacados"
        title="Productos destacados"
        description="Una selección de piezas fabricadas en nuestro taller: del asado al detalle de diseño."
        align="left"
      />

      <Stagger
        className="mt-12 flex flex-wrap justify-center gap-6"
        stagger={0.06}
      >
        {featured.map((product, i) => (
          <StaggerItem
            key={product.id}
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(20%-1.2rem)]"
          >
            <ProductCard product={product} index={i} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
