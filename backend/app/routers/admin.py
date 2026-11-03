from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_permission, AuthenticatedUser, csrf_protect
from app.models import AffiliateProfile, User, AuditLog, ReferralLead, ServiceProvider, ProviderService
from app.schemas import (
    AdminSummaryResponse,
    AdminApprovalListItem,
    AdminRejectRequest,
    AdminRequestInfoRequest,
    AdminSuspendRequest,
    AdminActionResponse,
    AffiliateProfileResponse,
    AuditLogItem,
    AdminReferralLeadResponse,
    AdminReferralListResponse,
    AdminReferralStatusUpdate,
    ServiceProviderCreate,
    ServiceProviderUpdate,
    ServiceProviderResponse,
    ProviderServiceCreate,
    ProviderServiceUpdate,
    ProviderServiceResponse,
    MessageResponse,
)
from app.security import get_client_ip

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/summary", response_model=AdminSummaryResponse)
def get_admin_summary(
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    pending_count = (
        db.query(AffiliateProfile)
        .filter(AffiliateProfile.status == "pending")
        .count()
    )
    info_count = (
        db.query(AffiliateProfile)
        .filter(AffiliateProfile.status == "info_requested")
        .count()
    )
    approved_count = (
        db.query(AffiliateProfile)
        .filter(AffiliateProfile.status == "approved")
        .count()
    )
    suspended_count = (
        db.query(AffiliateProfile)
        .filter(AffiliateProfile.status == "suspended")
        .count()
    )
    rejected_count = (
        db.query(AffiliateProfile)
        .filter(AffiliateProfile.status == "rejected")
        .count()
    )
    total_count = db.query(AffiliateProfile).count()

    verified_affiliates = (
        db.query(User)
        .join(AffiliateProfile, AffiliateProfile.user_id == User.id)
        .filter(User.email_verified_at.isnot(None))
        .count()
    )
    unverified_affiliates = (
        db.query(User)
        .join(AffiliateProfile, AffiliateProfile.user_id == User.id)
        .filter(User.email_verified_at.is_(None))
        .count()
    )

    total_referrals = db.query(ReferralLead).count()
    pending_referrals = db.query(ReferralLead).filter(ReferralLead.status == "pending").count()
    contacted_referrals = db.query(ReferralLead).filter(ReferralLead.status == "contacted").count()
    qualified_referrals = db.query(ReferralLead).filter(ReferralLead.status == "qualified").count()
    converted_referrals = db.query(ReferralLead).filter(ReferralLead.status == "converted").count()
    rejected_referrals = db.query(ReferralLead).filter(ReferralLead.status == "rejected").count()

    total_providers = db.query(ServiceProvider).count()
    active_providers = db.query(ServiceProvider).filter(ServiceProvider.is_active == True).count()

    return AdminSummaryResponse(
        pending=pending_count,
        info_requested=info_count,
        approved=approved_count,
        total=total_count,
        total_referrals=total_referrals,
        pending_referrals=pending_referrals,
        contacted_referrals=contacted_referrals,
        qualified_referrals=qualified_referrals,
        converted_referrals=converted_referrals,
        rejected_referrals=rejected_referrals,
        verified_affiliates=verified_affiliates,
        unverified_affiliates=unverified_affiliates,
        suspended_affiliates=suspended_count,
        rejected_affiliates=rejected_count,
        total_providers=total_providers,
        active_providers=active_providers,
    )


@router.get("/approvals", response_model=List[AdminApprovalListItem])
def list_affiliate_approvals(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    query = db.query(AffiliateProfile, User).join(User, User.id == AffiliateProfile.user_id)

    # When status_filter is specific (e.g. pending, approved, info_requested), filter by it.
    # When status_filter is "all" or omitted, return all registered affiliates.
    if status_filter and status_filter != "all":
        query = query.filter(AffiliateProfile.status == status_filter)

    query = query.order_by(AffiliateProfile.created_at.desc())
    results = query.all()

    items = []
    for profile, user in results:
        items.append(
            AdminApprovalListItem(
                user_id=profile.user_id,
                email=user.email,
                full_name=profile.full_name,
                city=profile.city,
                area=profile.area,
                occupation=profile.occupation,
                promotion_plan=profile.promotion_plan,
                status=profile.status,
                created_at=profile.created_at,
                submitted_at=profile.submitted_at,
                approved_at=profile.approved_at,
                approved_by=profile.approved_by,
            )
        )
    return items


@router.get("/approvals/{user_id}", response_model=AffiliateProfileResponse)
def get_affiliate_approval_detail(
    user_id: UUID,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate profile not found.",
        )
    return AffiliateProfileResponse.model_validate(profile)


@router.post("/approvals/{user_id}/approve", response_model=AdminActionResponse, dependencies=[Depends(csrf_protect)])
def approve_affiliate(
    user_id: UUID,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.decide")),
    db: Session = Depends(get_db),
):
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate profile not found.")

    now = datetime.now(timezone.utc)
    client_ip = get_client_ip(request)
    before_state = {
        "status": profile.status,
        "approved_by": str(profile.approved_by) if profile.approved_by else None,
        "approved_at": profile.approved_at.isoformat() if profile.approved_at else None,
    }

    # Update profile
    profile.status = "approved"
    profile.approved_by = current_user.id
    profile.approved_at = now
    profile.rejection_reason = None
    profile.info_request_note = None

    after_state = {
        "status": profile.status,
        "approved_by": str(profile.approved_by),
        "approved_at": profile.approved_at.isoformat(),
    }

    # Write audit log row in the same transaction
    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate.approved",
        entity_type="affiliate_profile",
        entity_id=str(user_id),
        before_state=before_state,
        after_state=after_state,
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()

    return AdminActionResponse(
        success=True,
        status="approved",
        message="Affiliate application approved successfully.",
    )


@router.post("/approvals/{user_id}/reject", response_model=AdminActionResponse, dependencies=[Depends(csrf_protect)])
def reject_affiliate(
    user_id: UUID,
    body: AdminRejectRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.decide")),
    db: Session = Depends(get_db),
):
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate profile not found.")

    if not body.reason or not body.reason.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rejection reason is required.")

    client_ip = get_client_ip(request)
    before_state = {"status": profile.status, "rejection_reason": profile.rejection_reason}

    profile.status = "rejected"
    profile.rejection_reason = body.reason.strip()

    after_state = {"status": profile.status, "rejection_reason": profile.rejection_reason}

    # Write audit log row in the same transaction
    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate.rejected",
        entity_type="affiliate_profile",
        entity_id=str(user_id),
        reason=body.reason.strip(),
        before_state=before_state,
        after_state=after_state,
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()

    return AdminActionResponse(
        success=True,
        status="rejected",
        message="Affiliate application marked as rejected.",
    )


@router.post("/approvals/{user_id}/request-info", response_model=AdminActionResponse, dependencies=[Depends(csrf_protect)])
def request_affiliate_info(
    user_id: UUID,
    body: AdminRequestInfoRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.decide")),
    db: Session = Depends(get_db),
):
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate profile not found.")

    if not body.note or not body.note.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Information request note is required.")

    client_ip = get_client_ip(request)
    before_state = {"status": profile.status, "info_request_note": profile.info_request_note}

    profile.status = "info_requested"
    profile.info_request_note = body.note.strip()

    after_state = {"status": profile.status, "info_request_note": profile.info_request_note}

    # Write audit log row in the same transaction
    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate.info_requested",
        entity_type="affiliate_profile",
        entity_id=str(user_id),
        reason=body.note.strip(),
        before_state=before_state,
        after_state=after_state,
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()

    return AdminActionResponse(
        success=True,
        status="info_requested",
        message="Information requested from affiliate.",
    )


@router.post("/approvals/{user_id}/suspend", response_model=AdminActionResponse, dependencies=[Depends(csrf_protect)])
def suspend_affiliate(
    user_id: UUID,
    body: AdminSuspendRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.suspend")),
    db: Session = Depends(get_db),
):
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate profile not found.")

    if not body.reason or not body.reason.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Suspension reason is required.")

    client_ip = get_client_ip(request)
    before_state = {"status": profile.status, "suspension_reason": profile.suspension_reason}

    profile.status = "suspended"
    profile.suspension_reason = body.reason.strip()

    after_state = {"status": profile.status, "suspension_reason": profile.suspension_reason}

    # Write audit log row in the same transaction
    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate.suspended",
        entity_type="affiliate_profile",
        entity_id=str(user_id),
        reason=body.reason.strip(),
        before_state=before_state,
        after_state=after_state,
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()

    return AdminActionResponse(
        success=True,
        status="suspended",
        message="Affiliate account suspended successfully.",
    )


@router.post("/approvals/{user_id}/reinstate", response_model=AdminActionResponse, dependencies=[Depends(csrf_protect)])
def reinstate_affiliate(
    user_id: UUID,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.decide")),
    db: Session = Depends(get_db),
):
    """
    Restores a suspended or rejected affiliate account back to approved standing.
    Enforces server-side audit logging.
    """
    profile = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate profile not found.")

    now = datetime.now(timezone.utc)
    client_ip = get_client_ip(request)
    before_state = {
        "status": profile.status,
        "suspension_reason": profile.suspension_reason,
        "rejection_reason": profile.rejection_reason,
    }

    profile.status = "approved"
    profile.approved_by = current_user.id
    profile.approved_at = now
    profile.suspension_reason = None
    profile.rejection_reason = None

    after_state = {"status": "approved", "reinstated": True}

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate.reinstated",
        entity_type="affiliate_profile",
        entity_id=str(user_id),
        reason="Administrative reinstatement",
        before_state=before_state,
        after_state=after_state,
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()

    return AdminActionResponse(
        success=True,
        status="approved",
        message="Affiliate account reinstated successfully.",
    )


@router.get("/audit-logs", response_model=List[AuditLogItem])
def list_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    logs = (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .limit(limit)
        .all()
    )
    return [AuditLogItem.model_validate(log) for log in logs]


@router.get("/referrals", response_model=List[AdminReferralLeadResponse])
def list_admin_referrals(
    response: Response,
    status_filter: Optional[str] = Query(None, alias="status"),
    sector_filter: Optional[str] = Query(None, alias="sector"),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    """
    Returns all submitted referrals across all affiliates for admin review.
    Supports status filters, sector filters, searching, and server-side pagination with X-Total-Count header.
    """
    query = (
        db.query(ReferralLead, User, AffiliateProfile, ServiceProvider.name, ProviderService.service_name)
        .join(User, User.id == ReferralLead.affiliate_user_id)
        .outerjoin(AffiliateProfile, AffiliateProfile.user_id == ReferralLead.affiliate_user_id)
        .outerjoin(ServiceProvider, ServiceProvider.id == ReferralLead.provider_id)
        .outerjoin(ProviderService, ProviderService.id == ReferralLead.service_id)
    )

    if status_filter and status_filter != "all":
        query = query.filter(ReferralLead.status == status_filter)

    if sector_filter and sector_filter != "all":
        query = query.filter(ReferralLead.service_category == sector_filter)

    if search and search.strip():
        s = f"%{search.strip().lower()}%"
        query = query.filter(
            (func.lower(ReferralLead.client_name).like(s))
            | (func.lower(ReferralLead.client_city).like(s))
            | (func.lower(ReferralLead.context_note).like(s))
            | (func.lower(User.email).like(s))
            | (func.lower(AffiliateProfile.full_name).like(s))
            | (func.lower(ServiceProvider.name).like(s))
            | (func.lower(ProviderService.service_name).like(s))
        )

    total_count = query.count()
    response.headers["X-Total-Count"] = str(total_count)
    response.headers["Access-Control-Expose-Headers"] = "X-Total-Count"

    leads = query.order_by(ReferralLead.created_at.desc()).offset(offset).limit(limit).all()

    items = []
    for lead, user, prof, prov_name, srv_name in leads:
        updater_user = db.query(User).filter(User.id == lead.updated_by).first() if lead.updated_by else None
        items.append(
            AdminReferralLeadResponse(
                id=lead.id,
                affiliate_user_id=lead.affiliate_user_id,
                affiliate_email=user.email,
                affiliate_name=prof.full_name if prof else None,
                client_name=lead.client_name,
                client_mobile=lead.client_mobile,
                client_email=lead.client_email,
                client_city=lead.client_city,
                service_category=lead.service_category,
                context_note=lead.context_note,
                consent_confirmed=lead.consent_confirmed,
                status=lead.status,
                provider_id=lead.provider_id,
                provider_name=prov_name,
                service_id=lead.service_id,
                service_name=srv_name,
                admin_notes=lead.admin_notes,
                updated_by=lead.updated_by,
                updater_email=updater_user.email if updater_user else None,
                created_at=lead.created_at,
                updated_at=lead.updated_at,
            )
        )
    return items


@router.get("/referrals/{lead_id}", response_model=AdminReferralLeadResponse)
def get_admin_referral_detail(
    lead_id: UUID,
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    """
    Returns single referral detail for administrative review.
    """
    res = (
        db.query(ReferralLead, User, AffiliateProfile, ServiceProvider.name, ProviderService.service_name)
        .join(User, User.id == ReferralLead.affiliate_user_id)
        .outerjoin(AffiliateProfile, AffiliateProfile.user_id == ReferralLead.affiliate_user_id)
        .outerjoin(ServiceProvider, ServiceProvider.id == ReferralLead.provider_id)
        .outerjoin(ProviderService, ProviderService.id == ReferralLead.service_id)
        .filter(ReferralLead.id == lead_id)
        .first()
    )
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Referral lead not found.")

    lead, user, prof, prov_name, srv_name = res
    updater_user = db.query(User).filter(User.id == lead.updated_by).first() if lead.updated_by else None
    return AdminReferralLeadResponse(
        id=lead.id,
        affiliate_user_id=lead.affiliate_user_id,
        affiliate_email=user.email,
        affiliate_name=prof.full_name if prof else None,
        client_name=lead.client_name,
        client_mobile=lead.client_mobile,
        client_email=lead.client_email,
        client_city=lead.client_city,
        service_category=lead.service_category,
        context_note=lead.context_note,
        consent_confirmed=lead.consent_confirmed,
        status=lead.status,
        provider_id=lead.provider_id,
        provider_name=prov_name,
        service_id=lead.service_id,
        service_name=srv_name,
        admin_notes=lead.admin_notes,
        updated_by=lead.updated_by,
        updater_email=updater_user.email if updater_user else None,
        created_at=lead.created_at,
        updated_at=lead.updated_at,
    )


@router.put("/referrals/{lead_id}/status", response_model=AdminReferralLeadResponse, dependencies=[Depends(csrf_protect)])
def update_referral_status(
    lead_id: UUID,
    body: AdminReferralStatusUpdate,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    """
    Updates referral status ('pending', 'contacted', 'qualified', 'converted', 'rejected'),
    appends admin notes, and writes an audit log record.
    """
    lead = db.query(ReferralLead).filter(ReferralLead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Referral lead not found.")

    client_ip = get_client_ip(request)
    before_state = {
        "status": lead.status,
        "admin_notes": lead.admin_notes,
        "updated_by": str(lead.updated_by) if lead.updated_by else None,
    }

    lead.status = body.status
    if body.admin_notes is not None:
        lead.admin_notes = body.admin_notes.strip()
    lead.updated_by = current_user.id
    lead.updated_at = datetime.now(timezone.utc)

    after_state = {
        "status": lead.status,
        "admin_notes": lead.admin_notes,
        "updated_by": str(lead.updated_by),
    }

    # Record status change in audit log
    audit = AuditLog(
        actor_user_id=current_user.id,
        action="referral.status_updated",
        entity_type="referral_lead",
        entity_id=str(lead.id),
        reason=body.admin_notes,
        before_state=before_state,
        after_state=after_state,
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(lead)

    # Load affiliate user, profile, provider, and service
    user = db.query(User).filter(User.id == lead.affiliate_user_id).first()
    prof = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == lead.affiliate_user_id).first()
    prov_name = None
    if lead.provider_id:
        prov = db.query(ServiceProvider).filter(ServiceProvider.id == lead.provider_id).first()
        if prov:
            prov_name = prov.name
    srv_name = None
    if lead.service_id:
        srv = db.query(ProviderService).filter(ProviderService.id == lead.service_id).first()
        if srv:
            srv_name = srv.service_name

    return AdminReferralLeadResponse(
        id=lead.id,
        affiliate_user_id=lead.affiliate_user_id,
        affiliate_email=user.email if user else None,
        affiliate_name=prof.full_name if prof else None,
        client_name=lead.client_name,
        client_mobile=lead.client_mobile,
        client_email=lead.client_email,
        client_city=lead.client_city,
        service_category=lead.service_category,
        context_note=lead.context_note,
        consent_confirmed=lead.consent_confirmed,
        status=lead.status,
        provider_id=lead.provider_id,
        provider_name=prov_name,
        service_id=lead.service_id,
        service_name=srv_name,
        admin_notes=lead.admin_notes,
        updated_by=lead.updated_by,
        updater_email=current_user.email,
        created_at=lead.created_at,
        updated_at=lead.updated_at,
    )


# ==============================================================================
# PROVIDER AND SERVICE MANAGEMENT
# ==============================================================================

@router.get("/providers", response_model=List[ServiceProviderResponse])
def list_admin_providers(
    sector: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    """
    Lists all service providers (active and inactive) for admin management.
    """
    query = db.query(ServiceProvider)

    if sector and sector != "all":
        query = query.filter(ServiceProvider.sector == sector)

    if status_filter == "active":
        query = query.filter(ServiceProvider.is_active == True)
    elif status_filter == "inactive":
        query = query.filter(ServiceProvider.is_active == False)

    if search and search.strip():
        s = f"%{search.strip().lower()}%"
        query = query.filter(
            (ServiceProvider.name.ilike(s))
            | (ServiceProvider.service_title.ilike(s))
            | (ServiceProvider.city.ilike(s))
            | (ServiceProvider.description.ilike(s))
        )

    providers = query.order_by(ServiceProvider.created_at.desc()).all()
    return [ServiceProviderResponse.model_validate(p) for p in providers]


@router.post("/providers", response_model=ServiceProviderResponse, dependencies=[Depends(csrf_protect)])
def create_admin_provider(
    request: Request,
    body: ServiceProviderCreate,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    """
    Creates a new service provider record in the directory with audit logging.
    """
    client_ip = get_client_ip(request)

    provider = ServiceProvider(
        name=body.name.strip(),
        sector=body.sector,
        service_title=body.service_title.strip(),
        description=body.description.strip(),
        eligibility_criteria=body.eligibility_criteria.strip() if body.eligibility_criteria else None,
        compensation_terms=body.compensation_terms.strip(),
        city=body.city.strip(),
        area=body.area.strip() if body.area else None,
        contact_email=body.contact_email.strip().lower() if body.contact_email else None,
        contact_phone=body.contact_phone.strip() if body.contact_phone else None,
        website=body.website.strip() if body.website else None,
        is_active=body.is_active,
        is_sample=body.is_sample,
    )
    db.add(provider)
    db.flush()

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider.created",
        entity_type="service_provider",
        entity_id=str(provider.id),
        after_state={"name": provider.name, "sector": provider.sector, "city": provider.city},
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(provider)

    return ServiceProviderResponse.model_validate(provider)


@router.get("/providers/{provider_id}", response_model=ServiceProviderResponse)
def get_admin_provider(
    provider_id: UUID,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service provider not found.")
    return ServiceProviderResponse.model_validate(provider)


@router.put("/providers/{provider_id}", response_model=ServiceProviderResponse, dependencies=[Depends(csrf_protect)])
def update_admin_provider(
    provider_id: UUID,
    body: ServiceProviderUpdate,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    """
    Updates provider information with audit logging.
    """
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service provider not found.")

    client_ip = get_client_ip(request)
    before_state = {
        "name": provider.name,
        "sector": provider.sector,
        "is_active": provider.is_active,
        "city": provider.city,
    }

    if body.name is not None:
        provider.name = body.name.strip()
    if body.sector is not None:
        provider.sector = body.sector
    if body.service_title is not None:
        provider.service_title = body.service_title.strip()
    if body.description is not None:
        provider.description = body.description.strip()
    if body.eligibility_criteria is not None:
        provider.eligibility_criteria = body.eligibility_criteria.strip() if body.eligibility_criteria else None
    if body.compensation_terms is not None:
        provider.compensation_terms = body.compensation_terms.strip()
    if body.city is not None:
        provider.city = body.city.strip()
    if body.area is not None:
        provider.area = body.area.strip() if body.area else None
    if body.contact_email is not None:
        provider.contact_email = body.contact_email.strip().lower() if body.contact_email else None
    if body.contact_phone is not None:
        provider.contact_phone = body.contact_phone.strip() if body.contact_phone else None
    if body.website is not None:
        provider.website = body.website.strip() if body.website else None
    if body.is_active is not None:
        provider.is_active = body.is_active
    if body.is_sample is not None:
        provider.is_sample = body.is_sample

    provider.updated_at = datetime.now(timezone.utc)

    after_state = {
        "name": provider.name,
        "sector": provider.sector,
        "is_active": provider.is_active,
        "city": provider.city,
    }

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider.updated",
        entity_type="service_provider",
        entity_id=str(provider.id),
        before_state=before_state,
        after_state=after_state,
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(provider)

    return ServiceProviderResponse.model_validate(provider)


@router.post("/providers/{provider_id}/toggle-active", response_model=ServiceProviderResponse, dependencies=[Depends(csrf_protect)])
def toggle_provider_active(
    provider_id: UUID,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    """
    Toggles a provider's active status.
    """
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service provider not found.")

    client_ip = get_client_ip(request)
    old_status = provider.is_active
    provider.is_active = not old_status
    provider.updated_at = datetime.now(timezone.utc)

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider.status_toggled",
        entity_type="service_provider",
        entity_id=str(provider.id),
        before_state={"is_active": old_status},
        after_state={"is_active": provider.is_active},
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(provider)

    return ServiceProviderResponse.model_validate(provider)


# ==============================================================================
# PROVIDER SERVICES MANAGEMENT (ADMIN)
# ==============================================================================

@router.get("/providers/{provider_id}/services", response_model=List[ProviderServiceResponse])
def list_admin_provider_services(
    provider_id: UUID,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    """
    Returns all services configured under a specific provider (active and inactive).
    """
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service provider not found.")
    services = (
        db.query(ProviderService)
        .filter(ProviderService.provider_id == provider_id)
        .order_by(ProviderService.created_at.asc())
        .all()
    )
    return [ProviderServiceResponse.model_validate(s) for s in services]


@router.post("/providers/{provider_id}/services", response_model=ProviderServiceResponse, dependencies=[Depends(csrf_protect)])
def create_admin_provider_service(
    provider_id: UUID,
    body: ProviderServiceCreate,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    """
    Adds a new service under a provider with audit logging.
    """
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service provider not found.")

    client_ip = get_client_ip(request)
    srv = ProviderService(
        provider_id=provider_id,
        service_name=body.service_name.strip(),
        description=body.description.strip(),
        requirement_description_required=body.requirement_description_required,
        instructions=body.instructions.strip() if body.instructions else None,
        is_active=body.is_active,
    )
    db.add(srv)
    db.flush()

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider_service.created",
        entity_type="provider_service",
        entity_id=str(srv.id),
        after_state={
            "service_name": srv.service_name,
            "provider_id": str(provider_id),
            "requirement_description_required": srv.requirement_description_required,
            "is_active": srv.is_active,
        },
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(srv)
    return ProviderServiceResponse.model_validate(srv)


@router.put("/providers/{provider_id}/services/{service_id}", response_model=ProviderServiceResponse, dependencies=[Depends(csrf_protect)])
def update_admin_provider_service(
    provider_id: UUID,
    service_id: UUID,
    body: ProviderServiceUpdate,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    """
    Updates a provider service configuration with audit logging.
    """
    srv = (
        db.query(ProviderService)
        .filter(ProviderService.id == service_id, ProviderService.provider_id == provider_id)
        .first()
    )
    if not srv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider service not found.")

    client_ip = get_client_ip(request)
    before_state = {
        "service_name": srv.service_name,
        "requirement_description_required": srv.requirement_description_required,
        "is_active": srv.is_active,
    }

    if body.service_name is not None:
        srv.service_name = body.service_name.strip()
    if body.description is not None:
        srv.description = body.description.strip()
    if body.requirement_description_required is not None:
        srv.requirement_description_required = body.requirement_description_required
    if body.instructions is not None:
        srv.instructions = body.instructions.strip() if body.instructions else None
    if body.is_active is not None:
        srv.is_active = body.is_active

    srv.updated_at = datetime.now(timezone.utc)

    after_state = {
        "service_name": srv.service_name,
        "requirement_description_required": srv.requirement_description_required,
        "is_active": srv.is_active,
    }

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider_service.updated",
        entity_type="provider_service",
        entity_id=str(srv.id),
        before_state=before_state,
        after_state=after_state,
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(srv)
    return ProviderServiceResponse.model_validate(srv)


@router.post("/providers/{provider_id}/services/{service_id}/toggle-active", response_model=ProviderServiceResponse, dependencies=[Depends(csrf_protect)])
def toggle_admin_provider_service_active(
    provider_id: UUID,
    service_id: UUID,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    """
    Toggles a provider service's active status.
    """
    srv = (
        db.query(ProviderService)
        .filter(ProviderService.id == service_id, ProviderService.provider_id == provider_id)
        .first()
    )
    if not srv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider service not found.")

    client_ip = get_client_ip(request)
    old_status = srv.is_active
    srv.is_active = not old_status
    srv.updated_at = datetime.now(timezone.utc)

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider_service.status_toggled",
        entity_type="provider_service",
        entity_id=str(srv.id),
        before_state={"is_active": old_status},
        after_state={"is_active": srv.is_active},
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(srv)
    return ProviderServiceResponse.model_validate(srv)


@router.delete("/providers/{provider_id}/services/{service_id}", response_model=MessageResponse, dependencies=[Depends(csrf_protect)])
def delete_admin_provider_service(
    provider_id: UUID,
    service_id: UUID,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    """
    Deletes a service from a provider with audit logging.
    """
    srv = (
        db.query(ProviderService)
        .filter(ProviderService.id == service_id, ProviderService.provider_id == provider_id)
        .first()
    )
    if not srv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider service not found.")

    client_ip = get_client_ip(request)
    service_name = srv.service_name
    db.delete(srv)

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider_service.deleted",
        entity_type="provider_service",
        entity_id=str(service_id),
        before_state={"service_name": service_name, "provider_id": str(provider_id)},
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    return MessageResponse(message="Service deleted successfully.")

