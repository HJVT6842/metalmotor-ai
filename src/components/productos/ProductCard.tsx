import Link from "next/link";

import { ProductMedia } from "@/components/productos/ProductMedia";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  STOCK_LABEL,
  formatPrice,
  type Product,
  type StockStatus,
} from "@/data/home-products";
import { cn } from "@/lib/cn";

const CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw";

/** Shared site easing (mirrors EASE_OUT in animations/variants). */
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Descriptive modifiers dropped from the VISIBLE card label. The canonical name
 * always lives in the catalog data — it is used verbatim on the PDP and, here,
 * for accessibility (aria-label + title). Cards optimize for fast scanning:
 * "Parrilla Desarmable 60x40" → "Parrilla 60×40".
 */
const NAME_NOISE =
  /\b(desarmable|multifunción|para asado|con tapa|de acero|de cocina|de pared|personalizado|adicional|minimalista|geométrico|circular)\b/gi;

/** Display-only. Falls back to the full name if cleanup would empty it. */
function displayName(name: string): string {
  const cleaned = name
    .replace(/(\d)\s*[x×]\s*(\d)/gi, "$1×$2")
    .replace(NAME_NOISE, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned || name;
}

/** Discreet availability tones — muted dot + text, never a loud fill. */
const STOCK_TONE: Record<StockStatus, { dot: string; text: string }> = {
  in_stock: { dot: "bg-emerald-400", text: "text-emerald-200" },
  made_to_order: { dot: "bg-brand-400", text: "text-brand-200" },
  coming_soon: { dot: "bg-steel-300", text: "text-steel-200" },
};

type ProductCardProps = {
  readonly product: Product;
  /** Varies the placeholder gradient so a grid never looks flat. */
  readonly index?: number;
};

/**
 * The standard product card for the whole MetalMotor storefront — featured,
 * categories, collections, related and future surfaces all render THIS.
 *
 * ANATOMY (top → bottom): a photo-dominant square media frame (~2/3 of the
 * card, `object-cover` so mixed white / lifestyle backgrounds read as one
 * homogeneous collection), a floating availability chip, then a compact body
 * with a fast-scan name, a high-hierarchy price and an editorial CTA footer.
 *
 * UNIFORMITY: the frame's fixed aspect-ratio fixes image height before any
 * photo loads (zero CLS); `h-full` + a stretch grid row makes every card in a
 * row share one height regardless of name length; one panel, one radius, one
 * border, one shadow, one hover across every surface.
 *
 * HOVER (motion-safe, GPU-composited): the card lifts and lights its border
 * molten, the shadow deepens, the photo zooms, and the CTA arrow fills brand
 * and slides — one coherent, restrained interaction.
 */
export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const href = `/productos/${product.categorySlug}/${product.slug}`;
  const cover = product.images[0] ?? "";
  const label = displayName(product.name);
  const stockLabel = STOCK_LABEL[product.stockStatus];
  const tone = STOCK_TONE[product.stockStatus];
  const priceLabel = product.price !== null ? formatPrice(product.price) : null;

  return (
    <Link
      href={href}
      aria-label={`${product.name} — ${priceLabel ?? "precio a consultar"} — ${stockLabel}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-steel-900/40",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_10px_30px_-18px_rgba(0,0,0,0.7)]",
        "transition-all duration-300",
        EASE,
        "hover:border-brand-500/50 hover:bg-steel-900/70 hover:shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)]",
        "motion-safe:hover:-translate-y-1.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-steel-950",
      )}
    >
      {/* Photo — the protagonist. Square + cover = one shared height, homogeneous. */}
      <div className="relative">
        <ProductMedia
          src={cover}
          alt={product.name}
          index={index}
          frame="square"
          fit="cover"
          rounded="rounded-none"
          background="bg-steel-950"
          sizes={CARD_SIZES}
          hoverZoom
          className="border-b border-white/10"
        >
          {/* Depth wash so a floating chip stays legible over any photo. */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-steel-950/45 via-transparent to-transparent"
            aria-hidden
          />
        </ProductMedia>

        {/* Availability — discreet glass chip, top-left. */}
        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-steel-950/60 px-2.5 py-1 text-[0.6875rem] font-medium text-white/90 backdrop-blur-md"
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} aria-hidden />
          <span className={tone.text}>{stockLabel}</span>
        </span>
      </div>

      {/* Body — fast-scan name, price as the hero, editorial CTA. */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3
          title={product.name}
          className="line-clamp-1 text-sm font-medium text-steel-100 transition-colors duration-300 group-hover:text-white"
        >
          {label}
        </h3>

        <p className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {priceLabel ?? (
            <span className="text-base font-medium text-steel-300">
              Precio a consultar
            </span>
          )}
        </p>

        {/* CTA footer — editorial, unmistakable, with a molten arrow chip. */}
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm font-semibold text-brand-400 transition-colors duration-300 group-hover:text-brand-300">
            Ver producto
          </span>
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white",
              "transition-all duration-300",
              EASE,
              "group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white",
            )}
            aria-hidden
          >
            <ArrowRightIcon
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                EASE,
                "motion-safe:group-hover:translate-x-0.5",
              )}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
