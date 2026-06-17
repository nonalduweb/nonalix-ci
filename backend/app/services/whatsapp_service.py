import httpx
from app.core.config import settings

class WhatsAppService:
    def __init__(self):
        self.api_version = "v18.0"
        self.base_url = f"https://graph.facebook.com/{self.api_version}"

    async def send_message(self, to_phone: str, text: str) -> bool:
        """Envoie un message texte via WhatsApp Cloud API."""
        if not settings.WHATSAPP_BUSINESS_TOKEN or not settings.WHATSAPP_PHONE_NUMBER_ID:
            # Mode simulation si credentials manquants
            print(f"[WHATSAPP SIMULATION] Message pour {to_phone} : {text}")
            return True

        url = f"{self.base_url}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
        headers = {
            "Authorization": f"Bearer {settings.WHATSAPP_BUSINESS_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to_phone,
            "type": "text",
            "text": {
                "body": text
            }
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=payload, timeout=10.0)
            
            if response.status_code in [200, 201]:
                print(f"[WHATSAPP SUCCESS] Message envoyé à {to_phone}")
                return True
            else:
                print(f"[WHATSAPP ERROR] Code {response.status_code} : {response.text}")
                return False
        except Exception as e:
            print(f"[WHATSAPP EXCEPTION] Impossible d'envoyer le message : {e}")
            return False
