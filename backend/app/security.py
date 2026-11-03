import hashlib
import ipaddress
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from argon2 import PasswordHasher, Type
from argon2.exceptions import VerifyMismatchError, InvalidHash
import jwt
from fastapi import Response, Request
from app.config import settings


def get_client_ip(request: Optional[Request]) -> Optional[str]:
    """Safely extracts and validates a client IPv4 or IPv6 string for PostgreSQL inet columns."""
    if not request or not hasattr(request, "client") or not request.client:
        return None
    host = getattr(request.client, "host", None)
    if not host:
        return None
    try:
        ipaddress.ip_address(host)
        return host
    except ValueError:
        # Fallback for Starlette TestClient ("testclient") or local proxy hostnames in development
        if host == "testclient" or settings.ENVIRONMENT.lower() == "development":
            return "127.0.0.1"
        return None

# Argon2id password hasher configuration
ph = PasswordHasher(
    time_cost=2,
    memory_cost=19456,
    parallelism=1,
    hash_len=32,
    type=Type.ID,
)


def hash_password(password: str) -> str:
    return ph.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return ph.verify(hashed_password, password)
    except (VerifyMismatchError, InvalidHash):
        return False


def generate_secure_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    """Computes SHA-256 hash of a token string for safe storage in the database."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"iat": now, "exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        return None


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    is_prod = settings.ENVIRONMENT.lower() == "production"
    secure_cookie = settings.COOKIE_SECURE if settings.COOKIE_SECURE is not None else is_prod
    samesite_val = settings.COOKIE_SAMESITE or "lax"
    # Access token cookie (expires in minutes)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite=samesite_val,
        secure=secure_cookie,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    # Refresh token cookie (expires in days)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite=samesite_val,
        secure=secure_cookie,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        path="/",
    )


def clear_auth_cookies(response: Response) -> None:
    is_prod = settings.ENVIRONMENT.lower() == "production"
    secure_cookie = settings.COOKIE_SECURE if settings.COOKIE_SECURE is not None else is_prod
    samesite_val = settings.COOKIE_SAMESITE or "lax"
    response.delete_cookie(key="access_token", path="/", httponly=True, samesite=samesite_val, secure=secure_cookie)
    response.delete_cookie(key="refresh_token", path="/", httponly=True, samesite=samesite_val, secure=secure_cookie)
