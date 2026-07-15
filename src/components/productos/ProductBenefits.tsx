import { CheckIcon } from "@/components/ui/icons";
import type { Product } from "@/data/home-products";

export function ProductBenefits({ product }: { readonly product: Product }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
      {product.benefits.map((benefit) => (
        <li
          key={benefit}
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-steel-900/40 px-6 py-5"
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-400"
            aria-hidden
          >
            <CheckIcon className="h-6 w-6" />
          </span>
          <span className="text-base font-medium text-steel-100">
            {benefit}
          </span>
        </li>
      ))}
    </ul>
  );
}
