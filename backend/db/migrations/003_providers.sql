-- sBLOOM affiliate platform
-- Migration 003: service providers and payout details
-- Adds dynamic service provider directory and affiliate settlement fields
-- under the sBLOOM permission-first principle.

BEGIN;

-- 1. Create service_providers table
CREATE TABLE IF NOT EXISTS app.service_providers (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL,
  sector                text NOT NULL CHECK (sector IN ('healthcare', 'education', 'professional')),
  service_title         text NOT NULL,
  description           text NOT NULL,
  eligibility_criteria  text,
  compensation_terms    text NOT NULL,
  city                  text NOT NULL,
  area                  text,
  contact_email         text,
  contact_phone         text,
  website               text,
  is_active             boolean NOT NULL DEFAULT true,
  is_sample             boolean NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_providers_sector_idx ON app.service_providers (sector, is_active);
CREATE INDEX IF NOT EXISTS service_providers_city_idx ON app.service_providers (city);

DROP TRIGGER IF EXISTS service_providers_set_updated_at ON app.service_providers;
CREATE TRIGGER service_providers_set_updated_at BEFORE UPDATE ON app.service_providers
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- 2. Link referral leads to service_providers
ALTER TABLE app.referral_leads 
  ADD COLUMN IF NOT EXISTS provider_id uuid REFERENCES app.service_providers (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS referral_leads_provider_idx ON app.referral_leads (provider_id);

-- 3. Add payout & settlement fields to affiliate profiles (for banking groundwork)
ALTER TABLE app.affiliate_profiles
  ADD COLUMN IF NOT EXISTS bank_name text,
  ADD COLUMN IF NOT EXISTS bank_account_number text,
  ADD COLUMN IF NOT EXISTS bank_ifsc text,
  ADD COLUMN IF NOT EXISTS upi_id text,
  ADD COLUMN IF NOT EXISTS pan_number text;

-- 4. Seed initial approved provider catalog across the 3 approved launch sectors
INSERT INTO app.service_providers (
  name, sector, service_title, description, eligibility_criteria, compensation_terms, city, area, contact_email, contact_phone, is_active, is_sample
) VALUES
(
  'Apex Multi-Specialty Care Network',
  'healthcare',
  'Specialist Consultation & Preventive Care',
  'Tertiary-care referral network providing specialist diagnostic evaluations, cardiology, orthopedic, and preventive health checks.',
  'Individuals seeking direct medical consultation, health screenings, or specialist second opinions.',
  'Provider sets terms. Referral compensation verified within 14 business days following completed patient consultation.',
  'Vijayawada',
  'Suryaraopet',
  'care@apexnetwork.example.in',
  '+91 866 245 9000',
  true,
  true
),
(
  'Pragathi Academy for Higher Studies',
  'education',
  'Engineering, Management & Degree Counseling',
  'Accredited educational counseling and entrance coaching for professional undergraduate and postgraduate courses.',
  'Students and parents exploring university admissions and certified technical career training.',
  'Provider sets terms. Referral acknowledgment upon verified enrollment and course fee confirmation.',
  'Hyderabad',
  'Madhapur',
  'admissions@pragathiacademy.example.in',
  '+91 40 4850 1100',
  true,
  true
),
(
  'Venkata Corporate Advisors & Tax Consultants',
  'professional',
  'Corporate Incorporation, GST & Tax Advisory',
  'End-to-end corporate advisory, GST filing, ROC compliance, and income tax consulting for MSMEs and startups.',
  'New entrepreneurs, established businesses, and professionals requiring verified taxation or corporate registration.',
  'Provider sets terms. Engagement compensation settled within 30 days of client engagement agreement execution.',
  'Visakhapatnam',
  'Dwaraka Nagar',
  'contact@venkataca.example.in',
  '+91 891 270 4400',
  true,
  true
);

SELECT app.lock_down_tables();

COMMIT;
