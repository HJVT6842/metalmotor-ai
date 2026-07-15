import { type StockStatus } from "@/data/home-products";
import { cn } from "@/lib/cn";
import { resolveStockDisplay, type StockTone } from "@/lib/stock";

/**
 * Dynamic availability pill. Source-agnostic: it receives only `stockStatus`,
 * `stockQuantity` and `stockAvailable` (see the inventory layer) and never
 * knows where the numbers come from (Shopify today, ERP/Supabase/etc. later).
 * Keeps the exact visual language of the pill (same size, dot + ring + muted
 * text) — only the text and colour change per stock level. Green/gray/brand
 * tones match the previous `StockPill` tokens; amber/orange for low stock.
 */
const TONE: Record<StockTone, { dot: string; text: string; ring: string }> = {
  green: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    ring: "ring-emerald-400/25",
  },
  amber: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    ring: "ring-amber-400/25",
  },
  orange: {
    dot: "bg-orange-400",
    text: "text-orange-300",
    ring: "ring-orange-400/25",
  },
  gray: {
    dot: "bg-steel-400",
    text: "text-steel-300",
    ring: "ring-white/15",
  },
  brand: {
    dot: "bg-brand-400",
    text: "text-brand-300",
    ring: "ring-brand-400/25",
  },
};

export function StockIndicator({
  stockStatus,
  stockQuantity,
  stockAvailable,
  className,
}: {
  readonly stockStatus: StockStatus;
  readonly stockQuantity: number | null;
  readonly stockAvailable: boolean;
  readonly className?: string;
}) {
  const { label, tone } = resolveStockDisplay(
    stockAvailable,
    stockQuantity,
    stockStatus,
  );
  const t = TONE[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
        t.text,
        t.ring,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", t.dot)} aria-hidden />
      {label}
    </span>
  );
}
