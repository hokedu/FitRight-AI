from sqlalchemy import Column, String, Integer, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.database import Base
import uuid


class ExerciseAnalysis(Base):
    __tablename__ = "exercise_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False, index=True)
    video_url = Column(String(500), default="")
    exercise_type = Column(String(50), default="")
    score = Column(Integer, default=0)
    issues = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    key_frames = Column(JSON, default=list)
    overall_suggestion = Column(Text, default="")
    status = Column(String(20), default="analyzing")  # analyzing / completed / failed
    created_at = Column(DateTime, server_default=func.now())
