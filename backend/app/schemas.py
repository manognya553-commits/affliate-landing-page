import re
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, field_validator, ConfigDict

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


def clean_email(v: Any) -> str:
    if not isinstance(v, str):
        raise ValueError("Email must be a string")
    v = v.strip().lower()
    if not re.match(EMAIL_REGEX, v):
        raise ValueError("Invalid email format")
    return v


# ==============================================================================
# AUTH SCHEMAS
# ==============================================================================

class SignupRequest(BaseModel):
    email: str
    password: str = Field(..., min_length=8, description="Minimum 8 characters")
    preferred_language: str = Field(default="en", pattern="^(en|te)$")
    # Optional profile completion upon registration for one-step auto-activation
    full_name: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    mobile: Optional[str] = None
    occupation: Optional[str] = None
    promotion_plan: Optional[str] = None
    terms_accepted: Optional[bool] = None
    terms_version: Optional[int] = 1

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: Any) -> str:
        return clean_email(v)

    @field_validator("occupation")
    @classmethod
    def validate_occupation(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in OCCUPATION_CHOICES:
            raise ValueError(f"Occupation must be one of: {', '.join(OCCUPATION_CHOICES)}")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: Any) -> str:
        return clean_email(v)


class RefreshTokenRequest(BaseModel):
    refresh_token: Optional[str] = None


class ForgotPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: Any) -> str:
        return clean_email(v)


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)


class VerifyEmailRequest(BaseModel):
    token: str = Field(..., min_length=1)


class ResendVerificationRequest(BaseModel):
    email: Optional[str] = None

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: Any) -> Optional[str]:
        if v:
            return clean_email(v)
        return None


class UserResponse(BaseModel):
    id: UUID
    email: str
    preferred_language: str
    is_active: bool
    email_verified_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class MeResponse(BaseModel):
    user: UserResponse
    roles: List[str]
    permissions: List[str]
    affiliate_status: Optional[str] = None


# ==============================================================================
# AFFILIATE SCHEMAS
# ==============================================================================

OCCUPATION_CHOICES = (
    "homemaker",
    "working_professional",
    "shop_owner",
    "student",
    "tutor",
    "community_connector",
    "retired",
    "other",
)


class AffiliateProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    mobile: Optional[str] = None
    occupation: Optional[str] = None
    promotion_plan: Optional[str] = None
    preferred_language: Optional[str] = None
    # Payout Groundwork Fields
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    upi_id: Optional[str] = None
    pan_number: Optional[str] = None

    @field_validator("occupation")
    @classmethod
    def validate_occupation(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in OCCUPATION_CHOICES:
            raise ValueError(f"Occupation must be one of: {', '.join(OCCUPATION_CHOICES)}")
        return v


class AffiliateProfileSubmit(BaseModel):
    full_name: str = Field(..., min_length=2)
    city: str = Field(..., min_length=2)
    area: str = Field(..., min_length=2)
    mobile: Optional[str] = None
    occupation: str = Field(...)
    promotion_plan: str = Field(..., min_length=10)
    terms_accepted: bool = Field(...)
    terms_version: int = Field(default=1)

    @field_validator("occupation")
    @classmethod
    def validate_occupation(cls, v: str) -> str:
        if v not in OCCUPATION_CHOICES:
            raise ValueError(f"Occupation must be one of: {', '.join(OCCUPATION_CHOICES)}")
        return v

    @field_validator("terms_accepted")
    @classmethod
    def validate_terms(cls, v: bool) -> bool:
        if not v:
            raise ValueError("You must accept the Programme Terms & Conditions to submit your application.")
        return v


class AffiliateProfileResponse(BaseModel):
    user_id: UUID
    full_name: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    mobile: Optional[str] = None
    occupation: Optional[str] = None
    promotion_plan: Optional[str] = None
    status: str
    terms_version: Optional[int] = None
    terms_accepted_at: Optional[datetime] = None
    submitted_at: Optional[datetime] = None
    info_request_note: Optional[str] = None
    rejection_reason: Optional[str] = None
    approved_by: Optional[UUID] = None
    approved_at: Optional[datetime] = None
    # Settlement & Payout Fields
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    upi_id: Optional[str] = None
    pan_number: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


SERVICE_CATEGORIES = ("healthcare", "education", "professional")
REFERRAL_STATUSES = ("pending", "contacted", "qualified", "converted", "rejected")


# ==============================================================================
# SERVICE PROVIDER & SERVICES SCHEMAS
# ==============================================================================

class ProviderServiceCreate(BaseModel):
    service_name: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=5)
    requirement_description_required: bool = False
    instructions: Optional[str] = None
    is_active: bool = True


class ProviderServiceUpdate(BaseModel):
    service_name: Optional[str] = None
    description: Optional[str] = None
    requirement_description_required: Optional[bool] = None
    instructions: Optional[str] = None
    is_active: Optional[bool] = None


class ProviderServiceResponse(BaseModel):
    id: UUID
    provider_id: UUID
    service_name: str
    description: str
    requirement_description_required: bool
    instructions: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ServiceProviderCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    sector: str = Field(...)
    service_title: str = Field(..., min_length=3, max_length=250)
    description: str = Field(..., min_length=10)
    eligibility_criteria: Optional[str] = None
    compensation_terms: str = Field(..., min_length=5)
    city: str = Field(..., min_length=2, max_length=100)
    area: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None
    is_active: bool = True
    is_sample: bool = False

    @field_validator("sector")
    @classmethod
    def validate_sector(cls, v: str) -> str:
        if v not in SERVICE_CATEGORIES:
            raise ValueError(f"Sector must be one of: {', '.join(SERVICE_CATEGORIES)}")
        return v


class ServiceProviderUpdate(BaseModel):
    name: Optional[str] = None
    sector: Optional[str] = None
    service_title: Optional[str] = None
    description: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    compensation_terms: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None
    is_active: Optional[bool] = None
    is_sample: Optional[bool] = None

    @field_validator("sector")
    @classmethod
    def validate_sector(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in SERVICE_CATEGORIES:
            raise ValueError(f"Sector must be one of: {', '.join(SERVICE_CATEGORIES)}")
        return v


class ServiceProviderResponse(BaseModel):
    id: UUID
    name: str
    sector: str
    service_title: str
    description: str
    eligibility_criteria: Optional[str] = None
    compensation_terms: str
    city: str
    area: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None
    is_active: bool
    is_sample: bool
    services: List[ProviderServiceResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# REFERRAL SCHEMAS
# ==============================================================================

class ReferralLeadCreate(BaseModel):
    provider_id: Optional[UUID] = None
    service_id: Optional[UUID] = None
    client_name: str = Field(..., min_length=2, max_length=120)
    client_mobile: str = Field(..., min_length=7, max_length=20)
    client_email: Optional[str] = None
    client_city: str = Field(..., min_length=2, max_length=100)
    service_category: Optional[str] = None
    context_note: Optional[str] = None
    consent_confirmed: bool = Field(...)

    @field_validator("client_email")
    @classmethod
    def validate_optional_email(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v.strip():
            return clean_email(v)
        return None

    @field_validator("service_category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in SERVICE_CATEGORIES:
            raise ValueError(f"Service category must be one of: {', '.join(SERVICE_CATEGORIES)}")
        return v

    @field_validator("consent_confirmed")
    @classmethod
    def validate_consent(cls, v: bool) -> bool:
        if v is not True:
            raise ValueError("You must confirm explicit client permission before introducing a client.")
        return v


class ReferralLeadResponse(BaseModel):
    id: UUID
    client_name: str
    client_mobile: str
    client_email: Optional[str] = None
    client_city: str
    service_category: str
    context_note: Optional[str] = None
    consent_confirmed: bool
    status: str
    provider_id: Optional[UUID] = None
    provider_name: Optional[str] = None
    service_id: Optional[UUID] = None
    service_name: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AffiliateMetricsResponse(BaseModel):
    active_referrals: int
    converted_introductions: int
    verified_pipeline: int
    performance_ratio: float
    total_referrals: int = 0
    pending_referrals: int = 0
    contacted_referrals: int = 0
    qualified_referrals: int = 0
    converted_referrals: int = 0
    rejected_referrals: int = 0


# ==============================================================================
# ADMIN SCHEMAS
# ==============================================================================

class AdminSummaryResponse(BaseModel):
    pending: int = 0
    info_requested: int = 0
    approved: int = 0
    total: int = 0
    total_referrals: int = 0
    pending_referrals: int = 0
    contacted_referrals: int = 0
    qualified_referrals: int = 0
    converted_referrals: int = 0
    rejected_referrals: int = 0
    conversion_rate: float = 0.0
    verified_affiliates: int = 0
    unverified_affiliates: int = 0
    suspended_affiliates: int = 0
    rejected_affiliates: int = 0
    total_registered_affiliates: int = 0
    active_affiliates: int = 0
    new_registrations_period: int = 0
    total_providers: int = 0
    active_providers: int = 0
    inactive_providers: int = 0
    active_services_count: int = 0
    provider_commission_eligible: float = 0.0
    affiliate_commission_payable: float = 0.0
    sbloom_retained_commission: float = 0.0
    provider_invoiced: float = 0.0
    provider_collected: float = 0.0
    affiliate_invoiced: float = 0.0
    affiliate_paid: float = 0.0
    outstanding_receivables: float = 0.0
    outstanding_payables: float = 0.0


class AdminReferralLeadResponse(BaseModel):
    id: UUID
    affiliate_user_id: UUID
    affiliate_email: Optional[str] = None
    affiliate_name: Optional[str] = None
    client_name: str
    client_mobile: str
    client_email: Optional[str] = None
    client_city: str
    service_category: str
    context_note: Optional[str] = None
    consent_confirmed: bool
    status: str
    provider_id: Optional[UUID] = None
    provider_name: Optional[str] = None
    service_id: Optional[UUID] = None
    service_name: Optional[str] = None
    admin_notes: Optional[str] = None
    conversion_date: Optional[datetime] = None
    conversion_value: Optional[float] = None
    conversion_reference: Optional[str] = None
    is_eligible_for_commission: bool = False
    commission_details: Optional[Dict[str, Any]] = None
    updated_by: Optional[UUID] = None
    updater_email: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminReferralListResponse(BaseModel):
    items: List[AdminReferralLeadResponse]
    total: int
    limit: int
    offset: int


class AdminReferralStatusUpdate(BaseModel):
    status: str = Field(...)
    admin_notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in REFERRAL_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(REFERRAL_STATUSES)}")
        return v


class AdminApprovalListItem(BaseModel):
    user_id: UUID
    email: str
    full_name: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    occupation: Optional[str] = None
    promotion_plan: Optional[str] = None
    status: str
    created_at: datetime
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[UUID] = None


class AdminRejectRequest(BaseModel):
    reason: str = Field(..., min_length=3, description="Rejection reason is required")


class AdminRequestInfoRequest(BaseModel):
    note: str = Field(..., min_length=3, description="Information request note is required")


class AdminSuspendRequest(BaseModel):
    reason: str = Field(..., min_length=3, description="Suspension reason is required")


class AdminActionResponse(BaseModel):
    success: bool
    status: str
    message: str


class AuditLogItem(BaseModel):
    id: int
    actor_user_id: Optional[UUID] = None
    action: str
    entity_type: str
    entity_id: str
    reason: Optional[str] = None
    before_state: Optional[Dict[str, Any]] = None
    after_state: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    created_at: datetime

    @field_validator("ip_address", mode="before")
    @classmethod
    def serialize_ip(cls, v: Any) -> Optional[str]:
        if v is not None:
            return str(v)
        return None

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# COMMISSION & FINANCIAL SCHEMAS
# ==============================================================================

class AdminRecordConversionRequest(BaseModel):
    conversion_value: float = Field(..., gt=0, description="Eligible transaction amount (e.g. ₹10,000)")
    conversion_date: Optional[datetime] = None
    conversion_reference: Optional[str] = None
    is_eligible_for_commission: bool = True
    admin_notes: Optional[str] = None
    agreement_id: Optional[UUID] = None


class CommissionAgreementCreate(BaseModel):
    provider_id: UUID
    service_id: Optional[UUID] = None
    agreement_type: str = Field(default="percentage", pattern="^(percentage|fixed)$")
    provider_rate: Optional[float] = None
    affiliate_rate: Optional[float] = None
    sbloom_share_rate: Optional[float] = None
    provider_fixed_amount: Optional[float] = None
    affiliate_fixed_amount: Optional[float] = None
    sbloom_fixed_amount: Optional[float] = None
    calculation_basis: str = Field(default="transaction_value")
    eligibility_trigger: str = Field(default="on_conversion")
    effective_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    status: str = Field(default="active", pattern="^(active|draft|superseded|expired)$")
    notes: Optional[str] = None

    @field_validator("provider_rate", "affiliate_rate", "sbloom_share_rate")
    @classmethod
    def validate_rates(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and (v < 0 or v > 100):
            raise ValueError("Rate must be between 0 and 100 percent")
        return v


class CommissionAgreementUpdate(BaseModel):
    service_id: Optional[UUID] = None
    agreement_type: Optional[str] = None
    provider_rate: Optional[float] = None
    affiliate_rate: Optional[float] = None
    sbloom_share_rate: Optional[float] = None
    provider_fixed_amount: Optional[float] = None
    affiliate_fixed_amount: Optional[float] = None
    sbloom_fixed_amount: Optional[float] = None
    calculation_basis: Optional[str] = None
    eligibility_trigger: Optional[str] = None
    effective_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class CommissionAgreementResponse(BaseModel):
    id: UUID
    provider_id: UUID
    provider_name: Optional[str] = None
    service_id: Optional[UUID] = None
    service_name: Optional[str] = None
    agreement_type: str
    provider_rate: Optional[float] = None
    affiliate_rate: Optional[float] = None
    sbloom_share_rate: Optional[float] = None
    provider_fixed_amount: Optional[float] = None
    affiliate_fixed_amount: Optional[float] = None
    sbloom_fixed_amount: Optional[float] = None
    calculation_basis: str
    eligibility_trigger: str
    effective_date: datetime
    expiry_date: Optional[datetime] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CommissionLedgerItemResponse(BaseModel):
    id: UUID
    referral_id: UUID
    affiliate_user_id: UUID
    affiliate_name: Optional[str] = None
    affiliate_email: Optional[str] = None
    provider_id: UUID
    provider_name: Optional[str] = None
    service_id: Optional[UUID] = None
    service_name: Optional[str] = None
    customer_name: Optional[str] = None
    eligible_transaction_value: float
    provider_commission_rate: Optional[float] = None
    affiliate_commission_rate: Optional[float] = None
    sbloom_share_rate: Optional[float] = None
    provider_commission_amount: float
    affiliate_commission_amount: float
    sbloom_retained_amount: float
    currency: str = "INR"
    status: str
    provider_invoice_id: Optional[UUID] = None
    affiliate_invoice_id: Optional[UUID] = None
    verified_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProviderInvoiceItemResponse(BaseModel):
    id: UUID
    ledger_id: Optional[UUID] = None
    referral_id: Optional[UUID] = None
    customer_name: str
    service_name: str
    eligible_transaction_value: float
    commission_rate: Optional[float] = None
    commission_amount: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProviderPaymentResponse(BaseModel):
    id: UUID
    amount: float
    payment_method: str
    payment_reference: str
    payment_date: datetime
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProviderInvoiceResponse(BaseModel):
    id: UUID
    invoice_number: str
    provider_id: UUID
    provider_name: str
    billing_period: Optional[str] = None
    invoice_date: datetime
    due_date: datetime
    provider_gstin: Optional[str] = None
    billing_address: Optional[str] = None
    subtotal_amount: float
    tax_rate: float
    tax_amount: float
    total_amount: float
    amount_paid: float
    amount_due: float
    status: str
    cancellation_reason: Optional[str] = None
    items: List[ProviderInvoiceItemResponse] = []
    payments: List[ProviderPaymentResponse] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProviderInvoiceCreate(BaseModel):
    provider_id: UUID
    ledger_ids: List[UUID] = Field(..., min_length=1)
    due_date: datetime
    provider_gstin: Optional[str] = None
    billing_address: Optional[str] = None
    tax_rate: float = 0.00
    notes: Optional[str] = None


class RecordProviderPaymentRequest(BaseModel):
    amount: float = Field(..., gt=0)
    payment_method: str = "bank_transfer"
    payment_reference: str = Field(..., min_length=2)
    payment_date: Optional[datetime] = None
    notes: Optional[str] = None


class CancelInvoiceRequest(BaseModel):
    reason: str = Field(..., min_length=3)


class AffiliateInvoiceItemResponse(BaseModel):
    id: UUID
    ledger_id: Optional[UUID] = None
    referral_id: Optional[UUID] = None
    customer_name: str
    provider_name: str
    service_name: str
    eligible_transaction_value: float
    affiliate_rate: Optional[float] = None
    commission_amount: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AffiliateInvoiceResponse(BaseModel):
    id: UUID
    invoice_number: str
    affiliate_user_id: UUID
    billing_period: str
    invoice_date: datetime
    due_date: Optional[datetime] = None
    affiliate_name: str
    affiliate_email: str
    affiliate_city: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    upi_id: Optional[str] = None
    pan_number: Optional[str] = None
    subtotal_amount: float
    tds_rate: float
    tds_amount: float
    total_payable: float
    status: str
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    payout_reference: Optional[str] = None
    payout_method: Optional[str] = None
    paid_at: Optional[datetime] = None
    items: List[AffiliateInvoiceItemResponse] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GenerateAffiliateInvoiceRequest(BaseModel):
    billing_period: str = Field(..., pattern=r"^\d{4}-\d{2}$", description="e.g. '2026-11'")
    ledger_ids: Optional[List[UUID]] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    upi_id: Optional[str] = None
    pan_number: Optional[str] = None
    tds_rate: float = 0.00


class AdminGenerateAffiliateInvoiceRequest(BaseModel):
    affiliate_user_id: UUID
    billing_period: str = Field(..., pattern=r"^\d{4}-\d{2}$", description="e.g. '2026-11'")
    ledger_ids: Optional[List[UUID]] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    upi_id: Optional[str] = None
    pan_number: Optional[str] = None
    tds_rate: float = 5.00
    notes: Optional[str] = None


class CancelAffiliateInvoiceRequest(BaseModel):
    reason: str = Field(..., min_length=3)


class RecordAffiliatePayoutRequest(BaseModel):
    payout_reference: str = Field(..., min_length=2, description="UTR / Bank transaction reference")
    payout_method: str = "bank_transfer"
    notes: Optional[str] = None


class ApproveAffiliateInvoiceRequest(BaseModel):
    admin_notes: Optional[str] = None


class RejectAffiliateInvoiceRequest(BaseModel):
    reason: str = Field(..., min_length=3)


class AdminFinancialSummaryResponse(BaseModel):
    provider_commission_eligible: float = 0.0
    provider_commission_invoiced: float = 0.0
    provider_commission_collected: float = 0.0
    provider_receivables_outstanding: float = 0.0
    affiliate_commission_earned: float = 0.0
    affiliate_commission_invoiced: float = 0.0
    affiliate_commission_paid: float = 0.0
    affiliate_payables_outstanding: float = 0.0
    sbloom_retained_commission: float = 0.0
    sbloom_net_retained: float = 0.0
    month_breakdown: List[Dict[str, Any]] = []
    provider_breakdown: List[Dict[str, Any]] = []


# ==============================================================================
# AFFILIATE DIRECTORY SCHEMAS
# ==============================================================================

class AdminAffiliateListItem(BaseModel):
    id: UUID
    full_name: str
    email: str
    mobile: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    status: str
    email_verified: bool
    registered_at: datetime
    total_referrals: int = 0
    converted_referrals: int = 0
    eligible_commission: float = 0.0
    outstanding_payment: float = 0.0

    model_config = ConfigDict(from_attributes=True)


class AdminAffiliateListResponse(BaseModel):
    items: List[AdminAffiliateListItem]
    total: int
    limit: int
    offset: int


class AdminAffiliateDetailResponse(BaseModel):
    user_id: UUID
    full_name: str
    email: str
    mobile: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    occupation: Optional[str] = None
    promotion_plan: Optional[str] = None
    status: str
    email_verified: bool
    registered_at: datetime
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    upi_id: Optional[str] = None
    pan_number: Optional[str] = None
    total_referrals: int = 0
    converted_referrals: int = 0
    eligible_commission: float = 0.0
    outstanding_payment: float = 0.0
    referral_history: List[Dict[str, Any]] = []
    provider_performance: List[Dict[str, Any]] = []
    commission_ledger: List[CommissionLedgerItemResponse] = []
    invoice_history: List[AffiliateInvoiceResponse] = []
    audit_events: List[AuditLogItem] = []

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# PUBLIC SCHEMAS
# ==============================================================================

class ContactInquiryRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: str
    message: str = Field(..., min_length=5)
    language: str = Field(default="en", pattern="^(en|te)$")
    # Honeypot field: real users leave it empty; bots fill it out
    hp_field: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: Any) -> str:
        return clean_email(v)


class SiteEventRequest(BaseModel):
    event_name: str = Field(..., min_length=1)
    language: Optional[str] = Field(default=None, pattern="^(en|te)$")
    session_id: Optional[str] = None
    path: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None


class MessageResponse(BaseModel):
    message: str
