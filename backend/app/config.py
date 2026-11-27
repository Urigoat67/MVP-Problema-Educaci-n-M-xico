from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Aula de Retos API"
    api_v1_prefix: str = "/api/v1"
    debug: bool = False

    database_url: str = "sqlite:///./aula.db"

    secret_key: str = "cambia-esta-clave-en-produccion"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    seed_admin_username: str = "admin"
    seed_admin_password: str = "AdminAula2026"

    # Reels
    media_dir: str = "./media"
    reel_fps: int = 24
    reel_width: int = 720
    reel_height: int = 1280
    reel_max_duration: float = 20.0
    edge_tts_voice: str = "es-MX-DaliaNeural"
    llm_api_key: str | None = None
    llm_base_url: str = "https://api.deepseek.com/v1"
    llm_model: str = "deepseek-chat"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
