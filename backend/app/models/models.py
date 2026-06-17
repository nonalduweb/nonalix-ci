from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Product(Base):
    __tablename__ = 'Product'

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    imageUrl = Column(String, nullable=False)
    inStock = Column(Boolean, default=True, nullable=False)
    featured = Column(Boolean, default=False, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    orderItems = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = 'Order'

    id = Column(String, primary_key=True)
    firstName = Column(String, nullable=False)
    lastName = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    city = Column(String, nullable=False)
    totalAmount = Column(Integer, nullable=False)
    paymentMethod = Column(String, nullable=False)
    paymentStatus = Column(String, default="pending", nullable=False)
    orderStatus = Column(String, default="new", nullable=False)
    transactionId = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = 'OrderItem'

    id = Column(String, primary_key=True)
    quantity = Column(Integer, nullable=False)
    unitPrice = Column(Integer, nullable=False)
    productId = Column(String, ForeignKey('Product.id'), nullable=False)
    orderId = Column(String, ForeignKey('Order.id'), nullable=False)

    product = relationship("Product", back_populates="orderItems")
    order = relationship("Order", back_populates="items")


class ContactLead(Base):
    __tablename__ = 'ContactLead'

    id = Column(String, primary_key=True)
    firstName = Column(String, nullable=False)
    lastName = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, default="contact", nullable=False)
    status = Column(String, default="new", nullable=False)
    company = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)


class PageView(Base):
    __tablename__ = 'PageView'

    id = Column(String, primary_key=True)
    url = Column(String, nullable=False)
    referrer = Column(String, nullable=True)
    userAgent = Column(String, nullable=True)
    ip = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)



class ChatSession(Base):
    __tablename__ = 'ChatSession'

    id = Column(String, primary_key=True) # Numéro de téléphone ou UUID
    platform = Column(String, default="web", nullable=False) # "web" ou "whatsapp"
    leadName = Column(String, nullable=True)
    leadCompany = Column(String, nullable=True)
    leadActivity = Column(String, nullable=True)
    leadPhone = Column(String, nullable=True)
    leadEmail = Column(String, nullable=True)
    leadNeed = Column(String, nullable=True)
    isQualified = Column(Boolean, default=False, nullable=False)
    currentState = Column(String, default="greeting", nullable=False) # Suivi de l'état pour le bot déterministe
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = 'ChatMessage'

    id = Column(String, primary_key=True)
    sessionId = Column(String, ForeignKey('ChatSession.id'), nullable=False)
    role = Column(String, nullable=False) # "user" ou "assistant"
    content = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)

    session = relationship("ChatSession", back_populates="messages")
