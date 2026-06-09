# Hermes — Fase 0 · Plan de Implementación (VPS Hostinger)

> Read-only estricto. Node.js + TypeScript. Salida: **Discord** (primario) + **email** (respaldo
> de reportes semanales y alertas críticas). **Diseño/plan — no ejecutar hasta aprobación.**
> Hermes vive en su propio repo `hermes-agent` (separado de `metalmotor-ai`).

## 0. Alcance y principios
- Conectores read-only: **GA4 Data API · Search Console API · Supabase (rol SELECT-only) · GitHub (PAT read)**.
- IA: **Claude** (Anthropic API) para ideas de marketing y recomendaciones accionables.
- **Sin escritura, sin acciones salientes** salvo notificar (Discord/email). Kill-switch `HERMES_ENABLED`.
- Secretos en `.env` (chmod 600) y `secrets/` (montados como Docker volume); nunca en repo/logs.

## 1. Estructura de carpetas (`hermes-agent/`)
```
hermes-agent/
├─ docker-compose.yml
├─ Dockerfile
├─ .env                      # 600, gitignored
├─ .env.example
├─ package.json  tsconfig.json
├─ secrets/                  # gitignored, 600
│  └─ ga-sa.json             # service account GA4/GSC
├─ data/                     # gitignored (estado/snapshots)
│  └─ hermes.db              # SQLite (deltas DoD/WoW, dedup de alertas)
├─ logs/
└─ src/
   ├─ index.ts               # bootstrap + scheduler
   ├─ config/env.ts          # validación de env con zod
   ├─ ai/claude.ts           # cliente Anthropic (ideas/recos)
   ├─ connectors/
   │  ├─ ga4.ts              # GA4 Data API (readonly)
   │  ├─ gsc.ts              # Search Console API (readonly)
   │  ├─ supabase.ts         # pg SELECT-only (leads/quotes/contacts)
   │  ├─ github.ts           # octokit (read)
   │  └─ siteHealth.ts       # probes HTTP a sitio y /api/contact
   ├─ state/store.ts         # SQLite (snapshots + alert state)
   ├─ reports/
   │  ├─ dailyBrief.ts  seoWatch.ts  marketingWatch.ts  executiveReport.ts
   │  └─ format.ts           # helpers Markdown / embeds Discord
   ├─ marketing/ideas.ts     # prompts Claude: 3 FB, 3 LinkedIn, 3 Reels, 5 keywords
   ├─ alerts/monitor.ts      # evaluación + dedup + cooldown
   ├─ notify/discord.ts      # envío a canal (REST Bot)
   ├─ notify/email.ts        # respaldo (Resend o SMTP)
   ├─ scheduler/jobs.ts      # node-cron (TZ America/Santiago)
   └─ lib/logger.ts          # logs sin secretos
```

## 2. Stack y dependencias
- Runtime: **Node 22 (alpine)**, TypeScript.
- Libs: `@google-analytics/data`, `googleapis`, `pg`, `@octokit/rest`, `@anthropic-ai/sdk`,
  `node-cron`, `better-sqlite3`, `zod`, `undici` (fetch), `pino` (logs). Discord vía REST (sin librería pesada) o `discord.js` (opcional).

## 3. Variables de entorno (`.env.example`)
```dotenv
# General
TZ=America/Santiago
HERMES_ENABLED=true
LOG_LEVEL=info

# IA
ANTHROPIC_API_KEY=sk-ant-...

# GA4 (read)
GOOGLE_APPLICATION_CREDENTIALS=/secrets/ga-sa.json
GA4_PROPERTY_ID=000000000

# Search Console (read) — mismo service account
GSC_SITE_URL=sc-domain:metalmotor.cl        # o https://www.metalmotor.cl/

# Supabase (rol SELECT-only)
SUPABASE_RO_DATABASE_URL=postgresql://hermes_ro:***@<host>.supabase.co:5432/postgres?sslmode=require

# GitHub (fine-grained PAT read)
GITHUB_TOKEN=github_pat_***
GITHUB_REPO=HJVT6842/metalmotor-ai

# Discord (primario)
DISCORD_BOT_TOKEN=***
DISCORD_CHANNEL_ID=000000000000000000        # reportes
DISCORD_ALERTS_CHANNEL_ID=000000000000000000 # alertas críticas (puede ser el mismo)

# Email (respaldo: semanal + alertas críticas)
RESEND_API_KEY=re_***                        # o SMTP_HOST/PORT/USER/PASS
REPORT_EMAIL_TO=ventas@metalmotor.cl
REPORT_EMAIL_FROM=hermes@metalmotor.cl       # remitente verificado en Resend

# Salud del sitio
SITE_URL=https://www.metalmotor.cl
CONTACT_API_URL=https://www.metalmotor.cl/api/contact

# Umbrales / horarios (cron en America/Santiago)
HEALTH_INTERVAL_CRON=*/5 * * * *
DAILY_BRIEF_CRON=0 6 * * *
SEO_WATCH_CRON=0 12 * * *
MARKETING_WATCH_CRON=0 18 * * *
EXEC_REPORT_CRON=0 22 * * *
LEADS_ZERO_HOURS=72
CONVERSION_DROP_PCT=50
```

## 4. Docker Compose + Dockerfile
**docker-compose.yml**
```yaml
services:
  hermes:
    build: .
    container_name: hermes
    restart: unless-stopped
    env_file: .env
    environment:
      - NODE_ENV=production
    volumes:
      - ./secrets:/secrets:ro      # service account (solo lectura)
      - ./data:/app/data           # SQLite persistente
      - ./logs:/app/logs
    # Sin puertos expuestos: Hermes no recibe tráfico entrante (solo egress).
```
**Dockerfile**
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

## 5. Scheduler (`node-cron`, TZ America/Santiago)
| Job | Cron | Contenido |
|---|---|---|
| Health monitor | `*/5 * * * *` | probes sitio + /api/contact + salud de conectores |
| **Daily Brief** | `0 6 * * *` | GA4 (ayer + delta 7d), leads/SLA (Supabase), SEO (GSC), build/deploy (GitHub), comercial, alertas |
| **SEO Watch** | `0 12 * * *` | GSC foco: queries/páginas, posiciones, cobertura, indexación 5 páginas + **5 keywords nuevas** |
| **Marketing Watch** | `0 18 * * *` | pulso conversiones + **3 FB · 3 LinkedIn · 3 Reels** (Claude) + tendencia |
| **Executive Report** | `0 22 * * *` | consolidado del día + **recomendaciones comerciales accionables** |
- Cada job: try/catch → si falla, alerta de "Error {conector}". Respeta `HERMES_ENABLED`.

## 6. Módulos (contratos read-only)
- **ga4.ts** → `getDailyMetrics(range)`, `getKeyEvents()` (page_view, page_service_view, click_whatsapp, submit_quote_form), `getByChannel()`, `getByPage()`. Scope `analytics.readonly`.
- **gsc.ts** → `getSearchAnalytics(range)` (query/page: clicks, impressions, ctr, position), `getCoverage()`. Scope `webmasters.readonly`.
- **supabase.ts** → `getNewLeads(since)`, `getLeadCounts()`, `getQuotes()`, `getTopServices()`, `getPipeline()`. Solo `SELECT` (rol `hermes_ro`).
- **github.ts** → `getRecentCommits()`, `getOpenPRs()`, `getLatestCIStatus()`. PAT read.
- **siteHealth.ts** → `checkSite()` (GET `SITE_URL`, espera 200), `checkContactApi()` (POST inválido → espera **422**, NO crea lead; o GET → 405). Marca caídas/timeouts.
- **marketing/ideas.ts** → usa Claude para generar ideas/keywords con el contexto de servicios y ciudades (Santiago/Buin/RM), formato JSON validado con zod.

## 7. Integración Discord (Bot `MI_Hermes_hjvt6842_BOT`)
- **Envío** vía REST API del bot (sin mantener gateway abierto, salida-only):
  `POST https://discord.com/api/v10/channels/{DISCORD_CHANNEL_ID}/messages`
  header `Authorization: Bot {DISCORD_BOT_TOKEN}`.
- **Permisos del bot:** invitado al servidor con permiso *Send Messages* (+ *Embed Links*) en el/los canales objetivo. Sin permisos de administración.
- **Límite 2000 chars** → reportes largos se envían como **embeds** (campos) o se **trocean**; el Weekly/Executive además puede adjuntarse como `.md`.
- Alertas críticas → `DISCORD_ALERTS_CHANNEL_ID` con `@mención`/prefijo `🚨`.
```ts
// notify/discord.ts (firma ilustrativa)
export async function sendDiscord(channelId: string, content: string, embeds?: unknown[]): Promise<void>
```

## 8. Email de respaldo
- `notify/email.ts` (Resend o SMTP) para: **Executive/Weekly report** y **alertas críticas** (redundancia si Discord falla).
- Remitente verificado (depende de verificar dominio en Resend; mientras tanto onboarding sender).

## 9. Alertas críticas — método de detección y factibilidad en Fase 0
| Alerta | Detección | Fase 0 |
|---|---|---|
| Caída del sitio (HTTP≠200) | `siteHealth.checkSite()` cada 5 min | ✅ |
| Error en `/api/contact` | POST inválido espera 422 (sin crear lead) | ✅ |
| Leads = 0 por 72h | Supabase: max(created_at) vs ahora | ✅ |
| Error Supabase | falla la consulta RO | ✅ |
| Error GA4 | falla la llamada GA4 | ✅ |
| Error Search Console | falla la llamada GSC | ✅ |
| Conversiones −50% vs promedio semanal | GA4: key events hoy vs media 7d | ✅ |
| **Error Resend** | ⚠️ requiere **conector opcional de lectura a Resend API** (`RESEND_API_KEY` read) o test E2E sintético | **Add recomendado** (fuera del alcance RO actual) |

- **Dedup/cooldown:** estado en SQLite; notifica al **cambiar de estado** (caído→arriba) y 1 vez por incidente con cooldown (p. ej. 60 min) para no spamear.

## 10. Reportes (incluyen lo comercial pedido)
Cada reporte (Daily/SEO/Marketing/Executive) incorpora según corresponda:
- **Técnico:** tráfico, eventos clave, SEO, build/deploy, alertas.
- **Comercial:** leads nuevos · cotizaciones nuevas · click WhatsApp · **top servicios consultados** · tendencia diaria/semanal · **recomendaciones comerciales accionables**.
- **Marketing (18:00):** 3 ideas FB · 3 LinkedIn · 3 Reels · 5 keywords SEO (Corte Láser/Celosías/Portones/Soldadura/Diseño CAD).
- Formato Markdown (plantillas Daily/Weekly del diseño previo `hermes-fase0-design.md` §8), adaptado a embeds de Discord.

## 11. Procedimiento de despliegue
1. **Crear repo** `hermes-agent` (privado) y clonar en el VPS: `/opt/hermes-agent`.
2. `cp .env.example .env` y completar (credenciales del Procedimiento §4 del diseño previo).
3. Colocar `secrets/ga-sa.json` (chmod 600); `chmod 600 .env`.
4. **Crear el rol Supabase `hermes_ro`** (SQL del diseño previo §2.3) y armar `SUPABASE_RO_DATABASE_URL`.
5. **Invitar el bot** al servidor Discord con permiso *Send Messages* en los canales; copiar `DISCORD_CHANNEL_ID`.
6. `docker compose build`.
7. **Self-test (sin scheduler):** `docker compose run --rm hermes node dist/index.js --selftest`
   → valida cada conector (1 lectura), envía 1 mensaje de prueba a Discord y 1 email de prueba. No agenda nada.
8. Si todo OK → `HERMES_ENABLED=true` → `docker compose up -d`.
9. Verificar logs: `docker compose logs -f hermes`.

## 12. Procedimiento de rollback
> Riesgo bajo: Hermes es read-only (no muta datos de Metal Motor).
- **Pausa inmediata (sin desplegar):** `HERMES_ENABLED=false` → `docker compose up -d` (los jobs no corren).
- **Detener:** `docker compose down` (sin `-v`, conserva `data/`).
- **Revertir versión:** `git checkout <tag-anterior>` → `docker compose build` → `up -d` (usar tags/imagenes versionadas).
- **Revocar accesos (si fuga):** rotar PAT GitHub, rotar password del rol `hermes_ro`, regenerar key del service account, regenerar token del bot.
- **Restaurar estado:** `data/hermes.db` es solo snapshots; borrarlo solo re-inicializa deltas (no afecta a Metal Motor).

## 13. Checklist de validación
- [ ] `--selftest` pasa: GA4 devuelve filas · GSC devuelve filas · Supabase `SELECT` OK (y `INSERT` **falla** = rol RO correcto) · GitHub lista commits.
- [ ] Mensaje de prueba llega al **canal Discord** correcto.
- [ ] Email de prueba llega a `REPORT_EMAIL_TO`.
- [ ] Health probe: `SITE_URL`→200 y `/api/contact` (POST inválido)→422.
- [ ] Simular caída (apuntar `SITE_URL` a una ruta 404 temporal) → **dispara alerta** en Discord; al restaurar → notifica recuperación.
- [ ] Dedup: una caída sostenida no genera spam (1 alerta + cooldown).
- [ ] Dry-run de cada reporte (`--run daily|seo|marketing|exec`) → formato correcto en Discord.
- [ ] Verificar que **no hay puertos expuestos** y que `.env`/`secrets` son `600`.
- [ ] Confirmar que ninguna credencial aparece en `logs/`.

## 14. Roadmap posterior (tras 7 días estable)
- **Fase 1 — Automatización de contenido:** publicar (con aprobación) los borradores en FB/IG/LinkedIn vía APIs.
- **Fase 2 — Clasificación automática de leads:** scoring + enrutamiento + sugerencia de respuesta (WhatsApp Cloud API).
- **Fase 3 — Asistente comercial interno:** Q&A sobre datos, generación de cotizaciones borrador, seguimiento de pipeline.
> Cada fase agrega permisos de **escritura/acción** → se diseña y aprueba por separado, con compuertas de aprobación.

## 15. Para pasar a ejecución necesito de ti
1. Aprobación de este plan (o ajustes).
2. Confirmar si agregamos el **conector opcional Resend (read)** para cubrir la alerta "Error Resend".
3. Ejecutar el Procedimiento §11 en el VPS y cargar credenciales (tú; yo nunca las veo en claro).
