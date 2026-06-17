from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.models import Order, ContactLead, ChatSession
from app.schemas.analytics import DashboardStats, LeadSummary

router = APIRouter(prefix="/analytics", tags=["Analytics Dashboard"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Retourne les métriques globales et les leads récents pour le tableau de bord."""
    
    # 1. Nombre total de commandes
    total_orders = db.query(Order).count()
    
    # 2. Chiffre d'affaires cumulé (somme des commandes payées ou terminées)
    revenue_query = db.query(func.sum(Order.totalAmount)).filter(
        Order.paymentStatus.in_(["completed", "processing"])
    ).scalar()
    total_revenue = int(revenue_query) if revenue_query else 0
    
    # 3. Nombre de leads de contact
    total_leads = db.query(ContactLead).count()
    
    # 4. Nombre de sessions qualifiées par l'IA
    qualified_leads = db.query(ChatSession).filter(ChatSession.isQualified == True).count()
    
    # 5. Nombre total de sessions de chat
    active_chat_sessions = db.query(ChatSession).count()
    
    # 6. Récupérer les 5 leads les plus récents
    recent_leads_raw = db.query(ContactLead).order_by(ContactLead.createdAt.desc()).limit(5).all()
    
    # Mapper vers LeadSummary Pydantic
    recent_leads = [
        LeadSummary(
            id=lead.id,
            firstName=lead.firstName,
            lastName=lead.lastName,
            email=lead.email,
            phone=lead.phone,
            message=lead.message,
            type=lead.type,
            status=lead.status,
            createdAt=lead.createdAt
        ) for lead in recent_leads_raw
    ]
    
    return DashboardStats(
        totalOrders=total_orders,
        totalRevenue=total_revenue,
        totalLeads=total_leads,
        qualifiedLeads=qualified_leads,
        activeChatSessions=active_chat_sessions,
        recentLeads=recent_leads
    )
