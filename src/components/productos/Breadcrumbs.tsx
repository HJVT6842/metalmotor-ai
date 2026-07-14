import Link from "next/link";

import { Container } from "@/components/ui/Container";

export type Crumb = {
  readonly label: string;
  /** Omit href on the current (last) crumb. */
  readonly href?: string;
};

/** Quiet, accessible breadcrumb trail. */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  return (
    <Container>
      <nav aria-label="Migas de pan" className="py-6 text-sm text-steel-500">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-steel-300"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-steel-400" aria-current="page">
                    {item.label}
                  </span>
                )}
                {!isLast ? (
                  <span className="text-steel-700" aria-hidden>
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </Container>
  );
}
