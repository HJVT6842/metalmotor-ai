"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Ease-out cubic — pure, exported for testing. */
export function easeOutCubic(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - clamped, 3);
}

type CounterProps = {
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly durationMs?: number;
  readonly className?: string;
};

/**
 * Counts up from 0 to `value` once it scrolls into view.
 * Uses requestAnimationFrame; falls back to the final value instantly when the
 * user prefers reduced motion.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1800,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Defer into a frame callback so we don't setState synchronously in the effect.
      const jump = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(jump);
    }

    let raf = 0;
    let start: number | null = null;
    const step = (now: number) => {
      if (start === null) start = now;
      const progress = (now - start) / durationMs;
      const eased = easeOutCubic(progress);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("es-CL")}
      {suffix}
    </span>
  );
}
