import uuid
from datetime import datetime, timezone, timedelta
from app.models import AuthToken, AffiliateProfile
from app.security import hash_token, generate_secure_token, create_access_token


def test_email_verification_flow(client, create_test_user, db):
    uid = uuid.uuid4().hex[:6]
    user = create_test_user(f"verify_test_{uid}@sbloom-test.invalid")
    
    # Reset email_verified_at to None
    user.email_verified_at = None
    db.commit()

    # 1. Invalid token fails
    res_bad = client.post("/api/auth/verify-email", json={"token": "invalid_fake_token_12345"})
    assert res_bad.status_code == 400

    # 2. Valid token succeeds
    raw_token = generate_secure_token()
    token_rec = AuthToken(
        user_id=user.id,
        purpose="email_verify",
        token_hash=hash_token(raw_token),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
    )
    db.add(token_rec)
    db.commit()

    res_good = client.post("/api/auth/verify-email", json={"token": raw_token})
    assert res_good.status_code == 200
    assert "verified successfully" in res_good.json()["message"].lower()

    # 3. Already-used token fails
    res_reuse = client.post("/api/auth/verify-email", json={"token": raw_token})
    assert res_reuse.status_code == 400


def test_suspended_account_protection_and_reinstatement(client, create_test_user, db):
    uid = uuid.uuid4().hex[:6]
    admin = create_test_user(f"admin_guard_{uid}@sbloom-test.invalid", role_key="admin")
    affiliate = create_test_user(f"aff_guard_{uid}@sbloom-test.invalid", role_key="affiliate")

    token_admin = create_access_token({"sub": str(admin.id), "email": admin.email})
    token_aff = create_access_token({"sub": str(affiliate.id), "email": affiliate.email})

    # Admin suspends affiliate
    client.cookies.set("access_token", token_admin)
    sus_res = client.post(
        f"/api/admin/approvals/{affiliate.id}/suspend",
        json={"reason": "Suspended for policy violation test."},
    )
    assert sus_res.status_code == 200

    # Suspended affiliate attempts referral submission -> 403 Forbidden
    client.cookies.set("access_token", token_aff)
    ref_res = client.post(
        "/api/affiliate/referrals",
        json={
            "client_name": "Test Client",
            "client_mobile": "+919876543299",
            "client_city": "Vijayawada",
            "service_category": "healthcare",
            "context_note": "Medical screening referral.",
            "consent_confirmed": True,
        },
    )
    assert ref_res.status_code == 403
    assert "suspended" in ref_res.json()["detail"].lower()

    # Suspended affiliate attempts self-reactivation via submit -> 403 Forbidden
    react_res = client.post(
        "/api/affiliate/profile/submit",
        json={
            "full_name": "Tampered Name",
            "city": "Vijayawada",
            "area": "Governorpet",
            "occupation": "homemaker",
            "promotion_plan": "Attempting to reactivate account without authorization.",
            "terms_accepted": True,
            "terms_version": 1,
        },
    )
    assert react_res.status_code == 403

    # Admin reinstates affiliate account
    client.cookies.set("access_token", token_admin)
    reinstate_res = client.post(f"/api/admin/approvals/{affiliate.id}/reinstate")
    assert reinstate_res.status_code == 200
    assert reinstate_res.json()["status"] == "approved"

    # Reinstated affiliate can now submit referrals
    client.cookies.set("access_token", token_aff)
    ref_ok = client.post(
        "/api/affiliate/referrals",
        json={
            "client_name": "Test Client Restored",
            "client_mobile": "+919876543298",
            "client_city": "Vijayawada",
            "service_category": "healthcare",
            "context_note": "Medical screening referral after reinstatement.",
            "consent_confirmed": True,
        },
    )
    assert ref_ok.status_code == 200, ref_ok.text
