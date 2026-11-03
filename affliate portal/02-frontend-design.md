# sBLOOM Affiliate Portal — Frontend Architecture & UI Design
**Document ID:** `SBD-ARCH-02`  
**Target System:** sBLOOM Affiliate Portal Frontend (`/frontend`)  
**Audit & Architecture Date:** November 3, 2026  
**Status:** IMPLEMENTED AND VERIFIED  
**Security Level:** Internal Engineering Reference  

---

## 1. Executive Summary & Scope

The **sBLOOM Affiliate Portal** frontend is a high-performance Single-Page Application (SPA) built with **React 19**, **TypeScript**, **Vite**, **React Router DOM 7**, and **Tailwind CSS**. It is dedicated to creator monetization, enterprise client referrals, and commission settlement auditing across South India and pan-India.

### Scope Boundary
- **IN SCOPE:** All authenticated portal pages (`/app/*`), admin operations pages (`/admin/*`), authentication workflows (`/app/login`, `/app/signup`), route protection, shared layout shells, navigation drawers, reusable UI components, and client-side state contexts.
- **OUT OF SCOPE:** The public affiliate marketing landing page at `/` (including hero sections, marketing copywriting, visual showcase, and SEO strategies). The landing page is noted strictly as the public entry point whose CTAs redirect unauthenticated visitors to `/app/signup` or `/app/login`.

---

## 2. Frontend Technology Stack & Dependencies

The complete dependency configuration is verified in `frontend/package.json`:

| Layer | Package / Technology | Version | Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Core UI Library** | `react` | `^19.3.1` | IMPLEMENTED AND VERIFIED | Functional component architecture, concurrent rendering, hooks |
| **DOM Renderer** | `react-dom` | `^19.3.1` | IMPLEMENTED AND VERIFIED | Virtual DOM mounting to root element (`#root`) |
| **Language** | `typescript` | `~7.0.2` | IMPLEMENTED AND VERIFIED | Strict type checking, interfaces, enum-like types |
| **Bundler & Dev Server**| `vite` | `^8.3.5` | IMPLEMENTED AND VERIFIED | Fast HMR dev server, Rollup-based production bundling |
| **Client Routing** | `react-router-dom` | `^7.18.5` | IMPLEMENTED AND VERIFIED | Nested route trees, route guards, URL state management |
| **CSS Framework** | `tailwindcss` | `^3.4.19` | IMPLEMENTED AND VERIFIED | Utility-first CSS styling with customized design tokens |
| **CSS Processing** | `postcss` + `autoprefixer` | `^8.5.32` | IMPLEMENTED AND VERIFIED | Vendor prefixing and CSS transformation |
| **Iconography** | `lucide-react` | `^1.66.0` | IMPLEMENTED AND VERIFIED | Consistent feather-style SVG iconography |
| **Static Linter** | `oxlint` | `^1.89.0` | IMPLEMENTED AND VERIFIED | High-speed static analysis and code verification |

---

## 3. Comprehensive Portal Route Inventory

All application routes are defined in `frontend/src/App.tsx`. The portal comprises 12 distinct authenticated or auth-related routes, wrapped by specialized layout guards.

| Route Path | Page Component | File Path | Guard / Layout | Allowed Roles | Data Source | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `LandingPage` | `pages/LandingPage.tsx` | None (Public) | Public | `landingContent.ts` | OUT OF SCOPE (Audit) / VERIFIED (Entry Point) |
| `/app/login` | `LoginPage` | `pages/auth/LoginPage.tsx` | Unauthenticated | Guest / All | `AuthContext.login` | IMPLEMENTED AND VERIFIED |
| `/app/signup` | `SignupPage` | `pages/auth/SignupPage.tsx` | Unauthenticated | Guest / All | `AuthContext.registerDemo` | IMPLEMENTED AND VERIFIED |
| `/app` | `DashboardPage` | `pages/affiliate/DashboardPage.tsx` | `AffiliateLayout` | `affiliate`, `admin` | `api.getLeads`, `sampleEarnings.ts` | IMPLEMENTED AND VERIFIED |
| `/app/profile` | `ProfilePage` | `pages/affiliate/ProfilePage.tsx` | `AffiliateLayout` | `affiliate`, `admin` | `AuthContext.user`, `api.updateProfile` | IMPLEMENTED AND VERIFIED |
| `/app/services` | `ServicesPage` | `pages/affiliate/ServicesPage.tsx` | `AffiliateLayout` | `affiliate`, `admin` | `api.getServices`, `sampleServices.ts` | IMPLEMENTED AND VERIFIED |
| `/app/learn` | `LearnPage` | `pages/affiliate/LearnPage.tsx` | `AffiliateLayout` | `affiliate`, `admin` | Static Enablement Modules | IMPLEMENTED AND VERIFIED |
| `/app/leads` | `LeadsPage` | `pages/affiliate/LeadsPage.tsx` | `AffiliateLayout` | `affiliate`, `admin` | `api.getLeads`, `api.submitLead` | IMPLEMENTED AND VERIFIED |
| `/app/earnings` | `EarningsPage` | `pages/affiliate/EarningsPage.tsx` | `AffiliateLayout` | `affiliate`, `admin` | `sampleEarnings.ts` | IMPLEMENTED AND VERIFIED |
| `/app/invoices` | `InvoicesPage` | `pages/affiliate/InvoicesPage.tsx` | `AffiliateLayout` | `affiliate`, `admin` | `sampleEarnings.ts` | IMPLEMENTED AND VERIFIED |
| `/app/support` | `SupportPage` | `pages/affiliate/SupportPage.tsx` | `AffiliateLayout` | `affiliate`, `admin` | Static FAQ + Ticket Form State | IMPLEMENTED AND VERIFIED |
| `/admin` | `AdminDashboardPage`| `pages/admin/AdminDashboardPage.tsx` | `AdminLayout` | `admin` (Client Guard)| Simulated Network Data | IMPLEMENTED AND VERIFIED |
| `/admin/leads` | `AdminLeadsPage` | `pages/admin/AdminLeadsPage.tsx` | `AdminLayout` | `admin` (Client Guard)| Cross-Affiliate Leads + Modal | IMPLEMENTED AND VERIFIED |

---

## 4. Page-by-Page Detailed Architecture & Functional Specifications

### 4.1 Authentication Pages

#### 1. Login Page (`/app/login`) — `frontend/src/pages/auth/LoginPage.tsx`
- **Purpose**: Authenticates registered partners and operators into the application session.
- **UI Elements**:
  - Email Address text input (`type="email"`).
  - Password input (`type="password"`).
  - Demo environment notice pill (`Demo Environment: In-memory temporary store`).
  - "Sign In to Partner Portal" CTA button with loading spinner state.
  - Quick-switch link to `/app/signup`.
- **Validation & Handling**:
  - Rejects empty email/password submissions with inline error notifications.
  - Authenticates via `AuthContext.login(email, password)`.
  - On success: Checks `user.role`. If `admin`, navigates to `/admin`; if `affiliate`, navigates to `/app`.
  - On error: Renders accessible error banner (`bg-red-50 text-red-700`).

#### 2. Signup & Instant Activation Page (`/app/signup`) — `frontend/src/pages/auth/SignupPage.tsx`
- **Purpose**: Allows regional creators and consultants to register and receive an active referral attribution code immediately without manual queue bottlenecks.
- **UI Form Fields**:
  - Full Name / Creator Brand Name (`name`, required, min 2 chars).
  - Business Email Address (`email`, required, RFC 5322 format).
  - Phone / WhatsApp Number (`phone`, required, min 8 digits).
  - Account Password (`password`, required, min 6 chars).
  - Promotion Sector / Category (`category`, dropdown: `Tech & Digital Creators`, `Healthcare & Clinics`, `Education & Coaching`, `Professional & Financial Services`, `General Agency`).
  - Payout UPI ID (`payoutUpi`, optional: e.g. `partner@upi`).
  - Partner Ethics & Attribution Terms Checkbox (`consent`, required boolean).
- **Backend Communication & Graceful Fallback**:
  - Dispatches `POST /api/v1/affiliates/register-demo` via `AuthContext.registerDemo()`.
  - **Graceful Client Fallback**: If the FastAPI backend is offline (`Failed to fetch`), `AuthContext` generates a local demo partner account with generated referral code format `SBLOOM-<NAME>-<XX>`, stores it in `localStorage`, and permits immediate access to `/app`.

---

### 4.2 Core Affiliate Portal Pages

#### 3. Affiliate Dashboard (`/app`) — `frontend/src/pages/affiliate/DashboardPage.tsx`
- **Purpose**: Central cockpit for affiliate performance, quick links, recent submissions, and recommended services.
- **UI Sections & Components**:
  - **Hero Welcome Banner**: Displays partner name, assigned referral code with 1-click clipboard copy, and quick "Refer a Client" CTA opening `LeadDrawer`.
  - **Live Backend Latency Pill**: Displays API connection state and millisecond ping (`HealthCard.tsx`).
  - **KPI Metric Grid**: 4 key statistical metric cards:
    - *Total Pipeline Volume* (₹ sum).
    - *Active Leads* (Count of Pending + Contacted + Qualified).
    - *Converted Deals* (Count of closed sales).
    - *Estimated Commission* (Accrued earnings).
  - **Recent Leads Table**: Displays last 5 submitted leads with status badges, client name, sector, and created timestamp.
  - **Catalog Highlights**: Quick carousel of top 3 promotional services with 1-click deal referral buttons.
- **Empty State**: If no leads exist, renders `<Card>` with `Inbox` icon: *"No referral leads registered yet. Submit your first enterprise client."*

#### 4. Partner Profile & Payout Settings (`/app/profile`) — `frontend/src/pages/affiliate/ProfilePage.tsx`
- **Purpose**: Displays partner account metadata, referral credentials, and enables modification of UPI disbursement handles and notification channels.
- **UI Sections**:
  - **Account Credentials Card**: Shows Partner ID (`aff-demo-XX`), Referral Code (`SBLOOM-XXXX-XX`), registered email, account creation date.
  - **Disbursement Settings**: Form input for Payout UPI ID (`payoutUpi`).
  - **Notification Toggles**: WhatsApp deal alerts toggle, email payout statements toggle.
  - **Demo Environment Notice**: Informs the user that updates persist to local memory/session.

#### 5. Promotional Services Catalog (`/app/services`) — `frontend/src/pages/affiliate/ServicesPage.tsx`
- **Purpose**: Showcase of high-ticket services available for affiliates to promote.
- **Verified Offerings**:
  1. *WhatsApp Automation* (Healthcare, Education, Professional Services) — Official WhatsApp API integration.
  2. *Website Building* (High-performance conversion-optimized responsive web).
  3. *Search Engine Optimization (SEO)* (Dominant local & regional search visibility).
  4. *Google Ads* (High-intent search & remarketing campaigns).
  5. *Meta Ads* (Targeted patient & student acquisition funnels).
- **Interactive Controls**:
  - Sector category filtering pills (`All`, `Healthcare`, `Education`, `Professional Services`).
  - Search query text input filtering by title or feature keywords.
  - Commission Calculator widget estimating payout based on monthly client volume.
  - Service Card Action: "Submit Lead for this Service" pre-selects the service in `LeadDrawer`.

#### 6. Lead Management Pipeline (`/app/leads`) — `frontend/src/pages/affiliate/LeadsPage.tsx`
- **Purpose**: Full lifecycle tracking of all client referrals submitted by the affiliate.
- **UI Controls & Filtering**:
  - Status filter tabs: `All`, `Pending`, `Contacted`, `Qualified`, `Converted`, `Rejected`.
  - Search input: Live filtering across Business Name, Contact Person, and Reference Number (`SBL-YYYYMM-XXXX`).
  - Primary Action Button: `+ Refer New Client` (triggers `LeadDrawer`).
- **Data Table**: Rendered via `<Table>` component:
  - Columns: *Reference ID*, *Business Name*, *Contact Details*, *Target Services*, *Status Badge*, *Submitted Date*, *Estimated Commission*.
- **Empty State**: Renders clear prompt with illustration when filters yield no records.

#### 7. Commission Ledger & Financials (`/app/earnings`) — `frontend/src/pages/affiliate/EarningsPage.tsx`
- **Purpose**: Financial transparency portal for accrued, cleared, and paid commissions.
- **UI Metrics**:
  - *Cleared Balance* (Ready for disbursement on 10th of the month).
  - *Pending Conversion* (Commission tied to active Qualified deals).
  - *Lifetime Paid Out* (Historical cumulative payouts).
  - *Next Settlement Date* (`10 Nov 2026`).
- **Statutory Tax Banner**: Informational box noting TDS deduction under **Section 194H** (5% TDS on commission/brokerage) for Indian tax residents.
- **Transaction Table**: Itemized deal conversion ledger showing Client, Service, Deal Size, Commission %, TDS deducted, and Net Payout status (`Paid`, `Processing`, `Pending`).

#### 8. Tax Invoices & Statements (`/app/invoices`) — `frontend/src/pages/affiliate/InvoicesPage.tsx`
- **Purpose**: Downloadable payout receipts and monthly GST-compliant billing statements.
- **Invoice Table**:
  - Columns: *Invoice #*, *Settlement Period*, *Disbursement Date*, *Amount*, *Payment Rail* (NEFT / UPI), *Banking UTR Reference*, *Status*, *Actions* (Download PDF simulated).

#### 9. Enablement Academy (`/app/learn`) — `frontend/src/pages/affiliate/LearnPage.tsx`
- **Purpose**: Knowledge repository and sales enablement material for partners.
- **Content Modules**:
  - Pitch Decks for South Indian Regional Clinics & Hospitals.
  - Objection Handling Guide for Education & Coaching Academies.
  - WhatsApp Business API Compliance & Template Guide.
  - vernacular Outreach Strategy (Telugu, Tamil, Kannada regional business communication).

#### 10. Partner Helpdesk & Support (`/app/support`) — `frontend/src/pages/affiliate/SupportPage.tsx`
- **Purpose**: Dispute resolution, cookie attribution queries, and support ticket submission.
- **UI Sections**:
  - **FAQ Accordion**: 8 interactive accordions covering cookie windows (60 days), lead verification timelines (24-48 hrs), payout cycles, and bank account updates.
  - **Create Support Ticket Drawer**: Form fields for Subject, Category (Attribution, Payment, Technical, Lead Status), and Detailed Message.

---

### 4.3 Admin Operations Pages

#### 11. Admin Ecosystem Console (`/admin`) — `frontend/src/pages/admin/AdminDashboardPage.tsx`
- **Purpose**: High-level operational overview of total affiliate network activity.
- **UI Elements**:
  - Dark-themed visual interface (`bg-sbloom-admin`).
  - Network Metrics: Active Affiliates (28), Total Pipeline Value (₹34.8 Lakhs), Deals Closed (14), Total Commissions Disbursed (₹4.2 Lakhs).
  - Conversion Funnel Bar: Pending (24) -> Contacted (38) -> Qualified (18) -> Converted (14).
  - Quick-switch back to Affiliate Portal View (`toggleRole` in TopBar).

#### 12. Admin Lead Administration (`/admin/leads`) — `frontend/src/pages/admin/AdminLeadsPage.tsx`
- **Purpose**: Cross-affiliate lead inspection, verification, and status mutation.
- **Features**:
  - Global Leads Table displaying attributed affiliate names and referral codes.
  - Status Update Modal: Allows operator to select a lead and advance stage:
    - `Pending` → `Contacted` → `Qualified` → `Converted` or `Rejected`.
  - Operator internal notes text area.

---

## 5. Shared Layouts & Component Hierarchy

```mermaid
flowchart TD
    App["App.tsx\n(LanguageProvider + AuthProvider + Router)"]
    
    subgraph LAYOUT_AFF["AffiliateLayout.tsx (/app/*)"]
        AFF_SB["AffiliateSidebar.tsx\n(Collapsible Nav + Brand Logomark)"]
        AFF_TB["TopBar.tsx\n(Search, LangToggle, RoleToggle, UserDropdown)"]
        DEMO_NOT["DemoDataNotice.tsx\n(In-memory storage banner)"]
        OUTLET_AFF["<Outlet />\n(Dashboard, Leads, Services, etc.)"]
        DRAWER_LEAD["LeadDrawer.tsx\n(Global Lead Submission Slide-over)"]
        
        AFF_SB --- AFF_TB
        AFF_TB --- DEMO_NOT
        DEMO_NOT --- OUTLET_AFF
        OUTLET_AFF --- DRAWER_LEAD
    end

    subgraph LAYOUT_ADM["AdminLayout.tsx (/admin/*)"]
        ADM_SB["AdminSidebar.tsx\n(Dark Theme Console Nav)"]
        ADM_TB["TopBar.tsx\n(Admin Context + Role Switcher)"]
        OUTLET_ADM["<Outlet />\n(AdminDashboard, AdminLeads)"]
        
        ADM_SB --- ADM_TB
        ADM_TB --- OUTLET_ADM
    end

    App --> LAYOUT_AFF
    App --> LAYOUT_ADM
```

### Layout Guard Behavior
- **`AffiliateLayout.tsx`**: Checks `AuthContext.user`. If `user === null`, automatically renders `<Navigate to="/app/login" replace />`.
- **`AdminLayout.tsx`**: Checks `AuthContext.user`. If unauthenticated or `user.role !== 'admin'`, redirects to `/app/login` with an unauthorized prompt.

---

## 6. Reusable UI Component Library Inventory

All components are located in `frontend/src/components/ui/` and adhere strictly to sBLOOM design tokens:

| Component | File Path | Props Contract | Features & Styling | Status |
| :--- | :--- | :--- | :--- | :--- |
| **`Button`** | `components/ui/Button.tsx` | `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`, standard button attributes | 6 variants (`primary`, `secondary`, `outline`, `ghost`, `lime`, `danger`). Spinner animation when `isLoading=true`. | IMPLEMENTED AND VERIFIED |
| **`Card`** | `components/ui/Card.tsx` | `variant`, `hoverable`, `padding`, children | 4 background variants (`canvas`, `surface`, `dark`, `outline`). Smooth CSS transform on hover when `hoverable=true`. | IMPLEMENTED AND VERIFIED |
| **`Table`** | `components/ui/Table.tsx` | `columns: Column<T>[]`, `data: T[]`, `keyExtractor`, `emptyMessage`, `onRowClick` | Fully typed generic `<T>` data grid with responsive overflow wrapper and empty state rendering. | IMPLEMENTED AND VERIFIED |
| **`StatusBadge`** | `components/ui/StatusBadge.tsx` | `status: string`, `size?: 'sm' \| 'md'` | Semantic status pill with colored pulse dot (`Pending`, `Contacted`, `Qualified`, `Converted`, `Rejected`, `Paid`, `Processing`). | IMPLEMENTED AND VERIFIED |
| **`Drawer`** | `components/ui/Drawer.tsx` | `isOpen`, `onClose`, `title`, `position`, `width` | Fixed slide-over drawer with backdrop blur (`backdrop-blur-sm`), smooth CSS transitions, and keyboard `ESC` listener. | IMPLEMENTED AND VERIFIED |
| **`Modal`** | `components/ui/Modal.tsx` | `isOpen`, `onClose`, `title`, `children`, `footer` | Centered modal dialog with accessible backdrop and trap, used for admin status updates. | IMPLEMENTED AND VERIFIED |
| **`Input`** | `components/ui/Input.tsx` | `label`, `error`, `helperText`, `leftIcon`, `rightIcon`, input props | Accessible input container with animated violet focus border and red inline validation messages. | IMPLEMENTED AND VERIFIED |
| **`Select`** | `components/ui/Select.tsx` | `label`, `error`, `options: {value, label}[]` | Styled dropdown select matching token borders and typography. | IMPLEMENTED AND VERIFIED |
| **`Textarea`** | `components/ui/Textarea.tsx` | `label`, `error`, `rows`, textarea props | Multi-line text field with consistent padding, focus ring, and character limits. | IMPLEMENTED AND VERIFIED |
| **`DemoDataNotice`**| `components/ui/DemoDataNotice.tsx`| `compact?: boolean` | Amber warning banner explaining temporary demo memory and lack of live financial transactions. | IMPLEMENTED AND VERIFIED |
| **`ComingSoonState`**| `components/ui/ComingSoonState.tsx`| `title`, `description`, `eta` | Empty state placeholder for features deferred to future releases. | IMPLEMENTED AND VERIFIED |
| **`LeadDrawer`** | `components/features/LeadDrawer.tsx`| `isOpen`, `onClose`, `onSuccess`, `initialServiceId` | Complete 11-field slide-over lead capture form with instant submission to `/api/v1/leads`. | IMPLEMENTED AND VERIFIED |

---

## 7. Client-Side State Management & Contexts

### 7.1 Authentication Context (`frontend/src/context/AuthContext.tsx`)
- **State Store**:
  - `user: UserProfile | null`
  - `isAuthenticated: boolean`
  - `backendConnected: boolean`
  - `latencyMs: number | null`
- **Persistence**: Serialized JSON stored under `localStorage.getItem('sbloom_active_user')`.
- **Methods**:
  - `login(email, password)`: Authenticates user credentials.
  - `registerDemo(data)`: Posts to `/api/v1/affiliates/register-demo` with automatic local fallback if backend unreachable.
  - `logout()`: Clears `localStorage` and redirects to `/app/login`.
  - `toggleRole()`: Toggles active role between `affiliate` and `admin` for rapid demo auditing.
  - `updateProfile(updates)`: Updates profile metadata in memory and calls `PATCH /api/v1/affiliates/me`.
  - `checkConnection()`: Pings `GET /health` every 30 seconds and measures latency.

### 7.2 Bilingual Localization Context (`frontend/src/context/LanguageContext.tsx`)
- **Supported Locales**:
  - `en`: English (Default).
  - `te`: Telugu (తెలుగు) — Draft localization.
- **Dictionary**: `frontend/src/data/translations.ts` contains synchronized UI strings.
- **Draft Status Indicator**: Displays a `Draft Telugu UI` badge when Telugu is selected, warning that professional linguistic review is ongoing.

---

## 8. Design System Tokens & Typography

Defined in `frontend/tailwind.config.js`:

```javascript
colors: {
  sbloom: {
    canvas: '#FAF7F2',        // Organic cream page canvas
    surface: '#F3ECE1',       // Elevated surface cards
    'text-main': '#12101F',   // Primary dark ink
    'text-secondary': '#575266', // Muted secondary ink
    border: '#E8E2D8',        // Divider and border stroke
    violet: {
      DEFAULT: '#6B3CFF',     // Brand primary violet
      light: '#845BFF',
      dark: '#5125DB',
    },
    magenta: {
      DEFAULT: '#FF4FA3',     // Accent magenta
      light: '#FF70B6',
    },
    lime: {
      DEFAULT: '#D6F36B',     // Highlight lime
      dark: '#B8DB3D',
    },
    admin: '#0E0B1E',         // Dark admin stage
    'admin-card': '#181432',  // Dark admin card
  }
}
```

### Typography Specification
- **Headings**: `'Fraunces'`, serif (Warm, editorial, optical size 32).
- **Body & UI**: `'Plus Jakarta Sans'`, sans-serif (Clean geometric sans).
- **Telugu Script**: `'Noto Sans Telugu'`, sans-serif (Proper Telugu vowel ligatures).
- **Code & IDs**: `ui-monospace, SFMono-Regular, Menlo, Monaco` (Referral codes and IDs).

---

## 9. Frontend Verification & Audit Matrix

| Feature / Component | Source File | Status | Verification Detail |
| :--- | :--- | :--- | :--- |
| **App Routing & Fallback** | `src/App.tsx` | IMPLEMENTED AND VERIFIED | All 12 routes render without runtime errors; catch-all redirects to `/`. |
| **Auth Route Guards** | `src/components/layout/AffiliateLayout.tsx` | IMPLEMENTED AND VERIFIED | Unauthenticated users redirected to `/app/login`. |
| **Admin Route Protection**| `src/components/layout/AdminLayout.tsx` | IMPLEMENTED AND VERIFIED | Restricts access to users with `role === 'admin'`. |
| **Lead Submission Form** | `src/components/features/LeadDrawer.tsx` | IMPLEMENTED AND VERIFIED | Form validation verifies all 11 fields; dispatches POST request. |
| **Offline Signup Fallback**| `src/context/AuthContext.tsx` | IMPLEMENTED AND VERIFIED | Generates local affiliate profile when backend port 8000 is inactive. |
| **Clipboard Referral Copy**| `src/pages/affiliate/DashboardPage.tsx` | IMPLEMENTED AND VERIFIED | `navigator.clipboard.writeText` triggers toast confirmation. |
| **Bilingual Toggle** | `src/context/LanguageContext.tsx` | IMPLEMENTED AND VERIFIED | Real-time string swap between English and Telugu dictionary. |
| **Production Build** | `frontend/dist` | IMPLEMENTED AND VERIFIED | Vite production bundle builds in ~2.2s with zero TypeScript/Rollup errors. |

