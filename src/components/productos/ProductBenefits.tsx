import { CheckIcon } from "@/components/ui/icons";
import type { Product } from "@/data/home-products";

export function ProductBenefits({ product }: { readonly product: Product }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {product.benefits.map((benefit) => (
        <li
          key={benefit}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-steel-900/40 px-5 py-4"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-400"
            aria-hidden
          >
            <CheckIcon className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-steel-100">{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
