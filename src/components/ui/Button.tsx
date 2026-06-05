import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-[0_8px_30px_-6px_rgba(249,115,22,0.65)] hover:shadow-[0_10px_44px_-4px_rgba(249,115,22,0.9)] hover:from-brand-400 hover:to-brand-500 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-brand-500",
  secondary:
    "bg-white text-steel-900 hover:bg-steel-100 focus-visible:outline-white",
  ghost:
    "bg-white/5 text-white ring-1 ring-inset ring-white/15 backdrop-blur-sm hover:bg-white/10 focus-visible:outline-white/40",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  readonly variant?: Variant;
  readonly size?: Size;
  readonly children: ReactNode;
};

/** Anchor styled as a button — all primary CTAs are links (WhatsApp/anchors). */
export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
