# MetalMotor-AI — WS2 (Leads CRM) + WS3 (Email Notifications) Implementation Plan

> Status: PLANNING ONLY. No application code is changed by this document. Implementation begins
> only after this plan is approved and each step is executed TDD-first (RED → GREEN → REFACTOR).
>
> Scope of this document: **WS2 Leads CRM** and **WS3 Email Notifications** only, plus the minimal
> auth slice WS2 depends on (see §3). WhatsApp send, real content/images, and AI quoting are
> explicitly out of scope.
>
> Conventions in force (non-negotiable): immutability (new objects, never mutate), small files
> (200–400 lines typical, 800 max), zod validation at every boundary, secrets only in server-side
> env vars (never hardcoded, never `NEXT_PUBLIC_*` for secrets), TDD-first, surgical changes.

## Table of Contents

1. [Locked Decisions Applied](#1-locked-decisions-applied)
2. [Recommended Handling of the Auth Dependency](#2-recommended-handling-of-the-auth-dependency)
3. [WS1-min — Auth Prerequisite Slice](#3-ws1-min--auth-prerequisite-slice)
4. [Data Model & Migrations](#4-data-model--migrations)
5. [WS3 — Email Notifications](#5-ws3--email-notifications)
6. [WS2 — Leads CRM Admin UI](#6-ws2--leads-crm-admin-ui)
7. [Test Plan](#7-test-plan)
8. [Definition of Done](#8-definition-of-done)
9. [Rollout & Config Order](#9-rollout--config-order)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Appendix — Env Var Names](#11-appendix--env-var-names)

---

## 1. Locked Decisions Applied

| # | Decision | Consequence in this plan |
|---|---|---|
| 1 | Database sessions (Auth.js v5 + Supabase adapter, server-side) | Auth.js session/account/user/verification tables live in Postgres (§4.5). RLS keys off a staff identity mapped from the session, NOT `auth.uid()`. |
| 2 | WhatsApp Cloud API NOT ready → email-first | `notifications/` interface is channel-agnostic (§5.2); only the Resend email channel ships. WhatsApp drops in later as a sibling `NotificationChannel` with zero refactor. |
| 3 | Final NAP later → placeholders | No change to `src/data/site.ts` (keeps placeholder phone/address). WS2/WS3 do not depend on NAP. |
| 4 | Resend; default inbox `jantonio.vasquez.t@gmail.com`, env-configurable; metalmotor.cl domain pending | Recipient read from env with that default; sender uses a verified-sender fallback (Resend onboarding sender) until the domain is verified (§5.5, §9). |
| 5 | Real photos arrive WS4 | No image work here. |

---

## 2. Recommended Handling of the Auth Dependency

**Recommendation: Option (a) — fold a minimal WS1 auth slice ("WS1-min") into the front of this plan
as an explicit, gating prerequisite (§3).** WS2 cannot ship without authenticated staff, and the
database-session RLS model (locked decision 1) means the auth tables and the staff identity are also
the foundation the leads RLS policies key off. Treating WS1 as an external predecessor would leave
WS2 unbuildable and the RLS design ungrounded.

**Why fold a *slice* rather than all of WS1:** WS2 needs only the parts of auth listed below. The
broader WS1 (role-based admin/staff split, password reset flows, multi-provider, full admin shell) is
NOT required to ship the leads CRM and stays in the full WS1 backlog.

**Exact auth surface WS2 depends on (the WS1-min contract):**

1. Auth.js v5 configured with **database sessions** via the Supabase/Postgres adapter.
2. A **Credentials provider** validating against a `staff` table (email + bcrypt/argon2 password hash).
3. The Auth.js session tables (`users`, `accounts`, `sessions`, `verification_token`) plus a `staff`
   table, all migrated (§4.5, §4.4).
4. A server-side helper `requireStaff()` that returns the authenticated staff identity in server
   components / server actions, or redirects to login.
5. `middleware.ts` protecting the `/admin` route group; unauthenticated → `/login`.
6. A single seeded staff user (created by a one-off secure script, NOT committed).

Everything WS2 builds (§6) consumes only this contract. The dependency is therefore unambiguous:
**WS1-min (§3) is a hard gate; WS2 (§6) starts only after WS1-min's DoD is green.** WS3 (§5) is
independent of auth and can proceed in parallel with WS1-min.

**Suggested execution order:** WS3 (§5) and WS1-min (§3) in parallel → WS2 (§6) after WS1-min.

---

## 3. WS1-min — Auth Prerequisite Slice

### 3.1 Scope & non-goals
- **In scope:** Auth.js v5 with database sessions, Credentials provider against `staff`, `requireStaff()`
  helper, `middleware.ts` for `/admin`, login page, seed script.
- **Non-goals:** role split beyond a single `role` column default `'staff'` (the column exists in §4.4
  but no role-gated UI yet), password reset, email verification flows, OAuth providers, buyer accounts
  (forbidden), the full admin shell/navigation (WS1 proper).

### 3.2 Prerequisites
- Supabase project reachable; `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` already validated in
  `src/lib/env.ts:12-15`.
- New deps (planning note, not installed here): `next-auth@5` (Auth.js v5), the Auth.js Supabase or
  Postgres adapter, and a password-hashing lib (`bcryptjs` or `@node-rs/argon2`).
- Env vars by NAME only (§11): `AUTH_SECRET`, `AUTH_URL` (if required by the Vercel deploy).
- Migrations 0002 + 0003 applied (§4.4, §4.5).

### 3.3 Ordered, TDD-first task breakdown

> Each step: write the gating test first (RED), implement minimally (GREEN), tidy (REFACTOR). File
> paths are real, under the existing `src/` layout. Keep files within the 200–400 line budget.

- **A1. Extend env schema for auth secrets.**
  - Changes: `src/lib/env.ts` — add an auth env reader (`getAuthEnv()`) returning the same `EnvResult`
    shape (`env.ts:19-21`) for `AUTH_SECRET` (+ `AUTH_URL` if needed). Do NOT merge into the Supabase
    schema; keep readers feature-scoped (mirrors the existing graceful-degradation philosophy).
  - Test (RED): `src/lib/env.test.ts` (new) — `getAuthEnv()` returns `{ok:false, missing:["AUTH_SECRET"]}`
    when unset, `{ok:true}` when set.
  - Gate: test passes; `tsc`/`lint` clean.

- **A2. Migrations 0002 (staff) + 0003 (auth tables) authored.**
  - Changes: `supabase/migrations/0002_create_staff.sql`, `supabase/migrations/0003_authjs_tables.sql`
    (SQL in §4.4 / §4.5).
  - Test: applied against a Supabase **test branch/project** (no mocking the DB — locked WS0 rule); a
    schema smoke check (a SQL script in `supabase/tests/` or a Vitest integration test) asserts the
    tables + RLS exist. RED = tables absent; GREEN = present with RLS enabled.

- **A3. Password hashing utility.**
  - Changes: `src/lib/auth/password.ts` — `hashPassword(plain)` / `verifyPassword(plain, hash)`, pure
    wrappers over the hashing lib; immutable, no globals.
  - Test (RED): `src/lib/auth/password.test.ts` — hash ≠ plaintext; `verifyPassword` true for correct,
    false for wrong; two hashes of the same input differ (salt).

- **A4. Auth.js configuration with database sessions.**
  - Changes: `src/lib/auth/config.ts` (Auth.js options: adapter = Supabase/Postgres, `session.strategy
    = "database"`, Credentials provider calling `password.ts` + a `staff` lookup via the server
    Supabase admin client from `src/lib/supabase/server.ts:15`), `src/lib/auth/index.ts` (exports
    `auth`, `signIn`, `signOut`, handlers), `src/app/api/auth/[...nextauth]/route.ts` (App Router
    handler).
  - Test (RED): `src/lib/auth/config.test.ts` — the Credentials `authorize` callback returns a staff
    object for valid creds (mock the staff lookup at the data-access seam, not the DB driver) and
    `null` for invalid / inactive (`is_active = false`) staff.

- **A5. `requireStaff()` server helper.**
  - Changes: `src/lib/auth/require-staff.ts` — server-only; reads the Auth.js session; returns
    `{ id, email, name, role }` or `redirect("/login")`.
  - Test (RED): `src/lib/auth/require-staff.test.ts` — returns identity when session present; triggers
    redirect when absent (assert the redirect call).

- **A6. Middleware + login page.**
  - Changes: `src/middleware.ts` (matcher `['/admin/:path*']`, redirect unauthenticated → `/login`);
    `src/app/(auth)/login/page.tsx` + `src/components/auth/LoginForm.tsx` (client form posting to
    Auth.js `signIn`, Spanish copy, reuses the form a11y pattern from `ContactForm.tsx`).
  - Test (RED): integration — request to `/admin/leads` while unauthenticated returns a redirect to
    `/login`; the matcher is asserted in a middleware unit test.

- **A7. Seed script for the first staff user.**
  - Changes: `scripts/seed-staff.ts` (one-off; reads email + password from env/CLI args, hashes,
    inserts via service role). NOT committed with real values; documented in `.env.example` + a README
    note.
  - Test: manual — run once; confirm login works end-to-end.

- **A8. Update `robots.ts` to disallow `/admin`.**
  - Changes: `src/app/robots.ts` — add `/admin/` to `disallow` (currently only `/api/`, `robots.ts:9`).
  - Test: `src/app/robots.test.ts` (new) asserts `/admin/` is disallowed.

### 3.4 WS1-min Definition of Done
- `npm run typecheck`, `npm run lint`, `npm run build`, `npm test` all green (fresh runs, output read).
- Functional checks: unauthenticated `/admin/leads` → 307 redirect to `/login`; valid staff login →
  session row created in `sessions`; `is_active=false` staff cannot log in; logout deletes the session
  row (server-side revocation proven); `robots.ts` disallows `/admin/`.

---

## 4. Data Model & Migrations

Concrete SQL, numbered continuing the existing convention (`supabase/migrations/0001_create_leads.sql`).
RLS model (locked decision 1): **anon = no access to leads/staff/events; authenticated staff = scoped
access via a session→staff mapping; the public contact insert + notification path use the service-role
key (bypasses RLS).** Because Auth.js stores users in its own `users` table (not Supabase
`auth.users`), RLS for staff is enforced at the **application layer through the authenticated server
client**, with database RLS as defense-in-depth denying anon entirely. (See §10 for the nuance and
mitigation.)

### 4.1 Migration list

| File | Purpose |
|---|---|
| `supabase/migrations/0002_create_staff.sql` | `staff` table + RLS lockdown. |
| `supabase/migrations/0003_authjs_tables.sql` | Auth.js `users`/`accounts`/`sessions`/`verification_token` (`next_auth` schema) + RLS. |
| `supabase/migrations/0004_extend_leads.sql` | Leads CRM columns, status constraint, `updated_at` trigger, RLS read/update policies. |
| `supabase/migrations/0005_create_lead_events.sql` | Append-only status audit trail + RLS. |

### 4.2 `0004_extend_leads.sql` — Leads CRM fields

```sql
-- 0004_extend_leads.sql · evolve the Phase 1 leads table (0001) for the CRM.
-- Existing columns from 0001 (id, name, email, phone, service, message, source,
-- status default 'new', created_at) and indexes are kept.

alter table public.leads
  add column if not exists assigned_to uuid,                          -- FK added after staff exists
  add column if not exists status_detail text,                        -- free-text note on current status
  add column if not exists updated_at timestamptz not null default now();

-- FK to staff (0002 must run before 0004).
alter table public.leads
  add constraint leads_assigned_to_fkey
  foreign key (assigned_to) references public.staff(id) on delete set null;

-- Lock the lifecycle to the agreed CRM states.
alter table public.leads
  add constraint leads_status_check
  check (status in ('new','contacted','quoted','won','lost'));

create index if not exists leads_assigned_to_idx on public.leads (assigned_to);

-- Keep updated_at fresh on every UPDATE (immutability at the row level is N/A in SQL;
-- the audit trail in 0005 preserves history append-only).
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- RLS: 0001 already enabled RLS with NO public policy (anon stays denied).
-- Add authenticated-staff scoped access. With Auth.js (non-Supabase-auth),
-- the authenticated server client connects with a role that these policies target.
-- Defense-in-depth: anon role has zero policies → cannot read/update.
create policy "staff_select_leads" on public.leads
  for select to authenticated using (true);
create policy "staff_update_leads" on public.leads
  for update to authenticated using (true) with check (true);
-- NOTE: INSERT stays service-role-only (contact route); no INSERT policy for authenticated/anon.
```

### 4.3 `0005_create_lead_events.sql` — append-only audit trail

```sql
-- 0005_create_lead_events.sql · immutable status-change history.
create table if not exists public.lead_events (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  actor_id    uuid references public.staff(id),
  from_status text,
  to_status   text not null,
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists lead_events_lead_id_idx on public.lead_events (lead_id, created_at desc);

alter table public.lead_events enable row level security;

-- Append-only: authenticated staff may INSERT and SELECT; never UPDATE/DELETE (no such policies).
create policy "staff_insert_lead_events" on public.lead_events
  for insert to authenticated with check (true);
create policy "staff_select_lead_events" on public.lead_events
  for select to authenticated using (true);
```

### 4.4 `0002_create_staff.sql`

```sql
-- 0002_create_staff.sql · internal staff (no buyer accounts, ever).
create table if not exists public.staff (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text not null,
  role          text not null default 'staff' check (role in ('staff','admin')),
  password_hash text not null,                 -- bcrypt/argon2; NEVER plaintext
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.staff enable row level security;
-- No policies for anon or authenticated → only the service-role key (server) touches staff.
-- Auth.js Credentials authorize() runs server-side with the service-role client.
comment on table public.staff is 'Internal staff accounts for the admin/CRM area.';
```

### 4.5 `0003_authjs_tables.sql` — database-session tables

```sql
-- 0003_authjs_tables.sql · Auth.js (NextAuth v5) database-session schema.
-- Mirrors the Auth.js Supabase/Postgres adapter expectations. Lives in a
-- dedicated schema to avoid clashing with Supabase's own auth.* schema.
create schema if not exists next_auth;

create table if not exists next_auth.users (
  id    uuid primary key default gen_random_uuid(),
  name  text,
  email text unique,
  "emailVerified" timestamptz,
  image text
);

create table if not exists next_auth.accounts (
  id                  uuid primary key default gen_random_uuid(),
  "userId"            uuid not null references next_auth.users(id) on delete cascade,
  type                text not null,
  provider            text not null,
  "providerAccountId" text not null,
  refresh_token       text,
  access_token        text,
  expires_at          bigint,
  token_type          text,
  scope               text,
  id_token            text,
  session_state       text,
  unique (provider, "providerAccountId")
);

create table if not exists next_auth.sessions (
  id             uuid primary key default gen_random_uuid(),
  "sessionToken" text not null unique,
  "userId"       uuid not null references next_auth.users(id) on delete cascade,
  expires        timestamptz not null
);

create table if not exists next_auth.verification_token (
  identifier text not null,
  token      text not null,
  expires    timestamptz not null,
  primary key (identifier, token)
);

-- RLS on every table; only the service-role client (Auth.js adapter) accesses next_auth.*.
alter table next_auth.users enable row level security;
alter table next_auth.accounts enable row level security;
alter table next_auth.sessions enable row level security;
alter table next_auth.verification_token enable row level security;
```

> Migration ordering constraint: **0002 before 0004** (leads FK → staff). 0003 is independent. Apply
> in numeric order; all are idempotent (`if not exists` / `add constraint` guarded in review).

---

## 5. WS3 — Email Notifications

### 5.1 Scope & non-goals
- **In scope:** a channel-agnostic `notifications/` module; a Resend email channel; wiring it into the
  existing `/api/contact` route at the TODO (`route.ts:65`), strictly persist-before-notify; Spanish
  (es-CL) email template; graceful degradation when Resend is unconfigured; idempotency guard.
- **Non-goals:** WhatsApp Cloud API send (deferred — interface only), customer-facing autoresponder
  email, retries via a queue/cron (documented but not built; see §5.6), domain-verified custom sender
  (uses fallback until metalmotor.cl is verified).

### 5.2 Channel-agnostic interface (the seam WhatsApp drops into later)

```ts
// src/lib/notifications/types.ts  (illustrative — finalized during GREEN)
import { z } from "zod";

/** A persisted lead, ready to notify on. id is required (persisted before notify). */
export const leadNotificationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  service: z.string().nullable(),
  message: z.string(),
  source: z.string(),
  receivedAt: z.string(), // ISO timestamp
});
export type LeadNotification = z.infer<typeof leadNotificationSchema>;

export type NotifyResult =
  | { readonly ok: true; readonly channel: string; readonly id?: string }
  | { readonly ok: false; readonly channel: string; readonly error: string };

/** Every channel (email now, WhatsApp later) implements this identically. */
export interface NotificationChannel {
  readonly name: string;          // 'email' | 'whatsapp' | ...
  readonly isConfigured: boolean; // false → dispatcher skips + logs (graceful)
  send(notification: LeadNotification): Promise<NotifyResult>;
}
```

```ts
// src/lib/notifications/index.ts  (dispatcher — illustrative)
// notifyNewLead(notification): runs all configured channels, collects results,
// NEVER throws into the caller. Unconfigured channel → skipped + warn-logged.
// Returns NotifyResult[] for logging/observability. The contact route ignores
// failures for the customer response (see §5.4).
```

WhatsApp later = add `src/lib/notifications/whatsapp.ts` implementing `NotificationChannel` and
register it in the dispatcher's channel list. **No refactor of `types.ts`, `index.ts`, or the route.**

### 5.3 Resend email channel shape

```ts
// src/lib/notifications/email-resend.ts  (illustrative)
// - Reads RESEND_API_KEY, NOTIFICATIONS_TO_EMAIL, NOTIFICATIONS_FROM_EMAIL via a
//   feature-scoped env reader (getNotificationsEnv() in src/lib/env.ts, EnvResult shape).
// - isConfigured = env.ok (graceful: missing key → channel disabled, lead still captured).
// - send(): builds the Spanish template (src/lib/notifications/templates/new-lead.ts),
//   calls the Resend SDK, maps the SDK result/error to NotifyResult. No throw on failure.
```

### 5.4 Wiring into `/api/contact` (persist-before-notify)

Current route persists the lead then has a TODO at `route.ts:65`. The change is surgical:

1. The Supabase insert (`route.ts:45`) must **return the inserted row id** (`.insert(lead).select("id").single()`)
   so the notification carries a real `id` (required by `leadNotificationSchema`).
2. **Only after a successful persist**, call `notifyNewLead({...lead, id, receivedAt})`.
3. `notifyNewLead` is awaited but its result **never changes the customer response** — failures are
   logged; the route still returns `{ ok: true }`. This preserves the existing guarantee
   (`route.ts:12-13`) that a misconfiguration never drops a customer.
4. If Supabase is **not configured** (`getSupabaseAdmin()` returns null, `route.ts:43-44`,
   `supabase/server.ts:15`): no persisted id exists → skip notification, keep the existing
   `console.warn` lead-recovery log (`route.ts:59-62`). Notifying without a persisted lead would
   violate persist-before-notify.
5. Honeypot path (`route.ts:36-38`) returns before persist → **no notification** (spam never emails staff).

### 5.5 Sender identity & domain-pending fallback (locked decision 4)
- **Recipient:** `NOTIFICATIONS_TO_EMAIL`, default `jantonio.vasquez.t@gmail.com` (default lives in the
  env reader's fallback, the value is not hardcoded in business logic).
- **Sender:** `NOTIFICATIONS_FROM_EMAIL`. Until `metalmotor.cl` DNS (SPF/DKIM) is verified in Resend,
  use Resend's verified onboarding sender (e.g. `onboarding@resend.dev`) as the env default. After
  verification, flip the env var to `notificaciones@metalmotor.cl` — no code change.
- Document both states in `.env.example` and §9.

### 5.6 Idempotency & retry considerations
- **Idempotency:** the lead `id` (uuid) is the natural dedupe key. Because notification is fire-once
  inside the request after a successful insert, double-send only happens if the client retries a POST.
  Mitigation (documented, low-priority): an optional `notified_at` column on `leads` set after a
  successful email so a retry of the same lead does not re-notify. Not built in WS3 unless duplicate
  emails are observed (avoid premature complexity).
- **Retry:** WS3 does not add a queue. If Resend fails, the failure is logged with the lead id so it is
  recoverable; the lead is safe in the DB. A durable retry (Supabase cron / outbox table) is a future
  enhancement noted here, not implemented now.

### 5.7 Email template (Spanish, es-CL)
- File: `src/lib/notifications/templates/new-lead.ts` — pure function `renderNewLeadEmail(notification)`
  returning `{ subject, html, text }`. No side effects (unit-testable).
- **Subject:** `Nueva solicitud de cotización — {name}` (e.g. "Nueva solicitud de cotización — Juan Pérez").
- **Body fields:** Nombre, Correo, Teléfono (or "No indicado"), Servicio de interés (or "No indicado"),
  Mensaje, Origen (`source`), Fecha de recepción (`receivedAt`, formatted es-CL), and a note that the
  lead is saved in the CRM. Plain, professional Spanish; both HTML and text variants for deliverability.

### 5.8 Ordered, TDD-first task breakdown (WS3)

- **B1. Notifications env reader.** `src/lib/env.ts` → add `getNotificationsEnv()` (`RESEND_API_KEY`,
  `NOTIFICATIONS_TO_EMAIL` with default, `NOTIFICATIONS_FROM_EMAIL` with fallback default), `EnvResult`
  shape. Test (RED): missing `RESEND_API_KEY` → `{ok:false}`; defaults applied for to/from.
- **B2. Types + schema.** `src/lib/notifications/types.ts`. Test (RED):
  `src/lib/notifications/types.test.ts` — `leadNotificationSchema` rejects a missing/invalid `id`,
  accepts a valid notification.
- **B3. Email template.** `src/lib/notifications/templates/new-lead.ts`. Test (RED):
  `new-lead.test.ts` — subject contains the name; html+text contain email/message; null phone renders
  "No indicado"; function does not mutate input.
- **B4. Resend channel.** `src/lib/notifications/email-resend.ts` (SDK call behind a thin seam so it can
  be mocked). Test (RED): `email-resend.test.ts` — `isConfigured=false` when env missing; on configured,
  `send()` calls the SDK with the rendered template and returns `{ok:true, channel:'email'}`; on SDK
  error returns `{ok:false, channel:'email', error}` and does NOT throw.
- **B5. Dispatcher.** `src/lib/notifications/index.ts` (`notifyNewLead`). Test (RED): `index.test.ts` —
  unconfigured channel skipped + logged, never throws; configured channel invoked once; returns the
  results array; a throwing channel is caught and reported as `{ok:false}` (dispatcher never propagates).
- **B6. Wire into the route.** `src/app/api/contact/route.ts` — `.select("id").single()` on insert;
  call `notifyNewLead` after a successful persist; result never alters the response. Test (RED):
  `src/app/api/contact/route.test.ts` (new, integration with mocked Supabase + mocked dispatcher) —
  (i) valid lead → persisted → exactly one email dispatched to the configured inbox; (ii) dispatcher
  rejection/failure → response still `{ok:true}` and lead still persisted; (iii) honeypot → no
  dispatch; (iv) Supabase unconfigured → no dispatch, warn logged.

---

## 6. WS2 — Leads CRM Admin UI

> Gate: WS1-min (§3) DoD green. WS2 consumes only the WS1-min contract.

### 6.1 Scope & non-goals
- **In scope:** `/admin/leads` list with filter (by status) + search + date sort; `/admin/leads/[id]`
  detail; status transitions (new/contacted/quoted/won/lost) writing an immutable `lead_events` row;
  assignment to a staff member; reads under the authenticated session.
- **Non-goals:** lead creation from the admin (leads come from the public form), bulk actions, CSV
  export, quotes (WS6), role-gated permissions beyond "authenticated staff", real content/images,
  WhatsApp.

### 6.2 Data access strategy: **Server Actions (not route handlers)**
- **Recommendation: Server Actions** for all mutations (status change, assignment) and server-component
  reads for the lists/detail.
- **Why:** mutations are internal, authenticated, same-origin, and tightly coupled to the admin UI —
  exactly the Server Action sweet spot. They eliminate a hand-rolled API surface, integrate with
  `requireStaff()` for per-action auth, and keep the service/authenticated Supabase client server-only.
  Route handlers would add an unnecessary public-looking API surface and duplicate auth checks.
- Every Server Action **first calls `requireStaff()`** (auth at the boundary), then validates inputs
  with zod (e.g. a `statusTransitionSchema`), then performs the DB write + `lead_events` insert.

### 6.3 Reads under RLS with the authenticated session
- A dedicated authenticated server Supabase client (`src/lib/supabase/authed-server.ts`, new) connects
  for staff reads/updates so the RLS policies in §4.2/§4.3 apply, rather than reusing the service-role
  client (which bypasses RLS). The service-role client (`supabase/server.ts:15`) stays reserved for the
  anonymous contact insert and the notification path. (See §10 for the Auth.js-vs-RLS nuance and why
  defense-in-depth still denies anon.)

### 6.4 Routes & layout
- `src/app/admin/layout.tsx` — server component; calls `requireStaff()`; renders a minimal admin chrome
  (header with staff name + sign-out). Protected additionally by `middleware.ts` (§3).
- `src/app/admin/leads/page.tsx` — server component list; reads leads via the authed client; renders
  `src/components/admin/LeadsTable.tsx` (client, for filter/sort interactivity) and
  `src/components/admin/LeadsFilters.tsx`.
- `src/app/admin/leads/[id]/page.tsx` — server component detail; renders
  `src/components/admin/LeadDetail.tsx` (status select + assignment + event timeline) and
  `src/components/admin/LeadStatusForm.tsx` (client, invokes the status Server Action).
- Server Actions: `src/app/admin/leads/actions.ts` — `updateLeadStatus`, `assignLead`.

### 6.5 Status-transition domain logic (pure, testable)
- `src/lib/leads/status.ts` — `LEAD_STATUSES` const tuple `['new','contacted','quoted','won','lost']`,
  `leadStatusSchema` (zod enum, mirrors the DB check in §4.2), and `isValidTransition(from, to)`.
  - **Recommendation:** allow any transition between the five states (sales reality: a lead can move
    backward, e.g. quoted → contacted), but **forbid no-op and unknown statuses**. Keep the rule
    explicit and unit-tested so it is a single source of truth shared by UI + Server Action.
- The Server Action computes `from_status` (current), validates the `to_status`, updates `leads.status`
  (trigger sets `updated_at`), and **appends** a `lead_events` row (`from_status`, `to_status`,
  `actor_id` = staff id, optional note) — never editing history (immutability).

### 6.6 Ordered, TDD-first task breakdown (WS2)

- **C1. Status domain module.** `src/lib/leads/status.ts`. Test (RED): `status.test.ts` —
  `leadStatusSchema` rejects `'archived'`; `isValidTransition('new','new')` false; valid transitions
  true; statuses match the DB constraint list.
- **C2. Authed server Supabase client.** `src/lib/supabase/authed-server.ts` (`server-only`). Test
  (RED): unit at the seam — returns a client bound to the session; returns null/guards when no session.
- **C3. Leads data-access helpers.** `src/lib/leads/repository.ts` — `listLeads(filter)`,
  `getLead(id)`, `updateLeadStatus(...)`, `assignLead(...)`, `appendLeadEvent(...)`, all immutable,
  zod-validated inputs. Test (RED): `repository.test.ts` with a mocked authed client — list applies the
  status filter; update + event are issued together; inputs validated.
- **C4. Server Actions.** `src/app/admin/leads/actions.ts`. Test (RED): `actions.test.ts` — action
  rejects when `requireStaff()` fails (unauthenticated); on success calls repository with validated
  args and records the actor id.
- **C5. Admin layout + auth gate.** `src/app/admin/layout.tsx`. Test: integration — unauthenticated →
  redirect (already covered by middleware test A6; add a layout-level `requireStaff` assertion).
- **C6. Leads list page + components.** `src/app/admin/leads/page.tsx`,
  `src/components/admin/LeadsTable.tsx`, `LeadsFilters.tsx`. Test (RED): component tests — table renders
  rows from props; filter narrows by status; empty state renders.
- **C7. Lead detail + status form + timeline.** `src/app/admin/leads/[id]/page.tsx`,
  `src/components/admin/LeadDetail.tsx`, `LeadStatusForm.tsx`. Test (RED): component tests — renders
  lead fields + event timeline; status form disables invalid/no-op transitions; submitting calls the
  action.
- **C8. RLS verification test.** `src/lib/leads/rls.test.ts` (integration, real test DB) — an anon
  client `select` on `public.leads` errors/returns no rows; the authenticated client can read.

---

## 7. Test Plan

### 7.1 Unit
- Zod schemas: `contactSchema` unchanged (existing `validation.test.ts`); new `leadNotificationSchema`
  (B2), `leadStatusSchema` (C1), `statusTransitionSchema`.
- Notification interface: dispatcher skip/throw/success (B5); Resend channel configured/failure (B4);
  template rendering + immutability (B3).
- Status transitions: `isValidTransition` matrix (C1).
- Password hashing (A3).

### 7.2 Integration
- `/api/contact` with mocked Supabase + mocked dispatcher (B6): persist → exactly one email; honeypot →
  none; unconfigured Supabase → none; dispatcher failure → still persisted + `{ok:true}`.
- Auth redirect for `/admin/*` (A6/C5).
- RLS against a real Supabase **test branch** (C8): anon denied, authenticated allowed (no DB mocking —
  locked WS0 rule).

### 7.3 Red-Green verification (mandatory for the two core guarantees)

**(1) Lead-status-transition logic**
1. Write `isValidTransition`/Server Action test → run → PASS.
2. Break the rule (e.g. make the action skip the `lead_events` append, or allow a no-op) → run → the
   transition/audit test FAILS (confirms the test catches the regression).
3. Restore → run → PASS.

**(2) Notification-failure-does-not-drop-lead**
1. Test: mock dispatcher to reject; assert response `{ok:true}` AND the Supabase insert was called →
   run → PASS.
2. Break the guarantee (make the route `await` the dispatcher and propagate its error, or move the
   insert after the notify) → run → the test FAILS (response no longer ok / insert not called).
3. Restore persist-before-notify + swallow-failure → run → PASS.

---

## 8. Definition of Done

### 8.1 Per-step
Every step (A1–A8, B1–B6, C1–C8): its named gating test passes (fresh run, output read), and
`tsc`/`lint` stay clean. No step is "done" on a single green without its RED having been observed first.

### 8.2 Per-workstream (evidence-based — run fresh, read output)
General gate for each: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm run build`
(exit 0), `npm test` (all pass).

- **WS1-min:** unauthenticated `/admin/leads` → 307 to `/login`; valid staff login creates a `sessions`
  row; inactive staff rejected; logout deletes the session (server-side revocation); `robots.ts`
  disallows `/admin/`.
- **WS3:** in a mocked test, submitting the contact form sends **exactly one** email to the configured
  inbox; **anon/honeypot/unconfigured-Supabase → zero** emails; a simulated Resend failure still returns
  `{ok:true}` and the lead is persisted (insert asserted); template renders valid Spanish HTML+text.
- **WS2:** **anon SELECT on `public.leads` errors / returns nothing** (RLS proven against the test DB);
  authenticated staff can list/filter/detail/update; every status change appends exactly one
  `lead_events` row with the correct `from`/`to`/`actor_id`; no-op/unknown transitions are rejected;
  assignment sets `assigned_to`.

---

## 9. Rollout & Config Order

Exact order so production (Vercel + Supabase) never breaks; the site degrades gracefully at each step.

1. **Supabase migrations (in order):** `0002_create_staff.sql` → `0003_authjs_tables.sql` →
   `0004_extend_leads.sql` → `0005_create_lead_events.sql`. Apply via Supabase CLI (`supabase db push`)
   against the project. 0004 adds a CHECK constraint on `status`; confirm all existing `leads.status`
   values are within the allowed set first (Phase 1 default is `'new'`, so this is safe, but verify).
2. **Seed the first staff user** (A7) via the one-off script using a strong password (not committed).
3. **Set env vars in Vercel (names only — values in the Vercel dashboard, never in code/commits):**
   `AUTH_SECRET`, `AUTH_URL` (if required), `RESEND_API_KEY`, `NOTIFICATIONS_TO_EMAIL`
   (= `jantonio.vasquez.t@gmail.com`), `NOTIFICATIONS_FROM_EMAIL` (= Resend onboarding sender until the
   domain is verified). `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` already configured.
4. **Deploy WS3 first** (notifications). Behavior before Resend is set: `getNotificationsEnv()` returns
   not-ok → the email channel `isConfigured=false` → dispatcher skips + logs → **leads still captured
   and persisted, just not emailed.** Identical graceful-degradation to the existing Supabase guard.
5. **Verify the Resend domain (metalmotor.cl)** when DNS is ready, then change `NOTIFICATIONS_FROM_EMAIL`
   to `notificaciones@metalmotor.cl` in Vercel — no redeploy of code logic required (env-only).
6. **Deploy WS1-min + WS2** (admin). Before `AUTH_SECRET` is set, `/admin/*` simply cannot establish a
   session (login fails closed) — the public site is unaffected because admin is a separate route group.
7. **Smoke test in prod:** submit a real contact form → confirm lead row + one email to the inbox; log
   in as staff → see the lead → move its status → confirm a `lead_events` row.

**Degradation summary:** missing Resend → leads saved, no email (logged). Missing auth → admin
locked, public site fine. Missing Supabase → leads logged to server logs, no email (persist-before-notify
means no notify without a persisted id).

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Auth.js v5 + Supabase adapter on Vercel serverless** (cold starts, edge vs node runtime, adapter config) | Admin unusable | Pin Auth.js to a known-good v5 release; force the Node.js runtime for auth routes (not edge); spike A4 against a Vercel preview deploy before building WS2; database sessions avoid edge-incompatible crypto pitfalls of some setups. |
| **RLS does not key off `auth.uid()`** because Auth.js uses its own `next_auth.users`, not Supabase `auth.users` | Staff identity not enforced *inside* Postgres; risk of over-permissive policies | Defense-in-depth: anon role gets **zero** policies (cannot read leads at all); staff reads go through a server-only authenticated client; auth is enforced at the app boundary via `requireStaff()` in every Server Action/page. Document that "authenticated" here means the app-tier authenticated client. If stricter DB-tier isolation is later required, migrate to Supabase Auth (the policies in §4 are written to make that swap mechanical). |
| **RLS mistake exposes leads** | Data leak of customer PII | C8 RLS integration test (anon SELECT must error/empty) gates WS2 DoD; every new table ships RLS-enabled with explicit policies; review checklist item. |
| **Service-role key leaks to client** | Full DB compromise | `server-only` already enforced (`supabase/server.ts:1`); new authed + admin clients also `server-only`; never referenced in client components. |
| **Email deliverability** (Gmail spam-foldering; unverified domain) | Staff miss RFQs | Send both HTML + text; until metalmotor.cl is verified use Resend's verified onboarding sender (good reputation); after verification add SPF/DKIM/DMARC; the lead is always in the CRM regardless, so email is an alert, not the system of record. |
| **Duplicate emails** on client POST retry | Staff annoyance | Optional `notified_at` dedupe column documented (§5.6); only build if observed. |
| **Notification blocks the request** if awaited incorrectly | Slow form / failure surfaced to customer | Persist-before-notify + swallow-failure pattern (§5.4) with a Red-Green guarantee test (§7.3-2). |
| **status CHECK constraint rejects legacy rows** at migration time | Migration 0004 fails | Pre-flight query confirms all existing `status` values are in the allowed set before adding the constraint (§9 step 1). |

---

## 11. Appendix — Env Var Names

Names only — values are set in Vercel / `.env.local`, never committed, never `NEXT_PUBLIC_*` for secrets.
All read through feature-scoped readers in `src/lib/env.ts` returning the existing `EnvResult` shape
(`env.ts:19-21`) for graceful degradation.

- `AUTH_SECRET` — Auth.js session signing secret.
- `AUTH_URL` — Auth.js canonical URL (set if the Vercel deploy requires it).
- `RESEND_API_KEY` — Resend API key (email channel).
- `NOTIFICATIONS_TO_EMAIL` — staff recipient; default `jantonio.vasquez.t@gmail.com` (default in code
  fallback, not a secret).
- `NOTIFICATIONS_FROM_EMAIL` — verified sender; default = Resend onboarding sender until metalmotor.cl
  is verified, then `notificaciones@metalmotor.cl`.
- (existing, unchanged) `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`.
- (deferred, WhatsApp — NOT set in WS2/WS3): `WHATSAPP_CLOUD_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
  `WHATSAPP_NOTIFY_TO`.
```