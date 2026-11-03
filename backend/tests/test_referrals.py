import uuid
import pytest
from app.models import AuditLog, ReferralLead
from app.security import create_access_token

def test_referral_submission_and_consent(client, create_test_user, db):
    uid = uuid.uuid4().hex[:6]
    affiliate = create_test_user(f"affiliate_ref_{uid}@sbloom-test.invalid", role_key="affiliate")
    token = create_access_token({"sub": str(affiliate.id), "email": affiliate.email})

    client.cookies.set("access_token", token)

    # 1. Submission without consent must fail
    res_no_consent = client.post(
        "/api/affiliate/referrals",
        json={
            "client_name": "Ravi Kumar",
            "client_mobile": "+919876543210",
            "client_city": "Visakhapatnam",
            "service_category": "healthcare",
            "context_note": "Interested in diagnostic screening packages.",
            "consent_confirmed": False,
        },
    )
    assert res_no_consent.status_code in (400, 422)

    # 2. Submission with invalid category must fail
    res_bad_cat = client.post(
        "/api/affiliate/referrals",
        json={
            "client_name": "Ravi Kumar",
            "client_mobile": "+919876543210",
            "client_city": "Visakhapatnam",
            "service_category": "real_estate",  # Not in launch sectors!
            "context_note": "Interested in diagnostics.",
            "consent_confirmed": True,
        },
    )
    assert res_bad_cat.status_code in (400, 422)

    # 3. Valid submission with explicit consent
    res = client.post(
        "/api/affiliate/referrals",
        json={
            "client_name": "Ravi Kumar",
            "client_mobile": "+919876543210",
            "client_city": "Visakhapatnam",
            "service_category": "healthcare",
            "context_note": "Client requested specialist consultation introduction.",
            "consent_confirmed": True,
        },
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["client_name"] == "Ravi Kumar"
    assert data["service_category"] == "healthcare"
    assert data["status"] == "pending"
    assert data["consent_confirmed"] is True

    # Verify audit log entry
    audit = (
        db.query(AuditLog)
        .filter(AuditLog.entity_type == "referral_lead", AuditLog.action == "referral.created", AuditLog.actor_user_id == affiliate.id)
        .order_by(AuditLog.created_at.desc())
        .first()
    )
    assert audit is not None


def test_referral_ownership_isolation(client, create_test_user):
    uid_a = uuid.uuid4().hex[:6]
    uid_b = uuid.uuid4().hex[:6]
    affiliate_a = create_test_user(f"affiliate_a_{uid_a}@sbloom-test.invalid", role_key="affiliate")
    affiliate_b = create_test_user(f"affiliate_b_{uid_b}@sbloom-test.invalid", role_key="affiliate")

    token_a = create_access_token({"sub": str(affiliate_a.id), "email": affiliate_a.email})
    token_b = create_access_token({"sub": str(affiliate_b.id), "email": affiliate_b.email})

    # Affiliate A submits a referral
    client.cookies.set("access_token", token_a)
    submit_res = client.post(
        "/api/affiliate/referrals",
        json={
            "client_name": "Sita Lakshmi",
            "client_mobile": "+919876543211",
            "client_city": "Vijayawada",
            "service_category": "education",
            "context_note": "Higher education counseling requirement.",
            "consent_confirmed": True,
        },
    )
    assert submit_res.status_code == 200
    lead_id = submit_res.json()["id"]

    # Affiliate A sees their referral
    res_a = client.get("/api/affiliate/referrals")
    assert res_a.status_code == 200
    leads_a = res_a.json()
    assert any(l["id"] == lead_id for l in leads_a)

    # Affiliate B lists referrals -> must NOT see Affiliate A's referral
    client.cookies.set("access_token", token_b)
    res_b = client.get("/api/affiliate/referrals")
    assert res_b.status_code == 200
    leads_b = res_b.json()
    assert not any(l["id"] == lead_id for l in leads_b)


def test_admin_referral_management_and_audit(client, create_test_user, db):
    uid_admin = uuid.uuid4().hex[:6]
    uid_aff = uuid.uuid4().hex[:6]
    admin = create_test_user(f"admin_{uid_admin}@sbloom-test.invalid", role_key="admin")
    affiliate = create_test_user(f"affiliate_{uid_aff}@sbloom-test.invalid", role_key="affiliate")

    token_admin = create_access_token({"sub": str(admin.id), "email": admin.email})
    token_affiliate = create_access_token({"sub": str(affiliate.id), "email": affiliate.email})

    # Affiliate submits referral
    client.cookies.set("access_token", token_affiliate)
    sub = client.post(
        "/api/affiliate/referrals",
        json={
            "client_name": "Venkatesh Rao",
            "client_mobile": "+919876543212",
            "client_city": "Hyderabad",
            "service_category": "professional",
            "context_note": "Corporate taxation advisory introduction.",
            "consent_confirmed": True,
        },
    )
    assert sub.status_code == 200
    lead_id = sub.json()["id"]

    # Affiliate cannot call admin referral list (403)
    affiliate_admin_res = client.get("/api/admin/referrals")
    assert affiliate_admin_res.status_code == 403

    # Admin calls admin referrals list -> finds the lead
    client.cookies.set("access_token", token_admin)
    admin_list_res = client.get("/api/admin/referrals")
    assert admin_list_res.status_code == 200
    admin_leads = admin_list_res.json()
    found = next((l for l in admin_leads if l["id"] == lead_id), None)
    assert found is not None
    assert found["client_name"] == "Venkatesh Rao"

    # Admin updates status to 'qualified' with notes
    update_res = client.put(
        f"/api/admin/referrals/{lead_id}/status",
        json={
            "status": "qualified",
            "admin_notes": "Contacted client; requirement confirmed and introduced to professional partner.",
        },
    )
    assert update_res.status_code == 200, update_res.text
    updated_data = update_res.json()
    assert updated_data["status"] == "qualified"
    assert "introduced to professional partner" in updated_data["admin_notes"]

    # Verify audit log recorded referral.status_updated
    audit = (
        db.query(AuditLog)
        .filter(AuditLog.entity_type == "referral_lead", AuditLog.action == "referral.status_updated", AuditLog.entity_id == lead_id)
        .first()
    )
    assert audit is not None
    assert audit.actor_user_id == admin.id
    assert audit.before_state["status"] == "pending"
    assert audit.after_state["status"] == "qualified"
