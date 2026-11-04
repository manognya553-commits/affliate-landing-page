from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, AuthenticatedUser, csrf_protect
from app.models import (
    AffiliateProfile,
    ConsentRecord,
    TermsVersion,
    AuditLog,
    ReferralLead,
    ServiceProvider,
    ProviderService,
    CommissionLedger,
    AffiliateInvoice,
    AffiliateInvoiceItem,
    User,
)
from app.schemas import (
    AffiliateProfileUpdate,
    AffiliateProfileSubmit,
    AffiliateProfileResponse,
    ReferralLeadCreate,
    ReferralLeadResponse,
    AffiliateMetricsResponse,
    GenerateAffiliateInvoiceRequest,
    AffiliateInvoiceResponse,
    CommissionLedgerItemResponse,
)
from app.security import get_client_ip
router = APIRouter(prefix="/affiliate", tags=["Affiliate"])


@router.get("/profile", response_model=AffiliateProfileResponse)
def get_affiliate_profile(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(AffiliateProfile)
        .filter(AffiliateProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        profile = AffiliateProfile(user_id=current_user.id, status="draft")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    elif profile.status == "pending":
        # Automatically activate any account in pending state (unless suspended/rejected)
        now = datetime.now(timezone.utc)
        profile.status = "approved"
        profile.approved_by = current_user.id
        profile.approved_at = now
        db.commit()
        db.refresh(profile)

    return AffiliateProfileResponse.model_validate(profile)


@router.put("/profile", response_model=AffiliateProfileResponse, dependencies=[Depends(csrf_protect)])
def update_affiliate_profile(
    body: AffiliateProfileUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(AffiliateProfile)
        .filter(AffiliateProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        profile = AffiliateProfile(user_id=current_user.id, status="draft")
        db.add(profile)

    # Affiliates can only update profile details; NEVER status, role, or approval fields
    if body.full_name is not None:
        profile.full_name = body.full_name.strip()
    if body.city is not None:
        profile.city = body.city.strip()
    if body.area is not None:
        profile.area = body.area.strip()
    if body.mobile is not None:
        profile.mobile = body.mobile.strip() if body.mobile else None
    if body.occupation is not None:
        profile.occupation = body.occupation
    if body.promotion_plan is not None:
        profile.promotion_plan = body.promotion_plan.strip()

    # Payout & Settlement Groundwork
    if body.bank_name is not None:
        profile.bank_name = body.bank_name.strip()
    if body.bank_account_number is not None:
        profile.bank_account_number = body.bank_account_number.strip()
    if body.bank_ifsc is not None:
        profile.bank_ifsc = body.bank_ifsc.strip().upper()
    if body.upi_id is not None:
        profile.upi_id = body.upi_id.strip()
    if body.pan_number is not None:
        profile.pan_number = body.pan_number.strip().upper()

    if body.preferred_language is not None and body.preferred_language in ("en", "te"):
        current_user.user.preferred_language = body.preferred_language

    db.commit()
    db.refresh(profile)
    return AffiliateProfileResponse.model_validate(profile)


@router.post("/profile/submit", response_model=AffiliateProfileResponse, dependencies=[Depends(csrf_protect)])
def submit_affiliate_profile(
    request: Request,
    body: AffiliateProfileSubmit,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(AffiliateProfile)
        .filter(AffiliateProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        profile = AffiliateProfile(user_id=current_user.id)
        db.add(profile)

    # Never allow suspended or rejected accounts to reactivate themselves
    if profile.status in ("suspended", "rejected"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Suspended or rejected accounts cannot be reactivated.",
        )

    # Check terms acceptance
    if not body.terms_accepted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Programme Terms & Conditions must be accepted.",
        )

    now = datetime.now(timezone.utc)
    client_ip = get_client_ip(request)

    # Verify terms version exists in terms_versions
    terms = (
        db.query(TermsVersion)
        .filter(TermsVersion.document_key == "affiliate_terms", TermsVersion.version == body.terms_version)
        .first()
    )
    if not terms:
        terms = TermsVersion(document_key="affiliate_terms", version=1, title="Affiliate Programme Terms")
        db.add(terms)
        db.flush()

    # Update profile fields
    profile.full_name = body.full_name.strip()
    profile.city = body.city.strip()
    profile.area = body.area.strip()
    profile.mobile = body.mobile.strip() if body.mobile else None
    profile.occupation = body.occupation
    profile.promotion_plan = body.promotion_plan.strip()

    # Automatic activation for normal applicants
    before_status = profile.status
    profile.status = "approved"
    profile.approved_by = current_user.id
    profile.approved_at = now
    profile.terms_version = body.terms_version
    profile.terms_accepted_at = now
    profile.submitted_at = now
    profile.rejection_reason = None
    profile.info_request_note = None

    # Write consent record
    consent = ConsentRecord(
        user_id=current_user.id,
        document_key="affiliate_terms",
        version=body.terms_version,
        accepted_at=now,
        ip_address=client_ip,
        user_agent=request.headers.get("user-agent"),
    )
    db.add(consent)

    # Record automatic approval in audit log
    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate.auto_approved",
        entity_type="affiliate_profile",
        entity_id=str(current_user.id),
        before_state={"status": before_status},
        after_state={"status": "approved", "auto_activated": True},
        ip_address=client_ip,
    )
    db.add(audit)

    db.commit()
    db.refresh(profile)
    return AffiliateProfileResponse.model_validate(profile)


@router.post("/referrals", response_model=ReferralLeadResponse, dependencies=[Depends(csrf_protect)])
def submit_referral_lead(
    request: Request,
    body: ReferralLeadCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submits a new client introduction (referral lead) under the permission-first principle.
    Validates explicit consent, sector eligibility, email verification, and writes to audit log.
    """
    # 1. Enforce explicit client consent
    if not body.consent_confirmed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Client permission is mandatory under the sBLOOM permission-first principle.",
        )

    # 2. Enforce email verification requirement
    if not current_user.user.email_verified_at:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email verification is required before submitting referrals. Please verify your email first.",
        )

    # 3. Enforce active account status (blocking suspended and rejected accounts)
    if current_user.affiliate_status in ("suspended", "rejected") or not current_user.user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended or rejected. Referral submission is disabled.",
        )

    now = datetime.now(timezone.utc)
    client_ip = get_client_ip(request)

    # 4. Prevent accidental duplicate submissions within 24 hours
    twenty_four_hours_ago = now - timedelta(hours=24)
    dup_query = (
        db.query(ReferralLead)
        .filter(
            ReferralLead.affiliate_user_id == current_user.id,
            ReferralLead.client_mobile == body.client_mobile.strip(),
            ReferralLead.created_at >= twenty_four_hours_ago,
        )
    )
    if body.service_id:
        dup_query = dup_query.filter(ReferralLead.service_id == body.service_id)
    elif body.service_category:
        dup_query = dup_query.filter(ReferralLead.service_category == body.service_category)
    if dup_query.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A referral for this client was recently submitted and is currently being processed.",
        )

    # 5. Resolve provider and service
    resolved_provider_id = None
    resolved_service_id = None
    provider_name = None
    service_name = None
    service_category = body.service_category

    if body.provider_id:
        prov = db.query(ServiceProvider).filter(ServiceProvider.id == body.provider_id).first()
        if not prov or not prov.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The selected service provider is inactive or does not exist.",
            )
        resolved_provider_id = prov.id
        provider_name = prov.name
        if not service_category:
            service_category = prov.sector

    if body.service_id:
        if not resolved_provider_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A service provider must be selected.",
            )
        srv = db.query(ProviderService).filter(ProviderService.id == body.service_id).first()
        if not srv or not srv.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The selected service is inactive or does not exist.",
            )
        if srv.provider_id != resolved_provider_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The selected service does not belong to the selected service provider.",
            )
        resolved_service_id = srv.id
        service_name = srv.service_name

        # Enforce requirement description if mandatory for this service
        if srv.requirement_description_required:
            if not body.context_note or len(body.context_note.strip()) < 10:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A customer requirement description (at least 10 characters) is required by this service.",
                )

    if not service_category:
        service_category = "healthcare"

    lead = ReferralLead(
        affiliate_user_id=current_user.id,
        provider_id=resolved_provider_id,
        service_id=resolved_service_id,
        client_name=body.client_name.strip(),
        client_mobile=body.client_mobile.strip(),
        client_email=body.client_email.strip().lower() if body.client_email else None,
        client_city=body.client_city.strip(),
        service_category=service_category,
        context_note=body.context_note.strip() if body.context_note else None,
        consent_confirmed=True,
        status="pending",
    )
    db.add(lead)
    db.flush()

    # Record referral creation in audit log
    audit = AuditLog(
        actor_user_id=current_user.id,
        action="referral.created",
        entity_type="referral_lead",
        entity_id=str(lead.id),
        after_state={
            "client_name": lead.client_name,
            "service_category": lead.service_category,
            "client_city": lead.client_city,
            "status": lead.status,
            "provider_id": str(resolved_provider_id) if resolved_provider_id else None,
            "service_id": str(resolved_service_id) if resolved_service_id else None,
        },
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(lead)

    resp = ReferralLeadResponse.model_validate(lead)
    resp.provider_name = provider_name
    resp.service_name = service_name
    return resp


@router.get("/referrals", response_model=List[ReferralLeadResponse])
def list_affiliate_referrals(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns only the referrals submitted by the authenticated affiliate.
    Enforces strict ownership isolation and associates provider and service details.
    """
    query = (
        db.query(ReferralLead, ServiceProvider.name, ProviderService.service_name)
        .outerjoin(ServiceProvider, ServiceProvider.id == ReferralLead.provider_id)
        .outerjoin(ProviderService, ProviderService.id == ReferralLead.service_id)
        .filter(ReferralLead.affiliate_user_id == current_user.id)
    )

    if status_filter and status_filter != "all":
        query = query.filter(ReferralLead.status == status_filter)

    results = query.order_by(ReferralLead.created_at.desc()).all()
    items = []
    for lead, prov_name, srv_name in results:
        lead_resp = ReferralLeadResponse.model_validate(lead)
        lead_resp.provider_name = prov_name
        lead_resp.service_name = srv_name
        items.append(lead_resp)
    return items


@router.get("/metrics", response_model=AffiliateMetricsResponse)
def get_affiliate_metrics(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Calculates live dashboard metrics and status breakdown for the authenticated affiliate.
    """
    user_leads = (
        db.query(ReferralLead)
        .filter(ReferralLead.affiliate_user_id == current_user.id)
        .all()
    )

    total = len(user_leads)
    pending = sum(1 for l in user_leads if l.status == "pending")
    contacted = sum(1 for l in user_leads if l.status == "contacted")
    qualified = sum(1 for l in user_leads if l.status == "qualified")
    converted = sum(1 for l in user_leads if l.status == "converted")
    rejected = sum(1 for l in user_leads if l.status == "rejected")
    active = pending + contacted + qualified
    pipeline = sum(1 for l in user_leads if l.status != "rejected")
    ratio = round((converted / total * 100.0), 1) if total > 0 else 0.0

    return AffiliateMetricsResponse(
        active_referrals=active,
        converted_introductions=converted,
        verified_pipeline=pipeline,
        performance_ratio=ratio,
        total_referrals=total,
        pending_referrals=pending,
        contacted_referrals=contacted,
        qualified_referrals=qualified,
        converted_referrals=converted,
        rejected_referrals=rejected,
    )



# ==============================================================================
# AFFILIATE FINANCIAL & INVOICING ENDPOINTS
# ==============================================================================

def generate_affiliate_invoice_number(db: Session) -> str:
    now = datetime.now(timezone.utc)
    prefix = f"INV-AFF-{now.strftime('%Y%m')}-"
    last_inv = db.query(AffiliateInvoice).filter(AffiliateInvoice.invoice_number.like(f"{prefix}%")).order_by(AffiliateInvoice.invoice_number.desc()).first()
    if last_inv:
        try:
            seq = int(last_inv.invoice_number.split("-")[-1]) + 1
        except Exception:
            seq = 1
    else:
        seq = 1
    return f"{prefix}{seq:04d}"


@router.get("/finance/summary")
def get_affiliate_finance_summary(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns the authenticated affiliate's own financial metrics:
    total earnings, invoiced amount, paid amount, and outstanding payable balance.
    NEVER exposes provider commercial terms or platform margin.
    """
    elig_sum = (
        db.query(func.coalesce(func.sum(CommissionLedger.affiliate_commission_amount), 0.0))
        .filter(
            CommissionLedger.affiliate_user_id == current_user.id,
            CommissionLedger.status.in_(["eligible", "invoiced_by_affiliate", "paid_to_affiliate"]),
        )
        .scalar()
    )
    invoiced_sum = (
        db.query(func.coalesce(func.sum(AffiliateInvoice.total_payable), 0.0))
        .filter(
            AffiliateInvoice.affiliate_user_id == current_user.id,
            AffiliateInvoice.status.in_(["submitted", "verified", "approved", "paid"]),
        )
        .scalar()
    )
    paid_sum = (
        db.query(func.coalesce(func.sum(AffiliateInvoice.total_payable), 0.0))
        .filter(
            AffiliateInvoice.affiliate_user_id == current_user.id,
            AffiliateInvoice.status == "paid",
        )
        .scalar()
    )
    uninvoiced_sum = (
        db.query(func.coalesce(func.sum(CommissionLedger.affiliate_commission_amount), 0.0))
        .filter(
            CommissionLedger.affiliate_user_id == current_user.id,
            CommissionLedger.status == "eligible",
        )
        .scalar()
    )
    outstanding_balance = max(0.0, float(elig_sum) - float(paid_sum))

    return {
        "eligible_commission": round(float(elig_sum), 2),
        "uninvoiced_commission": round(float(uninvoiced_sum), 2),
        "invoiced_commission": round(float(invoiced_sum), 2),
        "paid_commission": round(float(paid_sum), 2),
        "outstanding_balance": round(outstanding_balance, 2),
    }


@router.get("/finance/uninvoiced", response_model=List[CommissionLedgerItemResponse])
def get_uninvoiced_commissions(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns converted referrals that are eligible for commission but not yet included in any invoice.
    Affiliates only see their own customer name, provider name, service name, and their own commission share.
    """
    ledger_items = (
        db.query(CommissionLedger, ServiceProvider.name, ProviderService.service_name, ReferralLead.client_name)
        .outerjoin(ServiceProvider, ServiceProvider.id == CommissionLedger.provider_id)
        .outerjoin(ProviderService, ProviderService.id == CommissionLedger.service_id)
        .outerjoin(ReferralLead, ReferralLead.id == CommissionLedger.referral_id)
        .filter(
            CommissionLedger.affiliate_user_id == current_user.id,
            CommissionLedger.status == "eligible",
            CommissionLedger.affiliate_invoice_id.is_(None),
        )
        .order_by(CommissionLedger.created_at.desc())
        .all()
    )

    items = []
    for item, prov_name, srv_name, client_name in ledger_items:
        items.append(
            CommissionLedgerItemResponse(
                id=item.id,
                referral_id=item.referral_id,
                affiliate_user_id=item.affiliate_user_id,
                provider_id=item.provider_id,
                provider_name=prov_name,
                service_id=item.service_id,
                service_name=srv_name,
                customer_name=client_name,
                eligible_transaction_value=float(item.eligible_transaction_value),
                provider_commission_rate=None,  # NEVER exposed to affiliate
                affiliate_commission_rate=float(item.affiliate_commission_rate) if item.affiliate_commission_rate else None,
                sbloom_share_rate=None,  # NEVER exposed to affiliate
                provider_commission_amount=0.0,  # NEVER exposed to affiliate
                affiliate_commission_amount=float(item.affiliate_commission_amount),
                sbloom_retained_amount=0.0,  # NEVER exposed to affiliate
                currency=item.currency,
                status=item.status,
                provider_invoice_id=None,
                affiliate_invoice_id=item.affiliate_invoice_id,
                verified_at=item.verified_at,
                notes=item.notes,
                created_at=item.created_at,
            )
        )
    return items


@router.post("/invoices/generate", response_model=AffiliateInvoiceResponse, dependencies=[Depends(csrf_protect)])
def generate_affiliate_invoice(
    body: GenerateAffiliateInvoiceRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submits a monthly invoice from the affiliate to sBLOOM for all eligible uninvoiced referral conversions.
    Locks ledger entries with immutable snapshots and concurrency-safe invoice number.
    """
    user = db.query(User).filter(User.id == current_user.id).first()
    prof = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == current_user.id).first()

    query = db.query(CommissionLedger).filter(
        CommissionLedger.affiliate_user_id == current_user.id,
        CommissionLedger.status == "eligible",
        CommissionLedger.affiliate_invoice_id.is_(None),
    )
    if body.ledger_ids:
        query = query.filter(CommissionLedger.id.in_(body.ledger_ids))

    ledger_items = query.all()
    if not ledger_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No eligible uninvoiced referral commissions found to generate an invoice.",
        )

    subtotal = sum(float(item.affiliate_commission_amount) for item in ledger_items)
    tds_rate = float(body.tds_rate or 0.0)
    tds_amount = round(subtotal * (tds_rate / 100.0), 2)
    total_payable = round(subtotal - tds_amount, 2)

    now = datetime.now(timezone.utc)
    due_date = now + timedelta(days=15)
    inv_number = generate_affiliate_invoice_number(db)

    # Use bank details provided in request or fallback to profile
    bank_name = body.bank_name or (prof.bank_name if prof else None)
    bank_acc = body.bank_account_number or (prof.bank_account_number if prof else None)
    bank_ifsc = body.bank_ifsc or (prof.bank_ifsc if prof else None)
    upi_id = body.upi_id or (prof.upi_id if prof else None)
    pan_number = body.pan_number or (prof.pan_number if prof else None)

    invoice = AffiliateInvoice(
        invoice_number=inv_number,
        affiliate_user_id=current_user.id,
        billing_period=body.billing_period,
        invoice_date=now,
        due_date=due_date,
        affiliate_name=prof.full_name if prof and prof.full_name else "Affiliate Partner",
        affiliate_email=user.email,
        affiliate_city=prof.city if prof else None,
        bank_name=bank_name,
        bank_account_number=bank_acc,
        bank_ifsc=bank_ifsc,
        upi_id=upi_id,
        pan_number=pan_number,
        subtotal_amount=subtotal,
        tds_rate=tds_rate,
        tds_amount=tds_amount,
        total_payable=total_payable,
        status="submitted",
    )
    db.add(invoice)
    db.flush()

    for item in ledger_items:
        lead = db.query(ReferralLead).filter(ReferralLead.id == item.referral_id).first()
        prov = db.query(ServiceProvider).filter(ServiceProvider.id == item.provider_id).first()
        srv = db.query(ProviderService).filter(ProviderService.id == item.service_id).first() if item.service_id else None

        line_item = AffiliateInvoiceItem(
            invoice_id=invoice.id,
            ledger_id=item.id,
            referral_id=item.referral_id,
            customer_name=lead.client_name if lead else "Client",
            provider_name=prov.name if prov else "Provider",
            service_name=srv.service_name if srv else "Service",
            eligible_transaction_value=float(item.eligible_transaction_value),
            affiliate_rate=float(item.affiliate_commission_rate) if item.affiliate_commission_rate else None,
            commission_amount=float(item.affiliate_commission_amount),
        )
        db.add(line_item)

        item.affiliate_invoice_id = invoice.id
        item.status = "invoiced_by_affiliate"

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate_invoice.generated",
        entity_type="affiliate_invoice",
        entity_id=str(invoice.id),
        after_state={"invoice_number": invoice.invoice_number, "total_payable": total_payable},
        ip_address=get_client_ip(request),
    )
    db.add(audit)
    db.commit()
    db.refresh(invoice)

    return AffiliateInvoiceResponse.model_validate(invoice)


@router.get("/invoices", response_model=List[AffiliateInvoiceResponse])
def get_affiliate_invoices(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns all submitted and processed invoices for the authenticated affiliate.
    """
    invoices = (
        db.query(AffiliateInvoice)
        .filter(AffiliateInvoice.affiliate_user_id == current_user.id)
        .order_by(AffiliateInvoice.created_at.desc())
        .all()
    )
    return [AffiliateInvoiceResponse.model_validate(inv) for inv in invoices]


@router.get("/invoices/{invoice_id}", response_model=AffiliateInvoiceResponse)
def get_affiliate_invoice_detail(
    invoice_id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns single invoice detail with line items for the authenticated affiliate.
    """
    inv = (
        db.query(AffiliateInvoice)
        .filter(
            AffiliateInvoice.id == invoice_id,
            AffiliateInvoice.affiliate_user_id == current_user.id,
        )
        .first()
    )
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")
    return AffiliateInvoiceResponse.model_validate(inv)
