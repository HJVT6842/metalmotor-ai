# Hermes — Fase 0 (Read-Only) · Diseño técnico para aprobación

> Objetivo: conectar Hermes (VPS Hostinger, Docker, Claude) en modo **estrictamente
> read-only** a GA4, Search Console, Supabase y GitHub, para producir reportes
> diarios/semanales. **Sin acciones salientes, sin escritura, sin publicación.**
> Estado: DISEÑO — no ejecutar hasta aprobación.

## 0. Principios
- **Mínimo privilegio a nivel de credencial** (no por convención): cada conector usa un rol/scope que *no puede* escribir.
- **Secretos aislados** (archivo `.env` con permisos `600` o Docker secrets); nunca en repo ni logs.
- **Human-in-the-loop**: Hermes solo informa y sugiere; ninguna acción se ejecuta automáticamente en Fase 0.
- **Auditable**: cada lectura se registra (qué, cuándo, cuántas filas/llamadas).
- **Kill-switch**: una variable/flag desactiva todos los jobs.

## 1. Arquitectura

```
┌──────────────────────── VPS Hostinger · Docker (contenedor "hermes") ────────────────────────┐
│  Scheduler (cron)  →  Orquestador (Claude + lógica)  →  Conectores (READ-ONLY)                │
│                                                            │  GA4 Data API  (analytics.readonly)│
│                                                            │  Search Console API (webmasters.ro)│
│                                                            │  Supabase: rol PG SELECT-only       │
│                                                            │  GitHub: fine-grained PAT read       │
│  Estado local (SQLite/JSON) ← snapshots para deltas (DoD/WoW)                                  │
│  Reporte (Markdown) →  Canal de salida (Telegram bot  o  email Resend/SMTP)                    │
│  Logs + auditoría (rotación)        ·        Secretos: /secrets/*.json + .env (chmod 600)       │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Stack sugerido:** Node + TypeScript (consistente con el proyecto). Librerías oficiales:
  `@google-analytics/data` (GA4), `googleapis` (Search Console), `pg` (Supabase RO), `@octokit/rest` (GitHub).
- **Scheduler:** `node-cron` dentro del contenedor (o cron del host). Zona horaria `America/Santiago`.
- **Estado:** SQLite (`better-sqlite3`) o JSON para guardar el último snapshot y calcular variaciones.
- **Salida:** reporte Markdown → **Telegram** (recomendado, simple) o **email** a contacto@/ventas@.

## 2. Conectores (prioridad 1→4)

### 1) GA4 Data API (read)
- **Credencial:** Service Account de Google Cloud (JSON key).
- **Permiso mínimo:** en GA4 → *Property Access Management* → agregar el email del service account como **Viewer** (Lector). Scope: `analytics.readonly`.
- **Necesita:** **GA4 Property ID** (numérico; Admin → Property Settings — NO es el `G-VX5FKKPHZ8`).
- **Lee:** usuarios/sesiones, eventos clave (`page_view`, `page_service_view`, `click_whatsapp`, `submit_quote_form`), por fuente/medio y por página.

### 2) Search Console API (read)
- **Credencial:** mismo service account.
- **Permiso mínimo:** GSC → *Settings → Users & permissions* → agregar el email del service account como **Restricted**. Scope: `webmasters.readonly`.
- **Necesita:** identificar la propiedad: `sc-domain:metalmotor.cl` **o** `https://www.metalmotor.cl/` (según cómo esté verificada).
- **Lee:** clicks/impresiones/CTR/posición por query y página; estado de cobertura/indexación.

### 3) Supabase (read-only real)
- **Credencial:** **rol Postgres dedicado SELECT-only** (NO usar `service_role`, que es full-access).
- **Permiso mínimo (SQL a ejecutar luego, con aprobación):**
  ```sql
  create role hermes_ro with login password '<secreto-fuerte>';
  grant usage on schema public to hermes_ro;
  grant select on public.leads, public.quotes, public.contacts to hermes_ro;
  alter default privileges in schema public grant select on tables to hermes_ro; -- futuras tablas
  ```
- **Conexión:** `postgresql://hermes_ro:<secreto>@<host>.supabase.co:5432/postgres?sslmode=require`
  (VPS de larga vida → conexión directa 5432; o pooler 6543).
- **Lee:** leads/quotes/contacts (conteos, nuevos, scoring, SLA). No puede insertar/editar/borrar por diseño del rol.

### 4) GitHub (read-only)
- **Credencial:** **Fine-grained Personal Access Token** limitado al repo `HJVT6842/metalmotor-ai`.
- **Permisos mínimos:** Contents: **Read** · Metadata: **Read** · Commits/Commit statuses: **Read** · Pull requests: **Read** · Actions: **Read** (estado CI). **Sin write.** Expiración 90 días.
- **Lee:** últimos commits, PRs abiertos, estado de CI/deploy.

## 3. Credenciales necesarias (resumen) → variables de entorno de Hermes
| Conector | Qué entregar | Env var (VPS) |
|---|---|---|
| GA4 | JSON del service account + Property ID | `GOOGLE_APPLICATION_CREDENTIALS=/secrets/ga-sa.json` · `GA4_PROPERTY_ID` |
| GSC | (mismo SA, agregado como usuario) + propiedad | `GSC_SITE_URL` |
| Supabase | connection string del rol `hermes_ro` | `SUPABASE_RO_DATABASE_URL` (secreto) |
| GitHub | fine-grained PAT (read) | `GITHUB_TOKEN` · `GITHUB_REPO=HJVT6842/metalmotor-ai` |
| Salida | Telegram o SMTP | `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (o credenciales SMTP) |
| General | — | `TZ=America/Santiago` · `HERMES_ENABLED=true` (kill-switch) |

## 4. Procedimiento paso a paso (para ejecutar tras aprobación)
**A. Google Cloud (GA4 + GSC):**
1. Crear proyecto en Google Cloud (o usar uno existente).
2. Habilitar **Google Analytics Data API** y **Search Console API**.
3. Crear **Service Account** → generar **clave JSON** (descargar una vez).
4. En **GA4** → Property Access Management → agregar el email del SA como **Viewer**.
5. En **GSC** → Users & permissions → agregar el email del SA como **Restricted**.
6. Anotar **GA4 Property ID** y la **propiedad GSC**.

**B. Supabase:**
7. SQL Editor → ejecutar el bloque `create role hermes_ro …` (sección 2.3) con una contraseña fuerte.
8. Construir el `SUPABASE_RO_DATABASE_URL` con ese usuario.

**C. GitHub:**
9. Settings → Developer settings → **Fine-grained tokens** → repo `HJVT6842/metalmotor-ai` → permisos Read (sección 2.4) → expiración 90d → generar token.

**D. VPS / Docker:**
10. Colocar `ga-sa.json` en `/secrets/` (chmod 600) y crear `.env` (chmod 600) con las variables de la tabla §3.
11. Desplegar el contenedor `hermes` (read-only) con el scheduler desactivado (`HERMES_ENABLED=false`) → primera corrida manual de prueba → si OK, activar.

> ⚠️ **Tú entregas las credenciales; yo nunca las veo en claro.** Se cargan directo en el `.env`/secrets del VPS.

## 5. Seguridad y permisos mínimos (matriz)
| Conector | Puede leer | NO puede (garantizado por credencial) |
|---|---|---|
| GA4 | reportes de la propiedad | editar config, otras propiedades |
| GSC | métricas/cobertura de la propiedad | enviar sitemaps, cambios, otras propiedades |
| Supabase | SELECT en leads/quotes/contacts | INSERT/UPDATE/DELETE, DDL, otras tablas |
| GitHub | contenido/commits/PR/CI del repo | push, merge, settings, otros repos |

Controles adicionales: secretos `600`/Docker secrets · rotación (PAT 90d, claves SA y rol RO rotables) · logs sin secretos · `HERMES_ENABLED` kill-switch · rate limiting/retries por conector · sin endpoints entrantes (solo egress a las 4 APIs + canal de salida).

## 6. Tareas diarias (read-only)
| Tarea | Fuente | Salida |
|---|---|---|
| Snapshot de ayer (usuarios/sesiones/eventos clave) + delta vs día previo y media 7d | GA4 | sección "Tráfico & Conversiones" |
| Leads nuevos desde la última corrida + scoring + alerta SLA | Supabase | sección "Leads" |
| Top queries/páginas (clicks/impresiones/CTR/posición) + errores de cobertura | GSC | sección "SEO" |
| Últimos commits, PRs abiertos, estado de CI/deploy | GitHub | sección "Build/Deploy" |
| Alertas (caídas, anomalías, leads sin atender) | todas | sección "⚠️ Alertas" |

## 7. Tareas semanales (read-only)
| Tarea | Fuente | Salida |
|---|---|---|
| SEO WoW: posiciones, oportunidades, indexación de las 5 páginas, errores de datos estructurados | GSC | "Auditoría SEO semanal" |
| Conversiones por canal/página + tendencia semanal | GA4 | "Analytics semanal" |
| Resumen de leads: volumen por fuente/servicio + estado del pipeline | Supabase | "Comercial semanal" |
| Salud del repo/deploy de la semana | GitHub | "Técnico semanal" |
| Ideas de keywords/temas (a partir de queries emergentes) | GSC | "Oportunidades" (sugerencias, no acciones) |

## 8. Formato de reportes

### Daily Brief (Markdown, ~1 pantalla)
```
🔧 Metal Motor — Daily Brief · {fecha} (America/Santiago)

📈 Tráfico & Conversiones (ayer vs media 7d)
- Sesiones: 120 (▲12%) · Usuarios: 98
- click_whatsapp: 7 (▲2) · submit_quote_form: 3 (▲1) · page_service_view: 22
- Top fuente: google/organic (45%), directo (20%), cpc (15%)

🧲 Leads (Supabase)
- Nuevos (24h): 4  →  [#id corto · servicio · comuna · score]
- ⏰ Sin atender >1h hábil: 1 (prioridad alta)

🔎 SEO (GSC, último día disponible)
- Clicks: 38 (▲) · Impresiones: 1.240 · CTR 3.1% · Pos. media 14,2
- Query emergente: "celosías metálicas santiago" (pos 18 → 12)
- Cobertura: sin errores nuevos

🛠️ Build/Deploy
- Último commit: 8948c2b (main) · CI: ✅ · Deploy Vercel: Ready

⚠️ Alertas
- (ninguna) | o: "1 lead sin responder", "caída de tráfico -30%", etc.

💡 Sugerencias (no ejecutadas)
- Responder lead #a1b2 (celosías, Buin)
- Revisar página /portones-metalicos (impresiones altas, CTR bajo)
```

### Weekly Report (Markdown)
```
🔧 Metal Motor — Reporte Semanal · semana {n} ({rango})

1) Resumen ejecutivo (3 bullets)
2) Tráfico & Conversiones (tabla WoW: sesiones, click_whatsapp, submit_quote_form, por canal)
3) SEO (top 10 queries/páginas, cambios de posición, indexación 5 páginas, errores schema)
4) Comercial / Leads (volumen por fuente/servicio, pipeline, SLA, ideas de mejora)
5) Técnico (commits, PRs, deploys, salud)
6) Oportunidades & recomendaciones priorizadas (P0/P1/P2) — SUGERENCIAS
7) Anexos: métricas crudas
```

## 9. Para pasar a ejecución necesito de ti
1. **Aprobación de este diseño** (o ajustes).
2. Canal de salida elegido: **Telegram** (recomendado) o **email** (contacto@/ventas@).
3. Stack confirmado: **Node/TS** (sugerido) u otro.
4. Cuando aprobemos, ejecutas el **Procedimiento §4** y cargas credenciales en el VPS (yo nunca las veo en claro).

> Fase 0 = solo lectura + reportes. La autonomía de publicación/respuesta (Fase 1+) se diseña aparte, con compuertas de aprobación.
