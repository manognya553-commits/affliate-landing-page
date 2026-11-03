# sBLOOM Affiliate Portal — Technical Design Documentation Suite
**Documentation ID:** `SBD-DOCS-INDEX`  
**Target Repository:** `e:\HARSHITHA\OTTOBON\Affiliate`  
**Audit & Architecture Date:** November 3, 2026  
**System Status:** IMPLEMENTED AND VERIFIED (Foundation & Integration Phase)  
**Security Level:** Internal Engineering Reference  

---

## 1. Overview & Document Suite Index

This documentation suite provides a complete, repository-grounded technical audit and software architecture specification for the **sBLOOM Affiliate Portal**. It is specifically structured for engineering handover, ongoing maintenance, security review, and planned Phase 2 Supabase PostgreSQL migration.

### Scope Boundary Rule
- **STRICTLY IN SCOPE:** The authenticated portal application (`/app/*`), administrative operations console (`/admin/*`), authentication workflows (`/app/login`, `/app/signup`), route protection, shared layout shells, slide-over features (`LeadDrawer`), FastAPI backend services, temporary storage architecture, and planned Supabase database designs.
- **STRICTLY OUT OF SCOPE:** The public affiliate marketing landing page at `/` (including hero banners, promotional copy, visual showcases, and SEO strategies). The landing page is referenced solely as the navigation entry point whose primary CTAs route unauthenticated visitors to `/app/signup` or `/app/login`.

---

## 2. Master Document Inventory

| # | Document File | Document ID | Title | Core Focus & Description |
| :---: | :--- | :--- | :--- | :--- |
| **01** | [`01-affiliate-portal-system-design.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/01-affiliate-portal-system-design.md) | `SBD-ARCH-01` | System Design & Architecture Overview | High-level system architecture, component topologies, scope boundaries, and core technology decisions. |
| **02** | [`02-frontend-design.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/02-frontend-design.md) | `SBD-ARCH-02` | Frontend Architecture & UI Design | Complete 12-route inventory, page-by-page specifications, reusable UI library, state management contexts, design tokens, and Telugu localization. |
| **03** | [`03-backend-and-api-design.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/03-backend-and-api-design.md) | `SBD-ARCH-03` | Backend & REST API Design | FastAPI endpoints, Pydantic v2 schemas, validation logic, service catalog, thread-locked storage, and CORS policies. |
| **04** | [`04-supabase-database-design.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/04-supabase-database-design.md) | `SBD-ARCH-04` | Supabase Database Design | 8-table relational schema specification, Mermaid ER diagram, Row Level Security (RLS) policies, B-tree indexes, and migration roadmap. |
| **05** | [`05-authentication-rbac-and-security.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/05-authentication-rbac-and-security.md) | `SBD-ARCH-05` | Authentication, RBAC & Security Audit | Session lifecycles, PBKDF2 password hashing, RBAC permission matrix, security vulnerabilities, IDOR risks, and mitigation strategies. |
| **06** | [`06-business-workflows-and-data-flows.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/06-business-workflows-and-data-flows.md) | `SBD-ARCH-06` | Business Workflows & Data Flows | Sequence diagrams for onboarding, lead submission, lead state transitions (Pending to Converted), commission calculation, and Section 194H TDS. |
| **07** | [`07-shared-database-integration.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/07-shared-database-integration.md) | `SBD-ARCH-07` | Shared Database Integration | Integration with wider sBLOOM ecosystem, dedicated `affiliate.*` schema, collision prevention, and 5 open architecture questions for teammates. |
| **08** | [`08-testing-and-risk-register.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/08-testing-and-risk-register.md) | `SBD-ARCH-08` | Testing Suite & Risk Register | Automated pytest inventory, Vite production build audit, test coverage matrix, and prioritized technical/security risk register. |
| **09** | [`09-technical-reference-and-glossary.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/09-technical-reference-and-glossary.md) | `SBD-ARCH-09` | Technical Reference & Glossary | Repository directory tree, critical file catalog, environment variables reference, operational commands cheatsheet, and business glossary. |

---

## 3. Recommended Reading Order by Engineering Role

### For Frontend Developers
1. Start with [`01-affiliate-portal-system-design.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/01-affiliate-portal-system-design.md) for architectural orientation.
2. Read [`02-frontend-design.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/02-frontend-design.md) for the route hierarchy, component library, and state management.
3. Review [`06-business-workflows-and-data-flows.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/06-business-workflows-and-data-flows.md) for lead lifecycle and drawer interactions.
4. Reference [`09-technical-reference-and-glossary.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/09-technical-reference-and-glossary.md) for commands and environment variables.

### For Backend & API Engineers
1. Read [`01-affiliate-portal-system-design.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/01-affiliate-portal-system-design.md) for system context.
2. Study [`03-backend-and-api-design.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/03-backend-and-api-design.md) for endpoint contracts and Pydantic schemas.
3. Review [`05-authentication-rbac-and-security.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/05-authentication-rbac-and-security.md) for password hashing and RBAC rules.
4. Review [`08-testing-and-risk-register.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/08-testing-and-risk-register.md) for test cases and pytest commands.

### For Database Architects & Security Reviewers
1. Study [`04-supabase-database-design.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/04-supabase-database-design.md) for table DDL, ER diagrams, and RLS policies.
2. Review [`07-shared-database-integration.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/07-shared-database-integration.md) for schema namespacing and ecosystem collision prevention.
3. Review [`05-authentication-rbac-and-security.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/05-authentication-rbac-and-security.md) for IDOR risks and privilege escalation vectors.
4. Inspect the Risk Register in [`08-testing-and-risk-register.md`](file:///e:/HARSHITHA/OTTOBON/Affiliate/docs/affiliate-portal/08-testing-and-risk-register.md).

---

## 4. Verification Status Standard Reference

Every claim and finding within this documentation suite is categorized according to the following standard:
- **`IMPLEMENTED AND VERIFIED`**: Confirmed by working source code, successful test execution, or build output.
- **`IMPLEMENTED BUT NOT VERIFIED`**: Present in source code, but full integration or edge cases could not be executed at runtime.
- **`PARTIALLY IMPLEMENTED`**: Core scaffolding exists, but specific workflows or validations remain incomplete.
- **`PLANNED`**: Documented architecture or requirements intended for Phase 2 execution.
- **`NOT FOUND`**: Feature was examined and found completely absent in the repository.
- **`UNVERIFIED`**: Evidence was insufficient to determine operational status.

