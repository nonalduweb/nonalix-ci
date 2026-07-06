from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Product(Base):
    __tablename__ = 'Product'

    id = Column(String(255), primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    category = Column(String(255), nullable=False)
    imageUrl = Column(Text, nullable=False)
    inStock = Column(Boolean, default=True, nullable=False)
    featured = Column(Boolean, default=False, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    orderItems = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = 'Order'

    id = Column(String(255), primary_key=True)
    firstName = Column(String(255), nullable=False)
    lastName = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    city = Column(String(255), nullable=False)
    totalAmount = Column(Integer, nullable=False)
    paymentMethod = Column(String(100), nullable=False)
    paymentStatus = Column(String(50), default="pending", nullable=False)
    orderStatus = Column(String(50), default="new", nullable=False)
    transactionId = Column(String(255), nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = 'OrderItem'

    id = Column(String(255), primary_key=True)
    quantity = Column(Integer, nullable=False)
    unitPrice = Column(Integer, nullable=False)
    productId = Column(String(255), ForeignKey('Product.id'), nullable=False)
    orderId = Column(String(255), ForeignKey('Order.id'), nullable=False)

    product = relationship("Product", back_populates="orderItems")
    order = relationship("Order", back_populates="items")


class ContactLead(Base):
    __tablename__ = 'ContactLead'

    id = Column(String(255), primary_key=True)
    firstName = Column(String(255), nullable=False)
    lastName = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(100), default="contact", nullable=False)
    status = Column(String(50), default="new", nullable=False)
    company = Column(String(255), nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)


class PageView(Base):
    __tablename__ = 'PageView'

    id = Column(String(255), primary_key=True)
    url = Column(String(500), nullable=False)
    referrer = Column(Text, nullable=True)
    userAgent = Column(Text, nullable=True)
    ip = Column(String(100), nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)



class ChatSession(Base):
    __tablename__ = 'ChatSession'

    id = Column(String(255), primary_key=True) # Numéro de téléphone ou UUID
    platform = Column(String(50), default="web", nullable=False) # "web" ou "whatsapp"
    leadName = Column(String(255), nullable=True)
    leadCompany = Column(String(255), nullable=True)
    leadActivity = Column(String(255), nullable=True)
    leadPhone = Column(String(50), nullable=True)
    leadEmail = Column(String(255), nullable=True)
    leadNeed = Column(Text, nullable=True)
    isQualified = Column(Boolean, default=False, nullable=False)
    currentState = Column(String(100), default="greeting", nullable=False) # Suivi de l'état pour le bot déterministe
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = 'ChatMessage'

    id = Column(String(255), primary_key=True)
    sessionId = Column(String(255), ForeignKey('ChatSession.id'), nullable=False)
    role = Column(String(50), nullable=False) # "user" ou "assistant"
    content = Column(Text, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)

    session = relationship("ChatSession", back_populates="messages")


class BlogPost(Base):
    __tablename__ = 'BlogPost'

    id = Column(String(255), primary_key=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    title = Column(String(500), nullable=False)
    description = Column(String(500), nullable=True)
    contentHtml = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    categoryLabel = Column(String(100), nullable=True)
    tags = Column(Text, nullable=True)
    image = Column(Text, nullable=True)
    author = Column(String(255), default="Équipe NONALIX CI", nullable=False)
    readingTime = Column(Integer, default=7, nullable=False)
    featured = Column(Boolean, default=False, nullable=False)
    published = Column(Boolean, default=True, nullable=False)
    keywords = Column(Text, nullable=True)
    metaOgTitle = Column(String(500), nullable=True)
    metaOgDescription = Column(String(300), nullable=True)
    publishedAt = Column(DateTime, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)


class AgentConfig(Base):
    __tablename__ = 'AgentConfig'

    id = Column(String(255), primary_key=True)
    slug = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    systemPrompt = Column(Text, nullable=False)
    firstMessage = Column(Text, nullable=False)
    variables = Column(Text, nullable=False) # JSON-string representation
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
