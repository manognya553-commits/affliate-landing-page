-- sBLOOM affiliate platform
-- Migration 001: core (build Step 1)
-- Supabase is used ONLY as a hosted PostgreSQL database. We do not use Supabase Auth, the Supabase API,
-- Edge Functions or Storage. Our own Python backend handles login and permissions.
-- This file uses only standard PostgreSQL, so it also runs on any other PostgreSQL 14+ later.
--
-- All tables live in their own schema called "app". Supabase's built-in public API only exposes the
-- "public" schema, so keeping our tables in "app" and locking them down means nobody can read them
-- with the project's public key. Only our backend can.
--
-- Covers: accounts and login, roles and permissions, affiliate profile and approval,
-- terms and consent, audit log, contact inquiries, site events.
--
-- Every name below is written as app.something, so the file does not depend on any search_path setting.
--
-- Known simplification: login is email + password only. When the mobile OTP fallback or Google login
-- is added, a later migration adds an auth_identities table. Nothing here needs to change for that.

BEGIN;

CREATE SCHEMA IF NOT EXISTS app;

-- Keeps updated_at correct on any table that has it.
CREATE OR REPLACE FUNCTION app.set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Lock-down: turns on row level security for every table in the app schema and removes every
-- permission from Supabase's public roles (anon, authenticated). The backend connects as the owner,
-- which is not affected. EVERY future migration must end with:  SELECT app.lock_down_tables();
CREATE OR REPLACE FUNCTION app.lock_down_tables() RETURNS void AS $$
DECLARE
  t record;
  r text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'app' LOOP
    EXECUTE format('ALTER TABLE app.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('REVOKE ALL ON SCHEMA app FROM %I', r);
      EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA app FROM %I', r);
      EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA app FROM %I', r);
      EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA app FROM %I', r);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. ACCOUNTS AND LOGIN
-- ---------------------------------------------------------------------------

CREATE TABLE app.users (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email              text NOT NULL UNIQUE CHECK (email = lower(email)),   -- always stored in lower case
  password_hash      text NOT NULL,                 -- argon2id hash, never the password itself
  email_verified_at  timestamptz,
  preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
  is_active          boolean NOT NULL DEFAULT true,
  last_login_at      timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON app.users
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- One-time links for email verification and password reset. Only a hash of the token is stored.
CREATE TABLE app.auth_tokens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
  purpose     text NOT NULL CHECK (purpose IN ('email_verify', 'password_reset')),
  token_hash  text NOT NULL UNIQUE,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX auth_tokens_user_purpose_idx ON app.auth_tokens (user_id, purpose);

-- Logged-in sessions. The browser holds a refresh token in an httpOnly cookie; only its hash is stored here.
CREATE TABLE app.refresh_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
  token_hash  text NOT NULL UNIQUE,
  user_agent  text,
  ip_address  inet,
  expires_at  timestamptz NOT NULL,
  revoked_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX refresh_sessions_user_idx ON app.refresh_sessions (user_id);

-- ---------------------------------------------------------------------------
-- 2. ROLES AND PERMISSIONS (Admin is a bundle of permissions, so it can be split later)
-- ---------------------------------------------------------------------------

CREATE TABLE app.roles (
  id    smallserial PRIMARY KEY,
  key   text NOT NULL UNIQUE,
  name  text NOT NULL
);

CREATE TABLE app.permissions (
  id           smallserial PRIMARY KEY,
  key          text NOT NULL UNIQUE,
  description  text NOT NULL
);

CREATE TABLE app.role_permissions (
  role_id        smallint NOT NULL REFERENCES app.roles (id) ON DELETE CASCADE,
  permission_id  smallint NOT NULL REFERENCES app.permissions (id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE app.user_roles (
  user_id     uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
  role_id     smallint NOT NULL REFERENCES app.roles (id) ON DELETE CASCADE,
  granted_by  uuid REFERENCES app.users (id),
  granted_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- ---------------------------------------------------------------------------
-- 3. TERMS AND CONSENT
-- ---------------------------------------------------------------------------

CREATE TABLE app.terms_versions (
  document_key  text NOT NULL,                    -- for example 'affiliate_terms', 'privacy_notice'
  version       integer NOT NULL,
  title         text NOT NULL,
  url           text,
  published_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (document_key, version)
);

CREATE TABLE app.consent_records (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES app.users (id),
  document_key  text NOT NULL,
  version       integer NOT NULL,
  accepted_at   timestamptz NOT NULL DEFAULT now(),
  ip_address    inet,
  user_agent    text,
  FOREIGN KEY (document_key, version) REFERENCES app.terms_versions (document_key, version)
);
CREATE INDEX consent_records_user_idx ON app.consent_records (user_id);

-- ---------------------------------------------------------------------------
-- 4. AFFILIATE PROFILE AND APPROVAL
-- Status flow: draft -> pending -> approved | rejected | info_requested -> (back to pending) ; approved -> suspended
-- The backend enforces who may change status. These checks stop impossible data.
-- ---------------------------------------------------------------------------

CREATE TABLE app.affiliate_profiles (
  user_id            uuid PRIMARY KEY REFERENCES app.users (id) ON DELETE CASCADE,
  full_name          text,
  city               text,
  area               text,
  mobile             text,                         -- optional
  occupation         text CHECK (occupation IN (
                       'homemaker', 'working_professional', 'shop_owner', 'student',
                       'tutor', 'community_connector', 'retired', 'other')),
  promotion_plan     text,                         -- "How do you plan to introduce people to services?"
  status             text NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft', 'pending', 'info_requested', 'approved', 'rejected', 'suspended')),
  terms_version      integer,
  terms_accepted_at  timestamptz,
  submitted_at       timestamptz,
  info_request_note  text,
  rejection_reason   text,
  suspension_reason  text,
  approved_by        uuid REFERENCES app.users (id),
  approved_at        timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),

  -- Anything other than a draft must have a complete profile and accepted terms.
  CONSTRAINT profile_complete_when_submitted CHECK (
    status = 'draft' OR (
      full_name IS NOT NULL AND city IS NOT NULL AND area IS NOT NULL AND
      occupation IS NOT NULL AND promotion_plan IS NOT NULL AND terms_accepted_at IS NOT NULL)),
  CONSTRAINT rejection_needs_reason CHECK (status <> 'rejected' OR rejection_reason IS NOT NULL),
  CONSTRAINT info_request_needs_note CHECK (status <> 'info_requested' OR info_request_note IS NOT NULL),
  CONSTRAINT approval_needs_approver CHECK (status <> 'approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);
CREATE INDEX affiliate_profiles_status_idx ON app.affiliate_profiles (status, submitted_at);

CREATE TRIGGER affiliate_profiles_set_updated_at BEFORE UPDATE ON app.affiliate_profiles
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. AUDIT LOG (append-only: rows can never be changed or deleted)
-- ---------------------------------------------------------------------------

CREATE TABLE app.audit_log (
  id             bigserial PRIMARY KEY,
  actor_user_id  uuid REFERENCES app.users (id),
  action         text NOT NULL,                    -- for example 'affiliate.approved'
  entity_type    text NOT NULL,                    -- for example 'affiliate_profile'
  entity_id      text NOT NULL,
  reason         text,
  before_state   jsonb,
  after_state    jsonb,
  ip_address     inet,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_log_entity_idx  ON app.audit_log (entity_type, entity_id);
CREATE INDEX audit_log_actor_idx   ON app.audit_log (actor_user_id);
CREATE INDEX audit_log_created_idx ON app.audit_log (created_at);

CREATE OR REPLACE FUNCTION app.audit_log_block_changes() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_no_update_delete BEFORE UPDATE OR DELETE ON app.audit_log
  FOR EACH ROW EXECUTE FUNCTION app.audit_log_block_changes();

-- ---------------------------------------------------------------------------
-- 6. PUBLIC SITE: CONTACT FORM AND FUNNEL TRACKING
-- ---------------------------------------------------------------------------

CREATE TABLE app.contact_inquiries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  message     text NOT NULL,
  language    text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'te')),
  status      text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  ip_address  inet,
  user_agent  text,
  handled_by  uuid REFERENCES app.users (id),
  handled_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX contact_inquiries_status_idx ON app.contact_inquiries (status, created_at);

-- Light funnel tracking: page_view, language_changed, signup_click, signup_started, signup_completed
CREATE TABLE app.site_events (
  id          bigserial PRIMARY KEY,
  event_name  text NOT NULL,
  language    text CHECK (language IN ('en', 'te')),
  session_id  text,                                -- random id made by the browser, not a person
  path        text,
  meta        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX site_events_name_time_idx ON app.site_events (event_name, created_at);

-- ---------------------------------------------------------------------------
-- 7. STARTING DATA
-- The first admin account is created with the backend's create-admin script, not with SQL.
-- ---------------------------------------------------------------------------

INSERT INTO app.roles (key, name) VALUES
  ('affiliate', 'Affiliate'),
  ('admin',     'Admin');

INSERT INTO app.permissions (key, description) VALUES
  ('affiliates.review',  'View affiliate applications'),
  ('affiliates.decide',  'Approve, reject or request more information'),
  ('affiliates.suspend', 'Suspend or reinstate affiliates'),
  ('catalog.manage',     'Manage verticals, clients and services'),
  ('leads.manage',       'Validate, release and update leads'),
  ('bank.verify',        'Verify affiliate bank details'),
  ('payouts.manage',     'Run payout cycles, invoices and payments'),
  ('content.manage',     'Manage learning content and landing page text'),
  ('users.manage',       'Manage users and roles'),
  ('audit.view',         'View the audit log'),
  ('reports.view',       'View reports');

INSERT INTO app.role_permissions (role_id, permission_id)
  SELECT r.id, p.id FROM app.roles r CROSS JOIN app.permissions p WHERE r.key = 'admin';

INSERT INTO app.terms_versions (document_key, version, title) VALUES
  ('affiliate_terms', 1, 'Affiliate Programme Terms');

SELECT app.lock_down_tables();

COMMIT;
