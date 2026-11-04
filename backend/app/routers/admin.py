import csv
import io
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from sqlalchemy import func, or_, and_, desc
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_permission, require_admin, AuthenticatedUser, csrf_protect
from app.models import (
    AffiliateProfile, User, AuditLog, ReferralLead, ServiceProvider, ProviderService,
    ProviderCommissionAgreement, CommissionLedger, ProviderInvoice, ProviderInvoiceItem,
    ProviderPayment, AffiliateInvoice, AffiliateInvoiceItem
)
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
    AdminRecordConversionRequest,
    CommissionAgreementCreate,
    CommissionAgreementUpdate,
    CommissionAgreementResponse,
    CommissionLedgerItemResponse,
    ProviderInvoiceCreate,
    ProviderInvoiceResponse,
    ProviderInvoiceItemResponse,
    ProviderPaymentResponse,
    RecordProviderPaymentRequest,
    CancelInvoiceRequest,
    AffiliateInvoiceResponse,
    AffiliateInvoiceItemResponse,
    RecordAffiliatePayoutRequest,
    ApproveAffiliateInvoiceRequest,
    RejectAffiliateInvoiceRequest,
    AdminFinancialSummaryResponse,
    AdminAffiliateListItem,
    AdminAffiliateListResponse,
    AdminAffiliateDetailResponse,
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


def parse_date_range(period: Optional[str] = None, start_date: Optional[str] = None, end_date: Optional[str] = None):
    now = datetime.now(timezone.utc)
    if period == "this_month":
        start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
        return start, now
    elif period == "previous_month":
        first_this_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
        last_prev_month = first_this_month - timedelta(days=1)
        start = datetime(last_prev_month.year, last_prev_month.month, 1, tzinfo=timezone.utc)
        end = datetime(last_prev_month.year, last_prev_month.month, last_prev_month.day, 23, 59, 59, tzinfo=timezone.utc)
        return start, end
    elif period == "last_3_months":
        start = now - timedelta(days=90)
        return start, now
    elif start_date and end_date:
        try:
            start = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
            end = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
            return start, end
        except Exception:
            return None, None
    return None, None


@router.get("/summary", response_model=AdminSummaryResponse)
def get_admin_summary(
    period: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    dt_start, dt_end = parse_date_range(period, start_date, end_date)

    pending_count = db.query(AffiliateProfile).filter(AffiliateProfile.status == "pending").count()
    info_count = db.query(AffiliateProfile).filter(AffiliateProfile.status == "info_requested").count()
    approved_count = db.query(AffiliateProfile).filter(AffiliateProfile.status == "approved").count()
    suspended_count = db.query(AffiliateProfile).filter(AffiliateProfile.status == "suspended").count()
    rejected_count = db.query(AffiliateProfile).filter(AffiliateProfile.status == "rejected").count()
    total_count = db.query(AffiliateProfile).count()

    verified_affiliates = (
        db.query(User)
        .join(AffiliateProfile, AffiliateProfile.user_id == User.id)
        .filter(User.email_verified_at.isnot(None))
        .count()
    )
    unverified_affiliates = total_count - verified_affiliates

    user_reg_q = db.query(AffiliateProfile)
    if dt_start:
        user_reg_q = user_reg_q.filter(AffiliateProfile.created_at >= dt_start)
    if dt_end:
        user_reg_q = user_reg_q.filter(AffiliateProfile.created_at <= dt_end)
    new_registrations_period = user_reg_q.count()

    leads_q = db.query(ReferralLead)
    if dt_start:
        leads_q = leads_q.filter(ReferralLead.created_at >= dt_start)
    if dt_end:
        leads_q = leads_q.filter(ReferralLead.created_at <= dt_end)

    total_referrals = leads_q.count()
    pending_referrals = leads_q.filter(ReferralLead.status == "pending").count()
    contacted_referrals = leads_q.filter(ReferralLead.status == "contacted").count()
    qualified_referrals = leads_q.filter(ReferralLead.status == "qualified").count()
    converted_referrals = leads_q.filter(ReferralLead.status == "converted").count()
    rejected_referrals = leads_q.filter(ReferralLead.status == "rejected").count()

    conversion_rate = round((converted_referrals / total_referrals * 100.0), 1) if total_referrals > 0 else 0.0

    total_providers = db.query(ServiceProvider).count()
    active_providers = db.query(ServiceProvider).filter(ServiceProvider.is_active == True).count()
    inactive_providers = total_providers - active_providers
    active_services_count = db.query(ProviderService).filter(ProviderService.is_active == True).count()

    # Financial metrics calculated from real ledger and invoices
    prov_comm_sum = (
        db.query(func.coalesce(func.sum(CommissionLedger.provider_commission_amount), 0.0))
        .filter(CommissionLedger.status.notin_(["disputed", "reversed"]))
        .scalar()
    )
    aff_payable_sum = (
        db.query(func.coalesce(func.sum(CommissionLedger.affiliate_commission_amount), 0.0))
        .filter(CommissionLedger.status.in_(["eligible", "invoiced_by_affiliate"]))
        .scalar()
    )
    sbloom_retained_sum = (
        db.query(func.coalesce(func.sum(CommissionLedger.sbloom_retained_amount), 0.0))
        .filter(CommissionLedger.status.notin_(["disputed", "reversed"]))
        .scalar()
    )
    prov_invoiced_sum = (
        db.query(func.coalesce(func.sum(ProviderInvoice.subtotal_amount), 0.0))
        .filter(ProviderInvoice.status != "cancelled")
        .scalar()
    )
    prov_collected_sum = (
        db.query(func.coalesce(func.sum(ProviderInvoice.amount_paid), 0.0))
        .filter(ProviderInvoice.status != "cancelled")
        .scalar()
    )
    aff_invoiced_sum = (
        db.query(func.coalesce(func.sum(AffiliateInvoice.total_payable), 0.0))
        .filter(AffiliateInvoice.status.in_(["submitted", "verified", "approved", "paid"]))
        .scalar()
    )
    aff_paid_sum = (
        db.query(func.coalesce(func.sum(AffiliateInvoice.total_payable), 0.0))
        .filter(AffiliateInvoice.status == "paid")
        .scalar()
    )
    outstanding_receivables = max(0.0, float(prov_invoiced_sum) - float(prov_collected_sum))
    outstanding_payables = max(0.0, float(aff_payable_sum))

    return AdminSummaryResponse(
        pending=pending_count,
        info_requested=info_count,
        approved=approved_count,
        total=total_count,
        total_registered_affiliates=total_count,
        verified_affiliates=verified_affiliates,
        unverified_affiliates=unverified_affiliates,
        active_affiliates=approved_count,
        suspended_affiliates=suspended_count,
        rejected_affiliates=rejected_count,
        new_registrations_period=new_registrations_period,
        total_referrals=total_referrals,
        pending_referrals=pending_referrals,
        contacted_referrals=contacted_referrals,
        qualified_referrals=qualified_referrals,
        converted_referrals=converted_referrals,
        rejected_referrals=rejected_referrals,
        conversion_rate=conversion_rate,
        total_providers=total_providers,
        active_providers=active_providers,
        inactive_providers=inactive_providers,
        active_services_count=active_services_count,
        provider_commission_eligible=round(float(prov_comm_sum), 2),
        affiliate_commission_payable=round(float(aff_payable_sum), 2),
        sbloom_retained_commission=round(float(sbloom_retained_sum), 2),
        provider_invoiced=round(float(prov_invoiced_sum), 2),
        provider_collected=round(float(prov_collected_sum), 2),
        affiliate_invoiced=round(float(aff_invoiced_sum), 2),
        affiliate_paid=round(float(aff_paid_sum), 2),
        outstanding_receivables=round(outstanding_receivables, 2),
        outstanding_payables=round(outstanding_payables, 2),
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



# ==============================================================================
# INVOICE NUMBER GENERATION HELPERS
# ==============================================================================

def generate_provider_invoice_number(db: Session) -> str:
    now = datetime.now(timezone.utc)
    prefix = f"INV-PRV-{now.strftime('%Y%m')}-"
    last_inv = db.query(ProviderInvoice).filter(ProviderInvoice.invoice_number.like(f"{prefix}%")).order_by(ProviderInvoice.invoice_number.desc()).first()
    if last_inv:
        try:
            seq = int(last_inv.invoice_number.split("-")[-1]) + 1
        except Exception:
            seq = 1
    else:
        seq = 1
    return f"{prefix}{seq:04d}"


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


# ==============================================================================
# LEAD CONVERSION & COMMISSION LEDGER CREATION
# ==============================================================================

@router.post("/referrals/{lead_id}/conversion", response_model=AdminReferralLeadResponse, dependencies=[Depends(csrf_protect)])
def record_lead_conversion(
    lead_id: UUID,
    body: AdminRecordConversionRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    lead = db.query(ReferralLead).filter(ReferralLead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Referral lead not found.")

    client_ip = get_client_ip(request)
    now = datetime.now(timezone.utc)
    conv_date = body.conversion_date or now

    before_state = {
        "status": lead.status,
        "conversion_value": float(lead.conversion_value) if lead.conversion_value else None,
        "conversion_reference": lead.conversion_reference,
        "is_eligible_for_commission": lead.is_eligible_for_commission,
    }

    lead.status = "converted"
    lead.conversion_date = conv_date
    lead.conversion_value = body.conversion_value
    lead.conversion_reference = body.conversion_reference.strip() if body.conversion_reference else None
    lead.is_eligible_for_commission = body.is_eligible_for_commission
    if body.admin_notes:
        lead.admin_notes = body.admin_notes.strip()
    lead.updated_by = current_user.id
    lead.updated_at = now

    commission_details = None
    if body.is_eligible_for_commission and lead.provider_id:
        agreement = None
        if body.agreement_id:
            agreement = db.query(ProviderCommissionAgreement).filter(ProviderCommissionAgreement.id == body.agreement_id).first()
        if not agreement and lead.service_id:
            agreement = (
                db.query(ProviderCommissionAgreement)
                .filter(
                    ProviderCommissionAgreement.provider_id == lead.provider_id,
                    ProviderCommissionAgreement.service_id == lead.service_id,
                    ProviderCommissionAgreement.status == "active",
                )
                .first()
            )
        if not agreement:
            agreement = (
                db.query(ProviderCommissionAgreement)
                .filter(
                    ProviderCommissionAgreement.provider_id == lead.provider_id,
                    ProviderCommissionAgreement.service_id.is_(None),
                    ProviderCommissionAgreement.status == "active",
                )
                .first()
            )

        conv_val = float(body.conversion_value)
        if agreement and agreement.agreement_type == "percentage":
            prov_rate = float(agreement.provider_rate or 40.0)
            aff_rate = float(agreement.affiliate_rate or 20.0)
            sbloom_rate = float(agreement.sbloom_share_rate or 20.0)
            prov_amount = round(conv_val * (prov_rate / 100.0), 2)
            aff_amount = round(conv_val * (aff_rate / 100.0), 2)
            sbloom_amount = round(conv_val * (sbloom_rate / 100.0), 2)
        elif agreement and agreement.agreement_type == "fixed":
            prov_rate = None
            aff_rate = None
            sbloom_rate = None
            prov_amount = float(agreement.provider_fixed_amount or 0.0)
            aff_amount = float(agreement.affiliate_fixed_amount or 0.0)
            sbloom_amount = float(agreement.sbloom_fixed_amount or 0.0)
        else:
            prov_rate = 40.0
            aff_rate = 20.0
            sbloom_rate = 20.0
            prov_amount = round(conv_val * 0.40, 2)
            aff_amount = round(conv_val * 0.20, 2)
            sbloom_amount = round(conv_val * 0.20, 2)

        ledger_item = db.query(CommissionLedger).filter(CommissionLedger.referral_id == lead.id).first()
        if not ledger_item:
            ledger_item = CommissionLedger(
                referral_id=lead.id,
                affiliate_user_id=lead.affiliate_user_id,
                provider_id=lead.provider_id,
                service_id=lead.service_id,
                agreement_id=agreement.id if agreement else None,
                eligible_transaction_value=conv_val,
                provider_commission_rate=prov_rate,
                affiliate_commission_rate=aff_rate,
                sbloom_share_rate=sbloom_rate,
                provider_commission_amount=prov_amount,
                affiliate_commission_amount=aff_amount,
                sbloom_retained_amount=sbloom_amount,
                currency="INR",
                status="eligible",
                verified_at=now,
                notes=f"Verified conversion ref: {lead.conversion_reference or 'N/A'}",
            )
            db.add(ledger_item)
        else:
            ledger_item.eligible_transaction_value = conv_val
            ledger_item.provider_commission_rate = prov_rate
            ledger_item.affiliate_commission_rate = aff_rate
            ledger_item.sbloom_share_rate = sbloom_rate
            ledger_item.provider_commission_amount = prov_amount
            ledger_item.affiliate_commission_amount = aff_amount
            ledger_item.sbloom_retained_amount = sbloom_amount
            ledger_item.verified_at = now

        commission_details = {
            "provider_commission_amount": prov_amount,
            "affiliate_commission_amount": aff_amount,
            "sbloom_retained_amount": sbloom_amount,
            "affiliate_rate": aff_rate,
        }

    after_state = {
        "status": lead.status,
        "conversion_value": float(lead.conversion_value),
        "conversion_reference": lead.conversion_reference,
        "is_eligible_for_commission": lead.is_eligible_for_commission,
    }

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="referral.converted",
        entity_type="referral_lead",
        entity_id=str(lead.id),
        reason=f"Conversion verified: {lead.conversion_value:,.2f}",
        before_state=before_state,
        after_state=after_state,
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(lead)

    user = db.query(User).filter(User.id == lead.affiliate_user_id).first()
    prof = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == lead.affiliate_user_id).first()
    prov_name = None
    if lead.provider_id:
        p = db.query(ServiceProvider).filter(ServiceProvider.id == lead.provider_id).first()
        if p:
            prov_name = p.name
    srv_name = None
    if lead.service_id:
        s = db.query(ProviderService).filter(ProviderService.id == lead.service_id).first()
        if s:
            srv_name = s.service_name

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
        conversion_date=lead.conversion_date,
        conversion_value=float(lead.conversion_value) if lead.conversion_value else None,
        conversion_reference=lead.conversion_reference,
        is_eligible_for_commission=lead.is_eligible_for_commission,
        commission_details=commission_details,
        updated_by=lead.updated_by,
        updater_email=current_user.email,
        created_at=lead.created_at,
        updated_at=lead.updated_at,
    )


@router.get("/referrals/export/csv")
def export_referrals_csv(
    status_filter: Optional[str] = Query(None, alias="status"),
    sector_filter: Optional[str] = Query(None, alias="sector"),
    search: Optional[str] = Query(None),
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
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
            | (func.lower(User.email).like(s))
            | (func.lower(ServiceProvider.name).like(s))
        )
    leads = query.order_by(ReferralLead.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Lead ID", "Date Submitted", "Affiliate Email", "Affiliate Name",
        "Client Name", "Client Mobile", "Client City", "Sector",
        "Provider", "Service", "Status", "Conversion Date",
        "Conversion Value (INR)", "Conversion Ref", "Eligible for Comm"
    ])
    for lead, user, prof, prov_name, srv_name in leads:
        writer.writerow([
            str(lead.id),
            lead.created_at.strftime("%Y-%m-%d %H:%M"),
            user.email,
            prof.full_name if prof else "",
            lead.client_name,
            lead.client_mobile,
            lead.client_city,
            lead.service_category,
            prov_name or "",
            srv_name or "",
            lead.status,
            lead.conversion_date.strftime("%Y-%m-%d") if lead.conversion_date else "",
            f"{float(lead.conversion_value):.2f}" if lead.conversion_value else "",
            lead.conversion_reference or "",
            "Yes" if lead.is_eligible_for_commission else "No",
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=sbloom_referrals_{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"}
    )


# ==============================================================================
# AFFILIATE DIRECTORY & DETAIL ENDPOINTS
# ==============================================================================

@router.get("/affiliates", response_model=AdminAffiliateListResponse)
def list_admin_affiliates(
    response: Response,
    search: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    verified: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    query = (
        db.query(User, AffiliateProfile)
        .join(AffiliateProfile, AffiliateProfile.user_id == User.id)
    )

    if status_filter and status_filter != "all":
        query = query.filter(AffiliateProfile.status == status_filter)

    if city and city.strip():
        query = query.filter(func.lower(AffiliateProfile.city).like(f"%{city.strip().lower()}%"))

    if verified == "true":
        query = query.filter(User.email_verified_at.isnot(None))
    elif verified == "false":
        query = query.filter(User.email_verified_at.is_(None))

    if search and search.strip():
        s = f"%{search.strip().lower()}%"
        query = query.filter(
            (func.lower(User.email).like(s))
            | (func.lower(AffiliateProfile.full_name).like(s))
            | (func.lower(AffiliateProfile.city).like(s))
            | (func.lower(AffiliateProfile.mobile_number).like(s))
        )

    total = query.count()
    response.headers["X-Total-Count"] = str(total)
    response.headers["Access-Control-Expose-Headers"] = "X-Total-Count"

    users = query.order_by(AffiliateProfile.created_at.desc()).offset(offset).limit(limit).all()

    items = []
    for user, prof in users:
        tot_refs = db.query(ReferralLead).filter(ReferralLead.affiliate_user_id == user.id).count()
        conv_refs = db.query(ReferralLead).filter(ReferralLead.affiliate_user_id == user.id, ReferralLead.status == "converted").count()
        
        # Financial ledger calculations
        elig_comm = (
            db.query(func.coalesce(func.sum(CommissionLedger.affiliate_commission_amount), 0.0))
            .filter(CommissionLedger.affiliate_user_id == user.id, CommissionLedger.status.in_(["eligible", "invoiced_by_affiliate", "paid_to_affiliate"]))
            .scalar()
        )
        paid_comm = (
            db.query(func.coalesce(func.sum(AffiliateInvoice.total_payable), 0.0))
            .filter(AffiliateInvoice.affiliate_user_id == user.id, AffiliateInvoice.status == "paid")
            .scalar()
        )
        outstanding = max(0.0, float(elig_comm) - float(paid_comm))

        items.append(
            AdminAffiliateListItem(
                id=user.id,
                full_name=prof.full_name or "Anonymous Affiliate",
                email=user.email,
                mobile=prof.mobile_number,
                city=prof.city,
                area=prof.area,
                status=prof.status,
                email_verified=user.email_verified_at is not None,
                registered_at=prof.created_at,
                total_referrals=tot_refs,
                converted_referrals=conv_refs,
                eligible_commission=round(float(elig_comm), 2),
                outstanding_payment=round(outstanding, 2),
            )
        )

    return AdminAffiliateListResponse(items=items, total=total, limit=limit, offset=offset)


@router.get("/affiliates/export/csv")
def export_affiliates_csv(
    status_filter: Optional[str] = Query(None, alias="status"),
    city: Optional[str] = Query(None),
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    query = (
        db.query(User, AffiliateProfile)
        .join(AffiliateProfile, AffiliateProfile.user_id == User.id)
    )
    if status_filter and status_filter != "all":
        query = query.filter(AffiliateProfile.status == status_filter)
    if city and city.strip():
        query = query.filter(func.lower(AffiliateProfile.city).like(f"%{city.strip().lower()}%"))

    users = query.order_by(AffiliateProfile.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "User ID", "Full Name", "Email", "Mobile", "City", "Area",
        "Occupation", "Status", "Email Verified", "Registered Date",
        "Total Referrals", "Converted Referrals", "Eligible Commission (INR)"
    ])
    for user, prof in users:
        tot_refs = db.query(ReferralLead).filter(ReferralLead.affiliate_user_id == user.id).count()
        conv_refs = db.query(ReferralLead).filter(ReferralLead.affiliate_user_id == user.id, ReferralLead.status == "converted").count()
        elig_comm = (
            db.query(func.coalesce(func.sum(CommissionLedger.affiliate_commission_amount), 0.0))
            .filter(CommissionLedger.affiliate_user_id == user.id, CommissionLedger.status.in_(["eligible", "invoiced_by_affiliate", "paid_to_affiliate"]))
            .scalar()
        )
        writer.writerow([
            str(user.id),
            prof.full_name or "",
            user.email,
            prof.mobile_number or "",
            prof.city or "",
            prof.area or "",
            prof.occupation or "",
            prof.status,
            "Yes" if user.email_verified_at else "No",
            prof.created_at.strftime("%Y-%m-%d %H:%M"),
            tot_refs,
            conv_refs,
            f"{float(elig_comm):.2f}",
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=sbloom_affiliates_{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"}
    )


@router.get("/affiliates/{user_id}", response_model=AdminAffiliateDetailResponse)
def get_admin_affiliate_detail(
    user_id: UUID,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    prof = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == user_id).first()
    if not prof:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Affiliate profile not found.")

    leads = (
        db.query(ReferralLead, ServiceProvider.name, ProviderService.service_name)
        .outerjoin(ServiceProvider, ServiceProvider.id == ReferralLead.provider_id)
        .outerjoin(ProviderService, ProviderService.id == ReferralLead.service_id)
        .filter(ReferralLead.affiliate_user_id == user_id)
        .order_by(ReferralLead.created_at.desc())
        .all()
    )

    tot_refs = len(leads)
    conv_refs = sum(1 for l, _, _ in leads if l.status == "converted")

    # Financial ledger items
    ledger_items = (
        db.query(CommissionLedger, ServiceProvider.name, ProviderService.service_name, ReferralLead.client_name)
        .outerjoin(ServiceProvider, ServiceProvider.id == CommissionLedger.provider_id)
        .outerjoin(ProviderService, ProviderService.id == CommissionLedger.service_id)
        .outerjoin(ReferralLead, ReferralLead.id == CommissionLedger.referral_id)
        .filter(CommissionLedger.affiliate_user_id == user_id)
        .order_by(CommissionLedger.created_at.desc())
        .all()
    )

    ledger_resp = []
    elig_comm = 0.0
    for item, p_name, s_name, c_name in ledger_items:
        if item.status in ["eligible", "invoiced_by_affiliate", "paid_to_affiliate"]:
            elig_comm += float(item.affiliate_commission_amount)
        ledger_resp.append(
            CommissionLedgerItemResponse(
                id=item.id,
                referral_id=item.referral_id,
                affiliate_user_id=item.affiliate_user_id,
                affiliate_name=prof.full_name,
                affiliate_email=user.email,
                provider_id=item.provider_id,
                provider_name=p_name,
                service_id=item.service_id,
                service_name=s_name,
                customer_name=c_name,
                eligible_transaction_value=float(item.eligible_transaction_value),
                provider_commission_rate=float(item.provider_commission_rate) if item.provider_commission_rate else None,
                affiliate_commission_rate=float(item.affiliate_commission_rate) if item.affiliate_commission_rate else None,
                sbloom_share_rate=float(item.sbloom_share_rate) if item.sbloom_share_rate else None,
                provider_commission_amount=float(item.provider_commission_amount),
                affiliate_commission_amount=float(item.affiliate_commission_amount),
                sbloom_retained_amount=float(item.sbloom_retained_amount),
                currency=item.currency,
                status=item.status,
                provider_invoice_id=item.provider_invoice_id,
                affiliate_invoice_id=item.affiliate_invoice_id,
                verified_at=item.verified_at,
                notes=item.notes,
                created_at=item.created_at,
            )
        )

    # Invoices history
    invoices = (
        db.query(AffiliateInvoice)
        .filter(AffiliateInvoice.affiliate_user_id == user_id)
        .order_by(AffiliateInvoice.created_at.desc())
        .all()
    )
    invoices_resp = [AffiliateInvoiceResponse.model_validate(inv) for inv in invoices]

    paid_comm = sum(float(inv.total_payable) for inv in invoices if inv.status == "paid")
    outstanding = max(0.0, elig_comm - paid_comm)

    # Referral history dicts
    ref_history = []
    for l, p_name, s_name in leads:
        ref_history.append({
            "id": str(l.id),
            "client_name": l.client_name,
            "client_city": l.client_city,
            "provider_name": p_name,
            "service_name": s_name,
            "status": l.status,
            "created_at": l.created_at.isoformat(),
            "conversion_date": l.conversion_date.isoformat() if l.conversion_date else None,
            "conversion_value": float(l.conversion_value) if l.conversion_value else None,
        })

    # Provider breakdown
    prov_counts = {}
    for l, p_name, _ in leads:
        name = p_name or "Unknown Provider"
        if name not in prov_counts:
            prov_counts[name] = {"provider_name": name, "referrals": 0, "converted": 0}
        prov_counts[name]["referrals"] += 1
        if l.status == "converted":
            prov_counts[name]["converted"] += 1

    # Audit events
    audit_events = (
        db.query(AuditLog)
        .filter(AuditLog.entity_id == str(user_id))
        .order_by(AuditLog.created_at.desc())
        .limit(30)
        .all()
    )
    audit_resp = [AuditLogItem.model_validate(a) for a in audit_events]

    return AdminAffiliateDetailResponse(
        user_id=user.id,
        full_name=prof.full_name or "Anonymous Affiliate",
        email=user.email,
        mobile=prof.mobile_number,
        city=prof.city,
        area=prof.area,
        occupation=prof.occupation,
        promotion_plan=prof.promotion_plan,
        status=prof.status,
        email_verified=user.email_verified_at is not None,
        registered_at=prof.created_at,
        bank_name=prof.bank_name,
        bank_account_number=prof.bank_account_number,
        bank_ifsc=prof.bank_ifsc,
        upi_id=prof.upi_id,
        pan_number=prof.pan_number,
        total_referrals=tot_refs,
        converted_referrals=conv_refs,
        eligible_commission=round(elig_comm, 2),
        outstanding_payment=round(outstanding, 2),
        referral_history=ref_history,
        provider_performance=list(prov_counts.values()),
        commission_ledger=ledger_resp,
        invoice_history=invoices_resp,
        audit_events=audit_resp,
    )


# ==============================================================================
# COMMISSION AGREEMENTS ENDPOINTS
# ==============================================================================

@router.get("/agreements", response_model=List[CommissionAgreementResponse])
def list_agreements(
    provider_id: Optional[UUID] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    query = (
        db.query(ProviderCommissionAgreement, ServiceProvider.name, ProviderService.service_name)
        .join(ServiceProvider, ServiceProvider.id == ProviderCommissionAgreement.provider_id)
        .outerjoin(ProviderService, ProviderService.id == ProviderCommissionAgreement.service_id)
    )

    if provider_id:
        query = query.filter(ProviderCommissionAgreement.provider_id == provider_id)
    if status_filter and status_filter != "all":
        query = query.filter(ProviderCommissionAgreement.status == status_filter)

    results = query.order_by(ProviderCommissionAgreement.created_at.desc()).all()

    items = []
    for agr, prov_name, srv_name in results:
        resp = CommissionAgreementResponse.model_validate(agr)
        resp.provider_name = prov_name
        resp.service_name = srv_name
        items.append(resp)
    return items


@router.post("/agreements", response_model=CommissionAgreementResponse, dependencies=[Depends(csrf_protect)])
def create_agreement(
    body: CommissionAgreementCreate,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    # Split validation
    if body.agreement_type == "percentage":
        if body.provider_rate is None or body.affiliate_rate is None or body.sbloom_share_rate is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provider rate, affiliate rate, and sBLOOM share rate are required for percentage agreements.")
        total_split = round(body.affiliate_rate + body.sbloom_share_rate, 2)
        if round(body.provider_rate, 2) != total_split:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Split mismatch: Affiliate rate ({body.affiliate_rate}%) + sBLOOM share ({body.sbloom_share_rate}%) must equal Provider rate ({body.provider_rate}%)."
            )

    client_ip = get_client_ip(request)
    now = datetime.now(timezone.utc)

    agr = ProviderCommissionAgreement(
        provider_id=body.provider_id,
        service_id=body.service_id,
        agreement_type=body.agreement_type,
        provider_rate=body.provider_rate,
        affiliate_rate=body.affiliate_rate,
        sbloom_share_rate=body.sbloom_share_rate,
        provider_fixed_amount=body.provider_fixed_amount,
        affiliate_fixed_amount=body.affiliate_fixed_amount,
        sbloom_fixed_amount=body.sbloom_fixed_amount,
        calculation_basis=body.calculation_basis,
        eligibility_trigger=body.eligibility_trigger,
        effective_date=body.effective_date or now,
        expiry_date=body.expiry_date,
        status=body.status,
        notes=body.notes.strip() if body.notes else None,
    )
    db.add(agr)
    db.flush()

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="commission_agreement.created",
        entity_type="provider_commission_agreement",
        entity_id=str(agr.id),
        after_state={"provider_id": str(agr.provider_id), "status": agr.status, "type": agr.agreement_type},
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(agr)

    prov = db.query(ServiceProvider).filter(ServiceProvider.id == agr.provider_id).first()
    srv = db.query(ProviderService).filter(ProviderService.id == agr.service_id).first() if agr.service_id else None

    resp = CommissionAgreementResponse.model_validate(agr)
    resp.provider_name = prov.name if prov else None
    resp.service_name = srv.service_name if srv else None
    return resp


@router.put("/agreements/{agreement_id}", response_model=CommissionAgreementResponse, dependencies=[Depends(csrf_protect)])
def update_agreement(
    agreement_id: UUID,
    body: CommissionAgreementUpdate,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    agr = db.query(ProviderCommissionAgreement).filter(ProviderCommissionAgreement.id == agreement_id).first()
    if not agr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agreement not found.")

    client_ip = get_client_ip(request)
    before_state = {"status": agr.status, "provider_rate": float(agr.provider_rate) if agr.provider_rate else None}

    if body.service_id is not None:
        agr.service_id = body.service_id
    if body.agreement_type is not None:
        agr.agreement_type = body.agreement_type
    if body.provider_rate is not None:
        agr.provider_rate = body.provider_rate
    if body.affiliate_rate is not None:
        agr.affiliate_rate = body.affiliate_rate
    if body.sbloom_share_rate is not None:
        agr.sbloom_share_rate = body.sbloom_share_rate
    if body.provider_fixed_amount is not None:
        agr.provider_fixed_amount = body.provider_fixed_amount
    if body.affiliate_fixed_amount is not None:
        agr.affiliate_fixed_amount = body.affiliate_fixed_amount
    if body.sbloom_fixed_amount is not None:
        agr.sbloom_fixed_amount = body.sbloom_fixed_amount
    if body.calculation_basis is not None:
        agr.calculation_basis = body.calculation_basis
    if body.eligibility_trigger is not None:
        agr.eligibility_trigger = body.eligibility_trigger
    if body.effective_date is not None:
        agr.effective_date = body.effective_date
    if body.expiry_date is not None:
        agr.expiry_date = body.expiry_date
    if body.status is not None:
        agr.status = body.status
    if body.notes is not None:
        agr.notes = body.notes.strip() if body.notes else None

    agr.updated_at = datetime.now(timezone.utc)

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="commission_agreement.updated",
        entity_type="provider_commission_agreement",
        entity_id=str(agr.id),
        before_state=before_state,
        after_state={"status": agr.status, "provider_rate": float(agr.provider_rate) if agr.provider_rate else None},
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(agr)

    prov = db.query(ServiceProvider).filter(ServiceProvider.id == agr.provider_id).first()
    srv = db.query(ProviderService).filter(ProviderService.id == agr.service_id).first() if agr.service_id else None

    resp = CommissionAgreementResponse.model_validate(agr)
    resp.provider_name = prov.name if prov else None
    resp.service_name = srv.service_name if srv else None
    return resp


@router.post("/agreements/{agreement_id}/status", response_model=CommissionAgreementResponse, dependencies=[Depends(csrf_protect)])
def update_agreement_status(
    agreement_id: UUID,
    status: str = Query(..., pattern="^(active|draft|superseded|expired)$"),
    request: Request = None,
    current_user: AuthenticatedUser = Depends(require_permission("catalog.manage")),
    db: Session = Depends(get_db),
):
    agr = db.query(ProviderCommissionAgreement).filter(ProviderCommissionAgreement.id == agreement_id).first()
    if not agr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agreement not found.")

    agr.status = status
    agr.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(agr)

    prov = db.query(ServiceProvider).filter(ServiceProvider.id == agr.provider_id).first()
    srv = db.query(ProviderService).filter(ProviderService.id == agr.service_id).first() if agr.service_id else None

    resp = CommissionAgreementResponse.model_validate(agr)
    resp.provider_name = prov.name if prov else None
    resp.service_name = srv.service_name if srv else None
    return resp


# ==============================================================================
# COMMISSION LEDGER ENDPOINTS
# ==============================================================================

@router.get("/ledger", response_model=List[CommissionLedgerItemResponse])
def list_commission_ledger(
    provider_id: Optional[UUID] = Query(None),
    affiliate_user_id: Optional[UUID] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    query = (
        db.query(CommissionLedger, ServiceProvider.name, ProviderService.service_name, User.email, AffiliateProfile.full_name, ReferralLead.client_name)
        .join(ServiceProvider, ServiceProvider.id == CommissionLedger.provider_id)
        .outerjoin(ProviderService, ProviderService.id == CommissionLedger.service_id)
        .join(User, User.id == CommissionLedger.affiliate_user_id)
        .outerjoin(AffiliateProfile, AffiliateProfile.user_id == CommissionLedger.affiliate_user_id)
        .outerjoin(ReferralLead, ReferralLead.id == CommissionLedger.referral_id)
    )

    if provider_id:
        query = query.filter(CommissionLedger.provider_id == provider_id)
    if affiliate_user_id:
        query = query.filter(CommissionLedger.affiliate_user_id == affiliate_user_id)
    if status_filter and status_filter != "all":
        query = query.filter(CommissionLedger.status == status_filter)

    results = query.order_by(CommissionLedger.created_at.desc()).all()

    items = []
    for item, prov_name, srv_name, aff_email, aff_name, client_name in results:
        items.append(
            CommissionLedgerItemResponse(
                id=item.id,
                referral_id=item.referral_id,
                affiliate_user_id=item.affiliate_user_id,
                affiliate_name=aff_name,
                affiliate_email=aff_email,
                provider_id=item.provider_id,
                provider_name=prov_name,
                service_id=item.service_id,
                service_name=srv_name,
                customer_name=client_name,
                eligible_transaction_value=float(item.eligible_transaction_value),
                provider_commission_rate=float(item.provider_commission_rate) if item.provider_commission_rate else None,
                affiliate_commission_rate=float(item.affiliate_commission_rate) if item.affiliate_commission_rate else None,
                sbloom_share_rate=float(item.sbloom_share_rate) if item.sbloom_share_rate else None,
                provider_commission_amount=float(item.provider_commission_amount),
                affiliate_commission_amount=float(item.affiliate_commission_amount),
                sbloom_retained_amount=float(item.sbloom_retained_amount),
                currency=item.currency,
                status=item.status,
                provider_invoice_id=item.provider_invoice_id,
                affiliate_invoice_id=item.affiliate_invoice_id,
                verified_at=item.verified_at,
                notes=item.notes,
                created_at=item.created_at,
            )
        )
    return items


@router.get("/ledger/export/csv")
def export_commission_ledger_csv(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    query = (
        db.query(CommissionLedger, ServiceProvider.name, ProviderService.service_name, User.email, AffiliateProfile.full_name, ReferralLead.client_name)
        .join(ServiceProvider, ServiceProvider.id == CommissionLedger.provider_id)
        .outerjoin(ProviderService, ProviderService.id == CommissionLedger.service_id)
        .join(User, User.id == CommissionLedger.affiliate_user_id)
        .outerjoin(AffiliateProfile, AffiliateProfile.user_id == CommissionLedger.affiliate_user_id)
        .outerjoin(ReferralLead, ReferralLead.id == CommissionLedger.referral_id)
    )
    if status_filter and status_filter != "all":
        query = query.filter(CommissionLedger.status == status_filter)

    results = query.order_by(CommissionLedger.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Ledger ID", "Date", "Customer Name", "Provider", "Service",
        "Affiliate Name", "Affiliate Email", "Transaction Value (INR)",
        "Provider Comm (INR)", "Affiliate Share (INR)", "sBLOOM Share (INR)",
        "Status", "Provider Inv ID", "Affiliate Inv ID"
    ])
    for item, prov_name, srv_name, aff_email, aff_name, client_name in results:
        writer.writerow([
            str(item.id),
            item.created_at.strftime("%Y-%m-%d %H:%M"),
            client_name or "",
            prov_name or "",
            srv_name or "",
            aff_name or "",
            aff_email,
            f"{float(item.eligible_transaction_value):.2f}",
            f"{float(item.provider_commission_amount):.2f}",
            f"{float(item.affiliate_commission_amount):.2f}",
            f"{float(item.sbloom_retained_amount):.2f}",
            item.status,
            str(item.provider_invoice_id) if item.provider_invoice_id else "",
            str(item.affiliate_invoice_id) if item.affiliate_invoice_id else "",
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=sbloom_commission_ledger_{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"}
    )


@router.post("/ledger/{ledger_id}/status", response_model=CommissionLedgerItemResponse, dependencies=[Depends(csrf_protect)])
def update_ledger_status(
    ledger_id: UUID,
    status: str = Query(..., pattern="^(pending_verification|eligible|invoiced_to_provider|collected_from_provider|invoiced_by_affiliate|paid_to_affiliate|disputed|reversed)$"),
    notes: Optional[str] = Query(None),
    request: Request = None,
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    item = db.query(CommissionLedger).filter(CommissionLedger.id == ledger_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ledger item not found.")

    client_ip = get_client_ip(request) if request else None
    before_state = {"status": item.status, "notes": item.notes}

    item.status = status
    if notes:
        item.notes = notes.strip()

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="commission_ledger.status_updated",
        entity_type="commission_ledger",
        entity_id=str(item.id),
        before_state=before_state,
        after_state={"status": item.status, "notes": item.notes},
        ip_address=client_ip,
    )
    db.add(audit)
    db.commit()
    db.refresh(item)

    prov = db.query(ServiceProvider).filter(ServiceProvider.id == item.provider_id).first()
    srv = db.query(ProviderService).filter(ProviderService.id == item.service_id).first() if item.service_id else None
    user = db.query(User).filter(User.id == item.affiliate_user_id).first()
    prof = db.query(AffiliateProfile).filter(AffiliateProfile.user_id == item.affiliate_user_id).first()
    lead = db.query(ReferralLead).filter(ReferralLead.id == item.referral_id).first()

    return CommissionLedgerItemResponse(
        id=item.id,
        referral_id=item.referral_id,
        affiliate_user_id=item.affiliate_user_id,
        affiliate_name=prof.full_name if prof else None,
        affiliate_email=user.email if user else None,
        provider_id=item.provider_id,
        provider_name=prov.name if prov else None,
        service_id=item.service_id,
        service_name=srv.service_name if srv else None,
        customer_name=lead.client_name if lead else None,
        eligible_transaction_value=float(item.eligible_transaction_value),
        provider_commission_rate=float(item.provider_commission_rate) if item.provider_commission_rate else None,
        affiliate_commission_rate=float(item.affiliate_commission_rate) if item.affiliate_commission_rate else None,
        sbloom_share_rate=float(item.sbloom_share_rate) if item.sbloom_share_rate else None,
        provider_commission_amount=float(item.provider_commission_amount),
        affiliate_commission_amount=float(item.affiliate_commission_amount),
        sbloom_retained_amount=float(item.sbloom_retained_amount),
        currency=item.currency,
        status=item.status,
        provider_invoice_id=item.provider_invoice_id,
        affiliate_invoice_id=item.affiliate_invoice_id,
        verified_at=item.verified_at,
        notes=item.notes,
        created_at=item.created_at,
    )


# ==============================================================================
# FINANCIAL DASHBOARD / SUMMARY
# ==============================================================================

@router.get("/finance/summary", response_model=AdminFinancialSummaryResponse)
def get_admin_finance_summary(
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    prov_comm_sum = (
        db.query(func.coalesce(func.sum(CommissionLedger.provider_commission_amount), 0.0))
        .filter(CommissionLedger.status.notin_(["disputed", "reversed"]))
        .scalar()
    )
    prov_invoiced_sum = (
        db.query(func.coalesce(func.sum(ProviderInvoice.subtotal_amount), 0.0))
        .filter(ProviderInvoice.status != "cancelled")
        .scalar()
    )
    prov_collected_sum = (
        db.query(func.coalesce(func.sum(ProviderInvoice.amount_paid), 0.0))
        .filter(ProviderInvoice.status != "cancelled")
        .scalar()
    )
    aff_earned_sum = (
        db.query(func.coalesce(func.sum(CommissionLedger.affiliate_commission_amount), 0.0))
        .filter(CommissionLedger.status.notin_(["disputed", "reversed"]))
        .scalar()
    )
    aff_invoiced_sum = (
        db.query(func.coalesce(func.sum(AffiliateInvoice.total_payable), 0.0))
        .filter(AffiliateInvoice.status.in_(["submitted", "verified", "approved", "paid"]))
        .scalar()
    )
    aff_paid_sum = (
        db.query(func.coalesce(func.sum(AffiliateInvoice.total_payable), 0.0))
        .filter(AffiliateInvoice.status == "paid")
        .scalar()
    )
    sbloom_retained = (
        db.query(func.coalesce(func.sum(CommissionLedger.sbloom_retained_amount), 0.0))
        .filter(CommissionLedger.status.notin_(["disputed", "reversed"]))
        .scalar()
    )

    outstanding_rec = max(0.0, float(prov_invoiced_sum) - float(prov_collected_sum))
    outstanding_pay = max(0.0, float(aff_earned_sum) - float(aff_paid_sum))
    net_retained = max(0.0, float(prov_collected_sum) - float(aff_paid_sum))

    # Provider breakdown
    providers = db.query(ServiceProvider).all()
    prov_breakdown = []
    for p in providers:
        p_comm = (
            db.query(func.coalesce(func.sum(CommissionLedger.provider_commission_amount), 0.0))
            .filter(CommissionLedger.provider_id == p.id, CommissionLedger.status.notin_(["disputed", "reversed"]))
            .scalar()
        )
        p_leads = db.query(ReferralLead).filter(ReferralLead.provider_id == p.id).count()
        p_conv = db.query(ReferralLead).filter(ReferralLead.provider_id == p.id, ReferralLead.status == "converted").count()
        prov_breakdown.append({
            "provider_id": str(p.id),
            "provider_name": p.name,
            "sector": p.sector,
            "total_referrals": p_leads,
            "converted_referrals": p_conv,
            "total_commission_eligible": round(float(p_comm), 2),
        })

    # Recent months breakdown
    now = datetime.now(timezone.utc)
    month_breakdown = []
    for i in range(5, -1, -1):
        # Calculate month year
        month_dt = now - timedelta(days=i * 30)
        m_start = datetime(month_dt.year, month_dt.month, 1, tzinfo=timezone.utc)
        if month_dt.month == 12:
            m_end = datetime(month_dt.year + 1, 1, 1, tzinfo=timezone.utc) - timedelta(seconds=1)
        else:
            m_end = datetime(month_dt.year, month_dt.month + 1, 1, tzinfo=timezone.utc) - timedelta(seconds=1)

        m_prov = (
            db.query(func.coalesce(func.sum(CommissionLedger.provider_commission_amount), 0.0))
            .filter(CommissionLedger.created_at >= m_start, CommissionLedger.created_at <= m_end, CommissionLedger.status.notin_(["disputed", "reversed"]))
            .scalar()
        )
        m_aff = (
            db.query(func.coalesce(func.sum(CommissionLedger.affiliate_commission_amount), 0.0))
            .filter(CommissionLedger.created_at >= m_start, CommissionLedger.created_at <= m_end, CommissionLedger.status.notin_(["disputed", "reversed"]))
            .scalar()
        )
        m_sbloom = (
            db.query(func.coalesce(func.sum(CommissionLedger.sbloom_retained_amount), 0.0))
            .filter(CommissionLedger.created_at >= m_start, CommissionLedger.created_at <= m_end, CommissionLedger.status.notin_(["disputed", "reversed"]))
            .scalar()
        )
        month_breakdown.append({
            "month": m_start.strftime("%b %Y"),
            "provider_commission": round(float(m_prov), 2),
            "affiliate_commission": round(float(m_aff), 2),
            "sbloom_retained": round(float(m_sbloom), 2),
        })

    return AdminFinancialSummaryResponse(
        provider_commission_eligible=round(float(prov_comm_sum), 2),
        provider_commission_invoiced=round(float(prov_invoiced_sum), 2),
        provider_commission_collected=round(float(prov_collected_sum), 2),
        provider_receivables_outstanding=round(outstanding_rec, 2),
        affiliate_commission_earned=round(float(aff_earned_sum), 2),
        affiliate_commission_invoiced=round(float(aff_invoiced_sum), 2),
        affiliate_commission_paid=round(float(aff_paid_sum), 2),
        affiliate_payables_outstanding=round(outstanding_pay, 2),
        sbloom_retained_commission=round(float(sbloom_retained), 2),
        sbloom_net_retained=round(net_retained, 2),
        month_breakdown=month_breakdown,
        provider_breakdown=prov_breakdown,
    )


# ==============================================================================
# PROVIDER INVOICES (sBLOOM BILLS PROVIDER)
# ==============================================================================

@router.get("/invoices/provider", response_model=List[ProviderInvoiceResponse])
def list_provider_invoices(
    provider_id: Optional[UUID] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    query = (
        db.query(ProviderInvoice, ServiceProvider.name)
        .join(ServiceProvider, ServiceProvider.id == ProviderInvoice.provider_id)
    )
    if provider_id:
        query = query.filter(ProviderInvoice.provider_id == provider_id)
    if status_filter and status_filter != "all":
        query = query.filter(ProviderInvoice.status == status_filter)

    results = query.order_by(ProviderInvoice.created_at.desc()).all()

    items = []
    for inv, prov_name in results:
        resp = ProviderInvoiceResponse.model_validate(inv)
        resp.provider_name = prov_name
        resp.amount_due = max(0.0, float(inv.total_amount) - float(inv.amount_paid))
        items.append(resp)
    return items


@router.post("/invoices/provider", response_model=ProviderInvoiceResponse, dependencies=[Depends(csrf_protect)])
def create_provider_invoice(
    body: ProviderInvoiceCreate,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == body.provider_id).first()
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service provider not found.")

    ledger_items = (
        db.query(CommissionLedger)
        .filter(
            CommissionLedger.id.in_(body.ledger_ids),
            CommissionLedger.provider_id == body.provider_id,
            CommissionLedger.status.in_(["eligible", "pending_verification"]),
        )
        .all()
    )
    if not ledger_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No eligible uninvoiced ledger items found for the selected provider."
        )

    subtotal = sum(float(item.provider_commission_amount) for item in ledger_items)
    tax_rate = float(body.tax_rate or 0.0)
    tax_amount = round(subtotal * (tax_rate / 100.0), 2)
    total_amount = round(subtotal + tax_amount, 2)

    now = datetime.now(timezone.utc)
    inv_number = generate_provider_invoice_number(db)
    billing_period = now.strftime("%Y-%m")

    inv = ProviderInvoice(
        invoice_number=inv_number,
        provider_id=body.provider_id,
        billing_period=billing_period,
        invoice_date=now,
        due_date=body.due_date,
        provider_gstin=body.provider_gstin,
        billing_address=body.billing_address,
        subtotal_amount=subtotal,
        tax_rate=tax_rate,
        tax_amount=tax_amount,
        total_amount=total_amount,
        amount_paid=0.0,
        status="issued",
        created_by=current_user.id,
    )
    db.add(inv)
    db.flush()

    # Create line items and update ledger
    for item in ledger_items:
        lead = db.query(ReferralLead).filter(ReferralLead.id == item.referral_id).first()
        srv = db.query(ProviderService).filter(ProviderService.id == item.service_id).first() if item.service_id else None

        line_item = ProviderInvoiceItem(
            invoice_id=inv.id,
            ledger_id=item.id,
            referral_id=item.referral_id,
            customer_name=lead.client_name if lead else "Unknown Customer",
            service_name=srv.service_name if srv else "Standard Service",
            eligible_transaction_value=float(item.eligible_transaction_value),
            commission_rate=float(item.provider_commission_rate) if item.provider_commission_rate else None,
            commission_amount=float(item.provider_commission_amount),
        )
        db.add(line_item)

        item.provider_invoice_id = inv.id
        item.status = "invoiced_to_provider"

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider_invoice.issued",
        entity_type="provider_invoice",
        entity_id=str(inv.id),
        after_state={"invoice_number": inv.invoice_number, "total_amount": total_amount},
        ip_address=get_client_ip(request),
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)

    resp = ProviderInvoiceResponse.model_validate(inv)
    resp.provider_name = provider.name
    resp.amount_due = total_amount
    return resp


@router.get("/invoices/provider/{invoice_id}", response_model=ProviderInvoiceResponse)
def get_provider_invoice(
    invoice_id: UUID,
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    inv = db.query(ProviderInvoice).filter(ProviderInvoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

    prov = db.query(ServiceProvider).filter(ServiceProvider.id == inv.provider_id).first()
    resp = ProviderInvoiceResponse.model_validate(inv)
    resp.provider_name = prov.name if prov else "Provider"
    resp.amount_due = max(0.0, float(inv.total_amount) - float(inv.amount_paid))
    return resp


@router.post("/invoices/provider/{invoice_id}/payments", response_model=ProviderInvoiceResponse, dependencies=[Depends(csrf_protect)])
def record_provider_payment(
    invoice_id: UUID,
    body: RecordProviderPaymentRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    inv = db.query(ProviderInvoice).filter(ProviderInvoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

    now = datetime.now(timezone.utc)
    pay_date = body.payment_date or now

    payment = ProviderPayment(
        invoice_id=inv.id,
        amount=body.amount,
        payment_method=body.payment_method,
        payment_reference=body.payment_reference.strip(),
        payment_date=pay_date,
        recorded_by=current_user.id,
        notes=body.notes.strip() if body.notes else None,
    )
    db.add(payment)

    new_paid = float(inv.amount_paid) + float(body.amount)
    inv.amount_paid = new_paid
    if new_paid >= float(inv.total_amount):
        inv.status = "paid"
    else:
        inv.status = "partially_paid"
    inv.updated_at = now

    # Mark corresponding ledger items as collected_from_provider
    for line in inv.items:
        if line.ledger_id:
            led = db.query(CommissionLedger).filter(CommissionLedger.id == line.ledger_id).first()
            if led and led.status == "invoiced_to_provider":
                led.status = "collected_from_provider"

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider_invoice.payment_recorded",
        entity_type="provider_invoice",
        entity_id=str(inv.id),
        after_state={"amount_paid": inv.amount_paid, "status": inv.status, "ref": body.payment_reference},
        ip_address=get_client_ip(request),
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)

    prov = db.query(ServiceProvider).filter(ServiceProvider.id == inv.provider_id).first()
    resp = ProviderInvoiceResponse.model_validate(inv)
    resp.provider_name = prov.name if prov else "Provider"
    resp.amount_due = max(0.0, float(inv.total_amount) - float(inv.amount_paid))
    return resp


@router.post("/invoices/provider/{invoice_id}/cancel", response_model=ProviderInvoiceResponse, dependencies=[Depends(csrf_protect)])
def cancel_provider_invoice(
    invoice_id: UUID,
    body: CancelInvoiceRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("leads.manage")),
    db: Session = Depends(get_db),
):
    inv = db.query(ProviderInvoice).filter(ProviderInvoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

    if inv.status == "paid":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot cancel a fully paid invoice.")

    inv.status = "cancelled"
    inv.cancellation_reason = body.reason.strip()
    inv.updated_at = datetime.now(timezone.utc)

    # Revert ledger items back to eligible
    for line in inv.items:
        if line.ledger_id:
            led = db.query(CommissionLedger).filter(CommissionLedger.id == line.ledger_id).first()
            if led:
                led.status = "eligible"
                led.provider_invoice_id = None

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="provider_invoice.cancelled",
        entity_type="provider_invoice",
        entity_id=str(inv.id),
        reason=body.reason.strip(),
        ip_address=get_client_ip(request),
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)

    prov = db.query(ServiceProvider).filter(ServiceProvider.id == inv.provider_id).first()
    resp = ProviderInvoiceResponse.model_validate(inv)
    resp.provider_name = prov.name if prov else "Provider"
    resp.amount_due = 0.0
    return resp


# ==============================================================================
# AFFILIATE INVOICES (AFFILIATES BILL sBLOOM)
# ==============================================================================

@router.get("/invoices/affiliate", response_model=List[AffiliateInvoiceResponse])
def list_affiliate_invoices(
    affiliate_user_id: Optional[UUID] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    query = db.query(AffiliateInvoice)
    if affiliate_user_id:
        query = query.filter(AffiliateInvoice.affiliate_user_id == affiliate_user_id)
    if status_filter and status_filter != "all":
        query = query.filter(AffiliateInvoice.status == status_filter)

    invoices = query.order_by(AffiliateInvoice.created_at.desc()).all()
    return [AffiliateInvoiceResponse.model_validate(inv) for inv in invoices]


@router.get("/invoices/affiliate/{invoice_id}", response_model=AffiliateInvoiceResponse)
def get_affiliate_invoice(
    invoice_id: UUID,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.review")),
    db: Session = Depends(get_db),
):
    inv = db.query(AffiliateInvoice).filter(AffiliateInvoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")
    return AffiliateInvoiceResponse.model_validate(inv)


@router.post("/invoices/affiliate/{invoice_id}/approve", response_model=AffiliateInvoiceResponse, dependencies=[Depends(csrf_protect)])
def approve_affiliate_invoice(
    invoice_id: UUID,
    body: ApproveAffiliateInvoiceRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.decide")),
    db: Session = Depends(get_db),
):
    inv = db.query(AffiliateInvoice).filter(AffiliateInvoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

    inv.status = "approved"
    if body.admin_notes:
        inv.admin_notes = body.admin_notes.strip()
    inv.updated_at = datetime.now(timezone.utc)

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate_invoice.approved",
        entity_type="affiliate_invoice",
        entity_id=str(inv.id),
        ip_address=get_client_ip(request),
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)
    return AffiliateInvoiceResponse.model_validate(inv)


@router.post("/invoices/affiliate/{invoice_id}/reject", response_model=AffiliateInvoiceResponse, dependencies=[Depends(csrf_protect)])
def reject_affiliate_invoice(
    invoice_id: UUID,
    body: RejectAffiliateInvoiceRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.decide")),
    db: Session = Depends(get_db),
):
    inv = db.query(AffiliateInvoice).filter(AffiliateInvoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

    inv.status = "rejected"
    inv.rejection_reason = body.reason.strip()
    inv.updated_at = datetime.now(timezone.utc)

    # Revert ledger items back to eligible so affiliate can re-invoice
    for line in inv.items:
        if line.ledger_id:
            led = db.query(CommissionLedger).filter(CommissionLedger.id == line.ledger_id).first()
            if led:
                led.status = "eligible"
                led.affiliate_invoice_id = None

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate_invoice.rejected",
        entity_type="affiliate_invoice",
        entity_id=str(inv.id),
        reason=body.reason.strip(),
        ip_address=get_client_ip(request),
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)
    return AffiliateInvoiceResponse.model_validate(inv)


@router.post("/invoices/affiliate/{invoice_id}/payout", response_model=AffiliateInvoiceResponse, dependencies=[Depends(csrf_protect)])
def record_affiliate_payout(
    invoice_id: UUID,
    body: RecordAffiliatePayoutRequest,
    request: Request,
    current_user: AuthenticatedUser = Depends(require_permission("affiliates.decide")),
    db: Session = Depends(get_db),
):
    inv = db.query(AffiliateInvoice).filter(AffiliateInvoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

    now = datetime.now(timezone.utc)
    inv.status = "paid"
    inv.payout_reference = body.payout_reference.strip()
    inv.payout_method = body.payout_method
    inv.paid_at = now
    if body.notes:
        inv.admin_notes = body.notes.strip()
    inv.updated_at = now

    # Mark corresponding ledger items as paid_to_affiliate
    for line in inv.items:
        if line.ledger_id:
            led = db.query(CommissionLedger).filter(CommissionLedger.id == line.ledger_id).first()
            if led:
                led.status = "paid_to_affiliate"

    audit = AuditLog(
        actor_user_id=current_user.id,
        action="affiliate_invoice.paid",
        entity_type="affiliate_invoice",
        entity_id=str(inv.id),
        after_state={"payout_reference": inv.payout_reference, "amount": float(inv.total_payable)},
        ip_address=get_client_ip(request),
    )
    db.add(audit)
    db.commit()
    db.refresh(inv)
    return AffiliateInvoiceResponse.model_validate(inv)
