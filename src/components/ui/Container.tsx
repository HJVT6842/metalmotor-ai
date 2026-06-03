import type { ReactNode } from "react";

type ContainerProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

/** Centered, max-width content wrapper with responsive padding. */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
