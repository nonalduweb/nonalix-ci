"""
NONALIX CI — Backend FastAPI
Phase 2 : Agent IA, WhatsApp Business API, Analytics
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.routers import chat, whatsapp, analytics, leads
from app.db.session import engine, Base
from app.models import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Créer les tables si elles n'existent pas
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="NONALIX CI API",
    description="Backend API pour les services IA et automatisation de NONALIX CI",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS pour le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrement des routeurs API v1
app.include_router(chat.router, prefix="/api/v1")
app.include_router(whatsapp.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(leads.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "nonalix-ci-api"}

