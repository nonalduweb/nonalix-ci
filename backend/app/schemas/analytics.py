from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LeadSummary(BaseModel):
    id: str
    firstName: str
    lastName: Optional[str] = None
    email: Optional[str] = None
    phone: str
    message: str
    type: str
    status: str
    createdAt: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    totalOrders: int
    totalRevenue: int
    totalLeads: int
    qualifiedLeads: int
    activeChatSessions: int
    recentLeads: List[LeadSummary]
    # Stats journalières / hebdo
    dailyOrders: int = 0
    dailyRevenue: int = 0
    dailyLeads: int = 0
    weeklyPageViews: int = 0
    dailyPageViews: int = 0
    # WhatsApp vs Web chat
    whatsappSessions: int = 0
    whatsappQualified: int = 0
    webChatSessions: int = 0
    webChatQualified: int = 0
