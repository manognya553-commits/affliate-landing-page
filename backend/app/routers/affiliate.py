from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, AuthenticatedUser, csrf_protect
from app.models import AffiliateProfile, ConsentRecord, TermsVersion, AuditLog, ReferralLead, ServiceProvider
from app.schemas import (
    AffiliateProfileUpdate,
    AffiliateProfileSubmit,
    AffiliateProfileResponse,
    ReferralLeadCreate,
    ReferralLeadResponse,
    AffiliateMetricsResponse,
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
    dup = (
        db.query(ReferralLead)
        .filter(
            ReferralLead.affiliate_user_id == current_user.id,
            ReferralLead.client_mobile == body.client_mobile.strip(),
            ReferralLead.service_category == body.service_category,
            ReferralLead.created_at >= twenty_four_hours_ago,
        )
        .first()
    )
    if dup:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A referral for this client in this sector was recently submitted and is currently being processed.",
        )

    # 5. Resolve provider if provided
    resolved_provider_id = None
    provider_name = None
    if body.provider_id:
        prov = db.query(ServiceProvider).filter(ServiceProvider.id == body.provider_id, ServiceProvider.is_active == True).first()
        if prov:
            resolved_provider_id = prov.id
            provider_name = prov.name

    lead = ReferralLead(
        affiliate_user_id=current_user.id,
        provider_id=resolved_provider_id,
        client_name=body.client_name.strip(),
        client_mobile=body.client_mobile.strip(),
        client_city=body.client_city.strip(),
        service_category=body.service_category,
        context_note=body.context_note.strip(),
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
        },
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(lead)

    resp = ReferralLeadResponse.model_validate(lead)
    resp.provider_name = provider_name
    return resp


@router.get("/referrals", response_model=List[ReferralLeadResponse])
def list_affiliate_referrals(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns only the referrals submitted by the authenticated affiliate.
    Enforces strict ownership isolation and associates provider details.
    """
    query = (
        db.query(ReferralLead, ServiceProvider.name)
        .outerjoin(ServiceProvider, ServiceProvider.id == ReferralLead.provider_id)
        .filter(ReferralLead.affiliate_user_id == current_user.id)
    )

    if status_filter and status_filter != "all":
        query = query.filter(ReferralLead.status == status_filter)

    results = query.order_by(ReferralLead.created_at.desc()).all()
    items = []
    for lead, prov_name in results:
        lead_resp = ReferralLeadResponse.model_validate(lead)
        lead_resp.provider_name = prov_name
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

