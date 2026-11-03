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


def test_lead_submission_with_provider_and_services(client, create_test_user, db):
    """
    Tests scenarios:
    - Provider & service selection
    - Email can be omitted
    - Description optional when service does not require it
    - Description mandatory when service requires it
    - Backend rejects mismatched service and inactive provider/service
    - Association with correct affiliate, provider, and service
    - Affiliate sees provider & service in tracking
    - Admin sees provider, service, and contact details
    """
    from app.models import ServiceProvider, ProviderService

    uid_aff = uuid.uuid4().hex[:6]
    uid_admin = uuid.uuid4().hex[:6]
    affiliate = create_test_user(f"aff_prov_{uid_aff}@sbloom-test.invalid", role_key="affiliate")
    admin = create_test_user(f"admin_prov_{uid_admin}@sbloom-test.invalid", role_key="admin")

    token_aff = create_access_token({"sub": str(affiliate.id), "email": affiliate.email})
    token_admin = create_access_token({"sub": str(admin.id), "email": admin.email})

    # Setup 2 providers: Prov A and Prov B
    prov_a = ServiceProvider(
        name=f"Hospital Alpha {uid_aff}",
        sector="healthcare",
        service_title="Comprehensive Care",
        description="Multi-specialty tertiary care.",
        compensation_terms="Terms Net 14",
        city="Vijayawada",
        is_active=True,
    )
    prov_b = ServiceProvider(
        name=f"Clinic Beta {uid_aff}",
        sector="healthcare",
        service_title="Dermatology",
        description="Skin clinic.",
        compensation_terms="Terms Net 14",
        city="Guntur",
        is_active=True,
    )
    db.add_all([prov_a, prov_b])
    db.flush()

    # Service 1 on Prov A: Optional description
    srv_optional = ProviderService(
        provider_id=prov_a.id,
        service_name="General Health Checkup",
        description="Routine diagnostic profile.",
        requirement_description_required=False,
        instructions="Fasting required.",
        is_active=True,
    )
    # Service 2 on Prov A: Mandatory description
    srv_mandatory = ProviderService(
        provider_id=prov_a.id,
        service_name="Specialist Cardiology Review",
        description="Senior cardiology evaluation.",
        requirement_description_required=True,
        instructions="Attach past ECG/Echo reports.",
        is_active=True,
    )
    # Service on Prov B
    srv_b = ProviderService(
        provider_id=prov_b.id,
        service_name="Skin Consultation",
        description="Cosmetic dermatology.",
        requirement_description_required=False,
        is_active=True,
    )
    # Inactive service on Prov A
    srv_inactive = ProviderService(
        provider_id=prov_a.id,
        service_name="Inactive Unit",
        description="Currently paused.",
        requirement_description_required=False,
        is_active=False,
    )
    db.add_all([srv_optional, srv_mandatory, srv_b, srv_inactive])
    db.commit()

    client.cookies.set("access_token", token_aff)

    # 1. Reject mismatched service: Provider A with Service B
    mismatch_res = client.post(
        "/api/affiliate/referrals",
        json={
            "provider_id": str(prov_a.id),
            "service_id": str(srv_b.id),
            "client_name": "Naveen Chandra",
            "client_mobile": "+919876500001",
            "client_city": "Vijayawada",
            "consent_confirmed": True,
        },
    )
    assert mismatch_res.status_code == 400
    assert "does not belong" in mismatch_res.json()["detail"]

    # 2. Reject inactive service
    inactive_res = client.post(
        "/api/affiliate/referrals",
        json={
            "provider_id": str(prov_a.id),
            "service_id": str(srv_inactive.id),
            "client_name": "Naveen Chandra",
            "client_mobile": "+919876500001",
            "client_city": "Vijayawada",
            "consent_confirmed": True,
        },
    )
    assert inactive_res.status_code == 400
    assert "inactive or does not exist" in inactive_res.json()["detail"]

    # 3. Mandatory description required by service: omitting must fail (400)
    fail_mand_res = client.post(
        "/api/affiliate/referrals",
        json={
            "provider_id": str(prov_a.id),
            "service_id": str(srv_mandatory.id),
            "client_name": "Naveen Chandra",
            "client_mobile": "+919876500001",
            "client_city": "Vijayawada",
            "consent_confirmed": True,
            "context_note": "",  # missing or < 10 chars
        },
    )
    assert fail_mand_res.status_code == 400
    assert "requirement description" in fail_mand_res.json()["detail"].lower()

    # 4. Mandatory description provided: succeeds!
    succ_mand_res = client.post(
        "/api/affiliate/referrals",
        json={
            "provider_id": str(prov_a.id),
            "service_id": str(srv_mandatory.id),
            "client_name": "Naveen Chandra",
            "client_mobile": "+919876500001",
            "client_email": "naveen@example.com",
            "client_city": "Vijayawada",
            "consent_confirmed": True,
            "context_note": "Patient experiencing mild chest pain upon walking uphill for 2 weeks.",
        },
    )
    assert succ_mand_res.status_code == 200, succ_mand_res.text
    lead_data = succ_mand_res.json()
    assert lead_data["provider_name"] == prov_a.name
    assert lead_data["service_name"] == srv_mandatory.service_name
    assert lead_data["client_email"] == "naveen@example.com"
    lead_id_1 = lead_data["id"]

    # 5. Optional description omitted: succeeds! Email omitted: succeeds!
    succ_opt_res = client.post(
        "/api/affiliate/referrals",
        json={
            "provider_id": str(prov_a.id),
            "service_id": str(srv_optional.id),
            "client_name": "Priya Sharma",
            "client_mobile": "+919876500002",
            "client_city": "Vijayawada",
            "consent_confirmed": True,
            # no email, no context_note
        },
    )
    assert succ_opt_res.status_code == 200, succ_opt_res.text
    lead_data_2 = succ_opt_res.json()
    assert lead_data_2["client_email"] is None
    assert lead_data_2["context_note"] is None
    assert lead_data_2["service_name"] == srv_optional.service_name
    lead_id_2 = lead_data_2["id"]

    # 6. Affiliate referral tracking displays correct provider and service
    aff_leads_res = client.get("/api/affiliate/referrals")
    assert aff_leads_res.status_code == 200
    aff_leads = aff_leads_res.json()
    item_1 = next((l for l in aff_leads if l["id"] == lead_id_1), None)
    item_2 = next((l for l in aff_leads if l["id"] == lead_id_2), None)
    assert item_1 is not None
    assert item_1["provider_name"] == prov_a.name
    assert item_1["service_name"] == srv_mandatory.service_name
    assert item_2 is not None
    assert item_2["service_name"] == srv_optional.service_name

    # 7. Admin referral management displays provider, service, and contact details
    client.cookies.set("access_token", token_admin)
    admin_detail_res = client.get(f"/api/admin/referrals/{lead_id_1}")
    assert admin_detail_res.status_code == 200
    admin_detail = admin_detail_res.json()
    assert admin_detail["provider_name"] == prov_a.name
    assert admin_detail["service_name"] == srv_mandatory.service_name
    assert admin_detail["client_email"] == "naveen@example.com"
    assert "chest pain" in admin_detail["context_note"]

