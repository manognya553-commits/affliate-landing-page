-- =====================================================================
-- sBLOOM affiliate portal: migration 001 (core MVP)
-- Target: PostgreSQL 15+ on Supabase (uses auth.users and auth.uid()).
-- Covers: profiles and approval, catalog, learning content, payment
-- options, enrollments, leads with automatic status history, bank
-- details, audit log.
-- NOT in this file (next migrations): payout cycles, invoices, ledger,
-- tickets and disputes, the client-portal views for the other team.
--
-- Run order: paste into the Supabase SQL editor once, or save as
-- supabase/migrations/001_core_schema.sql and let the agent apply it.
--
-- FIRST ADMIN: sign up through the app normally, then in the SQL editor run:
--   update public.profiles set role = 'admin', status = 'approved',
--          approved_at = now() where email = 'your-admin-email@example.com';
-- (The protection trigger below allows this because the SQL editor has
--  no logged-in user.)
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- enums ----------------------------------------------------
create type app_role         as enum ('affiliate', 'admin');
create type affiliate_status as enum ('pending', 'info_requested', 'approved', 'rejected', 'suspended');
create type lead_status      as enum (
  'submitted', 'validated', 'sent_to_client', 'contacted', 'qualified',
  'converted', 'commission_approved', 'invoiced', 'paid',
  'duplicate', 'invalid', 'rejected', 'lost'
);
create type payment_model    as enum ('commission_only', 'retainer_commission');
create type content_status   as enum ('missing', 'draft', 'published');
create type content_source   as enum ('client', 'sbloom', 'translated');

-- ---------- generic helpers ------------------------------------------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------- people ---------------------------------------------------
create table public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  role                 app_role not null default 'affiliate',
  status               affiliate_status not null default 'pending',
  email                text,
  phone                text,
  full_name            text,
  city                 text,
  area                 text,
  occupation           text,
  promotion_plan       text,
  preferred_language   text not null default 'en' check (preferred_language in ('en', 'te')),
  terms_version        int,
  terms_accepted_at    timestamptz,
  info_request_note    text,
  rejection_reason     text,
  approved_by          uuid references public.profiles(id),
  approved_at          timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create unique index profiles_email_key on public.profiles (lower(email)) where email is not null;
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

create or replace function public.is_approved_affiliate() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'affiliate' and p.status = 'approved'
  );
$$;

-- create a profile row automatically when someone signs up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, phone, preferred_language)
  values (
    new.id, new.email, new.phone,
    case when new.raw_user_meta_data->>'preferred_language' in ('en', 'te')
         then new.raw_user_meta_data->>'preferred_language' else 'en' end
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- affiliates may edit their own details but never role, status or approval fields
create or replace function public.protect_profile_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role              := old.role;
    new.status            := old.status;
    new.email             := old.email;
    new.approved_by       := old.approved_by;
    new.approved_at       := old.approved_at;
    new.rejection_reason  := old.rejection_reason;
    new.info_request_note := old.info_request_note;
  end if;
  return new;
end $$;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- an affiliate answers an "info requested" message and goes back into the queue
create or replace function public.submit_for_review() returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
     set status = 'pending'
   where id = auth.uid() and status = 'info_requested';
end $$;

-- ---------- catalog --------------------------------------------------
create table public.verticals (
  id       uuid primary key default gen_random_uuid(),
  slug     text unique not null,
  name_en  text not null,
  name_te  text
);

create table public.clients (
  id                  uuid primary key default gen_random_uuid(),
  vertical_id         uuid not null references public.verticals(id),
  name                text not null,
  knowledge_hub_url   text,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

create table public.services (
  id                   uuid primary key default gen_random_uuid(),
  client_id            uuid not null references public.clients(id),
  vertical_id          uuid not null references public.verticals(id),
  slug                 text unique not null,
  name_en              text not null,
  name_te              text,
  summary_en           text,
  summary_te           text,
  who_to_target_en     text,
  who_to_target_te     text,
  cities               text[] not null default '{}',
  knowledge_hub_url    text,
  -- fields shown on the Add Lead form, for example:
  -- [{"key":"name","label_en":"Name","label_te":"పేరు","type":"text","required":true},
  --  {"key":"phone","label_en":"Phone","label_te":"ఫోన్","type":"tel","required":true}]
  -- Only information about the LEAD goes here, never about the affiliate.
  lead_form_schema     jsonb not null default '[]',
  is_active            boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create trigger services_updated before update on public.services
  for each row execute function public.set_updated_at();

create table public.service_payment_options (
  id                uuid primary key default gen_random_uuid(),
  service_id        uuid not null references public.services(id) on delete cascade,
  model             payment_model not null,
  commission_type   text not null default 'flat' check (commission_type in ('flat', 'percent')),
  commission_value  numeric(12, 2) not null check (commission_value >= 0),
  retainer_amount   numeric(12, 2) check (retainer_amount >= 0),
  terms_en          text,
  terms_te          text,
  terms_version     int not null default 1,
  is_active         boolean not null default true,
  unique (id, service_id)
);

-- learning and pitch kit, one row per language version
create table public.content_items (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid not null references public.services(id) on delete cascade,
  group_id    uuid not null default gen_random_uuid(),   -- links en and te versions of one item
  language    text not null check (language in ('en', 'te')),
  kind        text not null check (kind in ('explainer', 'pitch_script', 'faq', 'brochure', 'video', 'quiz')),
  title       text not null,
  body        text,
  file_url    text,
  status      content_status not null default 'draft',
  source      content_source not null default 'sbloom',
  sort_order  int not null default 0,
  updated_at  timestamptz not null default now()
);
create trigger content_updated before update on public.content_items
  for each row execute function public.set_updated_at();

-- ---------- enrollment ----------------------------------------------
create table public.enrollments (
  id                       uuid primary key default gen_random_uuid(),
  affiliate_id             uuid not null references public.profiles(id) on delete cascade,
  service_id               uuid not null references public.services(id),
  payment_option_id        uuid not null,
  accepted_terms_version   int not null,
  referral_code            text unique not null default ('SB' || upper(encode(gen_random_bytes(4), 'hex'))),
  status                   text not null default 'active' check (status in ('active', 'paused')),
  created_at               timestamptz not null default now(),
  unique (affiliate_id, service_id),
  -- the chosen payment option must belong to the same service
  foreign key (payment_option_id, service_id)
    references public.service_payment_options (id, service_id)
);

-- ---------- bank details --------------------------------------------
-- TODO before launch: encrypt account_number (Supabase Vault / pgsodium, or
-- application-level encryption). Never log or return it in full.
create table public.bank_accounts (
  affiliate_id         uuid primary key references public.profiles(id) on delete cascade,
  account_holder_name  text not null,
  account_number       text not null,
  ifsc                 text not null,
  verified_by          uuid references public.profiles(id),
  verified_at          timestamptz,
  updated_at           timestamptz not null default now()
);
create trigger bank_updated before update on public.bank_accounts
  for each row execute function public.set_updated_at();

-- any change by the affiliate clears verification; only an admin can verify
create or replace function public.protect_bank_verification() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.verified_by := null;
    new.verified_at := null;
  end if;
  return new;
end $$;
create trigger bank_protect before insert or update on public.bank_accounts
  for each row execute function public.protect_bank_verification();

-- ---------- leads ----------------------------------------------------
create table public.leads (
  id                     uuid primary key default gen_random_uuid(),
  client_lead_ref        bigint generated always as identity,   -- anonymous reference safe to show to clients
  enrollment_id          uuid not null references public.enrollments(id),
  affiliate_id           uuid not null references public.profiles(id),   -- filled by trigger
  service_id             uuid not null references public.services(id),   -- filled by trigger
  client_id              uuid not null references public.clients(id),    -- filled by trigger
  status                 lead_status not null default 'submitted',
  status_reason          text,                    -- mandatory for duplicate / invalid / rejected / lost (checked in app)
  lead_data              jsonb not null,          -- ONLY the lead's own details, never the affiliate's
  contact_key            text,                    -- normalised phone or email, for duplicate checks
  consent_confirmed      boolean not null,
  consent_at             timestamptz not null default now(),
  client_confirmed_at    timestamptz,
  commission_snapshot    jsonb,                   -- rate in force when the lead converts
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  check (consent_confirmed = true)
);
create index leads_affiliate_idx on public.leads (affiliate_id, created_at desc);
create index leads_client_status_idx on public.leads (client_id, status);
create index leads_dup_idx on public.leads (service_id, contact_key);
create trigger leads_updated before update on public.leads
  for each row execute function public.set_updated_at();

-- notes for admin only, kept out of the leads table so affiliates and the
-- client portal can never read them
create table public.lead_internal_notes (
  lead_id     uuid primary key references public.leads(id) on delete cascade,
  notes       text,
  updated_by  uuid references public.profiles(id),
  updated_at  timestamptz not null default now()
);

create or replace function public.prepare_lead() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  digits text;
begin
  select e.affiliate_id, e.service_id, s.client_id
    into new.affiliate_id, new.service_id, new.client_id
    from public.enrollments e
    join public.services s on s.id = e.service_id
   where e.id = new.enrollment_id;

  if new.affiliate_id is null then
    raise exception 'Unknown enrollment';
  end if;

  digits := regexp_replace(coalesce(new.lead_data->>'phone', ''), '\D', '', 'g');
  new.contact_key := coalesce(
    nullif(right(digits, 10), ''),
    lower(nullif(new.lead_data->>'email', ''))
  );
  return new;
end $$;
create trigger leads_prepare before insert on public.leads
  for each row execute function public.prepare_lead();

create table public.lead_status_history (
  id               uuid primary key default gen_random_uuid(),
  lead_id          uuid not null references public.leads(id) on delete cascade,
  from_status      lead_status,
  to_status        lead_status not null,
  reason           text,
  changed_by       uuid,
  changed_by_type  text not null default 'system' check (changed_by_type in ('admin', 'client', 'affiliate', 'system')),
  changed_via      text not null default 'portal' check (changed_via in ('portal', 'manual_entry', 'bulk_upload', 'system')),
  created_at       timestamptz not null default now()
);
create index lead_history_lead_idx on public.lead_status_history (lead_id, created_at);

-- every status change is recorded automatically
create or replace function public.log_lead_status() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.lead_status_history
      (lead_id, from_status, to_status, reason, changed_by, changed_by_type, changed_via)
    values (
      new.id,
      case when tg_op = 'INSERT' then null else old.status end,
      new.status,
      new.status_reason,
      auth.uid(),
      case when auth.uid() is null then 'system'
           when public.is_admin() then 'admin'
           else 'affiliate' end,
      case when auth.uid() is null then 'system'
           when public.is_admin() then 'manual_entry'
           else 'portal' end
    );
  end if;
  return new;
end $$;
create trigger leads_log_status after insert or update of status on public.leads
  for each row execute function public.log_lead_status();

-- ---------- audit log ------------------------------------------------
create table public.audit_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid,
  action      text not null,
  entity      text not null,
  entity_id   text,
  details     jsonb,
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles                enable row level security;
alter table public.verticals               enable row level security;
alter table public.clients                 enable row level security;
alter table public.services                enable row level security;
alter table public.service_payment_options enable row level security;
alter table public.content_items           enable row level security;
alter table public.enrollments             enable row level security;
alter table public.bank_accounts           enable row level security;
alter table public.leads                   enable row level security;
alter table public.lead_internal_notes     enable row level security;
alter table public.lead_status_history     enable row level security;
alter table public.audit_log               enable row level security;

-- profiles
create policy profiles_select_own   on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_update_own   on public.profiles for update using (id = auth.uid() or public.is_admin())
                                                               with check (id = auth.uid() or public.is_admin());

-- catalog: any signed-in user can read active items, admin manages everything
create policy verticals_read  on public.verticals for select using (auth.uid() is not null);
create policy verticals_admin on public.verticals for all using (public.is_admin()) with check (public.is_admin());

create policy clients_read    on public.clients for select using (auth.uid() is not null and (is_active or public.is_admin()));
create policy clients_admin   on public.clients for all using (public.is_admin()) with check (public.is_admin());

create policy services_read   on public.services for select using (auth.uid() is not null and (is_active or public.is_admin()));
create policy services_admin  on public.services for all using (public.is_admin()) with check (public.is_admin());

create policy payopts_read    on public.service_payment_options for select using (auth.uid() is not null and (is_active or public.is_admin()));
create policy payopts_admin   on public.service_payment_options for all using (public.is_admin()) with check (public.is_admin());

create policy content_read    on public.content_items for select using (
  public.is_admin() or (public.is_approved_affiliate() and status = 'published')
);
create policy content_admin   on public.content_items for all using (public.is_admin()) with check (public.is_admin());

-- enrollments: approved affiliates enroll themselves, read their own
create policy enroll_select   on public.enrollments for select using (affiliate_id = auth.uid() or public.is_admin());
create policy enroll_insert   on public.enrollments for insert with check (affiliate_id = auth.uid() and public.is_approved_affiliate());
create policy enroll_update   on public.enrollments for update using (public.is_admin()) with check (public.is_admin());

-- bank details: owner and admin
create policy bank_select     on public.bank_accounts for select using (affiliate_id = auth.uid() or public.is_admin());
create policy bank_insert     on public.bank_accounts for insert with check (affiliate_id = auth.uid() and public.is_approved_affiliate());
create policy bank_update     on public.bank_accounts for update using (affiliate_id = auth.uid() or public.is_admin())
                                                                with check (affiliate_id = auth.uid() or public.is_admin());

-- leads: affiliates create and read their own; only admin changes them
create policy leads_select    on public.leads for select using (affiliate_id = auth.uid() or public.is_admin());
create policy leads_insert    on public.leads for insert with check (
  public.is_approved_affiliate()
  and status = 'submitted'
  and exists (select 1 from public.enrollments e where e.id = enrollment_id and e.affiliate_id = auth.uid())
);
create policy leads_update    on public.leads for update using (public.is_admin()) with check (public.is_admin());

create policy lead_notes_admin on public.lead_internal_notes for all using (public.is_admin()) with check (public.is_admin());

create policy history_select  on public.lead_status_history for select using (
  public.is_admin()
  or exists (select 1 from public.leads l where l.id = lead_id and l.affiliate_id = auth.uid())
);
-- history rows are written only by the trigger above (security definer), never directly

create policy audit_admin     on public.audit_log for select using (public.is_admin());
create policy audit_insert    on public.audit_log for insert with check (public.is_admin());

-- =====================================================================
-- SEED DATA
-- =====================================================================
insert into public.verticals (slug, name_en, name_te) values
  ('education',             'Education',             'విద్య'),
  ('healthcare',            'Healthcare',            'ఆరోగ్యం'),
  ('professional-services', 'Professional services', 'ప్రొఫెషనల్ సేవలు');
