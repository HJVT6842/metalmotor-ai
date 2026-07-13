import { STOCK_LABEL, type StockStatus } from "@/data/home-products";
import { cn } from "@/lib/cn";

/** Dot + tone per availability state. Muted, premium — never a loud badge. */
const TONE: Record<StockStatus, { dot: string; text: string; ring: string }> = {
  in_stock: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    ring: "ring-emerald-400/25",
  },
  made_to_order: {
    dot: "bg-brand-400",
    text: "text-brand-300",
    ring: "ring-brand-400/25",
  },
  coming_soon: {
    dot: "bg-steel-400",
    text: "text-steel-300",
    ring: "ring-white/15",
  },
};

/** Small availability pill shared by the product hero and product cards. */
export function StockPill({
  status,
  className,
}: {
  readonly status: StockStatus;
  readonly className?: string;
}) {
  const tone = TONE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
        tone.text,
        tone.ring,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} aria-hidden />
      {STOCK_LABEL[status]}
    </span>
  );
}
