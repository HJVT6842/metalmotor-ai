import type { ReactNode } from "react";

import {
  FlagIcon,
  PenToolIcon,
  PuzzleIcon,
  ScissorsIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Seal = {
  readonly Icon: (props: { readonly className?: string }) => ReactNode;
  readonly label: string;
};

const SEALS: readonly Seal[] = [
  { Icon: FlagIcon, label: "Fabricado en Chile" },
  { Icon: ScissorsIcon, label: "Corte CNC de precisión" },
  { Icon: PenToolIcon, label: "Diseño propio" },
  { Icon: PuzzleIcon, label: "Productos armables" },
];

/**
 * Minimalist trust row shared across product pages. Small line icons + text,
 * no boxes or badges. Two rows on mobile (2×2), a single row on desktop.
 */
export function TrustSeals({ className }: { readonly className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4",
        className,
      )}
    >
      {SEALS.map(({ Icon, label }) => (
        <li
          key={label}
          className="flex items-center gap-2.5 text-sm text-steel-300"
        >
          <Icon className="h-5 w-5 shrink-0 text-brand-400" />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
