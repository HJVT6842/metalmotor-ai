import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:outline-brand-600",
  secondary:
    "bg-steel-900 text-white hover:bg-steel-800 focus-visible:outline-steel-900",
  ghost:
    "bg-transparent text-steel-800 ring-1 ring-inset ring-steel-300 hover:bg-steel-100 focus-visible:outline-steel-400",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  readonly variant?: Variant;
  readonly size?: Size;
  readonly children: ReactNode;
};

/**
 * Anchor styled as a button. All primary CTAs are links (WhatsApp, anchors),
 * so an anchor-based button keeps semantics correct and is keyboard-friendly.
 */
export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
