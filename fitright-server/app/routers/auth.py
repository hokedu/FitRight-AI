from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import LoginRequest, TokenResponse
from app.utils.auth import create_access_token

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    """手机号 + 验证码登录（MVP阶段验证码不校验）"""
    result = await db.execute(select(User).where(User.phone == req.phone))
    user = result.scalar_one_or_none()

    if not user:
        user = User(phone=req.phone, nickname=f"用户{req.phone[-4:]}")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(
        token=token,
        user={
            "id": user.id,
            "phone": user.phone,
            "nickname": user.nickname,
            "avatar_url": user.avatar_url
        }
    )


@router.post("/dev-login", response_model=TokenResponse)
async def dev_login(db: AsyncSession = Depends(get_db)):
    """开发模式自动登录：创建或返回默认用户"""
    result = await db.execute(select(User).where(User.phone == "13800000000"))
    user = result.scalar_one_or_none()

    if not user:
        user = User(phone="13800000000", nickname="健身达人")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(
        token=token,
        user={
            "id": user.id,
            "phone": user.phone,
            "nickname": user.nickname,
            "avatar_url": user.avatar_url
        }
    )
