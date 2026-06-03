-- MetalMotor-AI · leads table
-- Captures public contact-form submissions (RFQ / quotation requests).
-- Apply via the Supabase SQL editor or the Supabase CLI:
--   supabase db push   (CLI)   |   paste into Dashboard → SQL Editor

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  service     text,
  message     text not null,
  source      text not null default 'website_contact_form',
  status      text not null default 'new',
  created_at  timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- Row Level Security: lock the table down. The contact API uses the
-- service-role key (which bypasses RLS), so no public policy is granted.
-- Staff/admin read access will be added in Phase 1 with authenticated roles.
alter table public.leads enable row level security;

comment on table public.leads is
  'Public website leads / quotation requests captured by the contact form.';
