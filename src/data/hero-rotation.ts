/**
 * Ordered background frames for the hero crossfade (see HeroBanner).
 *
 * Each id is resolved through the central media catalogue (src/data/media.ts),
 * so it always renders the ACTIVE render — never a Wikimedia reference. Extend
 * the rotation simply by adding ids here; HeroBanner needs no changes.
 * hero-rotation.test.ts guards that every id is an active render.
 *
 * Narrative goal: el visitante percibe capacidad productiva + corte láser CNC
 * (hero-workshop) y producto terminado (prod-celosias) sin volver el hero un
 * slider tradicional.
 */
export const HERO_ROTATION_IDS: readonly string[] = [
  "hero-workshop", // capacidad productiva + corte láser CNC (frame de entrada / LCP)
  "prod-celosias", // producto terminado
];
