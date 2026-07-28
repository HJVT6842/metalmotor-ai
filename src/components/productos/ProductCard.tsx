import Link from "next/link";

import { ProductMedia } from "@/components/productos/ProductMedia";
import { StockPill } from "@/components/productos/StockPill";
import { ArrowRightIcon } from "@/components/ui/icons";
import { formatPrice, type Product } from "@/data/home-products";

const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw";

type ProductCardProps = {
  readonly product: Product;
  /** Varies the placeholder gradient so a grid never looks flat. */
  readonly index?: number;
};

/**
 * Product-first card as a single cohesive panel: bordered surface, a fixed
 * landscape media frame on a shared neutral background, and a meta block whose
 * bottom row is pinned via `mt-auto`. Because every card is `h-full` inside a
 * stretch row, mixed name lengths never break the grid's vertical alignment —
 * all cards in a row share one height, one radius, one border, one hover.
 */
export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const href = `/productos/${product.categorySlug}/${product.slug}`;
  const cover = product.images[0] ?? "";

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-steel-900/40 transition duration-300 ease-out motion-safe:hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]"
    >
      <ProductMedia
        src={cover}
        alt={product.name}
        index={index}
        frame="landscape"
        rounded="rounded-none"
        background="bg-steel-950"
        sizes={CARD_SIZES}
        className="border-b border-white/10"
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

      <div className="flex flex-1 flex-col p-5">
        <h3 className="truncate text-base font-medium text-white transition-colors group-hover:text-brand-300">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-steel-300">
          {formatPrice(product.price)}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <StockPill status={product.stockStatus} />
          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-400 group-hover:text-brand-300">
            Ver producto
            <ArrowRightIcon className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
