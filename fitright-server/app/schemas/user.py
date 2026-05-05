from pydantic import BaseModel
from typing import Optional


class LoginRequest(BaseModel):
    phone: str
    code: str


class TokenResponse(BaseModel):
    token: str
    user: dict


class UserProfile(BaseModel):
    id: str
    phone: str
    nickname: str
    avatar_url: str
    signature: str
    gender: str
    age: int
    height: float
    weight: float
    training_goal: str
    training_exp: str
    training_pref: str
    session_duration: str
    focus_areas: list


class FitnessInfoUpdate(BaseModel):
    gender: Optional[str] = None
    age: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    training_goal: Optional[str] = None
    training_exp: Optional[str] = None
    training_pref: Optional[str] = None
    session_duration: Optional[str] = None
    focus_areas: Optional[list] = None
