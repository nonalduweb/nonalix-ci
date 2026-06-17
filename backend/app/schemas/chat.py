from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageCreate(BaseModel):
    message: str
    sessionId: Optional[str] = None
    platform: Optional[str] = "web"
    leadName: Optional[str] = None
    leadEmail: Optional[str] = None
    leadPhone: Optional[str] = None

class MessageResponse(BaseModel):
    reply: str
    sessionId: str
    isQualified: bool
    platform: str

class ChatMessageSchema(BaseModel):
    id: str
    role: str
    content: str
    createdAt: datetime

    class Config:
        from_attributes = True

class ChatHistoryResponse(BaseModel):
    sessionId: str
    isQualified: bool
    messages: List[ChatMessageSchema]
