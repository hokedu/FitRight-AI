from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.analysis import router as analysis_router
from app.routers.posture import router as posture_router
from app.routers.chat import router as chat_router

__all__ = ["auth_router", "user_router", "analysis_router", "posture_router", "chat_router"]
