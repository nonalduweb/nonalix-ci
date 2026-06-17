"""Configuration du backend NONALIX CI"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Base
    APP_NAME: str = "NONALIX CI API"
    DEBUG: bool = True

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "https://nonalix.ci"]

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/nonalix_ci"

    # IA Agent (Phase 2)
    OPENAI_API_KEY: str = ""
    AI_MODEL: str = "gpt-4"

    # WhatsApp Business API (Phase 2)
    WHATSAPP_BUSINESS_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
