import { ImageResponse } from "next/og";

import { SITE } from "@/data/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded Open Graph / Twitter card, generated at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(900px 500px at 80% -10%, rgba(249,115,22,0.35), transparent), linear-gradient(135deg, #0f172a 0%, #020617 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 6,
            color: "#fb923c",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              background: "#f97316",
            }}
          />
          Metal Motor Services SpA
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Corte Láser CNC y Fabricación Metálica de Precisión
        </div>

        <div style={{ marginTop: 28, fontSize: 30, color: "#cbd5e1" }}>
          Celosías · Paneles · Soldadura MIG/TIG · Diseño CAD · Chile
        </div>
      </div>
    ),
    size,
  );
}
