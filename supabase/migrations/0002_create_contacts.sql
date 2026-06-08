-- MetalMotor-AI · contacts table (CRM)
-- General contact records (separate from quote/RFQ leads). Additive: does not
-- alter the existing `leads` table. Apply via Supabase SQL Editor or CLI.

create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  empresa     text,
  correo      text not null,
  telefono    text,
  mensaje     text,
  origen      text not null default 'website',
  estado      text not null default 'nuevo'
                check (estado in ('nuevo','contactado','calificado','descartado')),
  created_at  timestamptz not null default now()
);

create index if not exists contacts_created_at_idx on public.contacts (created_at desc);
create index if not exists contacts_estado_idx on public.contacts (estado);

-- RLS locked down (service-role bypasses it; staff read access added with auth).
alter table public.contacts enable row level security;

comment on table public.contacts is
  'CRM: contactos generales (NAP) para seguimiento comercial.';
