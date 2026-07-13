from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.db.session import get_db
from app.core.security import require_admin_secret
from app.models.models import Order, ContactLead, ChatSession, PageView
from app.schemas.analytics import DashboardStats, LeadSummary

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics Dashboard"],
    dependencies=[Depends(require_admin_secret)],
)

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Retourne les métriques globales et les leads récents pour le tableau de bord."""
    
    now = datetime.utcnow()
    since_24h = now - timedelta(hours=24)
    since_7d = now - timedelta(days=7)

    # Totaux globaux
    total_orders = db.query(Order).count()
    revenue_query = db.query(func.sum(Order.totalAmount)).filter(
        Order.paymentStatus.in_(["completed", "processing"])
    ).scalar()
    total_revenue = int(revenue_query) if revenue_query else 0
    total_leads = db.query(ContactLead).count()
    qualified_leads = db.query(ChatSession).filter(ChatSession.isQualified == True).count()
    active_chat_sessions = db.query(ChatSession).count()

    # Stats journalières (dernières 24h)
    daily_orders = db.query(Order).filter(Order.createdAt >= since_24h).count()
    daily_rev_q = db.query(func.sum(Order.totalAmount)).filter(
        Order.createdAt >= since_24h,
        Order.paymentStatus.in_(["completed", "processing"])
    ).scalar()
    daily_revenue = int(daily_rev_q) if daily_rev_q else 0
    daily_leads = db.query(ContactLead).filter(ContactLead.createdAt >= since_24h).count()

    # PageViews
    weekly_pv = db.query(PageView).filter(PageView.createdAt >= since_7d).count()
    daily_pv = db.query(PageView).filter(PageView.createdAt >= since_24h).count()

    # WhatsApp vs Web chat
    whatsapp_sessions = db.query(ChatSession).filter(ChatSession.platform == "whatsapp").count()
    whatsapp_qualified = db.query(ChatSession).filter(
        ChatSession.platform == "whatsapp", ChatSession.isQualified == True
    ).count()
    web_sessions = db.query(ChatSession).filter(ChatSession.platform == "web").count()
    web_qualified = db.query(ChatSession).filter(
        ChatSession.platform == "web", ChatSession.isQualified == True
    ).count()

    # 5 leads récents
    recent_leads_raw = db.query(ContactLead).order_by(ContactLead.createdAt.desc()).limit(5).all()
    recent_leads = [
        LeadSummary(
            id=lead.id, firstName=lead.firstName, lastName=lead.lastName,
            email=lead.email, phone=lead.phone, message=lead.message,
            type=lead.type, status=lead.status, createdAt=lead.createdAt
        ) for lead in recent_leads_raw
    ]

    return DashboardStats(
        totalOrders=total_orders,
        totalRevenue=total_revenue,
        totalLeads=total_leads,
        qualifiedLeads=qualified_leads,
        activeChatSessions=active_chat_sessions,
        recentLeads=recent_leads,
        dailyOrders=daily_orders,
        dailyRevenue=daily_revenue,
        dailyLeads=daily_leads,
        weeklyPageViews=weekly_pv,
        dailyPageViews=daily_pv,
        whatsappSessions=whatsapp_sessions,
        whatsappQualified=whatsapp_qualified,
        webChatSessions=web_sessions,
        webChatQualified=web_qualified,
    )
