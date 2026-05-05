from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, Enum as SAEnum
from sqlalchemy.sql import func
from app.database import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String(20), unique=True, nullable=False, index=True)
    nickname = Column(String(50), default="健身达人")
    avatar_url = Column(String(500), default="")
    signature = Column(String(200), default="坚持就是胜利")
    gender = Column(String(10), default="")
    age = Column(Integer, default=0)
    height = Column(Float, default=0)
    weight = Column(Float, default=0)
    training_goal = Column(String(50), default="")
    training_exp = Column(String(20), default="")
    training_pref = Column(String(20), default="")
    session_duration = Column(String(20), default="")
    focus_areas = Column(JSON, default=list)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
