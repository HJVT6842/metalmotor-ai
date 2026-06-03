# MetalMotor-AI

Landing page y sistema de captación de leads para **Metal Motor Services SpA** — corte láser CNC, paneles decorativos, celosías, plegado, soldadura MIG/TIG y diseño CAD.

> MVP de la Fase 1 del plan: landing profesional + catálogo + CTA de WhatsApp + formulario de contacto, con arquitectura preparada para cotizaciones con IA (Fase 2).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (configuración CSS-first)
- **Supabase Postgres** (persistencia de leads)
- **Vercel** (deploy)
- **Vitest** (tests unitarios) · **zod** (validación en los límites)

## Requisitos

- Node.js ≥ 20 (probado con v24)
- npm

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completa los valores
npm run dev                  # http://localhost:3000
```

La landing funciona sin Supabase configurado: el formulario valida y registra el lead en el log del servidor hasta que configures las credenciales.

### Variables de entorno

Ver `.env.example`. Resumen:

| Variable | Tipo | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | público | SEO / canonical / sitemap |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | público | CTA de WhatsApp (solo dígitos) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | público | Email mostrado en el sitio |
| `SUPABASE_URL` | servidor | Conexión a Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **secreto** | Inserción de leads (bypassa RLS) |

## Base de datos

Aplica la migración de la tabla `leads`:

- **Dashboard**: pega `supabase/migrations/0001_create_leads.sql` en el SQL Editor, o
- **CLI**: `supabase db push`

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # build de producción
npm run start      # sirve el build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # tests unitarios (Vitest)
```

## Estructura

```
src/
  app/
    layout.tsx          # shell + SEO + JSON-LD + header/footer/WhatsApp flotante
    page.tsx            # composición de la landing
    sitemap.ts, robots.ts
    api/contact/route.ts# captura de leads (zod → Supabase)
  components/
    layout/             # Header, Footer
    sections/           # Hero, Services, Catalog, Process, ContactSection
    ui/                 # Container, Section, Button, icons
    ContactForm.tsx     # formulario (client)
    WhatsAppCta.tsx, WhatsAppFloat.tsx
  data/                 # site, services, catalog (contenido estático del MVP)
  lib/                  # validation (zod), whatsapp, env, supabase
  types/                # tipos de dominio
```

## Deploy (Vercel)

1. Sube el repo `metalmotor-ai` a GitHub.
2. Importa el proyecto en Vercel (framework detectado: Next.js).
3. Configura las variables de entorno (incluyendo las de Supabase).
4. Deploy.

## Roadmap

- **Fase 1 (este MVP)**: landing, catálogo, WhatsApp, formulario, SEO.
- **Fase 1+**: notificación a staff por WhatsApp Cloud API + email; panel admin del catálogo.
- **Fase 2**: asistente de cotización con IA (Claude).
- **Backlog**: importación CSV, cotizaciones en PDF, enlaces compartibles.
