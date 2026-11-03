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


def test_admin_provider_services_crud(client, create_test_user):
    uid = uuid.uuid4().hex[:6]
    admin = create_test_user(f"admin_srv_{uid}@sbloom-test.invalid", role_key="admin")
    affiliate = create_test_user(f"aff_srv_{uid}@sbloom-test.invalid", role_key="affiliate")

    token_admin = create_access_token({"sub": str(admin.id), "email": admin.email})
    token_aff = create_access_token({"sub": str(affiliate.id), "email": affiliate.email})

    # Admin creates a provider
    client.cookies.set("access_token", token_admin)
    p_res = client.post(
        "/api/admin/providers",
        json={
            "name": f"City Healthcare Hub {uid}",
            "sector": "healthcare",
            "service_title": "Multi-discipline Care",
            "description": "General care hub.",
            "compensation_terms": "Provider Terms Net 14",
            "city": "Vijayawada",
            "is_active": True,
        },
    )
    assert p_res.status_code == 200
    prov_id = p_res.json()["id"]

    # 1. Non-admin cannot add service (403)
    client.cookies.set("access_token", token_aff)
    fail_add = client.post(
        f"/api/admin/providers/{prov_id}/services",
        json={
            "service_name": "Unauthorized Service",
            "description": "Will fail",
            "requirement_description_required": False,
        },
    )
    assert fail_add.status_code == 403

    # 2. Admin adds a service
    client.cookies.set("access_token", token_admin)
    add_res = client.post(
        f"/api/admin/providers/{prov_id}/services",
        json={
            "service_name": "Orthopedic Surgery Consultation",
            "description": "Consultation with senior joint replacement surgeons.",
            "requirement_description_required": True,
            "instructions": "Specify whether patient has had previous joint surgery.",
            "is_active": True,
        },
    )
    assert add_res.status_code == 200, add_res.text
    srv_data = add_res.json()
    srv_id = srv_data["id"]
    assert srv_data["service_name"] == "Orthopedic Surgery Consultation"
    assert srv_data["requirement_description_required"] is True

    # 3. Admin lists services under provider
    list_res = client.get(f"/api/admin/providers/{prov_id}/services")
    assert list_res.status_code == 200
    services = list_res.json()
    assert len(services) == 1
    assert services[0]["id"] == srv_id

    # 4. Admin updates service
    update_res = client.put(
        f"/api/admin/providers/{prov_id}/services/{srv_id}",
        json={
            "service_name": "Joint & Orthopedic Care",
            "requirement_description_required": False,
        },
    )
    assert update_res.status_code == 200
    assert update_res.json()["service_name"] == "Joint & Orthopedic Care"
    assert update_res.json()["requirement_description_required"] is False

    # 5. Admin toggles service active -> inactive
    toggle_res = client.post(f"/api/admin/providers/{prov_id}/services/{srv_id}/toggle-active")
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_active"] is False

    # 6. Public provider detail does NOT show inactive service
    pub_detail = client.get(f"/api/public/providers/{prov_id}")
    assert pub_detail.status_code == 200
    assert not any(s["id"] == srv_id for s in pub_detail.json()["services"])

    # 7. Admin deletes service
    del_res = client.delete(f"/api/admin/providers/{prov_id}/services/{srv_id}")
    assert del_res.status_code == 200
    list_after_del = client.get(f"/api/admin/providers/{prov_id}/services")
    assert len(list_after_del.json()) == 0

