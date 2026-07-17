"use client";

import { useEffect, useState } from "react";

/** Tailwind `sm` breakpoint — the boundary we treat as "desktop". */
const DESKTOP_QUERY = "(min-width: 640px)";

/**
 * True only on viewports at/above the desktop breakpoint. SSR-safe: returns
 * `false` until mounted, so decorative/infinite animations never start on
 * mobile. This sidesteps a WebKit (iOS Safari) repaint bug where scroll-driven
 * transforms and animated `backdrop-filter`/large-blur layers flicker.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
