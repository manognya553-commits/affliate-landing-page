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
    pending: int
    info_requested: int
    approved: int
    total: int
    total_referrals: int = 0
    pending_referrals: int = 0
    contacted_referrals: int = 0
    qualified_referrals: int = 0
    converted_referrals: int = 0
    rejected_referrals: int = 0
    verified_affiliates: int = 0
    unverified_affiliates: int = 0
    suspended_affiliates: int = 0
    rejected_affiliates: int = 0
    total_providers: int = 0
    active_providers: int = 0


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
