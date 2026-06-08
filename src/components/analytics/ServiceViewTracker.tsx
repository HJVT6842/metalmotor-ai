"use client";

import { useEffect } from "react";

import { trackServiceView } from "@/lib/analytics";

/** Fires `page_service_view` once when a service landing page mounts. */
export function ServiceViewTracker({ slug }: { readonly slug: string }) {
  useEffect(() => {
    trackServiceView(slug);
  }, [slug]);
  return null;
}
