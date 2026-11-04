import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models import User, AffiliateProfile, UserRole, Role, ServiceProvider, ReferralLead, CommissionLedger, AffiliateInvoice, ProviderInvoice

def inspect():
    db = SessionLocal()
    print("=== USERS ===")
    users = db.query(User).all()
    print(f"Total Users: {len(users)}")
    for u in users:
        if not u.email.endswith("@sbloom-test.invalid"):
            roles = [r.role.key for r in u.user_roles] if u.user_roles else []
            prof_status = u.affiliate_profile.status if u.affiliate_profile else "None"
            print(f"User: {u.id} | {u.email} | roles={roles} | prof_status={prof_status}")
            
    print("\n=== SERVICE PROVIDERS ===")
    providers = db.query(ServiceProvider).all()
    print(f"Total Providers: {len(providers)}")
    for p in providers:
        print(f"Provider: {p.id} | {p.name} | is_sample={p.is_sample} | is_active={p.is_active} | sector={p.sector}")
        
    print("\n=== LEADS ===")
    leads = db.query(ReferralLead).all()
    print(f"Total Leads: {len(leads)}")
    for l in leads:
        print(f"Lead: {l.id} | client={l.client_name} | status={l.status} | affiliate_id={l.affiliate_user_id}")
        
    print("\n=== COMMISSION LEDGER ===")
    entries = db.query(CommissionLedger).all()
    print(f"Total Ledger Entries: {len(entries)}")
    for e in entries:
        print(f"Ledger: {e.id} | status={e.status} | val={e.eligible_transaction_value}")
        
    print("\n=== AFFILIATE INVOICES ===")
    aff_invs = db.query(AffiliateInvoice).all()
    print(f"Total Affiliate Invoices: {len(aff_invs)}")
    for ai in aff_invs:
        print(f"Affiliate Invoice: {ai.id} | num={ai.invoice_number} | status={ai.status}")
        
    print("\n=== PROVIDER INVOICES ===")
    prov_invs = db.query(ProviderInvoice).all()
    print(f"Total Provider Invoices: {len(prov_invs)}")
    for pi in prov_invs:
        print(f"Provider Invoice: {pi.id} | num={pi.invoice_number} | status={pi.status}")
        
    db.close()

if __name__ == "__main__":
    inspect()
