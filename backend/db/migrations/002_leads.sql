-- sBLOOM affiliate platform
-- Migration 002: referral leads (Phase 3)
-- Defines the app.referral_leads table for tracking client introductions
-- under the sBLOOM permission-first principle.
--
-- Every table lives in schema "app" and is locked down with app.lock_down_tables().

BEGIN;

CREATE TABLE IF NOT EXISTS app.referral_leads (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_user_id  uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
  client_name        text NOT NULL,
  client_mobile      text NOT NULL,
  client_city        text NOT NULL,
  service_category   text NOT NULL CHECK (service_category IN ('healthcare', 'education', 'professional')),
  context_note       text NOT NULL,
  consent_confirmed  boolean NOT NULL CHECK (consent_confirmed = true),
  status             text NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'contacted', 'qualified', 'converted', 'rejected')),
  admin_notes        text,
  updated_by         uuid REFERENCES app.users (id),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS referral_leads_affiliate_idx ON app.referral_leads (affiliate_user_id, status);
CREATE INDEX IF NOT EXISTS referral_leads_status_idx ON app.referral_leads (status, created_at);

DROP TRIGGER IF EXISTS referral_leads_set_updated_at ON app.referral_leads;
CREATE TRIGGER referral_leads_set_updated_at BEFORE UPDATE ON app.referral_leads
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

SELECT app.lock_down_tables();

COMMIT;
