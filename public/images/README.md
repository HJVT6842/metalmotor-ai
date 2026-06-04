# Imágenes — Metal Motor

Sistema de imágenes con dos estados: **referenciales** (visuales de apoyo, no son
trabajos propios) y **reales** (fotos propias autorizadas). La fuente de verdad
es **`src/data/media.ts`**.

> ⚖️ Regla de honestidad: las imágenes `reference` muestran la insignia
> **“Imagen referencial”** y **nunca** se presentan como “Trabajo realizado”.
> Solo las imágenes `real` (fotos propias) muestran **“Trabajo realizado”**.

## Estructura de carpetas

```
public/images/
├── reference/            ← visuales de referencia (generados, uso comercial libre)
│   ├── hero/             ← banners del hero
│   ├── services/         ← visuales por servicio (corte láser, celosías, …)
│   ├── products/         ← visuales de productos
│   └── workshop/         ← ambiente / maquinaria de taller
└── real/                 ← TUS fotos propias (reemplazo final)
    ├── portfolio/        ← trabajos realizados
    ├── products/         ← fotos reales de productos
    └── workshop/         ← fotos reales del taller
```

## ¿De dónde salen las imágenes referenciales actuales?

Son **SVG generados localmente** por `scripts/gen-reference-svgs.mjs`
(propiedad de Metal Motor, uso comercial libre, sin atribución). Para
regenerarlas:

```bash
node scripts/gen-reference-svgs.mjs
```

> Si en el futuro descargas fotos de stock con licencia comercial permisiva
> (p. ej. **Unsplash** / **Pexels**), guárdalas en `reference/<categoría>/` y
> completa los campos `credit`, `source` y `license` en `src/data/media.ts`.

## Cómo reemplazar una imagen por una foto propia (real)

1. Sube tu foto a la carpeta `real/` correspondiente, usando el nombre indicado
   en el campo `replacementPath` del asset en `src/data/media.ts`.
   - Ejemplo: `replacementPath: "/images/real/portfolio/celosias.webp"`
     → sube tu foto a `public/images/real/portfolio/celosias.webp`.
2. En `src/data/media.ts`, en ese asset:
   - cambia `src` a la nueva ruta (`/images/real/...`),
   - cambia `status` de `"reference"` a `"real"`,
   - actualiza `alt` (descripción real) y borra `credit`/`source` si es propia.
3. Listo: la insignia pasa automáticamente a **“Trabajo realizado”** y
   `next/image` optimiza la foto (lazy-loading, AVIF/WebP, tamaños responsivos).

## Especificaciones recomendadas

| Uso          | Dimensiones        | Relación | Peso objetivo |
|--------------|--------------------|----------|---------------|
| Hero banner  | 1920 × 1080 px     | 16:9     | < 300 KB      |
| Servicios    | 1200 × 900 px      | 4:3      | < 200 KB      |
| Productos    | 1200 × 1200 px     | 1:1      | < 200 KB      |
| Portafolio   | 1600 × 1000 px     | 16:10    | < 250 KB      |
| Taller       | 1600 × 1000 px     | 16:10    | < 250 KB      |

- **Formato recomendado: `.webp`** (alternativa `.avif`). `next/image` también
  re-codifica a AVIF/WebP automáticamente.
- **Compresión:** calidad 75–82. Herramientas: `squoosh.app`, `cwebp`,
  o `sharp`.
  ```bash
  # Ejemplo con cwebp
  cwebp -q 80 foto.jpg -o foto.webp
  ```
- Evita imágenes > 2000 px de ancho: no aportan calidad visible y pesan de más.

## Convención de nombres

- minúsculas, sin espacios ni tildes, separadas por guiones:
  ```
  celosias-fachada-edificio.webp
  corte-laser-acero-inox.webp
  porton-industrial-bodega.webp
  ```
- Usa el mismo nombre base que aparece en `replacementPath` para un reemplazo
  directo.
