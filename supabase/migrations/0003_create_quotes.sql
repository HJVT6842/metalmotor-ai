-- MetalMotor-AI · quotes table (CRM)
-- Quote/RFQ records for commercial follow-up. Can reference a lead.
-- Additive migration. Apply via Supabase SQL Editor or CLI.

create table if not exists public.quotes (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads (id) on delete set null,
  nombre      text not null,
  empresa     text,
  correo      text not null,
  telefono    text,
  servicio    text,
  mensaje     text,
  monto       numeric(12, 0),            -- CLP, opcional
  origen      text not null default 'website_contact_form',
  estado      text not null default 'nuevo'
                check (estado in ('nuevo','contactado','cotizado','negociacion','ganado','perdido')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists quotes_estado_idx on public.quotes (estado);
create index if not exists quotes_lead_id_idx on public.quotes (lead_id);

-- Mantener updated_at al día
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists quotes_set_updated_at on public.quotes;
create trigger quotes_set_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

-- RLS locked down (service-role bypasses it; staff read access added with auth).
alter table public.quotes enable row level security;

comment on table public.quotes is
  'CRM: cotizaciones/RFQ con pipeline (nuevo→...→ganado/perdido) para seguimiento.';
