# Hermes Agent × MetalMotor-AI — Plan operativo

> Hermes = agente Claude 24/7 (VPS Hostinger, Docker) como asistente de crecimiento y
> operación continua de Metal Motor Services SpA.
> Principios: **human-in-the-loop** para todo lo que publica o responde a clientes ·
> secretos solo en env · sin reseñas falsas · respetar ToS (usar APIs oficiales, no scraping) ·
> todo cambio de código del sitio pasa por aprobación + validación (typecheck/lint/test/build).

---

## 0. Resumen ejecutivo

El sitio y la analítica base están en producción y sanos. Los **3 riesgos críticos** hoy no
son técnicos de SEO sino de **funnel y activación comercial**:

1. **Formulario sin validación end-to-end real** → si faltan envs en Vercel
   (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`), los leads podrían no
   persistir o no notificar. **Hay que probarlo hoy.**
2. **`submit_quote_form` aún no confirmado en GA4** (solo se han visto page_view,
   page_service_view, click_whatsapp, etc.) y **Key Events sin marcar** → no se miden conversiones.
3. **Sin GBP ni campañas activas** → no hay generación de demanda todavía.

Hermes debe arrancar resolviendo la **medición y vigilancia (read-only)** y la **generación de
borradores**, antes de cualquier autonomía de publicación.

---

## 1. Auditoría del estado actual

| Área | Estado | Evidencia | Gap / Acción | Criticidad |
|---|---|---|---|---|
| Infra web (Next/Vercel/dominio) | ✅ Producción | www.metalmotor.cl 200, www canónico | — | — |
| SEO técnico | ✅ | canonical/robots/sitemap/JSON-LD verificados en vivo | — | — |
| Páginas SEO (5) | ✅ | 200, index,follow, Service+Breadcrumb | Falta indexación manual + tráfico | Media |
| LocalBusiness telephone | ✅ | `+56961492776` en JSON-LD | Falta `address`/`geo` (NAP) | Media |
| GSC | ✅ configurado | property metalmotor.cl, sitemap enviado | Solicitar indexación 5 URLs; monitorear cobertura | Alta |
| GA4 | ✅ funcionando | G-VX5FKKPHZ8; eventos vistos | **Confirmar `submit_quote_form`** + **marcar Key Events** | Alta |
| **Formulario → Supabase/Resend** | ⚠️ **sin validar E2E** | endpoint responde 422 a inválido; happy-path no probado en prod | **Probar envío real: ¿persiste en Supabase? ¿llega email?** Verificar envs | **CRÍTICA** |
| WhatsApp | ✅ | wa.me/56961492776 en todo el sitio | Sin clasificación/seguimiento de leads | Alta |
| Imágenes | 🟡 referenciales | badge "Imagen referencial" | Reemplazar por fotos reales | Media |
| GBP | ❌ no activo | — | Crear/optimizar (SAB) | Alta |
| Google Ads / Meta Ads | ❌ no activos | — | Lanzar Search + click-to-WhatsApp | Alta |
| CRM / seguimiento leads | ❌ no formal | leads en Supabase sin pipeline | Pipeline + SLA <1h | Alta |
| Hermes infra | ✅ VPS/Docker/Claude | — | Faltan TODAS las integraciones (APIs) | — |

---

## 2. Arquitectura de Hermes

```
            ┌─────────────────────────── HERMES (VPS / Docker, Claude) ───────────────────────────┐
            │  Orquestador (cron + on-demand)  ·  Estado/DB propia  ·  Logs  ·  Cola de aprobación │
            └───┬───────────────┬───────────────┬───────────────┬───────────────┬─────────────────┘
   Conectores:  │               │               │               │               │
        GA4 Data API     GSC API        Supabase (leads)   WhatsApp Cloud   Meta/LinkedIn API
        (read)           (read)         (read/write)        API (msg)        (publish)
                         │               │               │               │
        Web fetch / Trends (vigilancia)  Resend / IMAP (email)            Sitio (PRs vía repo)
                                                          │
            Salidas:  Reportes  ·  Borradores de contenido  ·  Alertas (WhatsApp/email/Telegram al dueño)  ·  PRs
```

### Mapa de capacidades → integración → autonomía
| Responsabilidad | Necesita | Autonomía inicial |
|---|---|---|
| SEO audit / rankings | GSC API + web fetch | **Autónomo (read)** |
| Analytics review | GA4 Data API | **Autónomo (read)** |
| Monitoreo de leads (web form) | Supabase (ya existe) | **Autónomo (read)** |
| Clasificación/priorización de leads | Supabase + reglas/IA | **Autónomo (read+score)**; acción → aprobación |
| Monitoreo WhatsApp | **WhatsApp Business Cloud API** (Meta) + webhook | Bloqueado hasta integrar |
| Monitoreo correo | Gmail/IMAP API | Bloqueado hasta integrar |
| Generación de contenido (FB/IG/LinkedIn/Blog) | Claude (ya) | **Autónomo: borradores**; publicar → aprobación |
| Publicar en redes | Meta Graph API + IG Business + Página; LinkedIn API | Asistido (cola de aprobación) |
| GBP posts/insights | Google Business Profile API | Asistido |
| Vigilancia comercial / tendencias | Google Trends, Pinterest Trends, Meta Ad Library (APIs/oficiales) | **Autónomo (read)** — sin scraping a ToS |
| Cambios al sitio | Repo HJVT6842/metalmotor-ai (PR) | **Solo PR + aprobación + CI** |

### Guardrails (no negociables)
- **Aprobación humana** antes de: publicar en redes/GBP/blog, responder a un lead, enviar correos masivos, hacer merge de PRs.
- Secretos solo en variables de entorno del VPS; nunca en logs ni repo.
- Rate limits y reintentos en cada conector; todo registrado.
- Sin reseñas falsas, sin scraping que viole ToS, sin contactar leads sin opt-in.

---

## 3. Matriz de rutinas

### Diarias (lun–vie, mañana)
| Tarea | Hermes hace | Fuente | Output | Autonomía |
|---|---|---|---|---|
| Lead check | Lee leads nuevos, los clasifica/prioriza, alerta | Supabase | Alerta + lista priorizada | Auto (read) |
| SLA watch | Marca leads sin responder >1h | Supabase | Recordatorio al dueño | Auto |
| Pulso analytics | Snapshot de ayer (sesiones, eventos, conversiones) | GA4 API | Mini-reporte | Auto |
| Salud SEO | Crawl de 6 URLs (200/canonical/schema) + errores GSC | fetch + GSC | Alerta si algo rompe | Auto |
| Borrador social | 1–2 posts (IG/FB) + 1 GBP post | Claude | Borradores a aprobar | Asistido |
| Radar tendencias (light) | Trends del rubro (celosías, portones, CNC) | Trends APIs | Nota de oportunidades | Auto |

### Semanales (lunes)
| Tarea | Output |
|---|---|
| Auditoría SEO | Posiciones, CTR, páginas top/oportunidad (GSC) + technical crawl |
| Keywords nuevas | 10–20 keywords/temas con volumen e intención |
| Artículo SEO | 1 borrador de blog (de la lista de 20) |
| Revisión Analytics | Conversiones por canal/página, CPL si hay Ads, tendencia semanal |
| Revisión Search Console | Cobertura, indexación de las 5 páginas, errores de datos estructurados |
| Calendario de contenido | Plan de la semana siguiente (posts + reels + GBP) |
| Ads review (si activo) | Rendimiento, negativas nuevas, pausar/escalar |

### Mensuales
| Tarea | Output |
|---|---|
| Reporte ejecutivo | KPIs del mes: leads, CPL, cierre, ventas, ROAS, SEO (clics/posición) |
| Oportunidades de negocio | Segmentos/comunas/servicios con demanda creciente |
| Nuevos productos / nichos | Ideas validadas por tendencias + búsquedas |
| Performance de contenido | Qué formatos/temas convirtieron; doblar apuestas |
| Re-priorización backlog | Actualizar este backlog con datos reales |

---

## 4. Diseño de responsabilidades clave

### 4.4 Generación automática de contenido
- Pipeline: Hermes genera **borradores** (post/caption/hashtags/CTA WhatsApp) → cola de aprobación
  (WhatsApp/Telegram del dueño con botón Aprobar/Editar) → publica vía API en horario óptimo.
- Mantiene un **calendario** y un **banco de ideas** (20 artículos, 30 posts, 20 reels ya definidos).
- Blog: genera artículo + meta + imagen sugerida → **PR al repo** (requiere sección `/blog`, código).

### 4.5 Vigilancia comercial (sin violar ToS)
- Fuentes oficiales: **Google Trends**, **Pinterest Trends**, **Meta Ad Library** (anuncios de
  competencia), **GSC** (qué nos buscan), Google Maps (competidores locales y sus reseñas/categorías).
- Detecta: tendencias CNC, diseños populares de celosías/portones, productos con demanda creciente.
- Output: informe semanal de oportunidades + ideas de producto/contenido. **No scraping agresivo.**

### 4.6 Sistema de captación y clasificación de leads
- **Web form** (hoy): Hermes lee `leads` en Supabase, **scorea** (servicio, ciudad, urgencia,
  presupuesto si viene), prioriza y alerta. Estados: Nuevo→Contactado→Cotizado→Negociación→Ganado/Perdido.
- **WhatsApp** (requiere WhatsApp Cloud API): clasifica mensajes entrantes, sugiere respuesta/plantilla,
  registra en el pipeline. **Responder = aprobación humana** al inicio.
- **Correo** (requiere Gmail/IMAP): detecta RFQs por email, los normaliza al mismo pipeline.
- Fuente de verdad única del pipeline = Supabase (o CRM ligero sincronizado).

---

## 5. Backlog priorizado (alto impacto)

| # | Iniciativa | Impacto | Esfuerzo | Prioridad | Dependencia |
|---|---|---|---|---|---|
| 1 | **Validar form E2E en prod** (Supabase persiste + Resend envía) | Altísimo | Bajo | 🔴 P0 | Envs Vercel |
| 2 | Confirmar `submit_quote_form` + **marcar Key Events** GA4 | Alto | Bajo | 🔴 P0 | Acceso GA4 |
| 3 | Solicitar indexación 5 páginas + reenviar sitemap | Alto | Bajo | 🔴 P0 | GSC |
| 4 | Crear/optimizar **GBP** (SAB, categorías, servicios, fotos, posts) | Alto | Medio | 🔴 P0 | Datos NAP |
| 5 | Lanzar **Google Ads Search** (Corte Láser/Celosías/Portones) | Alto | Medio | 🟠 P1 | Presupuesto + GA4↔Ads |
| 6 | Pipeline de leads + SLA <1h + plantillas WhatsApp | Alto | Bajo | 🟠 P1 | — |
| 7 | **Hermes Fase 0** (conectores read: GA4, GSC, Supabase) + reportes diarios | Alto | Medio | 🟠 P1 | API keys |
| 8 | **Meta click-to-WhatsApp** Ads | Medio-Alto | Medio | 🟠 P1 | Cuenta Meta |
| 9 | Fotos reales (taller/proyectos) → badge "Trabajo realizado" | Medio-Alto | Bajo* | 🟠 P1 | Fotos del cliente |
| 10 | **Sección `/blog`** (código) + 5 artículos prioritarios | Alto (SEO) | Medio | 🟡 P2 | Aprobación código |
| 11 | **Páginas servicio×ciudad** (`/corte-laser-cnc-santiago`, `-buin`) | Alto (SEO local) | Medio | 🟡 P2 | Aprobación código |
| 12 | **Meta Pixel/CAPI** (retargeting/optimización web) | Medio | Bajo | 🟡 P2 | Aprobación código |
| 13 | **WhatsApp Cloud API** (Hermes lee/clasifica WhatsApp) | Alto | Alto | 🟡 P2 | Meta Business + nº verificado |
| 14 | Cola de aprobación + publicación social automatizada | Medio | Alto | 🟢 P3 | Meta/LinkedIn API |
| 15 | Reportes ejecutivos mensuales automáticos | Medio | Medio | 🟢 P3 | Fase 0 lista |

\* Bajo en código (1 flag por imagen); requiere que el cliente entregue fotos.

---

## 6. Roadmap 90 días

| Pista | Mes 1 (Activar y medir) | Mes 2 (Escalar y automatizar) | Mes 3 (Optimizar) |
|---|---|---|---|
| **Técnico** | P0: validar form E2E; arreglar envs si faltan | Meta Pixel; sección `/blog` | Páginas servicio×ciudad |
| **Comercial** | GBP + Google Ads Search + pipeline leads | Meta click-to-WhatsApp; remarketing | Escalar canales rentables; casos/reseñas |
| **SEO** | Indexación 5 páginas; GBP; NAP | 4–6 artículos; keywords nuevas | Link building local; servicio×ciudad |
| **IA / Hermes** | Fase 0 read (GA4/GSC/Supabase) + reportes diarios | Clasificación de leads + borradores de contenido en cola | WhatsApp Cloud API (clasificación asistida) |
| **Automatizaciones** | Alertas de leads + SLA | Calendario + publicación asistida (aprobación) | Reporte ejecutivo mensual automático |

---

## 7. Decisiones/accesos que necesito de ti para activar Hermes

1. **Validación del funnel (P0):** ¿hago/te guío en 1 envío real de prueba del formulario para
   confirmar Supabase + Resend? (No requiere código.)
2. **Accesos read para Hermes:** crear service account para **GA4 Data API** y **GSC API**;
   confirmar acceso a la **DB de Supabase** (URL + key de solo lectura).
3. **Datos NAP** para GBP/LocalBusiness (dirección o decisión SAB) + categorías a usar.
4. **Presupuesto** mensual para Google/Meta Ads.
5. **WhatsApp:** ¿quieres integrar WhatsApp Cloud API (Meta Business)? Es la pieza más potente
   para que Hermes vea/clasifique leads, pero la de mayor esfuerzo.
6. **Aprobación de código** para los items P2 (blog, páginas ciudad, Meta Pixel) cuando toque.

> Nada se ejecuta sin tu OK. Hermes arranca en modo **read-only + borradores**; la autonomía de
> publicación/respuesta se habilita progresivamente con compuertas de aprobación.
