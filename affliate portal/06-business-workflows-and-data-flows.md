# sBLOOM Affiliate Portal — Business Workflows & Data Flows
**Document ID:** `SBD-ARCH-06`  
**Target System:** sBLOOM Affiliate Portal Business Processes & Data Pipelines  
**Audit & Architecture Date:** November 3, 2026  
**Status:** IMPLEMENTED AND VERIFIED  
**Security Level:** Internal Engineering Reference  

---

## 1. Executive Summary

This document specifies the end-to-end business workflows and data transformation pipelines that govern the **sBLOOM Affiliate Portal**. Each workflow traces user actions, client-side state transformations, REST API invocations, business validation logic, and data persistence events.

The core workflows detailed include:
1. **Affiliate Partner Onboarding & Attribution Issuance**
2. **Lead Submission & Attribution Locking via `LeadDrawer`**
3. **End-to-End Lead Lifecycle & Status State Machine**
4. **Deal Conversion, Commission Calculation & Payout Settlement**
5. **Admin Deal Review & Status Transition Operations**

---

## 2. Workflow 1: Affiliate Onboarding & Code Issuance

```mermaid
sequenceDiagram
    autonumber
    actor Partner as Candidate Partner
    participant UI as SignupPage.tsx
    participant Ctx as AuthContext.tsx
    participant API as POST /api/v1/affiliates/register-demo
    participant Svc as affiliate_service.py
    participant Sec as security.py (PBKDF2)
    participant Store as InMemoryStore

    Partner->>UI: Enter Name, Email, Phone, Password, Category, Consent
    UI->>UI: Validate form (all required fields + consent checked)
    UI->>Ctx: registerDemo(payload)
    Ctx->>API: POST /api/v1/affiliates/register-demo
    API->>Svc: register_demo_affiliate(data)
    Svc->>Svc: Check for duplicate email in store
    alt Email already registered
        Svc-->>API: Raise HTTPException(400, "Email already registered")
        API-->>Ctx: 400 Bad Request
        Ctx-->>UI: Display error banner
    else Email unique
        Svc->>Sec: hash_password(data.password)
        Sec-->>Svc: salt:password_hash
        Svc->>Svc: Generate referral code: SBLOOM-<SLUG>-<HEX2>
        Svc->>Store: Persist new partner profile
        Svc-->>API: AffiliateResponse (no credentials)
        API-->>Ctx: 201 Created (AffiliateResponse)
        Ctx->>Ctx: Set user state & localStorage ('sbloom_active_user')
        Ctx-->>UI: Navigation trigger
        UI->>Partner: Redirect to /app (Affiliate Dashboard)
    end
```

### Business Rules & Constraints
- **Referral Code Determinism**: Generated from partner's name prefix (e.g. `HARSHI`) and randomized 2-character hex (e.g. `78`), ensuring short, brandable, shareable codes (`SBLOOM-HARSHI-78`).
- **Instant Activation**: Partners do not encounter waiting queues or manual screening barriers for demo evaluation.
- **Mandatory Consent**: Registration strictly requires agreement to sBLOOM partner ethics guidelines.

---

## 3. Workflow 2: Lead Submission & Attribution Locking

The primary monetization action of an affiliate is referring a qualified enterprise client.

```mermaid
sequenceDiagram
    autonumber
    actor Partner as Affiliate Partner
    participant UI as LeadsPage.tsx / ServicesPage.tsx
    participant Drawer as LeadDrawer.tsx
    participant API as POST /api/v1/leads
    participant Svc as lead_service.py
    participant Catalog as service_catalog.py
    participant Store as InMemoryStore

    Partner->>UI: Click "+ Refer New Client" (or "Submit Lead" on Service Card)
    UI->>Drawer: Open drawer (pre-select target service if clicked from card)
    Partner->>Drawer: Fill Organization, Contact, Email, Phone, Requirements, Consent
    Drawer->>Drawer: Validate 11 form fields
    Drawer->>API: POST /api/v1/leads (with affiliate_code attached)
    API->>Svc: create_lead(lead_in)
    Svc->>Catalog: calculate_commission_for_services(services_of_interest)
    Catalog-->>Svc: estimated_value, estimated_commission
    Svc->>Svc: Generate human-readable reference number (SBL-YYYYMM-XXXX)
    Svc->>Store: with store._lock: write lead to dictionary
    Svc-->>API: LeadResponse (Status: 'Pending', reference_number)
    API-->>Drawer: 201 Created
    Drawer->>UI: Trigger onSuccess callback (refresh leads table)
    Drawer->>Drawer: Close drawer & show success toast
```

### Lead Form Data Validation Rules
1. **`business_name`**: Length between 2 and 150 characters.
2. **`contact_name`**: Length between 2 and 100 characters.
3. **`email`**: Valid business email matching RFC 5322 syntax.
4. **`phone`**: Minimum 8 digits, maximum 25 characters (supports `+91` formats).
5. **`services_of_interest`**: Non-empty list (`min_items=1`) referencing valid catalog IDs.
6. **`business_requirements`**: Minimum 10 characters detailing client scope.
7. **`consent`**: Explicit boolean check confirming prior contact with the client.
8. **`affiliate_code`**: Automatically bound from active session to prevent misattribution.

---

## 4. Workflow 3: End-to-End Lead Lifecycle & State Transitions

A submitted lead progresses through five defined operational states:

```mermaid
stateDiagram-v2
    [*] --> Pending : Submitted via LeadDrawer\n(Ref: SBL-YYYYMM-XXXX)
    
    Pending --> Contacted : Operator Outreach\n(Sales initiates discovery call within 24-48h)
    Pending --> Rejected : Initial Review Failed\n(Invalid contact / Out of service scope)
    
    Contacted --> Qualified : Scope Verified\n(Client demo / POC meeting scheduled)
    Contacted --> Rejected : Client Unresponsive / Declined
    
    Qualified --> Converted : Deal Closed & Contract Signed\n(Contract value verified; Commission locked)
    Qualified --> Rejected : Deal Lost to Competitor / Dropped
    
    Converted --> [*] : Commission Ledger Created\n(Disbursement on 10th of month)
    Rejected --> [*] : Archived in Lead History
```

### State Definitions & SLA Metrics
| Lifecycle State | Responsible Actor | Average SLA | Description & Exit Criteria |
| :--- | :--- | :--- | :--- |
| **`Pending`** | System / Operator | 0 – 24 Hours | Default status upon submission. Awaits initial sales team triage. |
| **`Contacted`** | sBLOOM Sales Rep | 24 – 48 Hours | Discovery outreach initiated via WhatsApp or email. Initial discovery call held. |
| **`Qualified`** | Enterprise Solutions Team | 3 – 7 Days | Technical scope and budget confirmed. POC or formal contract drafted. |
| **`Converted`** | Finance & Legal | 7 – 30 Days | Agreement executed, first invoice paid by client. Trigger for commission credit. |
| **`Rejected`** | System / Operator | Immediate | Lead determined unqualified, invalid contact details, or outside geographic scope. |

---

## 5. Workflow 4: Deal Conversion, Commission Calculation & Payout Settlement

```mermaid
flowchart TD
    CONV["1. Deal Marked Converted in Admin Console\n(Contract Value: ₹2,00,000)"] --> CALC["2. Commission Engine Execution\n(Contract Rate: 20%)"]
    CALC --> GROSS["3. Gross Commission Calculated: ₹40,000"]
    GROSS --> TDS["4. Statutory TDS Deduction (Section 194H)\n5% TDS withheld: ₹2,000"]
    TDS --> NET["5. Net Commission Accrued: ₹38,000\n(Status: Pending Conversion -> Cleared)"]
    NET --> SCHEDULE["6. Payout Scheduled for 10th of Following Month\n(e.g. 10 Nov 2026)"]
    SCHEDULE --> BATCH["7. Monthly Batch Payout & Invoice Generated\n(INV-2026-11-XXXX)"]
    BATCH --> RAIL["8. Disbursement via Bank NEFT / UPI Handle\n(Banking UTR Recorded)"]
    RAIL --> PAID["9. Status Updated to 'Paid'\n(Reflected in /app/earnings and /app/invoices)"]
```

### Statutory Tax Compliance (Indian Income Tax Act, Section 194H)
- **TDS Threshold & Rate**: Commissions and brokerage disbursed to Indian resident partners are subject to a **5% Tax Deducted at Source (TDS)** under Section 194H.
- **Reporting & Transparency**: The earnings ledger explicitly itemizes `Gross Commission`, `TDS Deducted (5%)`, and `Net Disbursement Amount` for every closed deal.

---

## 6. Workflow 5: Admin Lead Audit & Cross-Affiliate Review

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Operations Admin
    participant Console as AdminLeadsPage.tsx
    participant Modal as StatusUpdateModal
    participant API as GET /api/v1/leads & Update Lead
    participant Store as InMemoryStore

    Admin->>Console: Open /admin/leads
    Console->>API: GET /api/v1/leads (fetch all cross-affiliate leads)
    API-->>Console: LeadListResponse (all leads + affiliate_code)
    Console->>Admin: Display full pipeline table
    Admin->>Console: Click "Update Status" on target lead
    Console->>Modal: Open modal with current lead status
    Admin->>Modal: Select new status (e.g. Qualified) & enter internal remarks
    Modal->>API: PATCH /api/v1/leads/{lead_id}/status (or store update)
    API->>Store: Update status and append to lead_status_history
    Store-->>API: Updated lead object
    API-->>Modal: 200 OK
    Modal->>Console: Close modal & refresh table
    Console->>Admin: Show success notification
```

---

## 7. Workflow Verification & Integrity Matrix

| Business Workflow | Verification Method | Status | Verification Observations |
| :--- | :--- | :--- | :--- |
| **Partner Registration** | Pytest `test_affiliates.py` | IMPLEMENTED AND VERIFIED | Generates unique referral code; password stored as salted hash. |
| **Attribution Enforcement** | Frontend `LeadDrawer.tsx` | IMPLEMENTED AND VERIFIED | Referral code automatically appended from active profile. |
| **Lead Form Validation** | Backend Pydantic validators | IMPLEMENTED AND VERIFIED | Rejects missing consent, empty services, invalid emails with 422. |
| **Status Transition** | UI modal in `AdminLeadsPage` | IMPLEMENTED AND VERIFIED | Successfully transitions states and updates table badges. |
| **Commission Breakdown** | Frontend `EarningsPage.tsx` | IMPLEMENTED AND VERIFIED | Itemizes Gross, TDS (5%), and Net amount according to Section 194H. |
| **Invoice Statement** | Frontend `InvoicesPage.tsx` | IMPLEMENTED AND VERIFIED | Renders monthly statement with UTR banking reference. |

