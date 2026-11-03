from uuid import UUID
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ContactInquiry, SiteEvent, ServiceProvider
from app.schemas import ContactInquiryRequest, SiteEventRequest, MessageResponse, ServiceProviderResponse
from app.security import get_client_ip

router = APIRouter(prefix="/public", tags=["Public"])


@router.post("/contact", response_model=MessageResponse)
def submit_contact_inquiry(request: Request, body: ContactInquiryRequest, db: Session = Depends(get_db)):
    # Honeypot spam check: if filled, drop silently and return success
    if body.hp_field and body.hp_field.strip():
        return MessageResponse(message="Thank you! Your message has been received.")

    inquiry = ContactInquiry(
        name=body.name.strip(),
        email=body.email.strip().lower(),
        message=body.message.strip(),
        language=body.language,
        status="new",
        ip_address=get_client_ip(request),
        user_agent=request.headers.get("user-agent"),
    )
    db.add(inquiry)
    db.commit()

    return MessageResponse(message="Thank you! Your message has been received.")


@router.post("/events", response_model=MessageResponse)
def track_site_event(body: SiteEventRequest, db: Session = Depends(get_db)):
    event = SiteEvent(
        event_name=body.event_name.strip(),
        language=body.language,
        session_id=body.session_id,
        path=body.path,
        meta=body.meta or {},
    )
    db.add(event)
    db.commit()

    return MessageResponse(message="Event recorded.")


@router.get("/providers", response_model=list[ServiceProviderResponse])
def list_public_providers(
    sector: str = None,
    city: str = None,
    search: str = None,
    db: Session = Depends(get_db),
):
    """
    Returns active verified service providers across Healthcare, Education, and Professional Services.
    """
    query = db.query(ServiceProvider).filter(ServiceProvider.is_active == True)

    if sector and sector != "all":
        query = query.filter(ServiceProvider.sector == sector)
    if city and city.strip():
        query = query.filter(ServiceProvider.city.ilike(f"%{city.strip()}%"))
    if search and search.strip():
        s = f"%{search.strip().lower()}%"
        query = query.filter(
            (ServiceProvider.name.ilike(s))
            | (ServiceProvider.service_title.ilike(s))
            | (ServiceProvider.description.ilike(s))
            | (ServiceProvider.city.ilike(s))
        )

    providers = query.order_by(ServiceProvider.is_sample.asc(), ServiceProvider.name.asc()).all()
    results = []
    for p in providers:
        resp = ServiceProviderResponse.model_validate(p)
        resp.services = [s for s in resp.services if s.is_active]
        results.append(resp)
    return results


@router.get("/providers/{provider_id}", response_model=ServiceProviderResponse)
def get_public_provider_detail(provider_id: UUID, db: Session = Depends(get_db)):
    provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id, ServiceProvider.is_active == True).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Service provider not found or inactive.")
    resp = ServiceProviderResponse.model_validate(provider)
    resp.services = [s for s in resp.services if s.is_active]
    return resp

