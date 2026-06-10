# MetalMotor.cl — Pack de prompts listos para pegar (Flux 1.1 Pro)

> Derivado de `docs/IMAGE-RENDER-PROMPTS.md` (fuente de verdad de auditoría, rutas y ALT).
> Cada bloque de abajo es **un prompt completo listo para copiar/pegar** en Flux 1.1 Pro:
> ancla de estilo ya fusionada, sin sintaxis Midjourney (`--ar`, `--style raw`).
> El ratio se configura como **parámetro de generación**, no dentro del prompt.
>
> **Principio rector (posicionamiento):** Metal Motor es una maestranza / taller
> metalmecánico, NO una oficina de arquitectura. Jerarquía visual (NUNCA invertir):
> 1) Producto terminado → 2) Precisión de fabricación → 3) Tecnología → 4) Ambiente
> de taller. Prohibido: foco en casas de lujo, estética de revista de arquitectura,
> estilo de marketing inmobiliario. Encuadre al producto; la edificación, si
> aparece, es contexto secundario.

## Configuración por ratio (parámetros Flux)

| Ratio | Flux 1.1 Pro (width×height) | Flux 1.1 Pro Ultra (`aspect_ratio`) | Export final (WebP q80) |
|-------|------------------------------|--------------------------------------|--------------------------|
| 16:9  | 1440×808 (o 1344×768)        | `16:9`                               | 1920×1080 (hero/capacidad) · 1600×900 (productos) |
| 4:3   | 1152×864                     | `4:3`                                | 1200×900 |
| 1:1   | 1440×1440 (o 1024×1024)      | `1:1`                                | 1200×1200 |
| 16:10 | 1280×800                     | `16:10`                              | 1600×1000 |

> Recomendado: usar **Ultra** si está disponible (≈4MP nativo → no requiere upscale para
> llegar a 1920×1080). Con Pro estándar (máx 1440px), el hero necesita un upscale ligero
> al exportar. Mismo seed-style entre tandas no es necesario: el ancla textual garantiza
> la consistencia.

---

## Prompts (19) — copiar el bloque completo

### 1. `hero-workshop` — ratio 16:9 → `reference/hero/hero-workshop.webp`

```
Finished laser-cut matte black steel panel in sharp focus in the foreground, precision-cut steel parts on a workbench beside it, industrial fiber laser cutting with bright orange sparks in the background of a modern clean fabrication workshop, cinematic depth, dramatic warm key light. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 2. `prod-celosias` — ratio 16:9 → `reference/products/prod-celosias.webp`

```
Close-up of a matte black laser-cut decorative metal screen (celosia), camera tight on the precision-cut geometric pattern, warm light glowing through the perforations, crisp clean cut edges, blurred neutral background. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 3. `prod-paneles` — ratio 16:9 → `reference/products/prod-paneles.webp`

```
Laser-cut decorative metal panel with warm backlighting through the precision pattern, installed in a modern commercial interior, camera centered on the panel, crisp cut edges, softly blurred surroundings. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 4. `prod-portones` — ratio 16:9 → `reference/products/prod-portones.webp`

```
Custom-fabricated matte black steel sliding gate (porton corredera) filling the frame at a vehicle access driveway, daylight, focus on the gate structure, clean welds and premium matte finish, blurred neutral background. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 5. `prod-separadores` — ratio 16:9 → `reference/products/prod-separadores.webp`

```
Laser-cut metal room divider screen separating a modern interior space, matte black steel with a precise geometric pattern, warm interior lighting through the perforations, camera centered on the divider. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 6. `svc-corte-laser` — ratio 4:3 → `reference/services/svc-corte-laser.webp`

```
Close-up of industrial 2000W fiber laser cutting a steel sheet, realistic sparks, modern workshop, cinematic shallow depth of field. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 7. `svc-paneles` — ratio 4:3 → `reference/services/svc-paneles.webp`

```
Detail of a laser-cut corten steel decorative panel, warm backlight through the perforated precision pattern, tight framing on the cut edges, outdoor setting softly blurred behind. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 8. `svc-celosias` — ratio 4:3 → `reference/services/svc-celosias.webp`

```
Close-up detail of a matte black laser-cut metal celosia screen, precise pattern geometry, crisp cut edges, warm lighting, shallow depth of field. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 9. `svc-portones` — ratio 4:3 → `reference/services/svc-portones.webp`

```
Detail of a custom-fabricated matte black metal sliding gate, focus on the frame structure, clean welds and premium matte finish, minimalist context softly blurred. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 10. `svc-soldadura` — ratio 4:3 → `reference/services/svc-soldadura.webp`

```
Extreme close-up of professional MIG TIG welding, bright electric arc, sparks, molten weld pool on steel, dark workshop background. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 11. `svc-plegado` — ratio 4:3 → `reference/services/svc-plegado.webp`

```
Modern CNC press brake bending a steel sheet in a clean fabrication shop, precise tooling, warm industrial light. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 12. `svc-fabricacion` — ratio 4:3 → `reference/services/svc-fabricacion.webp`

```
Professional structural metal assembly and fabrication on a shop floor, clean modern industrial environment. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 13. `svc-cad` — ratio 4:3 → `reference/services/svc-cad.webp`

```
Computer screen showing a detailed 3D CAD model of a metal part and sheet-metal assembly, engineering workstation, modern office, warm light. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no readable text, no logos, no watermark, no brand names.
```

### 14. `prod-rejas` — ratio 1:1 → `reference/products/prod-rejas.webp`

```
Frontal detail of a modern matte black metal railing (reja) with exact laser-cut geometry, precise repeating pattern, premium powder-coated finish, neutral blurred background. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 15. `prod-piezas` — ratio 1:1 → `reference/products/prod-piezas.webp`

```
Set of precision laser-cut steel parts neatly arranged on a clean surface, studio product lighting, sharp detail. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 16. `prod-custom` — ratio 1:1 → `reference/products/prod-custom.webp`

```
Bespoke custom metal fabrication piece, premium workshop setting, warm light, ultra-detailed. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 17. `workshop-machinery` — ratio 16:10 → `reference/workshop/workshop-machinery.webp`

```
Modern industrial machine park with CNC laser, press brake and welding stations, clean organized fabrication facility, warm industrial light, sense of a consolidated company. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 18. `workshop-atmosphere` — ratio 16:10 → `reference/workshop/workshop-atmosphere.webp`

```
Clean professional metal fabrication workshop interior, organized, warm cinematic lighting, no clutter, premium industrial. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

### 19. `capacity-composition` *(nuevo)* — ratio 16:9 → `reference/workshop/capacity-composition.webp`

```
Premium wide composition representing full fabrication capability: fiber laser cutting, CNC press brake bending, MIG welding, TIG welding, CAD design station, integral metal fabrication, cohesive single modern facility, looks like a consolidated industrial company. Hyperrealistic architectural product photography, industrial premium aesthetic, matte black steel, corten steel and brushed stainless steel, architectural exposed concrete, warm cinematic lighting, modern minimalist, shallow depth of field, ultra-detailed, photographic, color-graded warm neutrals with deep blacks. No people, no text, no logos, no watermark, no brand names.
```

---

## Checklist de generación

- [ ] 1. hero-workshop (16:9)
- [ ] 2. prod-celosias (16:9)
- [ ] 3. prod-paneles (16:9)
- [ ] 4. prod-portones (16:9)
- [ ] 5. prod-separadores (16:9)
- [ ] 6. svc-corte-laser (4:3)
- [ ] 7. svc-paneles (4:3)
- [ ] 8. svc-celosias (4:3)
- [ ] 9. svc-portones (4:3)
- [ ] 10. svc-soldadura (4:3)
- [ ] 11. svc-plegado (4:3)
- [ ] 12. svc-fabricacion (4:3)
- [ ] 13. svc-cad (4:3)
- [ ] 14. prod-rejas (1:1)
- [ ] 15. prod-piezas (1:1)
- [ ] 16. prod-custom (1:1)
- [ ] 17. workshop-machinery (16:10)
- [ ] 18. workshop-atmosphere (16:10)
- [ ] 19. capacity-composition (16:9)

## Flujo después de generar

1. Guarda cada imagen descargada con el **nombre del id** (p.ej. `hero-workshop.png`)
   en una carpeta (p.ej. `~/Downloads/renders/`).
2. Pásale la carpeta a Claude Code → conversión a WebP q80 al tamaño de export,
   colocación en `public/images/reference/**` y activación del id en
   `ACTIVE_RENDERS` con tests + build de verificación.
3. Criterio de aceptación visual: misma paleta (negros profundos + neutros cálidos),
   sin personas, sin texto/logos, sin artefactos IA evidentes (manos, geometría
   imposible, soldaduras irreales).
