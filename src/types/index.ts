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
  | "cad";

export type CatalogItem = {
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  /** Material / finish tags shown as chips. */
  readonly tags: readonly string[];
};

export type NavLink = {
  readonly label: string;
  readonly href: string;
};
