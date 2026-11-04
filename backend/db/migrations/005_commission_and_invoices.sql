-- sBLOOM affiliate platform
-- Migration 005: Commission Agreements, Commission Ledger, and Invoicing System
-- Introduces:
--   1. app.provider_commission_agreements
--   2. app.provider_invoices & app.provider_invoice_items & app.provider_payments
--   3. app.affiliate_invoices & app.affiliate_invoice_items
--   4. app.commission_ledger
--   5. Conversion fields on app.referral_leads

BEGIN;

-- 1. Conversion fields on app.referral_leads
ALTER TABLE app.referral_leads
  ADD COLUMN IF NOT EXISTS conversion_date timestamptz,
  ADD COLUMN IF NOT EXISTS conversion_value numeric(12, 2),
  ADD COLUMN IF NOT EXISTS conversion_reference text,
  ADD COLUMN IF NOT EXISTS is_eligible_for_commission boolean NOT NULL DEFAULT false;

-- 2. Provider Commission Agreements
CREATE TABLE IF NOT EXISTS app.provider_commission_agreements (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id             uuid NOT NULL REFERENCES app.service_providers (id) ON DELETE CASCADE,
  service_id            uuid REFERENCES app.provider_services (id) ON DELETE CASCADE,
  agreement_type          text NOT NULL DEFAULT 'percentage' CHECK (agreement_type IN ('percentage', 'fixed')),
  provider_rate           numeric(6, 2),
  affiliate_rate          numeric(6, 2),
  sbloom_share_rate       numeric(6, 2),
  provider_fixed_amount   numeric(12, 2),
  affiliate_fixed_amount  numeric(12, 2),
  sbloom_fixed_amount     numeric(12, 2),
  calculation_basis       text NOT NULL DEFAULT 'transaction_value',
  eligibility_trigger     text NOT NULL DEFAULT 'on_conversion',
  effective_date          timestamptz NOT NULL DEFAULT now(),
  expiry_date             timestamptz,
  status                  text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'superseded', 'draft', 'expired')),
  notes                   text,
  created_by              uuid REFERENCES app.users (id),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prov_comm_agr_prov_idx ON app.provider_commission_agreements (provider_id, status);
CREATE INDEX IF NOT EXISTS prov_comm_agr_srv_idx ON app.provider_commission_agreements (service_id);

DROP TRIGGER IF EXISTS prov_comm_agr_set_updated_at ON app.provider_commission_agreements;
CREATE TRIGGER prov_comm_agr_set_updated_at BEFORE UPDATE ON app.provider_commission_agreements
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- 3. Provider Invoices (sBLOOM bills provider)
CREATE TABLE IF NOT EXISTS app.provider_invoices (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number        text NOT NULL UNIQUE,
  provider_id           uuid NOT NULL REFERENCES app.service_providers (id) ON DELETE CASCADE,
  billing_period        text,
  invoice_date          timestamptz NOT NULL DEFAULT now(),
  due_date              timestamptz NOT NULL,
  provider_name         text NOT NULL,
  provider_gstin        text,
  billing_address       text,
  subtotal_amount       numeric(12, 2) NOT NULL DEFAULT 0.00,
  tax_rate              numeric(5, 2) NOT NULL DEFAULT 0.00,
  tax_amount            numeric(12, 2) NOT NULL DEFAULT 0.00,
  total_amount          numeric(12, 2) NOT NULL DEFAULT 0.00,
  amount_paid           numeric(12, 2) NOT NULL DEFAULT 0.00,
  amount_due            numeric(12, 2) NOT NULL DEFAULT 0.00,
  status                text NOT NULL DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'partially_paid', 'paid', 'cancelled')),
  cancellation_reason   text,
  cancelled_at          timestamptz,
  cancelled_by          uuid REFERENCES app.users (id),
  created_by            uuid REFERENCES app.users (id),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prov_inv_prov_idx ON app.provider_invoices (provider_id, status);
CREATE INDEX IF NOT EXISTS prov_inv_number_idx ON app.provider_invoices (invoice_number);

DROP TRIGGER IF EXISTS prov_inv_set_updated_at ON app.provider_invoices;
CREATE TRIGGER prov_inv_set_updated_at BEFORE UPDATE ON app.provider_invoices
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- 4. Affiliate Invoices (Affiliates bill sBLOOM)
CREATE TABLE IF NOT EXISTS app.affiliate_invoices (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number        text NOT NULL UNIQUE,
  affiliate_user_id     uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
  billing_period        text NOT NULL,
  invoice_date          timestamptz NOT NULL DEFAULT now(),
  due_date              timestamptz,
  affiliate_name        text NOT NULL,
  affiliate_email       text NOT NULL,
  affiliate_city        text,
  bank_name             text,
  bank_account_number   text,
  bank_ifsc             text,
  upi_id                text,
  pan_number            text,
  subtotal_amount       numeric(12, 2) NOT NULL DEFAULT 0.00,
  tds_rate              numeric(5, 2) NOT NULL DEFAULT 0.00,
  tds_amount            numeric(12, 2) NOT NULL DEFAULT 0.00,
  total_payable         numeric(12, 2) NOT NULL DEFAULT 0.00,
  status                text NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'verified', 'approved', 'rejected', 'paid', 'cancelled')),
  admin_notes           text,
  rejection_reason      text,
  payout_reference      text,
  payout_method         text,
  paid_at               timestamptz,
  paid_by               uuid REFERENCES app.users (id),
  verified_at           timestamptz,
  verified_by           uuid REFERENCES app.users (id),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS aff_inv_user_idx ON app.affiliate_invoices (affiliate_user_id, status);
CREATE INDEX IF NOT EXISTS aff_inv_period_idx ON app.affiliate_invoices (billing_period);

DROP TRIGGER IF EXISTS aff_inv_set_updated_at ON app.affiliate_invoices;
CREATE TRIGGER aff_inv_set_updated_at BEFORE UPDATE ON app.affiliate_invoices
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- 5. Commission Ledger (Central Financial Record)
CREATE TABLE IF NOT EXISTS app.commission_ledger (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id                 uuid NOT NULL UNIQUE REFERENCES app.referral_leads (id) ON DELETE CASCADE,
  affiliate_user_id           uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
  provider_id                 uuid NOT NULL REFERENCES app.service_providers (id) ON DELETE CASCADE,
  service_id                  uuid REFERENCES app.provider_services (id) ON DELETE SET NULL,
  agreement_id                uuid REFERENCES app.provider_commission_agreements (id) ON DELETE SET NULL,
  eligible_transaction_value  numeric(12, 2) NOT NULL,
  provider_commission_rate    numeric(6, 2),
  affiliate_commission_rate   numeric(6, 2),
  sbloom_share_rate           numeric(6, 2),
  provider_commission_amount  numeric(12, 2) NOT NULL,
  affiliate_commission_amount numeric(12, 2) NOT NULL,
  sbloom_retained_amount      numeric(12, 2) NOT NULL,
  currency                    text NOT NULL DEFAULT 'INR',
  status                      text NOT NULL DEFAULT 'eligible'
                                CHECK (status IN ('pending_verification', 'eligible', 'invoiced_to_provider', 'collected_from_provider', 'invoiced_by_affiliate', 'paid_to_affiliate', 'disputed', 'reversed')),
  provider_invoice_id         uuid REFERENCES app.provider_invoices (id) ON DELETE SET NULL,
  affiliate_invoice_id        uuid REFERENCES app.affiliate_invoices (id) ON DELETE SET NULL,
  verified_at                 timestamptz,
  verified_by                 uuid REFERENCES app.users (id),
  notes                       text,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comm_ledger_aff_idx ON app.commission_ledger (affiliate_user_id, status);
CREATE INDEX IF NOT EXISTS comm_ledger_prov_idx ON app.commission_ledger (provider_id, status);
CREATE INDEX IF NOT EXISTS comm_ledger_ref_idx ON app.commission_ledger (referral_id);

DROP TRIGGER IF EXISTS comm_ledger_set_updated_at ON app.commission_ledger;
CREATE TRIGGER comm_ledger_set_updated_at BEFORE UPDATE ON app.commission_ledger
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- 6. Provider Invoice Line Items
CREATE TABLE IF NOT EXISTS app.provider_invoice_items (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id                  uuid NOT NULL REFERENCES app.provider_invoices (id) ON DELETE CASCADE,
  ledger_id                   uuid REFERENCES app.commission_ledger (id) ON DELETE SET NULL,
  referral_id                 uuid REFERENCES app.referral_leads (id) ON DELETE SET NULL,
  customer_name               text NOT NULL,
  service_name                text NOT NULL,
  eligible_transaction_value  numeric(12, 2) NOT NULL,
  commission_rate             numeric(6, 2),
  commission_amount           numeric(12, 2) NOT NULL,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prov_inv_items_inv_idx ON app.provider_invoice_items (invoice_id);

-- 7. Provider Payment Records
CREATE TABLE IF NOT EXISTS app.provider_payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id          uuid NOT NULL REFERENCES app.provider_invoices (id) ON DELETE CASCADE,
  amount              numeric(12, 2) NOT NULL,
  payment_method      text NOT NULL DEFAULT 'bank_transfer',
  payment_reference   text NOT NULL,
  payment_date        timestamptz NOT NULL DEFAULT now(),
  notes               text,
  recorded_by         uuid REFERENCES app.users (id),
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prov_pmts_inv_idx ON app.provider_payments (invoice_id);

-- 8. Affiliate Invoice Line Items
CREATE TABLE IF NOT EXISTS app.affiliate_invoice_items (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id                  uuid NOT NULL REFERENCES app.affiliate_invoices (id) ON DELETE CASCADE,
  ledger_id                   uuid REFERENCES app.commission_ledger (id) ON DELETE SET NULL,
  referral_id                 uuid REFERENCES app.referral_leads (id) ON DELETE SET NULL,
  customer_name               text NOT NULL,
  provider_name               text NOT NULL,
  service_name                text NOT NULL,
  eligible_transaction_value  numeric(12, 2) NOT NULL,
  affiliate_rate              numeric(6, 2),
  commission_amount           numeric(12, 2) NOT NULL,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS aff_inv_items_inv_idx ON app.affiliate_invoice_items (invoice_id);

-- 9. Seed default commission agreements for verified sample providers
DO $$
DECLARE
  v_apex_id uuid;
  v_pragathi_id uuid;
  v_venkata_id uuid;
BEGIN
  -- Apex Multi-Specialty: 40% provider rate, 20% affiliate share, 20% sBLOOM share
  SELECT id INTO v_apex_id FROM app.service_providers WHERE name ILIKE '%Apex Multi-Specialty%' LIMIT 1;
  IF v_apex_id IS NOT NULL THEN
    INSERT INTO app.provider_commission_agreements (
      provider_id, agreement_type, provider_rate, affiliate_rate, sbloom_share_rate, calculation_basis, eligibility_trigger, status, notes
    ) VALUES (
      v_apex_id, 'percentage', 40.00, 20.00, 20.00, 'transaction_value', 'on_conversion', 'active',
      'Standard Healthcare Partnership Agreement: 40% total provider commission (20% affiliate referral share, 20% sBLOOM retained share).'
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- Pragathi Academy: 30% provider rate, 15% affiliate share, 15% sBLOOM share
  SELECT id INTO v_pragathi_id FROM app.service_providers WHERE name ILIKE '%Pragathi Academy%' LIMIT 1;
  IF v_pragathi_id IS NOT NULL THEN
    INSERT INTO app.provider_commission_agreements (
      provider_id, agreement_type, provider_rate, affiliate_rate, sbloom_share_rate, calculation_basis, eligibility_trigger, status, notes
    ) VALUES (
      v_pragathi_id, 'percentage', 30.00, 15.00, 15.00, 'transaction_value', 'on_conversion', 'active',
      'Education Counseling Agreement: 30% total provider commission on enrollment course fees (15% affiliate share, 15% sBLOOM share).'
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- Venkata Corporate Advisors: 35% provider rate, 20% affiliate share, 15% sBLOOM share
  SELECT id INTO v_venkata_id FROM app.service_providers WHERE name ILIKE '%Venkata Corporate Advisors%' LIMIT 1;
  IF v_venkata_id IS NOT NULL THEN
    INSERT INTO app.provider_commission_agreements (
      provider_id, agreement_type, provider_rate, affiliate_rate, sbloom_share_rate, calculation_basis, eligibility_trigger, status, notes
    ) VALUES (
      v_venkata_id, 'percentage', 35.00, 20.00, 15.00, 'transaction_value', 'on_conversion', 'active',
      'Professional Corporate Services Agreement: 35% total commission (20% affiliate share, 15% sBLOOM retained).'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

SELECT app.lock_down_tables();

COMMIT;
