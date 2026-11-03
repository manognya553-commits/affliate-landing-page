# sBLOOM Affiliate Programme — End-to-End Product Guide

Welcome to the **sBLOOM Affiliate Programme** repository. This document provides setup, architecture, security, database migration, and deployment instructions for running both the frontend client and the FastAPI backend service.

---

## 1. System Architecture

The application is structured as a decoupled full-stack architecture:

- **Frontend Client (`/`)**: React 19, Vite, Tailwind CSS, Lucide icons, Canvas-based dynamic visualization. Supports bilingual switching between canonical English and localized Telugu.
- **Backend Service (`/backend`)**: FastAPI, SQLAlchemy ORM, Pydantic schemas, Passlib (Argon2 / Bcrypt) password hashing, Python-jose JWT session handling, transaction audit logging.
- **Database (`app` schema in PostgreSQL / Supabase)**: Supabase PostgreSQL pooler integration with migration tracking (`app.schema_migrations`).

---

## 2. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Python**: v3.11, v3.12, or v3.13
- **PostgreSQL Database**: Supabase instance or PostgreSQL 15+ database

---

## 3. Environment Configuration

### Frontend Configuration (`.env`)
Create or verify `.env` in the root workspace directory:

```ini
# Base URL for the FastAPI Backend API
VITE_API_BASE_URL=http://localhost:8000

# Supabase Public Keys (Optional client-side fallback)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### Backend Configuration (`backend/.env`)
Create or verify `.env` in the `backend/` directory:

```ini
# PostgreSQL / Supabase Database Connection String
# Use Session pooler (port 5432) or Transaction pooler (port 6543)
DATABASE_URL=postgresql://postgres.your-id:your-db-password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

# Application Environment Mode: 'development' or 'production'
ENVIRONMENT=development

# JWT & Authentication Secret Keys
SECRET_KEY=generate-a-strong-random-hex-key-for-jwt-signing
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Security & CORS Settings
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
COOKIE_SECURE=False  # Set to True in production (HTTPS required)
COOKIE_SAMESITE=lax  # 'lax' for same-site or 'none' if cross-domain with SSL

# Public Application URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

# Transactional Email Provider (Optional for real inbox delivery)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=no-reply@sbloom.in
```

> **Security Note:** Never commit actual `.env` files with production passwords, database secrets, or JWT keys to version control.

---

## 4. Database Migrations

The backend features an idempotent migration runner that tracks executed SQL migrations in `app.schema_migrations`.

### Running Migrations

From the `backend/` directory:

```bash
# Activate virtual environment
.venv\Scripts\activate   # Windows PowerShell / CMD
# or source .venv/bin/activate  # macOS / Linux

# Execute migrations runner
python -m app.migrate
```

### Applied Migrations:
1. `001_initial_schema.sql`: Core tables (`users`, `roles`, `permissions`, `affiliate_profiles`, `audit_logs`).
2. `002_leads.sql`: Referral tracking pipeline (`referral_leads`) with status transitions and client consent tracking.
3. `003_providers.sql`: Service provider catalogue (`service_providers`), sector categorization, provider-defined compensation terms, and affiliate banking/settlement profile fields.

---

## 5. Local Development Startup

### 1. Start Backend API
```powershell
cd "backend"
# Create virtualenv if not created
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI with auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Health check endpoint**: `http://localhost:8000/api/health`
- **Interactive OpenAPI docs (development only)**: `http://localhost:8000/docs`

### 2. Start Frontend App
```powershell
cd "c:\Users\Sree sisters\Desktop\sbloom"

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

- **Frontend Application**: `http://localhost:5173`

---

## 6. Testing & Quality Assurance

### Automated Backend Tests
Run the complete backend test suite using `pytest`:

```powershell
cd "backend"
.venv\Scripts\activate
pytest -v
```

The test suite covers:
- User signup, password hashing, and immediate activation.
- Email verification flow, token generation, and one-time token consumption.
- Suspended and rejected account blocking against reactivation or referral submission.
- Client permission/consent enforcement on referral creation.
- Referral privacy and affiliate ownership isolation (affiliates cannot view other affiliates' data).
- Administrative governance, referral status transitions, and audit log generation.
- Service provider directory listing and administrator provider CRUD.

### Frontend Production Build
```powershell
npm run build
```
Generates optimized static bundle in `dist/` verified with zero syntax or bundling errors.

---

## 7. Configuring the Initial Administrator

To create or designate the initial system administrator:

1. Register an account through `/app/signup` (e.g., `admin@sbloom.in`).
2. Run a secure database update script or execute SQL in your Supabase SQL editor:

```sql
-- Assign admin role to user
INSERT INTO app.user_roles (user_id, role_id)
SELECT u.id, r.id
FROM app.users u, app.roles r
WHERE u.email = 'admin@sbloom.in' AND r.key = 'admin'
ON CONFLICT DO NOTHING;
```

3. Log in through `/app/login`. The portal will detect the `admin` role and allow access to `/admin` routes.

---

## 8. Production Deployment Readiness Checklist

- [ ] **HTTPS Enforced**: Ensure all traffic runs over TLS/HTTPS.
- [ ] **Secure Cookies**: Set `COOKIE_SECURE=True` in production backend `.env`.
- [ ] **JWT Secret**: Generate a cryptographically secure 64-character secret for `SECRET_KEY`.
- [ ] **CORS Restrictions**: Set `CORS_ORIGINS` to the exact production domain (e.g., `https://affiliate.sbloom.in`).
- [ ] **Disable Docs in Production**: The FastAPI app automatically suppresses `/docs` and `/redoc` when `ENVIRONMENT=production`.
- [ ] **Database Connection Pooling**: Ensure `sslmode=require` is configured on the Supabase PostgreSQL connection string.
- [ ] **Trusted Reverse Proxy**: If running behind Cloudflare or NGINX, configure trusted reverse proxy headers for accurate client IP auditing.
- [ ] **Email Provider**: Configure valid SMTP or transactional email API credentials for live verification delivery.
