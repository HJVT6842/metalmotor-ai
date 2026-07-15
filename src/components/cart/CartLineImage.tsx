"use client";

/**
 * Cart-line thumbnail. Shows the local editorial photo first, the Shopify image
 * as a fallback, and a neutral graphite <Poster> as the last resort — so the
 * drawer never renders broken alt text (Sprint 03.6.2).
 *
 * The frame owns the 80×80 box, rounded corners, overflow and graphite
 * background; the photo fills it with object-cover so lifestyle renders read
 * cleanly without distortion. If the resolved source fails to load at runtime
 * (e.g. a not-yet-shot local path), onError swaps to the poster.
 */

import Image from "next/image";
import { useState } from "react";

import { Poster } from "@/components/ui/Media";
import { resolveCartLineImage } from "@/lib/cart-line-image";
import type { CartLine } from "@/lib/shopify/types";

export function CartLineImage({ line }: { readonly line: CartLine }) {
  const [failed, setFailed] = useState(false);
  const src = resolveCartLineImage(line.handle, line.image);
  const showPoster = !src || failed;

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-steel-900 ring-1 ring-inset ring-white/10">
      {showPoster ? (
        <Poster label={line.productTitle} />
      ) : (
        <Image
          src={src}
          alt={line.image?.altText ?? line.productTitle}
          fill
          sizes="80px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
