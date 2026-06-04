"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  readonly children: ReactNode;
  readonly className?: string;
  /** Vertical travel in px across the element's scroll range. */
  readonly offset?: number;
};

/**
 * Subtle vertical parallax driven by scroll position. Kept lightweight
 * (transform only) so it stays compositor-friendly and performant.
 */
export function Parallax({ children, className, offset = 60 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
