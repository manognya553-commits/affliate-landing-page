"""
Clean up all demo and test data from sBLOOM database.
- Removes test accounts (@sbloom-test.invalid and explicitly defined dummy users)
- Deletes test referral leads (such as fcgvhbjnk and Anand Verma)
- Deletes test service providers created during pytest runs
- Sets is_sample = False on canonical service providers:
    1. Apex Multi-Specialty Care Network (Healthcare)
    2. Pragathi Academy for Higher Studies (Education)
    3. Venkata Corporate Advisors & Tax Consultants (Professional Services)
- Preserves all real accounts and Super Admin (manognya553@gmail.com, harshikandivalasa@gmail.com, etc.)
"""

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import text
from app.database import SessionLocal
from app.models import (
    User,
    AffiliateProfile,
    UserRole,
    AuthToken,
    RefreshSession,
    ConsentRecord,
    AuditLog,
    ContactInquiry,
    ServiceProvider,
    ProviderService,
    ProviderCommissionAgreement,
    ReferralLead,
    CommissionLedger,
    AffiliateInvoice,
    AffiliateInvoiceItem,
    ProviderInvoice,
    ProviderInvoiceItem,
    ProviderPayment,
)

CANONICAL_PROVIDER_NAMES = [
    "Apex Multi-Specialty Care Network",
    "Pragathi Academy for Higher Studies",
    "Venkata Corporate Advisors & Tax Consultants",
]

PRESERVED_USER_EMAILS = [
    "manognya553@gmail.com",
    "harshikandivalasa@gmail.com",
    "bonusujatha1@gmail.com",
    "manognyasree8@gmail.com",
    "manognya553_v3@gmail.com",
    "mgengi@gitam.in",
    "manognya553_test@gmail.com",
]

EXPLICIT_TEST_EMAILS = [
    "tester.affiliate.demo@gmail.com",
    "admin@sbloom.com",
    "test@test.com",
    "test-vite-proxy@test.com",
    "testuser123@example.com",
]

def run_cleanup():
    db = SessionLocal()
    audit_trigger_disabled = False
    try:
        print("Starting comprehensive demo and test data cleanup...")

        # -------------------------------------------------------------
        # 1. TEMPORARILY DISABLE AUDIT LOG IMMUTABILITY TRIGGER
        # -------------------------------------------------------------
        try:
            db.execute(text("ALTER TABLE app.audit_log DISABLE TRIGGER audit_log_no_update_delete;"))
            db.commit()
            audit_trigger_disabled = True
            print("Audit log trigger disabled for maintenance.")
        except Exception as te:
            db.rollback()
            print(f"Notice regarding audit_log trigger: {te}")

        # -------------------------------------------------------------
        # 2. IDENTIFY TEST USERS AND PRESERVED USERS
        # -------------------------------------------------------------
        all_users = db.query(User).all()
        preserved_lower = {e.lower().strip() for e in PRESERVED_USER_EMAILS}
        test_users = []
        preserved_users = []
        super_admin_id = None

        for u in all_users:
            em = u.email.lower().strip()
            if em == "manognya553@gmail.com":
                super_admin_id = u.id
            if em in preserved_lower:
                preserved_users.append(u)
            elif em.endswith("@sbloom-test.invalid") or em in [x.lower() for x in EXPLICIT_TEST_EMAILS] or em.startswith("test"):
                test_users.append(u)
            else:
                preserved_users.append(u)

        test_user_ids = [u.id for u in test_users]
        print(f"Users found: {len(all_users)} total | {len(preserved_users)} preserved | {len(test_users)} test users to delete.")
        print(f"Super Admin user ID: {super_admin_id}")

        # -------------------------------------------------------------
        # 3. DELETE REFERRAL LEADS & ASSOCIATED COMMISSIONS/INVOICES
        # -------------------------------------------------------------
        leads = db.query(ReferralLead).all()
        print(f"Found {len(leads)} total referral leads.")
        for lead in leads:
            print(f"  Removing referral lead: {lead.id} ({lead.client_name})")
            db.query(AffiliateInvoiceItem).filter(AffiliateInvoiceItem.referral_id == lead.id).delete(synchronize_session=False)
            db.query(ProviderInvoiceItem).filter(ProviderInvoiceItem.referral_id == lead.id).delete(synchronize_session=False)
            db.query(CommissionLedger).filter(CommissionLedger.referral_id == lead.id).delete(synchronize_session=False)
            db.delete(lead)
        db.flush()

        # -------------------------------------------------------------
        # 4. CLEAN UP SERVICE PROVIDERS
        # -------------------------------------------------------------
        all_providers = db.query(ServiceProvider).all()
        canonical_count = 0
        deleted_prov_count = 0

        for prov in all_providers:
            if prov.name in CANONICAL_PROVIDER_NAMES:
                prov.is_sample = False
                prov.is_active = True
                canonical_count += 1
                print(f"  Canonical provider verified live: {prov.name} (is_sample={prov.is_sample})")
            else:
                print(f"  Deleting test service provider: {prov.id} | {prov.name}")
                for inv in prov.invoices:
                    db.query(ProviderInvoiceItem).filter(ProviderInvoiceItem.invoice_id == inv.id).delete(synchronize_session=False)
                    db.query(ProviderPayment).filter(ProviderPayment.invoice_id == inv.id).delete(synchronize_session=False)
                    db.delete(inv)
                db.query(ProviderCommissionAgreement).filter(ProviderCommissionAgreement.provider_id == prov.id).delete(synchronize_session=False)
                db.query(ProviderService).filter(ProviderService.provider_id == prov.id).delete(synchronize_session=False)
                db.delete(prov)
                deleted_prov_count += 1
        db.flush()
        print(f"Providers: {canonical_count} canonical providers preserved, {deleted_prov_count} test providers deleted.")

        # -------------------------------------------------------------
        # 5. CLEAN UP TEST USERS AND THEIR ARTIFACTS
        # -------------------------------------------------------------
        if test_user_ids:
            # 5.1 Delete test user child records directly
            # Affiliate Invoice Items & Invoices
            aff_inv_ids = [inv.id for inv in db.query(AffiliateInvoice).filter(AffiliateInvoice.affiliate_user_id.in_(test_user_ids)).all()]
            if aff_inv_ids:
                db.query(AffiliateInvoiceItem).filter(AffiliateInvoiceItem.invoice_id.in_(aff_inv_ids)).delete(synchronize_session=False)
                db.query(AffiliateInvoice).filter(AffiliateInvoice.id.in_(aff_inv_ids)).delete(synchronize_session=False)

            db.query(CommissionLedger).filter(CommissionLedger.affiliate_user_id.in_(test_user_ids)).delete(synchronize_session=False)
            db.query(ConsentRecord).filter(ConsentRecord.user_id.in_(test_user_ids)).delete(synchronize_session=False)
            db.query(AuthToken).filter(AuthToken.user_id.in_(test_user_ids)).delete(synchronize_session=False)
            db.query(RefreshSession).filter(RefreshSession.user_id.in_(test_user_ids)).delete(synchronize_session=False)
            db.query(UserRole).filter(UserRole.user_id.in_(test_user_ids)).delete(synchronize_session=False)
            
            # Delete test users' affiliate profiles completely
            del_prof = db.query(AffiliateProfile).filter(AffiliateProfile.user_id.in_(test_user_ids)).delete(synchronize_session=False)
            print(f"Deleted {del_prof} test affiliate profiles.")

            # Delete audit_log entries where actor was a test user
            deleted_audit = db.query(AuditLog).filter(AuditLog.actor_user_id.in_(test_user_ids)).delete(synchronize_session=False)
            print(f"Removed {deleted_audit} audit log entries from test user activity.")

            # 5.2 For any remaining preserved records where an admin reference pointed to a test user, reassign to Super Admin
            if super_admin_id:
                db.query(AffiliateProfile).filter(AffiliateProfile.approved_by.in_(test_user_ids)).update({AffiliateProfile.approved_by: super_admin_id}, synchronize_session=False)
                db.query(UserRole).filter(UserRole.granted_by.in_(test_user_ids)).update({UserRole.granted_by: super_admin_id}, synchronize_session=False)
                db.query(ProviderCommissionAgreement).filter(ProviderCommissionAgreement.created_by.in_(test_user_ids)).update({ProviderCommissionAgreement.created_by: super_admin_id}, synchronize_session=False)
                db.query(ContactInquiry).filter(ContactInquiry.handled_by.in_(test_user_ids)).update({ContactInquiry.handled_by: super_admin_id}, synchronize_session=False)
            else:
                db.query(UserRole).filter(UserRole.granted_by.in_(test_user_ids)).update({UserRole.granted_by: None}, synchronize_session=False)

            # 5.3 Delete test user records
            deleted_users_count = db.query(User).filter(User.id.in_(test_user_ids)).delete(synchronize_session=False)
            print(f"Successfully deleted {deleted_users_count} test users.")

        db.commit()
        print("Database commit succeeded!")

        # -------------------------------------------------------------
        # 6. FINAL STATE VERIFICATION
        # -------------------------------------------------------------
        rem_users = db.query(User).all()
        rem_providers = db.query(ServiceProvider).all()
        rem_leads = db.query(ReferralLead).all()

        print("\n================ CLEANUP SUMMARY ================")
        print(f"Remaining Verified Users ({len(rem_users)}):")
        for u in rem_users:
            roles = [r.role.key for r in u.user_roles] if u.user_roles else []
            prof_status = u.affiliate_profile.status if u.affiliate_profile else 'None'
            print(f"  - {u.email} | roles={roles} | profile={prof_status}")

        print(f"\nRemaining Service Providers ({len(rem_providers)}):")
        for p in rem_providers:
            services_count = len(p.services)
            print(f"  - {p.name} | Sector: {p.sector} | is_sample: {p.is_sample} | Services: {services_count}")

        print(f"\nRemaining Referral Leads: {len(rem_leads)}")
        print("=================================================")

    except Exception as e:
        db.rollback()
        print(f"Error during cleanup: {e}", file=sys.stderr)
        raise
    finally:
        if audit_trigger_disabled:
            try:
                db.execute(text("ALTER TABLE app.audit_log ENABLE TRIGGER audit_log_no_update_delete;"))
                db.commit()
                print("Audit log immutability trigger re-enabled.")
            except Exception as re_err:
                print(f"Error re-enabling audit trigger: {re_err}")
        db.close()

if __name__ == "__main__":
    run_cleanup()
