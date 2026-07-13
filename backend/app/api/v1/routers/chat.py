import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import require_admin_secret
from app.models.models import ChatSession, ChatMessage, ContactLead, AgentConfig
from app.schemas.chat import MessageCreate, MessageResponse, ChatHistoryResponse, ChatMessageSchema, AgentConfigCreate, AgentConfigResponse
from app.services.ai_agent import AIAgent

router = APIRouter(prefix="/chat", tags=["Web Chat"])
agent = AIAgent()

@router.post("/message", response_model=MessageResponse)
async def send_chat_message(payload: MessageCreate, db: Session = Depends(get_db)):
    """Envoie un message à l'Agent IA et obtient une réponse."""
    session_id = payload.sessionId
    
    # Générer une session si non fournie
    if not session_id:
        session_id = f"web-{uuid.uuid4()}"
    
    # Récupérer ou créer la session de discussion
    chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not chat_session:
        has_lead_info = bool(payload.leadName and payload.leadPhone)
        chat_session = ChatSession(
            id=session_id,
            platform=payload.platform or "web",
            currentState="ask_activity" if has_lead_info else "greeting",
            leadName=payload.leadName or None,
            leadEmail=payload.leadEmail or None,
            leadPhone=payload.leadPhone or None,
            isQualified=has_lead_info
        )
        db.add(chat_session)
        
        # Enregistrer immédiatement comme lead qualifié si infos fournies
        if has_lead_info:
            lead = ContactLead(
                id=str(uuid.uuid4()),
                firstName=payload.leadName,
                email=payload.leadEmail,
                phone=payload.leadPhone,
                message="[Qualifié via Formulaire d'accueil Chatbot]",
                type="quote_request",
                status="new"
            )
            db.add(lead)
            
        db.commit()
        db.refresh(chat_session)
        
        # Personnaliser le message de bienvenue si on connaît le nom
        if payload.leadName:
            welcome_reply = f"Bonjour {payload.leadName} ! 👋 Ravi de faire votre connaissance. Comment puis-je vous aider aujourd'hui ? Souhaitez-vous en savoir plus sur nos services d'agence B2B (Création web, SEO, Chatbot) ou sur nos packs de formation en ligne (Boutique) ?"
        else:
            welcome_reply = "Bonjour ! 👋 Bienvenue chez NONALIX CI. Je suis votre assistant virtuel commercial. Pourriez-vous me donner votre nom ainsi que le nom de votre entreprise ?"
            
        # Enregistrer le message de bienvenue dans la base de données
        welcome_msg = ChatMessage(
            id=str(uuid.uuid4()),
            sessionId=session_id,
            role="assistant",
            content=welcome_reply
        )
        db.add(welcome_msg)
        db.commit()
        
        # Si le premier message de l'utilisateur n'est qu'un salut ou vide, on retourne directement le bienvenue
        if payload.message.lower().strip() in ["hello", "bonjour", "salut", "hi", "test", "commencer", ""]:
            return MessageResponse(
                reply=welcome_reply,
                sessionId=session_id,
                isQualified=chat_session.isQualified,
                platform=chat_session.platform
            )

    # Traiter le message de l'utilisateur avec l'Agent IA
    reply = await agent.process_message(payload.message, chat_session, db)
    
    # Rafraîchir l'état de la session pour retourner le statut de qualification à jour
    db.refresh(chat_session)

    return MessageResponse(
        reply=reply,
        sessionId=session_id,
        isQualified=chat_session.isQualified,
        platform=chat_session.platform
    )

@router.get("/history/{session_id}", response_model=ChatHistoryResponse)
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    """Récupère l'historique complet d'une session de chat."""
    chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not chat_session:
        raise HTTPException(status_code=404, detail="Session de discussion introuvable")

    messages = db.query(ChatMessage).filter(ChatMessage.sessionId == session_id).order_by(ChatMessage.createdAt.asc()).all()
    
    # Mapper vers le schéma de réponse
    mapped_messages = [
        ChatMessageSchema(
            id=m.id,
            role=m.role,
            content=m.content,
            createdAt=m.createdAt
        ) for m in messages
    ]

    return ChatHistoryResponse(
        sessionId=chat_session.id,
        isQualified=chat_session.isQualified,
        messages=mapped_messages
    )


@router.get(
    "/config/{slug}",
    response_model=AgentConfigResponse,
    dependencies=[Depends(require_admin_secret)],
)
def get_agent_config(slug: str, db: Session = Depends(get_db)):
    """Récupère la configuration d'un agent IA par son slug (admin uniquement — expose le system prompt)."""
    config = db.query(AgentConfig).filter(AgentConfig.slug == slug.lower().strip()).first()
    if not config:
        raise HTTPException(status_code=404, detail=f"Configuration d'agent '{slug}' introuvable")
    return config


@router.post(
    "/config",
    response_model=AgentConfigResponse,
    dependencies=[Depends(require_admin_secret)],
)
def upsert_agent_config(payload: AgentConfigCreate, db: Session = Depends(get_db)):
    """Crée ou met à jour la configuration d'un agent IA."""
    slug_clean = payload.slug.lower().strip()
    config = db.query(AgentConfig).filter(AgentConfig.slug == slug_clean).first()
    
    if config:
        # Update
        config.name = payload.name
        config.systemPrompt = payload.systemPrompt
        config.firstMessage = payload.firstMessage
        config.variables = payload.variables
    else:
        # Create
        config = AgentConfig(
            id=str(uuid.uuid4()),
            slug=slug_clean,
            name=payload.name,
            systemPrompt=payload.systemPrompt,
            firstMessage=payload.firstMessage,
            variables=payload.variables
        )
        db.add(config)
        
    db.commit()
    db.refresh(config)
    return config
