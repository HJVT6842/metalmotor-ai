import type { ReactNode, SVGProps } from "react";

import { ClockIcon, GaugeIcon } from "@/components/ui/icons";
import { DELIVERY, type Product } from "@/data/home-products";

type Glyph = (props: SVGProps<SVGSVGElement>) => ReactNode;

/** A cube glyph for physical dimensions and material specs. */
function CubeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 3v18M4 7.5l8 4.5 8-4.5" />
    </svg>
  );
}

type Spec = {
  readonly icon: Glyph;
  readonly label: string;
  readonly value: string;
};

/**
 * Clean spec cards — the essentials a buyer checks first. `Peso` is a declared
 * placeholder until real weights are measured (kept out of the data model on
 * purpose, per sprint scope).
 */
export function ProductSpecs({ product }: { readonly product: Product }) {
  const specs: readonly Spec[] = [
    { icon: CubeGlyph, label: "Material", value: product.material },
    { icon: GaugeIcon, label: "Espesor", value: product.thickness },
    { icon: CubeGlyph, label: "Medidas", value: product.dimensions },
    { icon: GaugeIcon, label: "Peso", value: "Por confirmar" },
    {
      icon: ClockIcon,
      label: "Entrega",
      value: DELIVERY[product.deliveryTier].eta,
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
      {specs.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="rounded-2xl border border-white/10 bg-steel-900/40 p-5 transition-colors hover:border-white/20"
        >
          <Icon className="h-5 w-5 text-brand-400" />
          <dt className="mt-4 text-xs uppercase tracking-wider text-steel-400">
            {label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-steel-100">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
