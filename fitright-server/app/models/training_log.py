from sqlalchemy import Column, String, Integer, Date, DateTime
from sqlalchemy.sql import func
from app.database import Base
import uuid


class TrainingLog(Base):
    __tablename__ = "training_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False, index=True)
    date = Column(Date, nullable=False)
    duration = Column(Integer, default=0)  # 分钟
    type = Column(String(50), default="")
    created_at = Column(DateTime, server_default=func.now())
