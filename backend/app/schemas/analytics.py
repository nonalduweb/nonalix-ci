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
