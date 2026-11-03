import uuid
import pytest
from fastapi.testclient import TestClient


def test_signup_and_immediate_login(client: TestClient):
    uid = uuid.uuid4().hex[:8]
    email = f"test-user-{uid}@sbloom-test.invalid"
    password = "SecurePassword123!"

    # 1. Signup with basic credentials
    signup_res = client.post(
        "/api/auth/signup",
        json={"email": email.upper(), "password": password, "preferred_language": "en"},
    )
    assert signup_res.status_code == 200, signup_res.text
    signup_data = signup_res.json()
    assert signup_data["user"]["email"] == email.lower()
    assert signup_data["roles"] == ["affiliate"]
    assert signup_data["affiliate_status"] == "draft"

    # Verify auth cookies were set
    assert "access_token" in signup_res.cookies
    assert "refresh_token" in signup_res.cookies

    # 2. Check /api/auth/me using cookie
    me_res = client.get("/api/auth/me", cookies=signup_res.cookies)
    assert me_res.status_code == 200
    assert me_res.json()["user"]["email"] == email.lower()

    # 3. Newly registered affiliate can log in immediately
    login_res = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert login_res.status_code == 200
    assert login_res.json()["user"]["email"] == email.lower()
    assert "access_token" in login_res.cookies

    # 4. Affiliate completes profile registration -> automatically activated immediately
    submit_payload = {
        "full_name": "Immediate Affiliate",
        "city": "Hyderabad",
        "area": "Gachibowli",
        "mobile": "+91 9988776655",
        "occupation": "working_professional",
        "promotion_plan": "Sharing via neighbourhood networks and professional groups.",
        "terms_accepted": True,
        "terms_version": 1,
    }
    submit_res = client.post(
        "/api/affiliate/profile/submit",
        json=submit_payload,
        cookies=login_res.cookies,
    )
    assert submit_res.status_code == 200, submit_res.text
    assert submit_res.json()["status"] == "approved"
    assert submit_res.json()["approved_at"] is not None

    # 5. Accessing profile and /api/auth/me returns 'approved'
    profile_res = client.get("/api/affiliate/profile", cookies=login_res.cookies)
    assert profile_res.status_code == 200
    assert profile_res.json()["status"] == "approved"

    me_res_after = client.get("/api/auth/me", cookies=login_res.cookies)
    assert me_res_after.status_code == 200
    assert me_res_after.json()["affiliate_status"] == "approved"


def test_signup_with_full_profile_auto_activation(client: TestClient):
    uid = uuid.uuid4().hex[:8]
    email = f"auto-active-{uid}@sbloom-test.invalid"
    password = "SecurePassword123!"

    # Registration with all required profile details automatically activates immediately
    signup_res = client.post(
        "/api/auth/signup",
        json={
            "email": email,
            "password": password,
            "preferred_language": "te",
            "full_name": "Direct Active Affiliate",
            "city": "Vijayawada",
            "area": "Benz Circle",
            "mobile": "+91 9123456789",
            "occupation": "community_connector",
            "promotion_plan": "Introducing verified healthcare services directly to community contacts.",
            "terms_accepted": True,
            "terms_version": 1,
        },
    )
    assert signup_res.status_code == 200, signup_res.text
    signup_data = signup_res.json()
    assert signup_data["affiliate_status"] == "approved"

    # Can immediately log in and access profile with status 'approved'
    login_res = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert login_res.status_code == 200
    assert login_res.json()["affiliate_status"] == "approved"

    profile_res = client.get("/api/affiliate/profile", cookies=login_res.cookies)
    assert profile_res.status_code == 200
    assert profile_res.json()["status"] == "approved"


def test_duplicate_email(client: TestClient):
    uid = uuid.uuid4().hex[:8]
    email = f"test-dup-{uid}@sbloom-test.invalid"
    password = "SecurePassword123!"

    # First signup succeeds
    res1 = client.post(
        "/api/auth/signup",
        json={"email": email, "password": password},
    )
    assert res1.status_code == 200

    # Second signup with same email must fail
    res2 = client.post(
        "/api/auth/signup",
        json={"email": email.upper(), "password": password},
    )
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]


def test_invalid_login(client: TestClient):
    res = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@sbloom-test.invalid", "password": "WrongPassword123!"},
    )
    assert res.status_code == 401
