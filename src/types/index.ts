/**
 * Shared domain types for MetalMotor-AI.
 * Keep this file small and dependency-free so it can be imported anywhere.
 */

export type Service = {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  /** Short bullet points describing what the service includes. */
  readonly highlights: readonly string[];
  /** Heroicons-style inline icon key (mapped in the component). */
  readonly icon: ServiceIcon;
};

export type ServiceIcon =
  | "laser"
  | "panel"
  | "lattice"
  | "fold"
  | "weld"
  | "cad"
  | "fabrication"
  | "gate"
  | "parts"
  | "industrial"
  | "reverse";

export type NavLink = {
  readonly label: string;
  readonly href: string;
};

export type Product = {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly tags: readonly string[];
};

export type Testimonial = {
  readonly name: string;
  readonly role: string;
  readonly company: string;
  readonly location: string;
  readonly quote: string;
  /** 1–5. */
  readonly rating: number;
};

export type ProcessStep = {
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly icon: ServiceIcon;
};

export type Stat = {
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly label: string;
};
