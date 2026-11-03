import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models import Role, Permission, RolePermission, AuditLog
from app.security import create_access_token


def test_auto_activation_and_admin_tracking_flow(client: TestClient, db: Session, create_test_user):
    uid = uuid.uuid4().hex[:8]
    # 1. Create affiliate user and token
    affiliate = create_test_user(f"flow-affiliate-{uid}@sbloom-test.invalid", "Password123!", "affiliate")
    affiliate_token = create_access_token({"sub": str(affiliate.id), "email": affiliate.email})

    # 2. Affiliate submits their profile -> automatically approved without manual admin approval
    submit_payload = {
        "full_name": "Automatic Candidate",
        "city": "Hyderabad",
        "area": "Madhapur",
        "mobile": "+91 9876543210",
        "occupation": "homemaker",
        "promotion_plan": "I know local community groups and will introduce verified healthcare services.",
        "terms_accepted": True,
        "terms_version": 1,
    }
    submit_res = client.post(
        "/api/affiliate/profile/submit",
        json=submit_payload,
        cookies={"access_token": affiliate_token},
    )
    assert submit_res.status_code == 200, submit_res.text
    # Must be activated immediately with status 'approved'
    assert submit_res.json()["status"] == "approved"
    assert submit_res.json()["approved_at"] is not None

    # Verify audit row for automatic approval
    auto_audit = (
        db.query(AuditLog)
        .filter(AuditLog.entity_id == str(affiliate.id), AuditLog.action == "affiliate.auto_approved")
        .first()
    )
    assert auto_audit is not None
    assert auto_audit.actor_user_id == affiliate.id
    assert auto_audit.after_state["status"] == "approved"

    # 3. Create Admin user with admin role and permissions
    admin_uid = uuid.uuid4().hex[:8]
    admin = create_test_user(f"flow-admin-{admin_uid}@sbloom-test.invalid", "AdminPassword123!", "admin")
    admin_role = db.query(Role).filter(Role.key == "admin").first()

    # Ensure admin role has permissions
    for perm_key in ("affiliates.review", "affiliates.decide", "affiliates.suspend"):
        perm = db.query(Permission).filter(Permission.key == perm_key).first()
        if not perm:
            perm = Permission(key=perm_key, description=perm_key)
            db.add(perm)
            db.flush()
        rp = db.query(RolePermission).filter(RolePermission.role_id == admin_role.id, RolePermission.permission_id == perm.id).first()
        if not rp:
            db.add(RolePermission(role_id=admin_role.id, permission_id=perm.id))
    db.commit()

    admin_token = create_access_token({"sub": str(admin.id), "email": admin.email})

    # 4. Admin checks summary: tracking all registered affiliates and approved count
    summary_res = client.get("/api/admin/summary", cookies={"access_token": admin_token})
    assert summary_res.status_code == 200
    assert summary_res.json()["approved"] >= 1
    assert summary_res.json()["total"] >= 1

    # 5. Admin lists registered affiliates
    queue_res = client.get("/api/admin/approvals?status=all", cookies={"access_token": admin_token})
    assert queue_res.status_code == 200
    found_ids = [item["user_id"] for item in queue_res.json()]
    assert str(affiliate.id) in found_ids

    # 6. Admin can view details of registered affiliate
    detail_res = client.get(f"/api/admin/approvals/{affiliate.id}", cookies={"access_token": admin_token})
    assert detail_res.status_code == 200
    assert detail_res.json()["user_id"] == str(affiliate.id)
    assert detail_res.json()["full_name"] == "Automatic Candidate"

    # 7. Admin requests more info for administrative review
    req_info_res = client.post(
        f"/api/admin/approvals/{affiliate.id}/request-info",
        json={"note": "Please specify which hospital services you plan to recommend."},
        cookies={"access_token": admin_token},
    )
    assert req_info_res.status_code == 200
    assert req_info_res.json()["status"] == "info_requested"

    # Verify audit row for info request
    audit_info = (
        db.query(AuditLog)
        .filter(AuditLog.entity_id == str(affiliate.id), AuditLog.action == "affiliate.info_requested")
        .first()
    )
    assert audit_info is not None
    assert audit_info.actor_user_id == admin.id
    assert "hospital services" in audit_info.reason

    # 8. Admin re-approves affiliate
    approve_res = client.post(
        f"/api/admin/approvals/{affiliate.id}/approve",
        cookies={"access_token": admin_token},
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["status"] == "approved"

    # 9. Admin suspends affiliate
    suspend_res = client.post(
        f"/api/admin/approvals/{affiliate.id}/suspend",
        json={"reason": "Suspended pending policy compliance check."},
        cookies={"access_token": admin_token},
    )
    assert suspend_res.status_code == 200
    assert suspend_res.json()["status"] == "suspended"

    # 10. Admin views audit logs
    audit_res = client.get("/api/admin/audit-logs", cookies={"access_token": admin_token})
    assert audit_res.status_code == 200
    audit_actions = [item["action"] for item in audit_res.json()]
    assert "affiliate.auto_approved" in audit_actions
    assert "affiliate.suspended" in audit_actions
