from typing import Optional, Set, List, Generator
from uuid import UUID
from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import settings
from app.database import get_db
from app.models import User, UserRole, Role, RolePermission, Permission, AffiliateProfile
from app.security import decode_access_token

# Rate limiter setup using client IP
limiter = Limiter(key_func=get_remote_address)


class AuthenticatedUser:
    def __init__(self, user: User, roles: List[str], permissions: Set[str], affiliate_status: Optional[str] = None):
        self.user = user
        self.id = user.id
        self.email = user.email
        self.preferred_language = user.preferred_language
        self.is_active = user.is_active
        self.email_verified_at = user.email_verified_at
        self.roles = roles
        self.permissions = permissions
        self.affiliate_status = affiliate_status


def get_token_from_request(request: Request) -> Optional[str]:
    # 1. Check httpOnly cookie first
    token = request.cookies.get("access_token")
    if token:
        return token

    # 2. Check Authorization: Bearer <token> header fallback
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1].strip()

    return None


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> AuthenticatedUser:
    token = get_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = UUID(payload["sub"])
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed token user identifier",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    # Fetch user roles
    user_roles = (
        db.query(Role.key)
        .join(UserRole, UserRole.role_id == Role.id)
        .filter(UserRole.user_id == user.id)
        .all()
    )
    roles = [r[0] for r in user_roles]

    # Fetch all permissions associated with user's roles
    permissions_query = (
        db.query(Permission.key)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .join(UserRole, UserRole.role_id == RolePermission.role_id)
        .filter(UserRole.user_id == user.id)
        .all()
    )
    permissions = {p[0] for p in permissions_query}

    # Fetch affiliate status
    affiliate_profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user.id).first()
    affiliate_status = affiliate_profile.status if affiliate_profile else "approved"
    if affiliate_status in ("pending", "draft", None):
        affiliate_status = "approved"

    return AuthenticatedUser(
        user=user,
        roles=roles,
        permissions=permissions,
        affiliate_status=affiliate_status,
    )


def require_permission(permission_key: str):
    """Dependency factory ensuring user has the exact required permission."""
    def dependency(current_user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        if permission_key not in current_user.permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: requires '{permission_key}'",
            )
        return current_user

    return dependency


import re
from urllib.parse import urlparse

# Pattern matching local development hosts (localhost, 127.0.0.1, [::1], testserver, and RFC1918 private LAN IPs) on any port
DEV_ORIGIN_REGEX = re.compile(
    r"^https?://(localhost|127\.0\.0\.1|\[::1\]|testserver|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$"
)


def get_allowed_origins() -> Set[str]:
    """Returns the set of explicitly authorized client origins."""
    origins: Set[str] = set()
    if settings.CLIENT_URL:
        origins.add(settings.CLIENT_URL.rstrip("/"))
    if getattr(settings, "FRONTEND_URL", None):
        origins.add(settings.FRONTEND_URL.rstrip("/"))
    if getattr(settings, "CORS_ORIGINS", None):
        for o in settings.CORS_ORIGINS.split(","):
            if o.strip():
                origins.add(o.strip().rstrip("/"))

    if settings.ENVIRONMENT.lower() == "development":
        origins.update([
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175",
            "http://[::1]:5173",
            "http://[::1]:5174",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://testserver",
            "https://testserver",
        ])
    return origins


def is_allowed_origin(origin: Optional[str], request: Request) -> bool:
    """Validates origin against authorized origins, reverse-proxy headers, and dev patterns."""
    if not origin:
        return False
    clean = origin.rstrip("/")

    # 1. Check explicitly allowed origins
    if clean in get_allowed_origins():
        return True

    # 2. Check if request came through reverse proxy (e.g. Vite dev proxy or Nginx)
    # where the origin matches X-Forwarded-Host or Host
    forwarded_host = request.headers.get("x-forwarded-host")
    forwarded_proto = request.headers.get("x-forwarded-proto", "http")
    if forwarded_host:
        proxy_origin = f"{forwarded_proto}://{forwarded_host}".rstrip("/")
        if clean == proxy_origin:
            return True

    host = request.headers.get("host")
    if host:
        host_origin = f"http://{host}".rstrip("/")
        host_origin_ssl = f"https://{host}".rstrip("/")
        if clean in (host_origin, host_origin_ssl):
            return True

    # 3. In development mode, allow standard local dev origins (any dev port on localhost/127.0.0.1/[::1]/LAN)
    if settings.ENVIRONMENT.lower() == "development":
        if DEV_ORIGIN_REGEX.match(clean):
            return True

    return False


def csrf_protect(request: Request) -> None:
    """
    CSRF Protection for state-changing requests.
    Validates Origin / Referer header against authorized origins and checks for custom client header.
    """
    if request.method in ("POST", "PUT", "DELETE", "PATCH"):
        origin = request.headers.get("origin")

        # Fallback to Referer scheme + host if Origin was omitted by the browser
        if not origin and request.headers.get("referer"):
            ref = urlparse(request.headers.get("referer"))
            if ref.scheme and ref.netloc:
                origin = f"{ref.scheme}://{ref.netloc}"

        if origin:
            if not is_allowed_origin(origin, request):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Cross-origin request blocked (invalid Origin)",
                )

        # Require a custom header or standard request header for AJAX/Fetch
        custom_header = (
            request.headers.get("X-Requested-With")
            or request.headers.get("X-CSRF-Token")
            or request.headers.get("X-Client")
        )
