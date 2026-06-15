import { Container } from "@/components/ui/Container";

/**
 * Single, page-level honesty note for the AI renders shown across the home
 * (hero, featured products, services, capacity, gallery). Rendered ONCE,
 * intentionally discreet — it replaces the former per-image "Imagen referencial"
 * badges. The status/credit metadata stays untouched in src/data/media.ts.
 */
export function ReferentialDisclaimer() {
  return (
    <div className="bg-steel-950">
      <Container>
        <p className="mx-auto max-w-3xl py-6 text-center text-xs text-steel-500">
          Las imágenes presentadas son referenciales y representan productos,
          capacidades y soluciones fabricables por Metal Motor Services SpA.
        </p>
      </Container>
    </div>
  );
}
