import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import time
from app.config import settings
from app.database import init_db
from app.routers import auth_router, user_router, analysis_router, posture_router, chat_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="FitRight AI - 智能健身助手 API",
    lifespan=lifespan
)

# 请求超时中间件（对大文件上传放宽超时）
@app.middleware("http")
async def timeout_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    return response

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS + ["*"],  # MVP阶段允许所有来源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")
app.include_router(analysis_router, prefix="/api/v1")
app.include_router(posture_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")

# 静态文件服务（上传的文件）
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/")
async def root():
    return {"message": "FitRight AI API is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
