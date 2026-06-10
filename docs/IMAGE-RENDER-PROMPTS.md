# MetalMotor.cl — Plan de reemplazo por renders hiperrealistas (Industrial Premium)

> Entregables 1–3 de la auditoría visual. Los renders se generan en un modelo de
> imagen (Midjourney / Flux / DALL·E / Nano-Banana) usando los prompts de abajo y
> luego se integran con el flujo de `src/data/media.ts`.
>
> **Regla de honestidad (no negociable):** un render IA NO es una foto real ni un
> trabajo realizado. Entra como `status: "reference"` → badge **"Imagen
> referencial"**. NUNCA se marca como "Trabajo realizado" (eso es solo para fotos
> propias autorizadas). El test `src/data/media.test.ts` lo verifica.
>
> **Principio rector (posicionamiento):** Metal Motor es una maestranza / taller
> metalmecánico, NO una oficina de arquitectura. Toda imagen refuerza
> TECNOLOGÍA + FABRICACIÓN + PRODUCTO TERMINADO + PRECISIÓN INDUSTRIAL.
>
> **Jerarquía visual (NUNCA invertir):**
> 1. Producto terminado → 2. Precisión de fabricación → 3. Tecnología → 4. Ambiente de taller.
>
> **Prohibido:** foco en casas de lujo, estética de revista de arquitectura,
> estilo de marketing inmobiliario. El producto se muestra como solución metálica
> fabricada (encuadre al producto); la edificación, si aparece, es contexto
> secundario.

---

## 1) Auditoría de imágenes actuales

Fuente de verdad: `src/data/media.ts` (18 assets) + `src/data/reference-manifest.ts`
(atribución Wikimedia, mostrada en `/creditos`). Todos hoy son `status: "reference"`.

| # | id | Sección / uso | Archivo actual | Fuente actual |
|---|----|--------------|----------------|---------------|
| 1 | `hero-workshop` | Hero | reference/hero/hero-workshop.jpg | Wikimedia "Laser Cutting" |
| 2 | `svc-corte-laser` | Servicio / Fabricamos | reference/services/svc-corte-laser.jpg | Wikimedia |
| 3 | `svc-paneles` | Servicio / Fabricamos | reference/services/svc-paneles.jpg | Wikimedia |
| 4 | `svc-celosias` | Servicio / Fabricamos | reference/services/svc-celosias.jpg | Wikimedia |
| 5 | `svc-portones` | Servicio / Fabricamos | reference/services/svc-portones.jpg | Wikimedia |
| 6 | `svc-soldadura` | Servicio / Trabajos | reference/services/svc-soldadura.jpg | Wikimedia |
| 7 | `svc-plegado` | Servicio / Trabajos | reference/services/svc-plegado.jpg | Wikimedia |
| 8 | `svc-fabricacion` | Servicio / Trabajos | reference/services/svc-fabricacion.jpg | Wikimedia |
| 9 | `svc-cad` | Servicio / Trabajos | reference/services/svc-cad.jpg | Wikimedia |
| 10 | `prod-celosias` | Producto destacado | reference/products/prod-celosias.jpg | Wikimedia |
| 11 | `prod-paneles` | Producto destacado | reference/products/prod-paneles.jpg | Wikimedia |
| 12 | `prod-portones` | Producto destacado | reference/products/prod-portones.jpg | Wikimedia |
| 13 | `prod-rejas` | Producto | reference/products/prod-rejas.jpg | Wikimedia |
| 14 | `prod-piezas` | Producto | reference/products/prod-piezas.png | Wikimedia |
| 15 | `prod-custom` | Producto | reference/products/prod-custom.jpg | Wikimedia |
| 16 | `prod-separadores` | Producto destacado | reference/products/prod-separadores.jpg | Wikimedia |
| 17 | `workshop-machinery` | Taller / Capacidad | reference/workshop/workshop-machinery.jpg | Wikimedia |
| 18 | `workshop-atmosphere` | Taller | reference/workshop/workshop-atmosphere.jpg | Wikimedia |

Secciones del sitio que consumen estos assets:
- **Hero** (`HeroBanner.tsx`) → #1
- **Productos destacados** → #10–#12, #16 (+ #13–#15)
- **Fabricamos / Servicios** → #2–#9
- **Capacidad productiva / Taller** → #17–#18
- **Trabajos y proyectos** (`Portfolio.tsx`, `SHOWCASE_MEDIA` = servicios + taller) → #2–#9, #17, #18

Propuesta nueva: **+1 asset** `capacity-composition` (composición de capacidad
productiva) → total 19.

---

## 2) Tabla: imagen actual vs propuesta

| id | Propuesta de render (Industrial Premium) | Ratio | Destino (queda en reference/) |
|----|------------------------------------------|-------|-------------------------------|
| `hero-workshop` | Producto metálico terminado en primer plano, piezas de precisión y láser fibra cortando al fondo | 16:9 | reference/hero/hero-workshop.webp |
| `svc-corte-laser` | Cabezal láser fibra sobre plancha, chispas, profundidad de campo | 4:3 | reference/services/svc-corte-laser.webp |
| `svc-paneles` | Detalle de panel corten retroiluminado, patrón de precisión | 4:3 | reference/services/svc-paneles.webp |
| `svc-celosias` | Detalle de celosía negra mate cortada a láser, patrón de precisión | 4:3 | reference/services/svc-celosias.webp |
| `svc-portones` | Detalle de portón corredera negro mate, estructura y terminación | 4:3 | reference/services/svc-portones.webp |
| `svc-soldadura` | Soldadura MIG/TIG real, arco, chispas, primer plano | 4:3 | reference/services/svc-soldadura.webp |
| `svc-plegado` | Plegadora CNC moderna doblando chapa | 4:3 | reference/services/svc-plegado.webp |
| `svc-fabricacion` | Ensamblaje metálico estructural profesional | 4:3 | reference/services/svc-fabricacion.webp |
| `svc-cad` | Pantalla con modelo CAD 3D de pieza metálica | 4:3 | reference/services/svc-cad.webp |
| `prod-celosias` | Primer plano de celosía negra mate cortada a láser, patrón de precisión, luz cálida | 16:9 | reference/products/prod-celosias.webp |
| `prod-paneles` | Panel metálico cortado a láser retroiluminado, interior comercial | 16:9 | reference/products/prod-paneles.webp |
| `prod-portones` | Portón corredera negro mate a medida, acceso vehicular, luz de día | 16:9 | reference/products/prod-portones.webp |
| `prod-separadores` | Separador de ambientes metálico cortado a láser, interior moderno | 16:9 | reference/products/prod-separadores.webp |
| `prod-rejas` | Detalle frontal de reja negra mate, geometría de corte exacta | 1:1 | reference/products/prod-rejas.webp |
| `prod-piezas` | Piezas de acero cortadas con precisión, fondo estudio | 1:1 | reference/products/prod-piezas.webp |
| `prod-custom` | Fabricación metálica a medida, taller premium | 1:1 | reference/products/prod-custom.webp |
| `workshop-machinery` | Parque de máquinas industrial moderno y ordenado | 16:10 | reference/workshop/workshop-machinery.webp |
| `workshop-atmosphere` | Ambiente de taller industrial limpio, luz cálida | 16:10 | reference/workshop/workshop-atmosphere.webp |
| `capacity-composition` *(nuevo)* | Composición premium: láser fibra + plegadora + MIG + TIG + CAD + fabricación | 16:9 | reference/workshop/capacity-composition.webp |

---

## 3) Prompts definitivos

### Ancla de estilo (PEGAR AL FINAL DE CADA PROMPT — garantiza consistencia)

```
STYLE: hyperrealistic architectural product photography, industrial premium
aesthetic, matte black steel + corten steel + brushed stainless steel,
architectural exposed concrete, warm cinematic lighting, modern minimalist,
shallow depth of field, ultra-detailed, photographic, 8k, color-graded warm
neutrals with deep blacks. NO people, NO text, NO logos, NO watermark,
NO brand names. --ar {RATIO} --style raw
```

> Reemplaza `{RATIO}` por el de la tabla (16:9, 4:3, 1:1, 16:10).
> Mantener SIEMPRE la misma ancla = mismo lenguaje visual entre todas las imágenes.

### Hero
```
hero-workshop — Finished laser-cut matte black steel panel in sharp focus in the
foreground, precision-cut steel parts on a workbench beside it, industrial fiber
laser cutting with bright orange sparks in the background of a modern clean
fabrication workshop, cinematic depth, dramatic warm key light. + STYLE --ar 16:9
```

### Productos destacados
```
prod-celosias — Close-up of a matte black laser-cut decorative metal screen
(celosía), camera tight on the precision-cut geometric pattern, warm light
glowing through the perforations, crisp clean cut edges, blurred neutral
background. + STYLE --ar 16:9

prod-paneles — Laser-cut decorative metal panel with warm backlighting through
the precision pattern, installed in a modern commercial interior, camera centered
on the panel, crisp cut edges, softly blurred surroundings. + STYLE --ar 16:9

prod-portones — Custom-fabricated matte black steel sliding gate (portón
corredera) filling the frame at a vehicle access driveway, daylight, focus on the
gate structure, clean welds and premium matte finish, blurred neutral
background. + STYLE --ar 16:9

prod-separadores — Laser-cut metal room divider screen separating a modern
interior space, matte black steel with a precise geometric pattern, warm interior
lighting through the perforations, camera centered on the divider. + STYLE --ar 16:9
```

### Fabricamos / Servicios
```
svc-corte-laser — Close-up of industrial 2000W fiber laser cutting a steel sheet,
realistic sparks, modern workshop, cinematic shallow depth of field. + STYLE --ar 4:3

svc-paneles — Detail of a laser-cut corten steel decorative panel, warm backlight
through the perforated precision pattern, tight framing on the cut edges,
outdoor setting softly blurred behind. + STYLE --ar 4:3

svc-celosias — Close-up detail of a matte black laser-cut metal celosía screen,
precise pattern geometry, crisp cut edges, warm lighting, shallow depth of
field. + STYLE --ar 4:3

svc-portones — Detail of a custom-fabricated matte black metal sliding gate,
focus on the frame structure, clean welds and premium matte finish, minimalist
context softly blurred. + STYLE --ar 4:3

svc-soldadura — Extreme close-up of professional MIG/TIG welding, bright electric
arc, sparks, molten weld pool on steel, dark workshop background. + STYLE --ar 4:3

svc-plegado — Modern CNC press brake bending a steel sheet in a clean fabrication
shop, precise tooling, warm industrial light. + STYLE --ar 4:3

svc-fabricacion — Professional structural metal assembly / fabrication on a shop
floor, clean modern industrial environment. + STYLE --ar 4:3

svc-cad — Computer screen showing a detailed 3D CAD model of a metal part /
sheet-metal assembly, engineering workstation, modern office, warm light. + STYLE --ar 4:3
```

### Productos (secundarios)
```
prod-rejas — Frontal detail of a modern matte black metal railing (reja) with
exact laser-cut geometry, precise repeating pattern, premium powder-coated
finish, neutral blurred background. + STYLE --ar 1:1

prod-piezas — Set of precision laser-cut steel parts neatly arranged on a clean
surface, studio product lighting, sharp detail. + STYLE --ar 1:1

prod-custom — Bespoke custom metal fabrication piece, premium workshop setting,
warm light, ultra-detailed. + STYLE --ar 1:1
```

### Taller / Capacidad productiva
```
workshop-machinery — Modern industrial machine park (CNC laser + press brake +
welding stations), clean organized fabrication facility, warm industrial light,
sense of a consolidated company. + STYLE --ar 16:10

workshop-atmosphere — Clean professional metal fabrication workshop interior,
organized, warm cinematic lighting, no clutter, premium industrial. + STYLE --ar 16:10

capacity-composition — Premium wide composition representing full fabrication
capability: fiber laser cutting, CNC press brake bending, MIG welding, TIG
welding, CAD design station, integral metal fabrication — cohesive single modern
facility, looks like a consolidated industrial company. + STYLE --ar 16:9
```

---

## 4) Especificaciones técnicas (al exportar)

| Uso | Dimensiones | Ratio | Peso objetivo | Formato |
|-----|-------------|-------|---------------|---------|
| Hero / Capacidad | 1920×1080 | 16:9 | < 300 KB | WebP q80 |
| Productos destacados | 1600×900 | 16:9 | < 220 KB | WebP q80 |
| Servicios | 1200×900 | 4:3 | < 200 KB | WebP q80 |
| Productos cuadrados | 1200×1200 | 1:1 | < 200 KB | WebP q80 |
| Taller | 1600×1000 | 16:10 | < 250 KB | WebP q80 |

```bash
# Conversión a WebP (ejemplo)
cwebp -q 80 render.png -o nombre-asset.webp
```

CLS=0 se mantiene: los contenedores tienen ratio fijo (`aspect-*`) y `next/image`
recibe el archivo; el ratio del render solo afecta el recorte, no el layout.

---

## 5) Integración en Next.js (cuando existan los .webp)

Para cada asset, **dejar el render en `reference/<categoría>/<archivo>.webp`** y en
`src/data/media.ts` apuntar el descriptor a la nueva ruta:

```ts
{
  id: "prod-celosias",
  title: "Celosías Decorativas",
  category: "Celosías Decorativas",
  alt: "Render de celosía decorativa negra mate en fachada moderna (imagen referencial)",
  usage: "product:celosias",
  src: "/images/reference/products/prod-celosias.webp", // ← render IA
  // status se omite → queda "reference" → badge "Imagen referencial"
  replacementPath: "/images/real/products/celosias.webp",
}
```

**Atribución (`/creditos`):** los renders no tienen autor Wikimedia. Hay que dejar
de heredar el crédito del `reference-manifest.ts` para los ids reemplazados (p.ej.
quitar su entrada del manifest o marcar `license: "Render propio · Metal Motor"`),
para no mostrar atribución Wikimedia falsa en `/creditos`.

ALT SEO: actualizar el `alt` de cada descriptor con la descripción del render
(servicio + material + comuna cuando aplique), manteniendo el sufijo
"(imagen referencial)".

### Checklist de cierre
- [ ] 19 renders generados con la MISMA ancla de estilo.
- [ ] Exportados a WebP con pesos objetivo.
- [ ] Colocados en `public/images/reference/**`.
- [ ] `src` actualizado en `media.ts` (status sigue "reference").
- [ ] ALT SEO reescritos.
- [ ] `/creditos`: sin atribución Wikimedia para ids reemplazados.
- [ ] `npm run test` verde (incluye honestidad de badges).
- [ ] `npm run build` exit 0, Lighthouse > 90, CLS = 0.
- [ ] Commit: `feat(media): reemplazo por renders hiperrealistas (Industrial Premium)`.
