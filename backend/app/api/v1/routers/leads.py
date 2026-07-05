from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

from app.db.session import get_db
from app.models.models import ContactLead

router = APIRouter(prefix="/leads", tags=["Leads"])


class LeadCreate(BaseModel):
    nom: str
    email: Optional[str] = None
    phone: Optional[str] = None
    besoin: str
    budget: Optional[str] = None
    delai: Optional[str] = None
    source: Optional[str] = "n8n_agent"
    company: Optional[str] = None


class LeadResponse(BaseModel):
    id: str
    message: str
    createdAt: datetime

    class Config:
        from_attributes = True


@router.post("", response_model=LeadResponse, status_code=201)
def create_lead(data: LeadCreate, db: Session = Depends(get_db)):
    parts = data.nom.strip().split(" ", 1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else None

    message_parts = [f"Besoin: {data.besoin}"]
    if data.budget:
        message_parts.append(f"Budget: {data.budget}")
    if data.delai:
        message_parts.append(f"Délai: {data.delai}")
    full_message = " | ".join(message_parts)

    lead = ContactLead(
        id=str(uuid.uuid4()),
        firstName=first_name,
        lastName=last_name,
        email=data.email,
        phone=data.phone or "non renseigné",
        message=full_message,
        type=data.source or "n8n_agent",
        status="new",
        company=data.company,
        createdAt=datetime.utcnow(),
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    return LeadResponse(id=lead.id, message="Lead enregistré", createdAt=lead.createdAt)
