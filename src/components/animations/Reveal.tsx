"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { fadeInUp } from "@/components/animations/variants";

type RevealProps = {
  readonly children: ReactNode;
  readonly className?: string;
  /** Delay in seconds before the reveal animation runs. */
  readonly delay?: number;
  readonly variants?: Variants;
  readonly once?: boolean;
};

/**
 * Scroll-reveal wrapper. Animates in when scrolled into view; honors
 * prefers-reduced-motion automatically via Framer's reducedMotion handling.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeInUp,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
