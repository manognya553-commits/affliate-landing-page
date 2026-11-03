from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user, AuthenticatedUser, limiter, csrf_protect
from app.models import User, Role, UserRole, AffiliateProfile, AuthToken, RefreshSession, ConsentRecord, TermsVersion, AuditLog
from app.schemas import (
    SignupRequest,
    LoginRequest,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    ResendVerificationRequest,
    MeResponse,
    UserResponse,
    MessageResponse,
)
from app.security import (
    hash_password,
    verify_password,
    generate_secure_token,
    hash_token,
    create_access_token,
    set_auth_cookies,
    clear_auth_cookies,
    get_client_ip,
)
from app.email import send_verification_email, send_password_reset_email

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=MeResponse, dependencies=[Depends(csrf_protect)])
@limiter.limit("5/minute")
def signup(request: Request, body: SignupRequest, response: Response, db: Session = Depends(get_db)):
    email = body.email.strip().lower()

    # Check for existing account
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    now = datetime.now(timezone.utc)
    client_ip = get_client_ip(request)

    # 1. Create user
    pw_hash = hash_password(body.password)
    user = User(
        email=email,
        password_hash=pw_hash,
        preferred_language=body.preferred_language,
        is_active=True,
    )
    db.add(user)
    db.flush()

    # 2. Assign default role: 'affiliate'
    affiliate_role = db.query(Role).filter(Role.key == "affiliate").first()
    if affiliate_role:
        user_role = UserRole(user_id=user.id, role_id=affiliate_role.id)
        db.add(user_role)

    # 3. Create affiliate profile (auto-activate if registration details provided, else draft)
    has_profile_details = bool(
        body.full_name
        and body.city
        and body.area
        and body.occupation
        and body.promotion_plan
        and body.terms_accepted
    )

    if has_profile_details:
        terms_ver = body.terms_version or 1
        # Fallback ensure terms version exists
        terms = db.query(TermsVersion).filter(TermsVersion.document_key == "affiliate_terms", TermsVersion.version == terms_ver).first()
        if not terms:
            terms = TermsVersion(document_key="affiliate_terms", version=terms_ver, title="Affiliate Programme Terms")
            db.add(terms)
            db.flush()

        profile = AffiliateProfile(
            user_id=user.id,
            full_name=body.full_name.strip(),
            city=body.city.strip(),
            area=body.area.strip(),
            mobile=body.mobile.strip() if body.mobile else None,
            occupation=body.occupation,
            promotion_plan=body.promotion_plan.strip(),
            status="approved",
            approved_by=user.id,
            approved_at=now,
            terms_version=terms_ver,
            terms_accepted_at=now,
            submitted_at=now,
        )
        db.add(profile)

        # Consent record
        consent = ConsentRecord(
            user_id=user.id,
            document_key="affiliate_terms",
            version=terms_ver,
            accepted_at=now,
            ip_address=client_ip,
            user_agent=request.headers.get("user-agent"),
        )
        db.add(consent)

        # Audit log row for automatic activation
        audit = AuditLog(
            actor_user_id=user.id,
            action="affiliate.auto_approved",
            entity_type="affiliate_profile",
            entity_id=str(user.id),
            after_state={"status": "approved", "auto_activated": True},
            ip_address=client_ip,
        )
        db.add(audit)
        affiliate_status = "approved"
    else:
        profile = AffiliateProfile(user_id=user.id, status="draft")
        db.add(profile)
        affiliate_status = "draft"

    # 4. Create email verification token
    raw_verify_token = generate_secure_token()
    token_rec = AuthToken(
        user_id=user.id,
        purpose="email_verify",
        token_hash=hash_token(raw_verify_token),
        expires_at=now + timedelta(hours=settings.EMAIL_VERIFY_EXPIRE_HOURS),
    )
    db.add(token_rec)

    # 5. Create refresh session with validated IP address
    raw_refresh_token = generate_secure_token()
    refresh_rec = RefreshSession(
        user_id=user.id,
        token_hash=hash_token(raw_refresh_token),
        user_agent=request.headers.get("user-agent"),
        ip_address=client_ip,
        expires_at=now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(refresh_rec)

    db.commit()
    db.refresh(user)

    # Print or send verification email
    send_verification_email(user.email, raw_verify_token)

    # Create JWT access token and set cookies
    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    set_auth_cookies(response, access_token, raw_refresh_token)

    return MeResponse(
        user=UserResponse.model_validate(user),
        roles=["affiliate"],
        permissions=[],
        affiliate_status=affiliate_status,
    )


@router.post("/login", response_model=MeResponse, dependencies=[Depends(csrf_protect)])
@limiter.limit("5/minute")
def login(request: Request, body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact support.",
        )

    now = datetime.now(timezone.utc)
    client_ip = get_client_ip(request)

    # Update last login
    user.last_login_at = now

    # Auto-activate if affiliate profile was awaiting approval in pending status
    if user.affiliate_profile and user.affiliate_profile.status == "pending":
        user.affiliate_profile.status = "approved"
        user.affiliate_profile.approved_by = user.id
        user.affiliate_profile.approved_at = now

    # Create refresh session with validated IP address
    raw_refresh_token = generate_secure_token()
    refresh_rec = RefreshSession(
        user_id=user.id,
        token_hash=hash_token(raw_refresh_token),
        user_agent=request.headers.get("user-agent"),
        ip_address=client_ip,
        expires_at=now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(refresh_rec)
    db.commit()

    # Load roles, permissions, affiliate profile
    roles = [ur.role.key for ur in user.user_roles if ur.role]
    permissions = set()
    for ur in user.user_roles:
        if ur.role:
            for rp in ur.role.role_permissions:
                if rp.permission:
                    permissions.add(rp.permission.key)

    affiliate_status = user.affiliate_profile.status if user.affiliate_profile else None
    if affiliate_status == "pending":
        affiliate_status = "approved"

    # Issue access token and cookies
    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    set_auth_cookies(response, access_token, raw_refresh_token)

    return MeResponse(
        user=UserResponse.model_validate(user),
        roles=roles,
        permissions=sorted(list(permissions)),
        affiliate_status=affiliate_status,
    )


@router.post("/logout", response_model=MessageResponse)
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    # Invalidate refresh session if cookie present
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        h = hash_token(refresh_token)
        session_rec = db.query(RefreshSession).filter(RefreshSession.token_hash == h).first()
        if session_rec:
            session_rec.revoked_at = datetime.now(timezone.utc)
            db.commit()

    clear_auth_cookies(response)
    return MessageResponse(message="Successfully logged out.")


@router.post("/refresh", response_model=MessageResponse)
def refresh(request: Request, response: Response, body: Optional[RefreshTokenRequest] = None, db: Session = Depends(get_db)):
    token = (body.refresh_token if body and body.refresh_token else None) or request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token required",
        )

    h = hash_token(token)
    session_rec = db.query(RefreshSession).filter(RefreshSession.token_hash == h).first()
    now = datetime.now(timezone.utc)

    if not session_rec or session_rec.revoked_at or session_rec.expires_at <= now:
        clear_auth_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session. Please log in again.",
        )

    user = session_rec.user
    if not user or not user.is_active:
        clear_auth_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account inactive.",
        )

    # Issue new access token and rotate refresh token
    new_access_token = create_access_token({"sub": str(user.id), "email": user.email})
    new_refresh_token = generate_secure_token()
    session_rec.token_hash = hash_token(new_refresh_token)
    session_rec.expires_at = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.commit()

    set_auth_cookies(response, new_access_token, new_refresh_token)
    return MessageResponse(message="Token refreshed successfully.")


@router.post("/forgot-password", response_model=MessageResponse, dependencies=[Depends(csrf_protect)])
@limiter.limit("5/minute")
def forgot_password(request: Request, body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    if user and user.is_active:
        raw_token = generate_secure_token()
        token_rec = AuthToken(
            user_id=user.id,
            purpose="password_reset",
            token_hash=hash_token(raw_token),
            expires_at=datetime.now(timezone.utc) + timedelta(hours=settings.PASSWORD_RESET_EXPIRE_HOURS),
        )
        db.add(token_rec)
        db.commit()
        send_password_reset_email(user.email, raw_token)

    return MessageResponse(
        message="If an account with that email exists, password reset instructions have been sent."
    )


@router.post("/reset-password", response_model=MessageResponse, dependencies=[Depends(csrf_protect)])
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    h = hash_token(body.token)
    token_rec = db.query(AuthToken).filter(AuthToken.token_hash == h, AuthToken.purpose == "password_reset").first()
    now = datetime.now(timezone.utc)

    if not token_rec or token_rec.used_at or token_rec.expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset link.",
        )

    user = token_rec.user
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found.")

    # Update password and mark token used
    user.password_hash = hash_password(body.new_password)
    token_rec.used_at = now

    # Revoke all existing sessions for security
    db.query(RefreshSession).filter(RefreshSession.user_id == user.id).update(
        {RefreshSession.revoked_at: now}
    )

    db.commit()
    return MessageResponse(message="Password reset successfully. You can now log in.")


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(body: VerifyEmailRequest, db: Session = Depends(get_db)):
    h = hash_token(body.token)
    token_rec = db.query(AuthToken).filter(AuthToken.token_hash == h, AuthToken.purpose == "email_verify").first()
    now = datetime.now(timezone.utc)

    if not token_rec or token_rec.used_at or token_rec.expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification link.",
        )

    user = token_rec.user
    user.email_verified_at = now
    token_rec.used_at = now
    db.commit()

    return MessageResponse(message="Email address verified successfully.")


@router.post("/verify-self", response_model=MessageResponse)
def verify_self(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = current_user.user
    user.email_verified_at = datetime.now(timezone.utc)
    db.commit()
    return MessageResponse(message="Email address verified successfully.")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(
    body: Optional[ResendVerificationRequest] = None,
    current_user: Optional[AuthenticatedUser] = Depends(lambda: None),
    db: Session = Depends(get_db),
):
    target_user = None
    if current_user:
        target_user = current_user.user
    elif body and body.email:
        target_user = db.query(User).filter(User.email == body.email.strip().lower()).first()

    if target_user and not target_user.email_verified_at:
        raw_token = generate_secure_token()
        token_rec = AuthToken(
            user_id=target_user.id,
            purpose="email_verify",
            token_hash=hash_token(raw_token),
            expires_at=datetime.now(timezone.utc) + timedelta(hours=settings.EMAIL_VERIFY_EXPIRE_HOURS),
        )
        db.add(token_rec)
        db.commit()
        send_verification_email(target_user.email, raw_token)

    return MessageResponse(message="If the account requires verification, a new link has been sent.")


@router.get("/me", response_model=MeResponse)
def get_me(current_user: AuthenticatedUser = Depends(get_current_user)):
    return MeResponse(
        user=UserResponse.model_validate(current_user.user),
        roles=current_user.roles,
        permissions=sorted(list(current_user.permissions)),
        affiliate_status=current_user.affiliate_status,
    )
