from sqlalchemy import Column, String, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.database import Base
import uuid


class PostureAssessment(Base):
    __tablename__ = "posture_assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False, index=True)
    front_image_url = Column(String(500), default="")
    side_image_url = Column(String(500), default="")
    back_image_url = Column(String(500), default="")
    overall_rating = Column(String(20), default="")
    issues = Column(JSON, default=list)
    training_plan = Column(JSON, default=dict)
    status = Column(String(20), default="analyzing")
    created_at = Column(DateTime, server_default=func.now())
