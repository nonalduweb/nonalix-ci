import httpx
from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query, Request, Response, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import require_admin_secret
from app.db.session import get_db
from app.models.models import ChatSession
from app.services.ai_agent import AIAgent
from app.services.whatsapp_service import WhatsAppService

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp Webhook"])
agent = AIAgent()
whatsapp = WhatsAppService()

VERIFY_TOKEN = "nonalix_ci_verify_token"


class TranscribeRequest(BaseModel):
    mediaId: str


@router.post("/transcribe", dependencies=[Depends(require_admin_secret)])
async def transcribe_voice(payload: TranscribeRequest):
    """
    Télécharge un vocal WhatsApp (par son media_id) et le transcrit en texte
    via OpenAI Whisper. Appelé par le workflow n8n quand un client envoie un
    message audio. Protégé par x-admin-secret.
    """
    wa_token = settings.WHATSAPP_BUSINESS_TOKEN
    openai_key = settings.OPENAI_API_KEY
    if not wa_token or not openai_key:
        raise HTTPException(status_code=503, detail="Transcription non configurée (token WhatsApp ou OpenAI manquant)")

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            # 1. Récupérer l'URL du média auprès de Meta
            meta = await client.get(
                f"https://graph.facebook.com/v21.0/{payload.mediaId}",
                headers={"Authorization": f"Bearer {wa_token}"},
            )
            meta.raise_for_status()
            media_url = meta.json().get("url")
            if not media_url:
                raise HTTPException(status_code=422, detail="URL du média introuvable")

            # 2. Télécharger le fichier audio (le CDN Meta exige aussi le token)
            audio_resp = await client.get(media_url, headers={"Authorization": f"Bearer {wa_token}"})
            audio_resp.raise_for_status()
            audio_bytes = audio_resp.content

            # 3. Transcrire via OpenAI Whisper
            whisper = await client.post(
                "https://api.openai.com/v1/audio/transcriptions",
                headers={"Authorization": f"Bearer {openai_key}"},
                files={"file": ("audio.ogg", audio_bytes, "audio/ogg")},
                data={"model": "whisper-1"},
            )
            whisper.raise_for_status()
            text = (whisper.json().get("text") or "").strip()

        return {"text": text}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[WHATSAPP TRANSCRIBE ERROR] {e}")
        raise HTTPException(status_code=502, detail=f"Échec de la transcription: {e}")

@router.get("/webhook")
def verify_whatsapp_webhook(
    mode: str = Query(None, alias="hub.mode"),
    challenge: str = Query(None, alias="hub.challenge"),
    verify_token: str = Query(None, alias="hub.verify_token")
):
    """Validation du webhook par Meta (WhatsApp Business Cloud API)."""
    if mode and verify_token:
        if mode == "subscribe" and verify_token == VERIFY_TOKEN:
            print("[WHATSAPP WEBHOOK] Webhook validé avec succès !")
            return Response(content=challenge, media_type="text/plain")
        else:
            raise HTTPException(status_code=403, detail="Jeton de vérification invalide")
    raise HTTPException(status_code=400, detail="Paramètres manquants")

@router.post("/webhook")
async def receive_whatsapp_message(request: Request, db: Session = Depends(get_db)):
    """Réception des messages WhatsApp envoyés par les utilisateurs."""
    body = await request.json()
    
    # Valider que c'est un message WhatsApp
    if "object" in body and body["object"] == "whatsapp_business_account":
        try:
            for entry in body.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    
                    # Ignorer si ce n'est pas un message (ex: statuts de lecture)
                    if "messages" not in value:
                        continue
                        
                    for msg in value.get("messages", []):
                        if msg.get("type") == "text":
                            sender_phone = msg.get("from") # Numéro de téléphone de l'expéditeur
                            message_text = msg.get("text", {}).get("body", "")
                            
                            if not sender_phone or not message_text:
                                continue
                                
                            print(f"[WHATSAPP RECEIVED] Message de {sender_phone}: {message_text}")
                            
                            # Récupérer ou créer la session de discussion WhatsApp
                            session_id = f"wa-{sender_phone}"
                            chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
                            if not chat_session:
                                chat_session = ChatSession(
                                    id=session_id,
                                    platform="whatsapp",
                                    currentState="greeting"
                                )
                                db.add(chat_session)
                                db.commit()
                                db.refresh(chat_session)
                            
                            # Obtenir la réponse de l'Agent IA
                            reply = await agent.process_message(message_text, chat_session, db)
                            
                            # Envoyer la réponse via WhatsApp API
                            await whatsapp.send_message(sender_phone, reply)
                            
        except Exception as e:
            print(f"[WHATSAPP WEBHOOK ERROR] Erreur lors du traitement du message : {e}")
            
    # Toujours retourner 200 OK à Meta pour éviter qu'ils renvoient le message
    return Response(content="EVENT_RECEIVED", status_code=200)
