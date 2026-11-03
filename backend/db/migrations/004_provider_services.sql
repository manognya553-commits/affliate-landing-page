-- sBLOOM affiliate platform
-- Migration 004: Provider Services & Lead Association
-- Introduces individual services per service provider, configurable requirements,
-- and links referral leads to specific provider services and optional client email.

BEGIN;

-- 1. Create app.provider_services table
CREATE TABLE IF NOT EXISTS app.provider_services (
  id                               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id                      uuid NOT NULL REFERENCES app.service_providers (id) ON DELETE CASCADE,
  service_name                     text NOT NULL,
  description                      text NOT NULL,
  requirement_description_required boolean NOT NULL DEFAULT false,
  instructions                     text,
  is_active                        boolean NOT NULL DEFAULT true,
  created_at                       timestamptz NOT NULL DEFAULT now(),
  updated_at                       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS provider_services_prov_idx ON app.provider_services (provider_id, is_active);

DROP TRIGGER IF EXISTS provider_services_set_updated_at ON app.provider_services;
CREATE TRIGGER provider_services_set_updated_at BEFORE UPDATE ON app.provider_services
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- 2. Alter app.referral_leads to attach service_id and client_email, and make context_note nullable
ALTER TABLE app.referral_leads
  ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES app.provider_services (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client_email text;

ALTER TABLE app.referral_leads ALTER COLUMN context_note DROP NOT NULL;

CREATE INDEX IF NOT EXISTS referral_leads_service_idx ON app.referral_leads (service_id);

-- 3. Seed initial services for existing sample providers
-- Healthcare: Apex Multi-Specialty Care Network
DO $$
DECLARE
  v_apex_id uuid;
  v_pragathi_id uuid;
  v_venkata_id uuid;
BEGIN
  SELECT id INTO v_apex_id FROM app.service_providers WHERE name ILIKE '%Apex Multi-Specialty%' LIMIT 1;
  IF v_apex_id IS NOT NULL THEN
    INSERT INTO app.provider_services (provider_id, service_name, description, requirement_description_required, instructions, is_active)
    VALUES
      (v_apex_id, 'Specialist Consultation', 'Direct clinical consultation with senior cardiologists, orthopedicians, and general physicians.', true, 'Please note the patient''s primary health concern, duration of symptoms, and preferred department.', true),
      (v_apex_id, 'Comprehensive Preventive Health Check', 'Full body diagnostic screening covering cardiac evaluation, blood profiling, liver/kidney panels, and imaging.', false, 'Inform the client that 10-12 hours of overnight fasting is required prior to testing.', true),
      (v_apex_id, 'Dermatology & Skin Care', 'Specialist dermatological care, advanced skin diagnostics, and cosmetic consultation.', false, 'Consultations are scheduled Monday through Saturday during outpatient hours.', true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Education: Pragathi Academy for Higher Studies
  SELECT id INTO v_pragathi_id FROM app.service_providers WHERE name ILIKE '%Pragathi Academy%' LIMIT 1;
  IF v_pragathi_id IS NOT NULL THEN
    INSERT INTO app.provider_services (provider_id, service_name, description, requirement_description_required, instructions, is_active)
    VALUES
      (v_pragathi_id, 'Engineering Counseling & Entrance Coaching', 'Structured admission counseling, stream selection, and entrance exam guidance for B.Tech & technical colleges.', true, 'Specify the student''s intermediate score/stream and targeted entrance examinations.', true),
      (v_pragathi_id, 'Management & Degree Programs', 'Guidance for undergraduate degree courses (BBA/B.Com) and postgraduate management (MBA/MCA) admissions.', false, 'Sessions can be arranged in person at our counseling centers or via structured video call.', true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Professional: Venkata Corporate Advisors
  SELECT id INTO v_venkata_id FROM app.service_providers WHERE name ILIKE '%Venkata Corporate Advisors%' LIMIT 1;
  IF v_venkata_id IS NOT NULL THEN
    INSERT INTO app.provider_services (provider_id, service_name, description, requirement_description_required, instructions, is_active)
    VALUES
      (v_venkata_id, 'Corporate Incorporation & Startup Package', 'End-to-end company incorporation (Pvt Ltd, LLP, OPC), PAN/TAN allotment, and statutory ROC registration.', true, 'Specify the business sector, number of founding partners/directors, and target operational city.', true),
      (v_venkata_id, 'GST Registration & Monthly Compliance', 'Hassle-free GST enrollment, monthly filing (GSTR-1, GSTR-3B), and input tax credit reconciliation.', false, 'Ensure the client has their PAN, Aadhaar, and electricity bill or lease deed ready.', true),
      (v_venkata_id, 'Income Tax & Statutory Audit Advisory', 'Direct taxation assessment, corporate tax return preparation, and annual statutory audit assistance.', false, 'Advisory engagements are tailored following an initial exploratory call.', true)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

SELECT app.lock_down_tables();

COMMIT;
