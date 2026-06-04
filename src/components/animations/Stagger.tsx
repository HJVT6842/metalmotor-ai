"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeInUp, staggerContainer } from "@/components/animations/variants";

type StaggerProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly stagger?: number;
  readonly delayChildren?: number;
  readonly once?: boolean;
};

/** Container that reveals its <StaggerItem> children one after another. */
export function Stagger({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0,
  once = true,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

/** A single staggered child. Inherits timing from the parent <Stagger>. */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={fadeInUp}>
      {children}
    </motion.div>
  );
}
