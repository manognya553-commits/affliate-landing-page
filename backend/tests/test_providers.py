import uuid
from app.models import ServiceProvider
from app.security import create_access_token


def test_public_and_admin_provider_directory(client, create_test_user, db):
    uid = uuid.uuid4().hex[:6]
    admin = create_test_user(f"admin_prov_{uid}@sbloom-test.invalid", role_key="admin")
    affiliate = create_test_user(f"aff_prov_{uid}@sbloom-test.invalid", role_key="affiliate")

    token_admin = create_access_token({"sub": str(admin.id), "email": admin.email})
    token_aff = create_access_token({"sub": str(affiliate.id), "email": affiliate.email})

    # 1. Non-admin cannot create provider (403)
    client.cookies.set("access_token", token_aff)
    fail_create = client.post(
        "/api/admin/providers",
        json={
            "name": "Unauthorized Clinic",
            "sector": "healthcare",
            "service_title": "General Health Checkup",
            "description": "Standard medical testing services.",
            "compensation_terms": "Provider terms Net 30",
            "city": "Vijayawada",
            "is_active": True,
        },
    )
    assert fail_create.status_code == 403

    # 2. Admin creates a real provider
    client.cookies.set("access_token", token_admin)
    create_res = client.post(
        "/api/admin/providers",
        json={
            "name": f"KIMS Diagnostic Center {uid}",
            "sector": "healthcare",
            "service_title": "Comprehensive Cardiac & Preventive Care",
            "description": "State-of-the-art diagnostic screening network.",
            "compensation_terms": "Provider sets terms. Net 14 business days.",
            "city": "Vijayawada",
            "area": "Governorpet",
            "contact_email": "care@kimsdiag.example.in",
            "contact_phone": "+91 866 250 8800",
            "is_active": True,
            "is_sample": False,
        },
    )
    assert create_res.status_code == 200, create_res.text
    prov_id = create_res.json()["id"]

    # 3. Public query returns active provider
    pub_res = client.get("/api/public/providers?sector=healthcare")
    assert pub_res.status_code == 200
    providers = pub_res.json()
    assert any(p["id"] == prov_id for p in providers)

    # 4. Admin toggles provider active -> inactive
    toggle_res = client.post(f"/api/admin/providers/{prov_id}/toggle-active")
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_active"] is False

    # 5. Public query no longer lists inactive provider
    pub_after = client.get("/api/public/providers?sector=healthcare")
    assert pub_after.status_code == 200
    assert not any(p["id"] == prov_id for p in pub_after.json())
