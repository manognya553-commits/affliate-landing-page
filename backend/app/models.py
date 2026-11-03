import uuid
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    DateTime,
    SmallInteger,
    Integer,
    BigInteger,
    ForeignKey,
    ForeignKeyConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, INET
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import relationship
from app.database import Base


# Allow INET to compile to TEXT on SQLite for local testing
@compiles(INET, "sqlite")
def compile_inet_sqlite(type_, compiler, **kw):
    return "TEXT"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(Text, nullable=False, unique=True, index=True)
    password_hash = Column(Text, nullable=False)
    email_verified_at = Column(DateTime(timezone=True), nullable=True)
    preferred_language = Column(Text, nullable=False, default="en")
    is_active = Column(Boolean, nullable=False, default=True)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    affiliate_profile = relationship(
        "AffiliateProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        foreign_keys="[AffiliateProfile.user_id]",
    )
    user_roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan", foreign_keys="[UserRole.user_id]")
    refresh_sessions = relationship("RefreshSession", back_populates="user", cascade="all, delete-orphan")
    auth_tokens = relationship("AuthToken", back_populates="user", cascade="all, delete-orphan")
    referral_leads = relationship("ReferralLead", back_populates="affiliate_user", foreign_keys="[ReferralLead.affiliate_user_id]", cascade="all, delete-orphan")


class AuthToken(Base):
    __tablename__ = "auth_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    purpose = Column(Text, nullable=False)  # 'email_verify', 'password_reset'
    token_hash = Column(Text, nullable=False, unique=True, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="auth_tokens")


class RefreshSession(Base):
    __tablename__ = "refresh_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(Text, nullable=False, unique=True, index=True)
    user_agent = Column(Text, nullable=True)
    ip_address = Column(INET, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="refresh_sessions")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(Text, nullable=False, unique=True)
    name = Column(Text, nullable=False)

    role_permissions = relationship("RolePermission", back_populates="role", cascade="all, delete-orphan")
    user_roles = relationship("UserRole", back_populates="role", cascade="all, delete-orphan")


class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(Text, nullable=False, unique=True)
    description = Column(Text, nullable=False)

    role_permissions = relationship("RolePermission", back_populates="permission", cascade="all, delete-orphan")


class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id = Column(SmallInteger, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)
    permission_id = Column(SmallInteger, ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True)

    role = relationship("Role", back_populates="role_permissions")
    permission = relationship("Permission", back_populates="role_permissions")


class UserRole(Base):
    __tablename__ = "user_roles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role_id = Column(SmallInteger, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True)
    granted_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    granted_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="user_roles", foreign_keys=[user_id])
    role = relationship("Role", back_populates="user_roles")


class TermsVersion(Base):
    __tablename__ = "terms_versions"

    document_key = Column(Text, primary_key=True)
    version = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    url = Column(Text, nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    document_key = Column(Text, nullable=False)
    version = Column(Integer, nullable=False)
    accepted_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)

    __table_args__ = (
        ForeignKeyConstraint(
            ["document_key", "version"],
            ["terms_versions.document_key", "terms_versions.version"],
        ),
    )


class AffiliateProfile(Base):
    __tablename__ = "affiliate_profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    full_name = Column(Text, nullable=True)
    city = Column(Text, nullable=True)
    area = Column(Text, nullable=True)
    mobile = Column(Text, nullable=True)
    occupation = Column(Text, nullable=True)
    promotion_plan = Column(Text, nullable=True)
    status = Column(Text, nullable=False, default="draft", index=True)
    terms_version = Column(Integer, nullable=True)
    terms_accepted_at = Column(DateTime(timezone=True), nullable=True)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    info_request_note = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    suspension_reason = Column(Text, nullable=True)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    
    # Settlement & Payout Groundwork
    bank_name = Column(Text, nullable=True)
    bank_account_number = Column(Text, nullable=True)
    bank_ifsc = Column(Text, nullable=True)
    upi_id = Column(Text, nullable=True)
    pan_number = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="affiliate_profile", foreign_keys=[user_id])
    approved_by_user = relationship("User", foreign_keys=[approved_by])


class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    sector = Column(Text, nullable=False, index=True)  # 'healthcare', 'education', 'professional'
    service_title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    eligibility_criteria = Column(Text, nullable=True)
    compensation_terms = Column(Text, nullable=False)
    city = Column(Text, nullable=False, index=True)
    area = Column(Text, nullable=True)
    contact_email = Column(Text, nullable=True)
    contact_phone = Column(Text, nullable=True)
    website = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_sample = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    referrals = relationship("ReferralLead", back_populates="provider")
    services = relationship("ProviderService", back_populates="provider", cascade="all, delete-orphan", order_by="ProviderService.created_at.asc()")


class ProviderService(Base):
    __tablename__ = "provider_services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("service_providers.id", ondelete="CASCADE"), nullable=False, index=True)
    service_name = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    requirement_description_required = Column(Boolean, nullable=False, default=False)
    instructions = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    provider = relationship("ServiceProvider", back_populates="services", foreign_keys=[provider_id])
    referrals = relationship("ReferralLead", back_populates="service")


class ReferralLead(Base):
    __tablename__ = "referral_leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    affiliate_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("service_providers.id", ondelete="SET NULL"), nullable=True, index=True)
    service_id = Column(UUID(as_uuid=True), ForeignKey("provider_services.id", ondelete="SET NULL"), nullable=True, index=True)
    client_name = Column(Text, nullable=False)
    client_mobile = Column(Text, nullable=False)
    client_email = Column(Text, nullable=True)
    client_city = Column(Text, nullable=False)
    service_category = Column(Text, nullable=False)  # 'healthcare', 'education', 'professional'
    context_note = Column(Text, nullable=True)
    consent_confirmed = Column(Boolean, nullable=False)
    status = Column(Text, nullable=False, default="pending", index=True)  # 'pending', 'contacted', 'qualified', 'converted', 'rejected'
    admin_notes = Column(Text, nullable=True)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    affiliate_user = relationship("User", back_populates="referral_leads", foreign_keys=[affiliate_user_id])
    provider = relationship("ServiceProvider", back_populates="referrals", foreign_keys=[provider_id])
    service = relationship("ProviderService", back_populates="referrals", foreign_keys=[service_id])
    updater = relationship("User", foreign_keys=[updated_by])


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    actor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    action = Column(Text, nullable=False)
    entity_type = Column(Text, nullable=False, index=True)
    entity_id = Column(Text, nullable=False, index=True)
    reason = Column(Text, nullable=True)
    before_state = Column(JSONB, nullable=True)
    after_state = Column(JSONB, nullable=True)
    ip_address = Column(INET, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)


class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    email = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    language = Column(Text, nullable=False, default="en")
    status = Column(Text, nullable=False, default="new", index=True)
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)
    handled_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    handled_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)


class SiteEvent(Base):
    __tablename__ = "site_events"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    event_name = Column(Text, nullable=False, index=True)
    language = Column(Text, nullable=True)
    session_id = Column(Text, nullable=True)
    path = Column(Text, nullable=True)
    meta = Column(JSONB, nullable=False, default=dict)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)
