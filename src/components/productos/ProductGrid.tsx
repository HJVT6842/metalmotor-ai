import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { ProductCard } from "@/components/productos/ProductCard";
import type { Product } from "@/data/home-products";

type ProductGridProps = {
  readonly products: readonly Product[];
};

/** Premium, mobile-first product grid. Shared by category pages and showcases. */
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <Stagger
      className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      stagger={0.06}
    >
      {products.map((product, i) => (
        <StaggerItem key={product.id}>
          <ProductCard product={product} index={i} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
