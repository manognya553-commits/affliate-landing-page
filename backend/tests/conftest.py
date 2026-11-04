import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.main import app
from app.database import get_db, SessionLocal, engine as default_engine
from app.models import (
    User,
    Role,
    UserRole,
    AffiliateProfile,
    Permission,
    RolePermission,
    TermsVersion,
    ServiceProvider,
    ProviderService,
    ProviderCommissionAgreement,
    ReferralLead,
    CommissionLedger,
    AffiliateInvoice,
    AffiliateInvoiceItem,
    ProviderInvoiceItem,
    AuthToken,
    RefreshSession,
    ConsentRecord,
)
from app.security import hash_password, create_access_token

TestSession = SessionLocal

CANONICAL_PROVIDER_NAMES = [
    "Apex Multi-Specialty Care Network",
    "Pragathi Academy for Higher Studies",
    "Venkata Corporate Advisors & Tax Consultants",
]


def cleanup_test_records():
    """Safely and thoroughly cleans up transient test records created during pytest runs."""
    try:
        with TestSession() as db:
            # 1. Clean up non-canonical test providers
            test_providers = db.query(ServiceProvider).filter(ServiceProvider.name.not_in(CANONICAL_PROVIDER_NAMES)).all()
            for p in test_providers:
                db.delete(p)

            # 2. Clean up test users ending in @sbloom-test.invalid
            test_users = db.query(User.id).filter(User.email.like("%@sbloom-test.invalid")).all()
            test_user_ids = [u[0] for u in test_users]

            if test_user_ids:
                # Delete test child records in correct order
                db.query(AffiliateInvoiceItem).filter(
                    AffiliateInvoiceItem.referral_id.in_(
                        db.query(ReferralLead.id).filter(ReferralLead.affiliate_user_id.in_(test_user_ids))
                    )
                ).delete(synchronize_session=False)

                db.query(ProviderInvoiceItem).filter(
                    ProviderInvoiceItem.referral_id.in_(
                        db.query(ReferralLead.id).filter(ReferralLead.affiliate_user_id.in_(test_user_ids))
                    )
                ).delete(synchronize_session=False)

                db.query(CommissionLedger).filter(CommissionLedger.affiliate_user_id.in_(test_user_ids)).delete(synchronize_session=False)
                db.query(ReferralLead).filter(ReferralLead.affiliate_user_id.in_(test_user_ids)).delete(synchronize_session=False)
                db.query(AuthToken).filter(AuthToken.user_id.in_(test_user_ids)).delete(synchronize_session=False)
                db.query(RefreshSession).filter(RefreshSession.user_id.in_(test_user_ids)).delete(synchronize_session=False)
                db.query(UserRole).filter(UserRole.user_id.in_(test_user_ids)).delete(synchronize_session=False)
                db.query(AffiliateProfile).filter(AffiliateProfile.user_id.in_(test_user_ids)).delete(synchronize_session=False)
                db.query(ConsentRecord).filter(ConsentRecord.user_id.in_(test_user_ids)).delete(synchronize_session=False)
                db.query(User).filter(User.id.in_(test_user_ids)).delete(synchronize_session=False)

            db.commit()
    except Exception as e:
        print(f"[Cleanup Notice] {e}")


@pytest.fixture(scope="session", autouse=True)
def session_cleanup():
    cleanup_test_records()
    yield
    cleanup_test_records()


@pytest.fixture
def db():
    session = TestSession()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db: Session):
    # Override get_db dependency to use the active test session
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app, headers={"X-Requested-With": "XMLHttpRequest", "Origin": "http://localhost:5173"}) as c:
        yield c

    app.dependency_overrides.clear()


@pytest.fixture
def create_test_user(db: Session):
    created_users = []

    def _create(email: str, password: str = "TestPass123!", role_key: str = "affiliate"):
        assert email.endswith("@sbloom-test.invalid"), "All test emails must end with @sbloom-test.invalid"
        user = User(
            email=email.lower(),
            password_hash=hash_password(password),
            email_verified_at=datetime.now(timezone.utc),
            preferred_language="en",
            is_active=True,
        )
        db.add(user)
        db.flush()

        role = db.query(Role).filter(Role.key == role_key).first()
        if not role:
            role = Role(key=role_key, name=role_key.capitalize())
            db.add(role)
            db.flush()

        ur = UserRole(user_id=user.id, role_id=role.id)
        db.add(ur)

        now = datetime.now(timezone.utc)
        profile = AffiliateProfile(
            user_id=user.id,
            full_name="Test Partner",
            city="Hyderabad",
            area="Banjara Hills",
            occupation="community_connector",
            promotion_plan="Direct personal introductions to verified service providers.",
            status="approved",
            terms_version=1,
            terms_accepted_at=now,
            submitted_at=now,
            approved_by=user.id,
            approved_at=now,
        )
        db.add(profile)

        db.commit()
        db.refresh(user)
        created_users.append(user)
        return user

    yield _create
