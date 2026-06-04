import { mediaBadgeLabel, type MediaStatus } from "@/data/media";
import { cn } from "@/lib/cn";

type MediaBadgeProps = {
  readonly status: MediaStatus;
  readonly className?: string;
};

/**
 * Provenance badge. `reference` → "Imagen referencial"; `real` → "Trabajo
 * realizado". This is the single place the honesty rule is rendered.
 */
export function MediaBadge({ status, className }: MediaBadgeProps) {
  const real = status === "real";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm",
        real
          ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-inset ring-emerald-400/30"
          : "bg-steel-950/60 text-steel-200 ring-1 ring-inset ring-white/15",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          real ? "bg-emerald-400" : "bg-brand-400",
        )}
      />
      {mediaBadgeLabel(status)}
    </span>
  );
}
