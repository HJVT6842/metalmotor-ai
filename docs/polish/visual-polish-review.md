# Visual Polish & Conversion Review

Scope: visual polish + conversion only — **no new features, no backend changes.**
Verified green: `test` (44/44) · `typecheck` · `lint` · `build`.

## Before / After (full page)

| | Desktop | Mobile |
|---|---|---|
| **Before** | ![before desktop](./before-desktop.png) | ![before mobile](./before-mobile.png) |
| **After** | ![after desktop](./after-desktop.png) | ![after mobile](./after-mobile.png) |

> Screenshots are full-page captures at 1280 px (desktop) and 390 px (mobile),
> taken with `scripts/shoot.mjs` (Playwright, installed `--no-save`).

## Changes by area

| # | Area | Before | After |
|---|------|--------|-------|
| 1 | **Hero image** | Mixed crossfade (laser head, a lathe, a steel structure); heavy 72% overlay hid the photo | All 3 frames are **real CNC laser-cutting machines**; lighter 55% + directional overlay so the machine reads while text stays AA. Ken-Burns toned down (1.1) to avoid over-crop |
| 2 | **Hero text spacing** | Fixed large gaps (`mt-7/9/14`) felt loose on mobile | Responsive rhythm (`mt-6 sm:mt-8`, `mt-8 sm:mt-10`, `mt-12 sm:mt-16`); subhead width capped for readability; `min-h-[88vh] sm:min-h-[92vh]` |
| 3 | **Product cards** | CTA position drifted with description/tag length | Description natural, CTA pinned to the bottom (`mt-auto`) → consistent baseline across all cards |
| 4 | **Portfolio** | 210/240 px rows, weak overlay, flat hover | Taller 220/260 px rows, stronger bottom gradient for legibility, brand-glow + border on hover, center-cropped real photos |
| 5 | **Mobile nav** | Instant show/hide, 2.5 tap padding | Animated height/opacity (Framer), larger 3.5 tap targets, active states, full-width WhatsApp CTA |
| 6 | **CTA buttons** | Flat gradient | Lift on hover (`-translate-y-0.5`), stronger molten glow, tactile press — more prominent primary action |
| 7 | **WhatsApp visibility** | Round icon + hover-only label | Always-labelled **pill** ("Cotizar por WhatsApp") on ≥sm, round on mobile, attention pulse retained → unmissable |
| 8 | **Section spacing** | Several adjacent sections shared the same background → blended together | True **alternating bands** (steel-950 / steel-900) with hairline dividers; Trust normalized to `py-20` for consistent rhythm |
| 9 | **Image crop quality** | Default crop/quality | `object-center` + `quality={82}` on every `next/image`; AVIF/WebP via config |
| 10 | **Footer** | Plain top border | Premium **brand gradient accent bar**, cleaner hierarchy; image-credits link retained |

## Trust & honesty (unchanged guarantees)
- Every reference photo keeps the **"Imagen referencial"** badge; attribution on **/creditos**.
- Hero photos are real **CNC laser-cutting machines** (Wikimedia Commons, commercial-use licenses) — see `src/data/reference-manifest.ts` and `scripts/fetch-hero-photos.mjs`.

## Not touched
Supabase contact form · Resend notifications · API routes · SEO metadata / JSON-LD · OG image.
