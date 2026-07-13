import Link from "next/link";

import { ProductMedia } from "@/components/productos/ProductMedia";
import { StockPill } from "@/components/productos/StockPill";
import { ArrowRightIcon } from "@/components/ui/icons";
import { type Product } from "@/data/home-products";

const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

type ProductCardProps = {
  readonly product: Product;
  /** Varies the placeholder gradient so a grid never looks flat. */
  readonly index?: number;
};

/**
 * Minimal, product-first card. Aspect-agnostic image, quiet type, availability
 * pill and a hover affordance — no loud badges, no marketplace clutter. The
 * whole card is one link.
 */
export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const href = `/productos/${product.categorySlug}/${product.slug}`;
  const cover = product.images[0] ?? "";

  return (
    <Link href={href} className="group block">
      <ProductMedia
        src={cover}
        alt={product.name}
        index={index}
        frame="landscape"
        sizes={CARD_SIZES}
        className="ring-1 ring-inset ring-white/10 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-black/40"
        hoverZoom
      />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-medium text-white transition-colors group-hover:text-brand-300">
            {product.name}
          </h3>
          <div className="mt-2">
            <StockPill status={product.stockStatus} />
          </div>
        </div>
        <span
          className="mt-0.5 shrink-0 text-steel-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-400"
          aria-hidden
        >
          <ArrowRightIcon className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
