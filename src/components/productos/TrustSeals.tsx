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
  readonly description: string;
};

const SEALS: readonly Seal[] = [
  {
    Icon: FlagIcon,
    label: "Fabricado en Chile",
    description: "Producción nacional con control directo de la calidad.",
  },
  {
    Icon: ScissorsIcon,
    label: "Corte CNC de precisión",
    description: "Cortes exactos y repetibles en cada pieza.",
  },
  {
    Icon: PenToolIcon,
    label: "Diseño propio",
    description: "Piezas desarrolladas íntegramente por MetalMotor.",
  },
  {
    Icon: PuzzleIcon,
    label: "Productos armables",
    description: "Fácil transporte, guardado y montaje.",
  },
];

/**
 * Value cards at the foot of the "Fabricado por MetalMotor" block. Each of the
 * four differentiators is a small card in the site's dark language (graphite
 * panel, soft border, very subtle hover), with an icon, a title and a one-line
 * description that reinforces the own-manufacturing value proposition. PDP-only.
 */
export function TrustSeals({ className }: { readonly className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {SEALS.map(({ Icon, label, description }) => (
        <li
          key={label}
          className="rounded-2xl border border-white/10 bg-steel-900/40 p-5 transition-colors hover:border-white/20"
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15 text-brand-400"
            aria-hidden
          >
            <Icon className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-white sm:text-lg">
            {label}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-steel-400">
            {description}
          </p>
        </li>
      ))}
    </ul>
  );
}
