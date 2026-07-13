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
 * Minimal, product-first card. Aspect-agnostic image with a lively hover — the
 * photo zooms, the frame lifts and lights up, and a "Ver producto" affordance
 * fades in over the image. Quiet type, availability pill, one link.
 */
export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const href = `/productos/${product.categorySlug}/${product.slug}`;
  const cover = product.images[0] ?? "";

  return (
    <Link
      href={href}
      className="group block transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1"
    >
      <ProductMedia
        src={cover}
        alt={product.name}
        index={index}
        frame="landscape"
        sizes={CARD_SIZES}
        className="ring-1 ring-inset ring-white/10 transition duration-300 group-hover:ring-brand-500/40 group-hover:shadow-2xl group-hover:shadow-black/50"
        hoverZoom
      >
        <div
          className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-steel-950/80 via-steel-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        >
          <span className="m-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
            Ver producto
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </div>
      </ProductMedia>

      <div className="mt-4">
        <h3 className="truncate text-base font-medium text-white transition-colors group-hover:text-brand-300">
          {product.name}
        </h3>
        <div className="mt-2">
          <StockPill status={product.stockStatus} />
        </div>
      </div>
    </Link>
  );
}
