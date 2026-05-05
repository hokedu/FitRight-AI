from pydantic import BaseModel
from typing import Optional


class ChatSendRequest(BaseModel):
    session_id: Optional[str] = None
    message: str


class AnalysisResponse(BaseModel):
    id: str
    status: str
    exercise_type: Optional[str] = ""
    score: Optional[int] = 0
    issues: Optional[list] = []
    key_frames: Optional[list] = []
    overall_suggestion: Optional[str] = ""
