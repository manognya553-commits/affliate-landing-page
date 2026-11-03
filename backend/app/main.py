from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db, engine
from app.dependencies import limiter, get_allowed_origins, DEV_ORIGIN_REGEX
from app.routers import auth, affiliate, admin, public


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup check
    print(f"[sBLOOM Backend] Starting up in {settings.ENVIRONMENT} mode...")
    yield
    print("[sBLOOM Backend] Shutting down...")


# Show API docs only in development mode
docs_enabled = settings.ENVIRONMENT.lower() == "development"

app = FastAPI(
    title="sBLOOM API",
    description="Official Python backend for sBLOOM Affiliate Programme",
    version="1.0.0",
    docs_url="/docs" if docs_enabled else None,
    redoc_url=None,
    openapi_url="/openapi.json" if docs_enabled else None,
    lifespan=lifespan,
)

# SlowAPI rate limiting state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS setup: strict client origin validation
allowed_origins = list(get_allowed_origins())

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=DEV_ORIGIN_REGEX.pattern if docs_enabled else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/api/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    try:
        # Check database connectivity
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"unreachable ({e.__class__.__name__})"
        if settings.ENVIRONMENT.lower() == "development":
            import logging
            logger = logging.getLogger("uvicorn.error")
            err_msg = str(e)
            # Redact database password and secret tokens to prevent credential leaks
            try:
                from sqlalchemy import make_url
                parsed = make_url(settings.DATABASE_URL)
                if parsed.password:
                    err_msg = err_msg.replace(parsed.password, "******")
            except Exception:
                pass
            if settings.JWT_SECRET:
                err_msg = err_msg.replace(settings.JWT_SECRET, "******")
            logger.error(f"[Database Health Diagnostic] Connection failed: {e.__class__.__name__}: {err_msg}")

    return {
        "status": "ok",
        "db": db_status,
        "environment": settings.ENVIRONMENT,
    }


# Include Routers under /api
app.include_router(auth.router, prefix="/api")
app.include_router(affiliate.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(public.router, prefix="/api")
