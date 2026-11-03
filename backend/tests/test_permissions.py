import uuid
import pytest
from fastapi.testclient import TestClient
from app.security import create_access_token


def test_affiliate_cannot_call_admin_endpoints(client: TestClient, create_test_user):
    uid = uuid.uuid4().hex[:8]
    affiliate = create_test_user(f"affiliate-guard-{uid}@sbloom-test.invalid", "Password123!", "affiliate")
    token = create_access_token({"sub": str(affiliate.id), "email": affiliate.email})

    # Attempt to call admin summary -> forbidden with 403
    res_summary = client.get("/api/admin/summary", cookies={"access_token": token})
    assert res_summary.status_code == 403
    assert "Permission denied" in res_summary.json()["detail"]

    # Attempt to call admin approvals queue -> forbidden with 403
    res_queue = client.get("/api/admin/approvals", cookies={"access_token": token})
    assert res_queue.status_code == 403
    assert "Permission denied" in res_queue.json()["detail"]

    # Attempt to call admin approve endpoint -> forbidden with 403
    res_approve = client.post(
        f"/api/admin/approvals/{affiliate.id}/approve",
        cookies={"access_token": token},
    )
    assert res_approve.status_code == 403
    assert "Permission denied" in res_approve.json()["detail"]


def test_affiliate_cannot_read_someone_elses_profile(client: TestClient, create_test_user):
    uid_a = uuid.uuid4().hex[:8]
    uid_b = uuid.uuid4().hex[:8]
    user_a = create_test_user(f"user-a-{uid_a}@sbloom-test.invalid", "Password123!", "affiliate")
    user_b = create_test_user(f"user-b-{uid_b}@sbloom-test.invalid", "Password123!", "affiliate")

    token_a = create_access_token({"sub": str(user_a.id), "email": user_a.email})

    # User A requests their own profile -> succeeds and returns user A's profile
    res_a = client.get("/api/affiliate/profile", cookies={"access_token": token_a})
    assert res_a.status_code == 200
    assert res_a.json()["user_id"] == str(user_a.id)

    # User A tries to access admin detail endpoint for User B -> fails with 403
    res_b = client.get(f"/api/admin/approvals/{user_b.id}", cookies={"access_token": token_a})
    assert res_b.status_code == 403
