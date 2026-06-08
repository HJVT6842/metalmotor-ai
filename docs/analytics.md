# Analítica — Google Analytics 4 (GA4)

Medición de conversiones para MetalMotor-AI. No altera el diseño ni la UX, y es
compatible con SSR / App Router (todo no-opera en el servidor o sin GA).

## Configuración

1. Crea una propiedad GA4 y copia su **Measurement ID** (`G-XXXXXXXXXX`).
2. Define la variable de entorno (en Vercel → Settings → Environment Variables,
   y/o en `.env.local` para desarrollo):

   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
   ```

3. Redeploy. Si la variable está vacía, **no se carga ningún script GA ni se
   envían eventos** (el sitio funciona igual). El ID nunca está hardcodeado.

## Arquitectura

| Pieza | Archivo | Rol |
|---|---|---|
| Carga de GA4 | `src/components/analytics/GoogleAnalytics.tsx` | Inyecta `gtag.js` vía `next/script` solo si hay ID |
| Listener global | `src/components/analytics/AnalyticsListener.tsx` | `page_view` en navegación SPA + delega clicks de WhatsApp/mailto/tel |
| Tracker de vista | `src/components/analytics/ServiceViewTracker.tsx` | Dispara `page_service_view` al montar una página de servicio |
| Helper central | `src/lib/analytics.ts` | API tipada de eventos (SSR-safe) |

Montado en `src/app/layout.tsx` (`<GoogleAnalytics />` + `<AnalyticsListener />`).

## Eventos

| Evento | Cuándo se dispara | Cómo |
|---|---|---|
| `click_whatsapp` | Click en cualquier CTA/enlace WhatsApp (Hero, flotante, tarjetas, páginas de servicio) | Listener global (delegación de `a[href*="wa.me/"]`) |
| `submit_quote_form` | Envío exitoso del formulario de cotización | `trackQuoteSubmit()` en `ContactForm` |
| `submit_contact_form` | Disponible para un formulario de contacto independiente (futuro) | `trackContactSubmit()` |
| `page_service_view` | Montaje de una landing de servicio (`/corte-laser-cnc`, etc.) | `ServiceViewTracker` |
| `click_phone` | Click en un enlace `tel:` | Listener global (se activa cuando exista un `tel:`) |
| `click_email` | Click en un enlace `mailto:` (footer, contacto) | Listener global |

> Nota: el sitio tiene **un** formulario (RFQ/cotización) → se mide como
> `submit_quote_form`. `submit_contact_form` queda implementado en el helper por
> si se añade un formulario de contacto separado.

## Parámetros

Cada evento incluye automáticamente:

| Parámetro | Valor |
|---|---|
| `page_path` | Ruta actual (`window.location.pathname`) |
| `source_page` | Ruta desde donde se originó la acción |
| `timestamp` | ISO 8601 (hora del cliente) |

Parámetros adicionales según evento:

- `service_slug` — en `page_service_view` (ej. `corte-laser-cnc`).
- `service` — en `submit_quote_form` (servicio de interés seleccionado, si aplica).

## API del helper (`src/lib/analytics.ts`)

```ts
trackWhatsappClick(params?)
trackQuoteSubmit(params?)     // submit_quote_form
trackContactSubmit(params?)   // submit_contact_form
trackServiceView(slug)        // page_service_view
trackPhoneClick(params?)
trackEmailClick(params?)
pageview(path)                // page_view SPA
track(event, params?)         // emisor de bajo nivel
isAnalyticsEnabled()          // true si hay measurement ID
```

Todas las funciones no-operan en servidor o si `gtag` no está disponible.

## Verificar

1. Con el ID configurado, abre el sitio y revisa en GA4 → **Realtime**.
2. Eventos a validar: `click_whatsapp`, `submit_quote_form`, `page_service_view`.
3. Marca los eventos de conversión clave en GA4 (Admin → Events → *Mark as key
   event*): `submit_quote_form` y `click_whatsapp`.

## Privacidad

GA4 anonimiza IPs por defecto. No se envían datos personales del formulario a
GA (solo el evento de envío y el servicio de interés). Los leads siguen
guardándose en Supabase como sistema de registro.
