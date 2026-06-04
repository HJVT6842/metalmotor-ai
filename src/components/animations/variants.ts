import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion variants. Keeping them in one place gives every section
 * the same easing/rhythm so the whole site feels like one coherent product.
 */

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

/** Parent container that staggers its children's entrance. */
export const staggerContainer = (stagger = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
