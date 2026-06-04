import type { ReactNode } from "react";

import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type SectionProps = {
  readonly id?: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly containerClassName?: string;
};

/** Vertical-rhythm section wrapper with an anchor id for nav links. */
export function Section({
  id,
  children,
  className = "",
  containerClassName = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 py-20 sm:py-24 lg:py-28", className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

type SectionHeadingProps = {
  readonly eyebrow?: string;
  readonly title: ReactNode;
  readonly description?: string;
  readonly align?: "left" | "center";
};

/** Consistent eyebrow + title + description block, animated on scroll. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow ? (
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
          <span className="h-px w-6 bg-brand-500" aria-hidden />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-steel-300">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
