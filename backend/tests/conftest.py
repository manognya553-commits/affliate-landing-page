import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, Session

from app.main import app
from app.database import get_db, SessionLocal, engine as default_engine
from app.models import Base, User, Role, UserRole, AffiliateProfile, Permission, RolePermission, TermsVersion
from app.security import hash_password, create_access_token


# Check if default PostgreSQL database is reachable
def is_db_connected():
    try:
        with default_engine.connect() as conn:
            conn.execute(text("SELECT 1;"))
            return True
    except Exception:
        return False


_pg_reachable = is_db_connected()

if not _pg_reachable:
    print("\n[Notice] Real database not reachable yet (waiting for user credentials). Using local test database for pytest.")
    test_db_engine = create_engine("sqlite:///sbloom_test.db")

    @event.listens_for(test_db_engine, "connect")
    def attach_app_schema(dbapi_con, con_record):
        dbapi_con.execute("ATTACH 'sbloom_test.db' AS app")

    TestSession = sessionmaker(autocommit=False, autoflush=False, bind=test_db_engine, expire_on_commit=False)
    Base.metadata.create_all(test_db_engine)

    # Seed initial test data if empty
    with TestSession() as s:
        if not s.query(Role).filter(Role.key == "affiliate").first():
            s.add(Role(key="affiliate", name="Affiliate"))
        if not s.query(Role).filter(Role.key == "admin").first():
            s.add(Role(key="admin", name="Admin"))
        if not s.query(TermsVersion).filter(TermsVersion.document_key == "affiliate_terms", TermsVersion.version == 1).first():
            s.add(TermsVersion(document_key="affiliate_terms", version=1, title="Affiliate Programme Terms"))
        s.commit()
else:
    test_db_engine = default_engine
    TestSession = SessionLocal


def cleanup_test_records():
    """Safely cleans up transient test accounts ending in @sbloom-test.invalid."""
    try:
        with TestSession() as db:
            test_users = db.query(User.id).filter(User.email.like("%@sbloom-test.invalid")).all()
            test_user_ids = [str(u[0]) for u in test_users]

            if test_user_ids:
                try:
                    db.execute(text("DELETE FROM app.referral_leads WHERE affiliate_user_id IN (SELECT id FROM app.users WHERE email LIKE '%@sbloom-test.invalid')"))
                    db.commit()
                except Exception:
                    db.rollback()

                try:
                    db.execute(text("DELETE FROM app.audit_log WHERE actor_user_id IN (SELECT id FROM app.users WHERE email LIKE '%@sbloom-test.invalid')"))
                    db.commit()
                except Exception:
                    db.rollback()

                try:
                    db.execute(text("DELETE FROM app.consent_records WHERE user_id IN (SELECT id FROM app.users WHERE email LIKE '%@sbloom-test.invalid')"))
                    db.commit()
                except Exception:
                    db.rollback()

                try:
                    db.execute(text("""
                        DELETE FROM app.users 
                        WHERE email LIKE '%@sbloom-test.invalid' 
                    """))
                    db.commit()
                except Exception:
                    db.rollback()
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
