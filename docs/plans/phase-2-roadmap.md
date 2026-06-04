# MetalMotor-AI — Phase 2 Execution Plan / Roadmap

> Status: PLANNING ONLY. This document proposes architecture, sequencing, and data-model evolution.
> No application code is changed by this document. Implementation begins only after the open
> questions (§9) are confirmed and individual workstreams are turned into approved `/plan`s.
>
> Conventions in force (carried from Phase 0/1, non-negotiable): immutability, small files
> (200–400 lines, 800 max), zod validation at every system boundary, secrets only in server-side
> env vars (never hardcoded, never in `NEXT_PUBLIC_*`), TDD-first (RED → GREEN → IMPROVE),
> surgical changes.

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current-State Assessment](#2-current-state-assessment)
3. [Architecture Decisions](#3-architecture-decisions)
4. [Data Model Evolution](#4-data-model-evolution)
5. [Phased / Sequenced Workstreams](#5-phased--sequenced-workstreams)
6. [Cross-Cutting Concerns](#6-cross-cutting-concerns)
7. [Risks & Mitigations](#7-risks--mitigations)
8. [Definition of Done per Workstream](#8-definition-of-done-per-workstream)
9. [Open Questions](#9-open-questions)

---

## 1. Executive Summary

**Recommendation:** Execute Phase 2 in six sequenced workstreams in this order: **(WS0) foundations
→ (WS1) Auth → (WS2) Leads CRM → (WS3) Notifications → (WS4) Content & Images → (WS5) SEO → (WS6)
AI groundwork.** Auth must land before any admin UI; the notifications module must exist before
email/WhatsApp channels plug into it; content tables must exist before SEO per-service pages can be
data-driven. The recommended stack additions are **Auth.js / NextAuth v5 (credentials + database
sessions on Supabase)**, **Resend** for transactional email, **Supabase Storage** for images, a
**Supabase-backed content model with admin CRUD**, and a **swappable `ai/` provider interface
defaulting to Anthropic Claude 4.x** that produces zod-validated structured output.

Phase 1 already gives Phase 2 an unusually clean starting point: boundary validation
(`src/lib/validation.ts`), graceful-degradation persistence (`src/app/api/contact/route.ts`,
`src/lib/supabase/server.ts`), an RLS-locked `leads` table (`supabase/migrations/0001_create_leads.sql`),
and a lazy env guard (`src/lib/env.ts`). The main gaps are: no auth, no admin surface, no
`notifications/` module (only a TODO at `route.ts:65`), static content in `src/data/*.ts`, a
single-URL sitemap (`src/app/sitemap.ts`), and no quotes data model.

The single biggest sequencing risk is **session strategy on Vercel serverless** — decide
JWT-vs-database sessions and service-role-key isolation in WS0/WS1 before building anything on top.

---

## 2. Current-State Assessment

### 2.1 What Phase 1 already provides (Phase 2 builds directly on these)

| Capability | Evidence | How Phase 2 reuses it |
|---|---|---|
| Boundary validation pattern | `src/lib/validation.ts:8` (`contactSchema`), tested in `src/lib/validation.test.ts` | All new inputs (admin forms, AI output) follow the same zod-at-boundary pattern. |
| Graceful-degradation lead capture | `src/app/api/contact/route.ts:42-66` — inserts if configured, logs otherwise; honeypot at `:36` | Persist-before-notify ordering is already half-built; notifications slot in after the insert. |
| Server-only Supabase admin client | `src/lib/supabase/server.ts:15` returns `null` when unconfigured; `import "server-only"` at `:1` | Reused for CRM reads/writes via service role; admin reads should move to RLS + user session, not service role (see §6). |
| Lazy, validated env access | `src/lib/env.ts:27` (`getSupabaseServerEnv`) returns missing-keys instead of throwing | Extend the schema for new secrets (Resend, Auth.js, Anthropic, WhatsApp) using the same `EnvResult` shape. |
| RLS already enabled on `leads` | `supabase/migrations/0001_create_leads.sql:24` — RLS on, no public policy | CRM adds authenticated SELECT/UPDATE policies; the migration even notes "Staff/admin read access will be added." |
| Immutable domain types | `src/types/index.ts` (`Service`, `CatalogItem`, all `readonly`) | Content tables mirror these shapes; types extend rather than mutate. |
| SEO scaffolding | `src/app/layout.tsx:20-92` (metadata + LocalBusiness JSON-LD), `src/app/sitemap.ts`, `src/app/robots.ts` | SEO workstream expands JSON-LD, adds per-service routes, grows the sitemap. |
| WhatsApp link helpers (pure, tested) | `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts` | Click-to-chat stays; the *outbound* WhatsApp Cloud API notification is new and distinct. |
| Test/lint/build tooling | `package.json:5-13` — `vitest`, `tsc --noEmit`, `eslint`, `next build` | TDD-first workstreams gate on these exact commands. |

### 2.2 Concrete gaps Phase 2 must close

1. **No authentication.** There is no `auth` config, no middleware, no admin route group. `robots.ts:9`
   only disallows `/api/`; no `/admin` surface exists yet.
2. **No `notifications/` module.** The only marker is the TODO at `src/app/api/contact/route.ts:65`
   (`notify staff via WhatsApp Cloud API + transactional email`). Email and outbound WhatsApp are unbuilt.
3. **Leads CRM is insert-only.** `leads` has `status` (`migration 0001:13`) and indexes on `status`
   and `created_at`, but there is no UI, no status-transition logic, and no authenticated read path.
4. **Content is static.** `src/data/services.ts`, `src/data/catalog.ts`, and `src/data/site.ts` are
   hardcoded TS. `catalog.ts:6` and `services.ts:5` both contain comments explicitly anticipating a
   move to Supabase. No content tables exist.
5. **Images are placeholders.** `src/components/sections/Catalog.tsx:21-29` renders gradient blocks;
   `next.config.ts` has no `images` config; `next/image` is not used anywhere.
6. **SEO is single-page.** `sitemap.ts` emits one URL; there are no per-service routes; JSON-LD is a
   single static `LocalBusiness` block (`layout.tsx:61`) with no per-service `Service`/`FAQPage`/
   `BreadcrumbList`/`AggregateRating` schema and no `geo`/`openingHours`/`telephone` fields.
7. **No quotes data model.** Nothing for RFQ spec extraction, quotes, or quote line items exists.
8. **Env schema is Supabase-only.** `src/lib/env.ts:12-15` validates only `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY`. Every new integration needs a schema extension.

---

## 3. Architecture Decisions

Each decision leads with one recommendation, then the justification and alternatives considered.

### 3.1 Staff/admin authentication → **Auth.js (NextAuth v5) with Credentials provider + Supabase database sessions**

- **Recommendation:** Auth.js v5 (`next-auth@5`), Credentials provider for a small fixed staff set,
  database session strategy backed by Supabase (Auth.js Supabase/Postgres adapter). No buyer accounts
  (locked Phase 0/1 decision). Protect an `/(admin)` route group via `middleware.ts`.
- **Why:** First-class App Router support, runs on Vercel serverless, and the credentials model fits a
  handful of internal staff with no public sign-up. Database sessions give server-side revocation
  (important: a staff member leaving should kill their session immediately) and keep session lookup
  consistent with the data already in Supabase.
- **Alternatives considered:**
  - *Supabase Auth* — tempting since Supabase is already present, and it pairs natively with RLS
    `auth.uid()`. Rejected as the primary because it pulls session management into a second system and
    is heavier than needed for a fixed internal staff list; revisit if buyer accounts ever appear.
    (If chosen instead, RLS policies in §4 simplify because `auth.uid()` is native.)
  - *Clerk / Auth0* — managed, fast to wire, but adds a paid third-party dependency and external user
    store for what is a tiny internal team. Overkill.
  - *JWT (stateless) sessions in Auth.js* — lower DB load and simplest on serverless, but no
    server-side revocation. Acceptable fallback if the Supabase adapter proves awkward on Vercel; see
    §6 and Open Question Q1.

### 3.2 Email notifications → **Resend, behind a swappable `notifications/` provider interface**

- **Recommendation:** Define a channel-agnostic notification interface first; implement a Resend email
  channel and a WhatsApp Cloud API channel as two implementations of the same interface. Always persist
  the lead **before** dispatching notifications, and never let a notification failure change the API
  response the customer sees.
- **Why:** Resend has a clean API, good deliverability, React-email templating, and a generous free
  tier suited to low RFQ volume. The interface abstraction means swapping to SES/Postmark later is a
  one-file change. Persist-before-notify is already half-implemented (`route.ts:42-66`); we extend it.
- **Interface sketch (illustrative, not final):**
  ```ts
  // src/lib/notifications/types.ts
  export type LeadNotification = {
    readonly lead: LeadRecord & { readonly id: string };
    readonly receivedAt: string;
  };
  export type NotifyResult =
    | { readonly ok: true; readonly channel: string }
    | { readonly ok: false; readonly channel: string; readonly error: string };
  export interface NotificationChannel {
    readonly name: string;
    notify(payload: LeadNotification): Promise<NotifyResult>;
  }
  // src/lib/notifications/index.ts — dispatch to all configured channels,
  // collect results, never throw into the request path. Unconfigured channel = skip + log.
  ```
- **Alternatives considered:** SES (cheapest at scale, but more setup/IAM); Postmark (excellent
  deliverability, paid sooner); SendGrid (heavier, historically noisier API). Resend wins on
  time-to-value at this volume.
- **WhatsApp note:** outbound staff notification uses the **WhatsApp Cloud API** (Graph API token +
  phone-number ID), which is entirely separate from the existing client-side `wa.me` click-to-chat
  helpers in `src/lib/whatsapp.ts`. Both live under the same `NotificationChannel` interface.

### 3.3 Image storage → **Supabase Storage**

- **Recommendation:** Supabase Storage (a public bucket for catalog imagery, a private bucket if any
  internal docs appear later), served through `next/image`.
- **Why:** Supabase is already the system of record; one fewer vendor, one fewer set of credentials.
  Storage integrates with the same RLS/auth model, and admin uploads can reuse the authenticated
  Supabase client. Public read + authenticated write is a natural bucket policy.
- **Alternatives considered:** *Vercel Blob* — excellent DX and CDN co-located with the deploy, but
  introduces a second storage vendor and splits content (DB rows in Supabase, bytes in Blob). Choose
  Blob only if Supabase Storage egress/CDN performance proves insufficient in the Chile market
  (see Open Question Q3). *Cloudinary* — strong transformation pipeline but redundant with
  `next/image` optimization and adds cost.
- **Required config:** add the Supabase Storage hostname to `next.config.ts` `images.remotePatterns`
  (currently empty — `next.config.ts:3`). Mandate non-empty `alt` text at the content-model level
  (NOT NULL `alt_text` column, see §4) so SEO/accessibility is enforced by the schema, not by memory.

### 3.4 Content modeling → **Supabase-backed content tables with admin CRUD; keep `data/*.ts` as seed/fallback**

- **Recommendation:** Move `services` and `catalog` into Supabase tables with an authenticated admin
  CRUD UI. Page components read from the DB at build/request time (server components + Next.js caching).
  Seed the tables from the existing `src/data/services.ts` / `src/data/catalog.ts` so the live site is
  unchanged on day one and `data/*.ts` becomes the migration seed + a typed fallback.
- **Why:** Non-technical staff need to edit content without deploys (the explicit intent in the
  `catalog.ts:6` comment). Supabase-backed content keeps a single source of truth and reuses auth/RLS.
  Keeping the static files as seed preserves the current `readonly` typed shape (`src/types/index.ts`)
  and gives a deterministic fallback if the DB is unavailable — mirroring the existing
  graceful-degradation philosophy.
- **Alternatives considered:** *Headless CMS (Sanity/Contentful/Payload)* — richer editing UX but a
  whole new system, new auth, new cost, and overkill for ~6 services + a small catalog. *MDX/Git-based
  content* — great for developers, wrong for non-technical staff (requires a PR per edit). *Stay
  static* — rejected; it is the gap WS4 exists to close.
- **Rendering note:** prefer server components reading content directly; use Next.js cache
  revalidation (tag-based `revalidateTag` on admin save) so edits appear without a redeploy while
  keeping pages static-fast.

### 3.5 AI provider abstraction → **Swappable `ai/` interface, default Anthropic Claude 4.x, zod-validated structured output**

- **Recommendation:** Phase 2 builds the *seams* only (no live AI quoting). Define an `ai/` provider
  interface returning structured, zod-validated objects; ship a default Anthropic Claude 4.x adapter
  stubbed/feature-flagged off. The human-review loop and quotes tables (see §4) are built so Phase 3
  can flip the flag.
- **Why:** Locking the interface and data model now means Phase 3 AI work is additive, not invasive.
  Claude 4.x is the project's stated default and supports tool-use/structured output that maps cleanly
  to zod schemas — the same boundary-validation discipline already in `validation.ts` extends to
  model output (treat the model as an untrusted boundary).
- **Interface sketch (illustrative):**
  ```ts
  // src/lib/ai/types.ts
  export interface QuoteDraftProvider {
    readonly name: string;
    draftQuote(input: RfqSpec): Promise<QuoteDraft>; // QuoteDraft validated by a zod schema
  }
  ```
- **Alternatives considered:** *OpenAI / Gemini* — viable, but Claude is the locked default; the
  interface keeps them swappable. *No abstraction, call SDK directly* — rejected; violates the
  swappability requirement and would scatter prompt/parse logic.

---

## 4. Data Model Evolution

SQL-ish sketches only — these become real, reviewed migrations during implementation
(`supabase/migrations/0002_*.sql` onward). RLS notes assume **Auth.js database sessions**; if Supabase
Auth is chosen instead (Q1), policies can use native `auth.uid()` and the `staff` table becomes a
profile table linked to `auth.users`.

### 4.1 Staff / auth (WS1)

```sql
-- 0002_create_staff.sql (sketch)
create table public.staff (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  name        text not null,
  role        text not null default 'staff'   -- 'staff' | 'admin'
                check (role in ('staff','admin')),
  password_hash text,                          -- if Credentials provider; never plaintext
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
-- Auth.js database-session tables (sessions, accounts, verification_tokens)
-- are created by the Auth.js Supabase/Postgres adapter migration.
alter table public.staff enable row level security;
-- RLS: only service role (server) touches staff; no client policy.
```

### 4.2 Leads CRM (WS2) — evolve the existing `leads` table

```sql
-- 0003_extend_leads.sql (sketch). Existing columns from 0001 are kept.
alter table public.leads
  add column status_detail text,                       -- free-text note on current status
  add column assigned_to   uuid references public.staff(id),
  add column updated_at     timestamptz not null default now();

-- Tighten status to the locked CRM lifecycle.
alter table public.leads
  add constraint leads_status_check
  check (status in ('new','contacted','quoted','won','lost'));

-- Status-change audit trail (immutability: append-only, never edit history).
create table public.lead_events (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  actor_id    uuid references public.staff(id),
  from_status text,
  to_status   text,
  note        text,
  created_at  timestamptz not null default now()
);

-- RLS (Auth.js sessions): authenticated staff may SELECT/UPDATE leads and INSERT lead_events.
-- The public contact route keeps using the service-role key to INSERT leads (bypasses RLS),
-- so anonymous lead capture is unchanged. Add an authenticated read/update policy here —
-- this is the "Staff/admin read access" the 0001 migration comment promised.
```

> Note: `status` already exists (`0001:13`) with a default of `'new'` and a `status` index
> (`0001:19`); WS2 adds the lifecycle constraint, assignment, audit trail, and `updated_at`.

### 4.3 Content tables (WS4)

```sql
-- 0004_create_content.sql (sketch)
create table public.services (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  summary     text not null,
  highlights  jsonb not null default '[]',   -- string[]
  icon        text not null,                  -- mirrors ServiceIcon union in src/types
  sort_order  int  not null default 0,
  is_published boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table public.catalog_items (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  category    text not null,
  description text not null,
  tags        jsonb not null default '[]',    -- string[]
  sort_order  int  not null default 0,
  is_published boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table public.catalog_images (
  id            uuid primary key default gen_random_uuid(),
  catalog_item_id uuid not null references public.catalog_items(id) on delete cascade,
  storage_path  text not null,                -- Supabase Storage object path
  alt_text      text not null,                -- NOT NULL → enforces SEO/a11y alt text
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now()
);

-- RLS: public (anon) may SELECT only where is_published = true;
-- authenticated staff may do full CRUD. Storage bucket: public read, authenticated write.
```

### 4.4 Quotes / AI groundwork (WS6) — created but inert until Phase 3

```sql
-- 0005_create_quotes.sql (sketch)
create table public.rfq_specs (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  extracted   jsonb not null,                 -- zod-validated structured RFQ spec
  source      text not null default 'manual', -- 'manual' | 'ai'
  created_at  timestamptz not null default now()
);

create table public.quotes (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  status      text not null default 'draft'
                check (status in ('draft','in_review','sent','accepted','rejected')),
  drafted_by  text not null default 'human',  -- 'human' | 'ai'
  reviewed_by uuid references public.staff(id),
  currency    text not null default 'CLP',
  subtotal    numeric(12,2),
  total       numeric(12,2),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.quote_items (
  id          uuid primary key default gen_random_uuid(),
  quote_id    uuid not null references public.quotes(id) on delete cascade,
  description text not null,
  quantity    numeric(12,2) not null default 1,
  unit_price  numeric(12,2),
  line_total  numeric(12,2),
  sort_order  int not null default 0
);

-- RLS: staff-only CRUD. AI-drafted quotes land as status='draft'/drafted_by='ai'
-- and MUST pass through 'in_review' before a human sets 'sent' (human-review-then-send loop).
```

---

## 5. Phased / Sequenced Workstreams

Dependency order: **WS0 → WS1 → WS2 → WS3** (WS2/WS3 can overlap once WS1 lands)
**→ WS4 → WS5** (WS5 depends on WS4 content tables for data-driven service pages)
**→ WS6** (independent groundwork; can start in parallel after WS0, lands last). TDD-first throughout.

### WS0 — Foundations & decisions (effort: S)

- **Goals:** unblock everything; make the cross-cutting decisions concrete before building on them.
- **Tasks:** extend `src/lib/env.ts` schema for new secrets (names in §6); decide session strategy
  (Q1) and image vendor (Q3); add `images.remotePatterns` to `next.config.ts`; confirm Supabase
  project + service-role-key isolation plan; set up an integration-test DB approach (no mocking the DB
  for migration-touching tests — use a real Supabase test project/branch).
- **Dependencies:** none.
- **Exit criteria:** env schema parses all new keys with `EnvResult` shape; `tsc`/`lint`/`build` green;
  decisions Q1–Q3 recorded.

### WS1 — Staff/admin authentication (effort: M)

- **Goals:** authenticated `/(admin)` area; no buyer accounts.
- **Tasks:** install/configure Auth.js v5; Credentials provider against `staff` table
  (migration 0002); `middleware.ts` protecting `/(admin)`; login page; session helper for server
  components; seed initial admin staff (via secure script, not committed). Update `robots.ts` to
  disallow `/admin`.
- **Dependencies:** WS0.
- **Exit criteria:** unauthenticated `/admin` → redirect to login (tested); valid staff login →
  session established; inactive staff cannot log in; session revocation works (database sessions).

### WS2 — Leads CRM admin UI (effort: M/L)

- **Goals:** view, filter, assign, and status-transition leads with an audit trail.
- **Tasks:** migration 0003 (extend leads, `lead_events`, status constraint); authenticated RLS
  policies for staff read/update; admin list view (filter by status, search, date sort — reuse
  existing `status`/`created_at` indexes); lead detail with status transitions writing `lead_events`
  immutably; assignment to staff.
- **Dependencies:** WS1 (auth + `staff` table).
- **Exit criteria:** staff can list/filter/update leads; every status change appends a `lead_events`
  row; RLS verified (anon cannot read leads); public contact insert still works unchanged.

### WS3 — Notifications module (email + WhatsApp) (effort: M)

- **Goals:** notify staff on each new RFQ via email and WhatsApp, behind one swappable interface;
  never drop a lead on notifier outage.
- **Tasks:** create `src/lib/notifications/` (`types.ts`, `index.ts` dispatcher, `resend.ts`,
  `whatsapp-cloud.ts`); wire into `route.ts` **after** the successful insert (replace the TODO at
  `route.ts:65`); persist-before-notify; collect per-channel results, log failures, never change the
  customer-facing response; unconfigured channel = skip + log (graceful degradation, matching
  `supabase/server.ts` pattern).
- **Dependencies:** WS0 (env keys). Lead persistence already exists; WS2 not strictly required but
  pairs naturally.
- **Exit criteria:** new lead triggers email + WhatsApp to staff; simulated Resend/WhatsApp outage
  still returns `ok:true` to the customer and logs the failure; lead is persisted regardless;
  honeypot path (`route.ts:36`) sends no notification.

### WS4 — Real content & product images (effort: L)

- **Goals:** Supabase-backed services + catalog with admin CRUD and optimized images.
- **Tasks:** migrations 0004 (content tables + `catalog_images`); seed from `src/data/services.ts` /
  `src/data/catalog.ts`; Supabase Storage bucket + policies; admin CRUD UI (create/edit/publish,
  drag-sort, image upload with **required** alt text); convert `Services.tsx` and `Catalog.tsx` to read
  from DB (server components); replace gradient placeholders (`Catalog.tsx:21-29`) with `next/image`;
  tag-based cache revalidation on save; keep `data/*.ts` as typed fallback.
- **Dependencies:** WS1 (auth for CRUD), WS0 (image config).
- **Exit criteria:** staff edits content without a deploy; published content renders; unpublished
  hidden from anon (RLS); all images have non-empty alt text (enforced by NOT NULL); Lighthouse image
  audit clean; fallback path works when DB unavailable.

### WS5 — SEO optimization for Chile / es-CL (effort: M/L)

- **Goals:** local SEO/GEO/AEO depth for the Chilean market.
- **Tasks:** per-service landing routes (`/servicios/[slug]`) data-driven from the `services` table,
  each with unique title/description/keywords and `Service` + `BreadcrumbList` JSON-LD; expand
  `LocalBusiness` JSON-LD (`layout.tsx:61`) with `telephone`, `openingHours`/`hours` (from
  `site.ts:37`), `geo` coordinates, `priceRange`, `image`, and `sameAs` (Google Business Profile / IG);
  add `FAQPage` schema for AEO; grow `sitemap.ts` (currently 1 URL) to include all service routes +
  catalog; confirm `hreflang`/`lang="es-CL"` (already set, `layout.tsx:101`) and canonical strategy;
  Core Web Vitals pass (LCP via `next/image` from WS4); align NAP (name/address/phone) with Google
  Business Profile; Chile-specific keyword targeting in copy (e.g. "corte láser Santiago",
  "fabricación metálica Región Metropolitana").
- **Dependencies:** WS4 (service table drives per-service pages).
- **Exit criteria:** each service route renders unique metadata + valid structured data (Rich Results
  test passes); sitemap lists all live routes; Lighthouse SEO ≥ 95 and CWV "good"; JSON-LD validates;
  NAP matches GBP.

### WS6 — AI quotation groundwork (effort: M, no live AI)

- **Goals:** put the data model + provider seams in place so Phase 3 is additive.
- **Tasks:** migration 0005 (`rfq_specs`, `quotes`, `quote_items`); `src/lib/ai/` interface
  (`types.ts`, zod schemas for `RfqSpec` and `QuoteDraft`, a feature-flagged Anthropic Claude 4.x
  adapter that is OFF by default); a minimal staff "manual quote" UI proving the human-review→send loop
  (`draft` → `in_review` → `sent`); document where AI structured output plugs in and how AI-drafted
  quotes must pass human review before `sent`.
- **Dependencies:** WS0; pairs with WS2 (quotes link to leads). Can start after WS0 in parallel.
- **Exit criteria:** quotes tables + RLS in place; staff can hand-create a quote and walk it through the
  review→send lifecycle; `ai/` interface + zod schemas compile and are unit-tested with the provider
  flag OFF; no live AI calls in Phase 2.

---

## 6. Cross-Cutting Concerns

### Security
- **Service-role key isolation:** the service-role key bypasses RLS and must stay server-only
  (already enforced via `import "server-only"` at `supabase/server.ts:1`). New admin reads/writes should
  run under the **user session** with RLS policies, NOT the service-role key. Reserve the service-role
  path for the anonymous public contact insert (where there is no user) and trusted server jobs.
- **RLS everywhere:** every new table ships with RLS enabled and explicit policies (staff CRUD; anon
  SELECT only on published content). `leads` stays anon-no-read.
- **Session strategy on Vercel serverless:** prefer database sessions (server-side revocation) unless
  Q1 resolves to JWT for simplicity. Cookies must be `httpOnly`, `secure`, `sameSite=lax`.
- **AI output is an untrusted boundary:** validate every model response with zod before persisting,
  exactly as user input is validated in `validation.ts`.
- Pre-commit security checklist applies (no hardcoded secrets, parameterized queries via Supabase
  client, error messages already avoid leaking internals — see `route.ts:48-54`).

### Env var additions (NAMES ONLY — never values, never `NEXT_PUBLIC_*` for secrets)
- `AUTH_SECRET` (Auth.js)
- `AUTH_URL` (Auth.js, if required by deploy)
- `RESEND_API_KEY`
- `NOTIFICATIONS_TO_EMAIL` (staff inbox; could be non-secret config)
- `WHATSAPP_CLOUD_API_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_NOTIFY_TO` (staff number)
- `ANTHROPIC_API_KEY` (WS6, flag-gated)
- `AI_QUOTING_ENABLED` (feature flag, default false)
- All added to `src/lib/env.ts` schema with the existing `EnvResult` graceful pattern, and to
  `.env.example` with placeholders (matching the existing file's style).

### Performance
- `next/image` for all catalog imagery (WS4) to fix LCP; tag-based cache revalidation so DB-backed
  content stays static-fast; Supabase queries use existing indexes (`leads_status_idx`,
  `leads_created_at_idx`) and add indexes on content `slug`/`is_published`/`sort_order`.

### Accessibility
- `alt_text` is NOT NULL in `catalog_images` so a11y/SEO alt text cannot be skipped; admin forms
  require it. Maintain existing form a11y patterns (labels, `role="alert"`, `aria-hidden` honeypot) seen
  in `ContactForm.tsx`.

### i18n
- Single locale `es-CL` remains (`layout.tsx:101`, OpenGraph `es_CL` at `:43`). No multi-locale in
  Phase 2; ensure per-service pages keep `lang="es-CL"` and correct `hreflang` self-reference.

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Auth.js v5 + Supabase adapter friction on Vercel serverless | Blocks all admin work (WS2+) | Spike in WS0/WS1; JWT-session fallback (Q1) keeps WS1 unblocked; database sessions are the goal, not a hard gate. |
| Notification outage drops a lead | Lost revenue, silent failure | Persist-before-notify (extends `route.ts:42-66`); notifier failures logged, never alter customer response; unconfigured channel skips gracefully. |
| Service-role key leaks into client bundle | Full DB compromise (bypasses RLS) | `server-only` already enforced (`supabase/server.ts:1`); admin paths use user-session RLS, not service role; code review gate. |
| RLS misconfiguration exposes leads/content | Data leak | Each migration ships with explicit policies + an RLS test (anon read must fail) in the DoD. |
| Content migration breaks the live landing page | Public site regression | Seed tables from existing `data/*.ts`; keep static files as typed fallback; ship behind verified render tests before removing static reads. |
| SEO route sprawl outpaces sitemap | Unindexed pages | `sitemap.ts` generated from the `services` table, not hand-maintained; CWV/Rich-Results checks in DoD. |
| AI groundwork over-engineered for unknown Phase 3 needs | Wasted effort, churn | WS6 builds only data model + interface seams, flag OFF, no live calls; abstract only what Phase 3 demonstrably needs. |
| Supabase Storage CDN latency in Chile | Slow images, poor CWV | Measure in WS4; Vercel Blob is the documented fallback (Q3). |

---

## 8. Definition of Done per Workstream (evidence-based)

General gate for every workstream (run fresh, read output): `npm run typecheck` (0 errors),
`npm run lint` (0 errors), `npm run build` (exit 0), `npm test` (all pass, new tests included).
Regression tests follow Red→Green→Restore. No completion claim without fresh command output.

- **WS0:** env schema unit test passes for all new keys; `build` green; decisions Q1–Q3 written down.
- **WS1:** test — anon `/admin` redirects to login; valid staff logs in; inactive staff rejected;
  session revoked after logout/deactivation. Manual: login flow demoed.
- **WS2:** test — RLS denies anon `select` on `leads`; staff can update status; `lead_events` row
  appended per transition (immutable). Manual: filter/assign in UI; public contact insert still 200.
- **WS3:** test — successful insert triggers both channels; simulated channel failure → customer still
  gets `ok:true`, failure logged, lead persisted; honeypot sends nothing. Manual: real test email +
  WhatsApp received by staff.
- **WS4:** test — anon sees only `is_published=true`; `catalog_images.alt_text` NOT NULL enforced;
  fallback to `data/*.ts` when DB unavailable. Manual: staff edits content, change appears without
  redeploy; Lighthouse image audit clean.
- **WS5:** Rich Results test passes for `LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage`;
  sitemap lists all live routes; Lighthouse SEO ≥ 95; CWV "good"; per-service pages have unique
  metadata (verified per route).
- **WS6:** quotes tables + RLS migrated; `ai/` zod schemas + provider interface unit-tested with flag
  OFF; staff manual-quote walks `draft → in_review → sent`; no live AI calls present.

---

## 9. Open Questions (confirm before implementation)

1. **Session strategy (Q1):** Auth.js **database sessions** (server-side revocation, recommended) vs
   **JWT sessions** (simpler on serverless, no revocation)? This also decides whether RLS uses an
   Auth.js-mapped staff id or — if you prefer **Supabase Auth** instead — native `auth.uid()`. Affects
   §4 RLS policies and the `staff` table shape.
2. **Staff roster & roles:** How many staff, and do we need the `staff`/`admin` role split now, or is a
   flat staff role enough for Phase 2? Affects WS1 scope and assignment in WS2.
3. **Image vendor (Q3):** Confirm **Supabase Storage** (recommended) vs Vercel Blob. Any concern about
   Chile-market CDN latency that would justify Blob from the start?
4. **Resend domain & sending identity:** Is `metalmotor.cl` available to verify for Resend (SPF/DKIM),
   and what is the staff notification inbox (`NOTIFICATIONS_TO_EMAIL`)?
5. **WhatsApp Cloud API readiness:** Is there a Meta Business account + verified WhatsApp Business
   number for the **outbound Cloud API** (distinct from the existing `wa.me` links)? If not ready, WS3
   ships email-first and WhatsApp behind its graceful-skip.
6. **Google Business Profile:** Is a GBP listing live, and what are the exact NAP details + geo
   coordinates to align JSON-LD with (WS5)? Current `site.ts` has placeholder phone (`+56 9 0000 0000`)
   and no street address.
7. **Real content readiness:** Will real product photography and finalized service/catalog copy be
   available when WS4 starts? If not, WS4 ships the CRUD + pipeline and staff populate content later.
8. **Quote currency & tax:** Phase 2 sketches assume CLP and store pre-tax totals. Confirm whether IVA
   (19%) handling belongs in the Phase 2 quotes model or is deferred to Phase 3.
9. **Migration workflow:** Confirm migrations are applied via Supabase CLI (`supabase db push`) vs
   Dashboard SQL editor, and whether a Supabase **branch/test project** is available for the
   integration-test-against-real-DB requirement (WS0).
