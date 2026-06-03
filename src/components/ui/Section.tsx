import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

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
    <section id={id} className={`scroll-mt-20 py-16 sm:py-20 lg:py-24 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

type SectionHeadingProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly align?: "left" | "center";
};

/** Consistent eyebrow + title + description block used by each section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-steel-900 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-steel-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}
