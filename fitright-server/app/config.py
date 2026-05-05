from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "FitRight AI"
    DEBUG: bool = True

    # Database - 默认使用SQLite方便开发
    DATABASE_URL: str = "sqlite+aiosqlite:///./fitright.db"

    # JWT
    JWT_SECRET_KEY: str = "fitright-ai-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 10080  # 7天

    # AI API (通义千问)
    DASHSCOPE_API_KEY: str = ""
    DASHSCOPE_BASE_URL: str = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    DASHSCOPE_VL_MODEL: str = "qwen-vl-max"
    DASHSCOPE_CHAT_MODEL: str = "qwen-max"

    # 对象存储 - MVP阶段用本地存储
    UPLOAD_DIR: str = "./uploads"

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:8080"]

    class Config:
        env_file = ".env"


settings = Settings()
