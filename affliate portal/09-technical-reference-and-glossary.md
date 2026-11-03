# sBLOOM Affiliate Portal — Technical Reference & Glossary
**Document ID:** `SBD-ARCH-09`  
**Target System:** sBLOOM Affiliate Portal Repository Reference & Domain Terminology  
**Audit & Architecture Date:** November 3, 2026  
**Status:** IMPLEMENTED AND VERIFIED  
**Security Level:** Internal Engineering Reference  

---

## 1. Repository Directory Structure

```
E:\HARSHITHA\OTTOBON\Affiliate\
├── .gitignore                          # Root Git ignore rules
├── package.json                        # Root npm proxy scripts (--prefix frontend)
├── README.md                           # Monorepo setup guide & quickstart
├── FRONTEND_DESIGN_SPEC.md             # Original frontend design specifications
├── docs/                               # Engineering documentation suite
│   └── affiliate-portal/               # Technical Design Suite (SBD-ARCH-01 to 09)
│       ├── 01-affiliate-portal-system-design.md
│       ├── 02-frontend-design.md
│       ├── 03-backend-and-api-design.md
│       ├── 04-supabase-database-design.md
│       ├── 05-authentication-rbac-and-security.md
│       ├── 06-business-workflows-and-data-flows.md
│       ├── 07-shared-database-integration.md
│       ├── 08-testing-and-risk-register.md
│       ├── 09-technical-reference-and-glossary.md
│       └── README.md
│
├── frontend/                           # React 19 + TypeScript + Vite SPA
│   ├── index.html                      # HTML5 entry with fonts & meta
│   ├── package.json                    # Frontend dependencies & scripts
│   ├── tailwind.config.js              # sBLOOM design tokens & color definitions
│   ├── tsconfig.json                   # TypeScript project configuration
│   ├── vite.config.ts                  # Vite build options & dev server port (5173)
│   └── src/
│       ├── App.tsx                     # Top-level router & provider tree
│       ├── main.tsx                    # React DOM root render
│       ├── index.css                   # Global Tailwind imports & custom fonts
│       ├── components/
│       │   ├── layout/                 # Layout wrappers (AffiliateLayout, AdminLayout, TopBar)
│       │   ├── features/               # Complex feature widgets (LeadDrawer)
│       │   └── ui/                     # Primitives (Button, Card, Table, Drawer, Modal, etc.)
│       ├── context/                    # React Contexts (AuthContext, LanguageContext)
│       ├── data/                       # Static catalogs, mock data, translations
│       ├── pages/
│       │   ├── LandingPage.tsx         # Public landing page (Entry route)
│       │   ├── auth/                   # Authentication (LoginPage, SignupPage)
│       │   ├── affiliate/              # Affiliate portal (Dashboard, Leads, Services, etc.)
│       │   └── admin/                  # Admin console (AdminDashboard, AdminLeads)
│       ├── services/
│       │   └── api.ts                  # Central REST client for backend communication
│       └── types/
│           └── api.ts                  # TypeScript interfaces for API payloads
│
└── backend/                            # Python 3.13 + FastAPI API Service
    ├── run.py                          # Local startup entrypoint (uvicorn.run on port 8000)
    ├── requirements.txt                # Python package dependencies
    ├── .env                            # Active environment configuration
    ├── .env.example                    # Template environment variables
    ├── README.md                       # Backend service documentation
    ├── app/
    │   ├── main.py                     # FastAPI app instance, CORS middleware, lifespan
    │   ├── api/v1/                     # API routers (health, affiliates, leads, services)
    │   ├── core/                       # Security (PBKDF2 hashing) & Config (Pydantic BaseSettings)
    │   ├── schemas/                    # Pydantic v2 validation models
    │   └── services/                   # Business logic (lead_service, affiliate_service, storage)
    └── tests/                          # Pytest suite (unit, integration, validation)
```

---

## 2. Critical File Catalog

| File Path | Language | Core Responsibility |
| :--- | :--- | :--- |
| `frontend/src/App.tsx` | TypeScript (TSX) | Root route configuration mapping all 12 portal pages to their layout shells. |
| `frontend/src/context/AuthContext.tsx` | TypeScript (TSX) | Global session state, localStorage sync, login/logout logic, offline fallback. |
| `frontend/src/components/layout/AffiliateLayout.tsx` | TypeScript (TSX) | Standard 2-column affiliate portal shell with unauthenticated redirect guard. |
| `frontend/src/components/layout/AdminLayout.tsx` | TypeScript (TSX) | Dark-stage operator shell enforcing `role === 'admin'`. |
| `frontend/src/components/features/LeadDrawer.tsx` | TypeScript (TSX) | 11-field slide-over drawer for client referral capture with instant submission. |
| `frontend/src/services/api.ts` | TypeScript (TS) | Central fetch client executing REST requests against `http://localhost:8000`. |
| `frontend/tailwind.config.js` | JavaScript | Design token definitions for sBLOOM canvas, violet, magenta, lime, and admin dark. |
| `backend/app/main.py` | Python | FastAPI application factory, CORS setup, health check mounting, and router registration. |
| `backend/app/core/security.py` | Python | PBKDF2-HMAC-SHA256 password salting, hashing, and constant-time verification. |
| `backend/app/services/storage.py` | Python | Thread-safe in-memory store singleton managing affiliates and leads dictionaries in RAM. |
| `backend/app/services/lead_service.py` | Python | Lead submission logic, unique reference number generation (`SBL-`), commission estimation. |
| `backend/app/services/affiliate_service.py` | Python | Partner registration logic, referral code generation (`SBLOOM-`), profile updates. |

---

## 3. Environment Variables Reference

### Frontend Configuration (`frontend/.env` / `frontend/src/config/api.ts`)
| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Target URL of the FastAPI backend service |
| `VITE_APP_NAME` | `sBLOOM Affiliate Portal` | Application display name rendered in headers |
| `VITE_ENABLE_TELUGU`| `true` | Feature flag enabling Telugu language switcher |

### Backend Configuration (`backend/.env`)
| Variable Name | Active Value | Description |
| :--- | :--- | :--- |
| `PROJECT_NAME` | `sBLOOM Affiliate API` | Display name in OpenAPI docs (`/docs`) |
| `API_V1_STR` | `/api/v1` | URL routing prefix for all v1 endpoints |
| `STORAGE_MODE` | `in_memory_temporary` | Data layer operational mode (`in_memory_temporary` or `supabase_postgres`) |
| `DATABASE_CONNECTED` | `false` | Status flag indicating whether a live PostgreSQL DB is connected |
| `CORS_ORIGINS` | `["http://localhost:5173"]`| Whitelist of origins permitted to execute cross-origin requests |
| `SUPABASE_URL` | `None (Deferred)` | Planned Phase 2 Supabase project endpoint |
| `SUPABASE_SERVICE_ROLE_KEY` | `None (Deferred)` | Planned Phase 2 Supabase service secret |

---

## 4. Operational Commands Cheatsheet

### Monorepo Root Commands
```powershell
# Install all frontend dependencies
npm install

# Start Vite frontend development server (accessible on local network)
npm run dev

# Execute production build of frontend
npm run build

# Preview compiled production build locally
npm run preview

# Run Oxlint static analysis on frontend
npm run lint
```

### Backend Commands (from `/backend`)
```powershell
# Create Python virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install required Python packages
pip install -r requirements.txt

# Start FastAPI development server with auto-reload (Port 8000)
python run.py
# (Alternative using uvicorn directly:)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Execute full pytest suite
pytest tests -v
```

---

## 5. Domain Glossary & Business Terminology

| Term | Domain Category | Definition |
| :--- | :--- | :--- |
| **Attribution Window** | Business / Sales | The contractual period (standard 60 days) during which an affiliate receives commission for a deal closed with a referred client. |
| **Referral Code** | Monetization | A unique, branded alphanumeric identifier (e.g. `SBLOOM-HARSHI-78`) assigned to an affiliate to tag lead submissions and tracking links. |
| **Qualified Lead** | Deal Pipeline | A referred client whose business scope, budget, and contact legitimacy have been verified, advancing them to demo/POC scheduling. |
| **Converted Deal** | Financials | A deal where the referred client has executed a service agreement and paid their initial invoice, triggering commission credit. |
| **Section 194H TDS** | Taxation / Legal | Section of the Indian Income Tax Act mandating a 5% tax deduction at source on commission and brokerage payouts to Indian residents. |
| **Payout Rail** | Banking | The payment network used to disburse earnings to partners, specifically UPI (Unified Payments Interface) or NEFT (Direct Bank Transfer). |
| **UTR Number** | Banking | Unique Transaction Reference number generated by Indian banking systems upon successful settlement of an electronic fund transfer. |
| **Row Level Security (RLS)**| Database Security | PostgreSQL security engine ensuring database users can only access rows matching authorized security predicates (e.g. `affiliate_id = auth.uid()`). |
| **InMemoryStore** | System Architecture | The temporary, thread-locked Python RAM repository used during MVP evaluation prior to Phase 2 Supabase migration. |
| **LeadDrawer** | UI / UX | The primary slide-over drawer interface enabling affiliates to submit new enterprise client referrals from any page in the portal. |
| **Draft Telugu UI** | Localization | Status indicator notifying users that vernacular Telugu strings are in draft status pending certified linguistic review. |

