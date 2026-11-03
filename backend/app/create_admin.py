import sys
import getpass
import argparse
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User, Role, UserRole
from app.security import hash_password


def create_or_promote_admin(email: str, password: str):
    email = email.strip().lower()
    if not email:
        print("[Error] Email cannot be empty.")
        sys.exit(1)

    if len(password) < 8:
        print("[Error] Password must be at least 8 characters.")
        sys.exit(1)

    db: Session = SessionLocal()
    try:
        # Find admin role
        admin_role = db.query(Role).filter(Role.key == "admin").first()
        if not admin_role:
            # Fallback create role if not present
            admin_role = Role(key="admin", name="Admin")
            db.add(admin_role)
            db.flush()

        now = datetime.now(timezone.utc)
        user = db.query(User).filter(User.email == email).first()

        if user:
            print(f"[sBLOOM Admin] User with email '{email}' already exists. Updating password and granting admin role...")
            user.password_hash = hash_password(password)
            user.email_verified_at = user.email_verified_at or now
            user.is_active = True
        else:
            print(f"[sBLOOM Admin] Creating new admin user '{email}'...")
            user = User(
                email=email,
                password_hash=hash_password(password),
                email_verified_at=now,
                preferred_language="en",
                is_active=True,
            )
            db.add(user)
            db.flush()

        # Grant admin role if not already assigned
        existing_ur = (
            db.query(UserRole)
            .filter(UserRole.user_id == user.id, UserRole.role_id == admin_role.id)
            .first()
        )
        if not existing_ur:
            ur = UserRole(user_id=user.id, role_id=admin_role.id, granted_at=now)
            db.add(ur)

        db.commit()
        print(f"[sBLOOM Admin] Success! '{email}' is now an active administrator.")
    except Exception as e:
        db.rollback()
        print(f"[Error] Failed to create admin: {e}")
        sys.exit(1)
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Create or promote an administrator in sBLOOM.")
    parser.add_argument("--email", type=str, help="Admin email address")
    parser.add_argument("--password", type=str, help="Admin password")
    args = parser.parse_args()

    email = args.email
    password = args.password

    if not email:
        email = input("Enter admin email address: ").strip()

    if not password:
        password = getpass.getpass("Enter admin password (min 8 characters): ")

    create_or_promote_admin(email, password)


if __name__ == "__main__":
    main()
