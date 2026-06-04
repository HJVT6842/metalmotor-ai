/**
 * Minimal className combiner — joins truthy class fragments with a space.
 * Avoids a runtime dependency for the small amount of conditional styling here.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
