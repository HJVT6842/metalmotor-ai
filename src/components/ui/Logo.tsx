import type { SVGProps } from "react";

import { cn } from "@/lib/cn";

/**
 * Metal Motor logo system.
 * Concept: an "M" cut from a steel plate by a laser beam (the orange diagonal).
 * Minimalist, industrial, modern — icon + wordmark.
 */

type MarkProps = SVGProps<SVGSVGElement> & { readonly title?: string };

/** Square icon mark — usable standalone, in the header, or as a favicon. */
export function LogoMark({ title = "Metal Motor", className, ...props }: MarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="mm-plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="mm-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>

      {/* Steel plate */}
      <rect x="1.5" y="1.5" width="45" height="45" rx="11" fill="url(#mm-plate)" />
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="11"
        fill="none"
        stroke="rgba(148,163,184,0.25)"
        strokeWidth="1.2"
      />

      {/* "M" cut path */}
      <path
        d="M12 35 V15 L24 27 L36 15 V35"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Laser beam slicing across the plate */}
      <path
        d="M8 12 L40 38"
        stroke="url(#mm-beam)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.95"
      />
      <circle cx="40" cy="38" r="2.4" fill="#fb923c" />
    </svg>
  );
}

type LogoProps = {
  readonly variant?: "horizontal" | "square" | "mark";
  readonly className?: string;
};

/** Composed logo with wordmark. */
export function Logo({ variant = "horizontal", className }: LogoProps) {
  if (variant === "mark") {
    return <LogoMark className={cn("h-10 w-10", className)} />;
  }

  if (variant === "square") {
    return (
      <span className={cn("inline-flex flex-col items-center gap-2", className)}>
        <LogoMark className="h-14 w-14" />
        <span className="text-center leading-none">
          <span className="block text-sm font-extrabold tracking-[0.2em] text-white">
            METAL MOTOR
          </span>
          <span className="mt-1 block text-[10px] font-medium tracking-[0.3em] text-steel-400">
            SERVICES SPA
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className="leading-none">
        <span className="block text-lg font-extrabold tracking-tight text-white">
          METAL<span className="text-gradient-brand">MOTOR</span>
        </span>
        <span className="mt-0.5 block text-[10px] font-medium tracking-[0.28em] text-steel-400">
          SERVICES SPA
        </span>
      </span>
    </span>
  );
}
