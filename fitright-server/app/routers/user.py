from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.user import User
from app.models.training_log import TrainingLog
from app.schemas.user import FitnessInfoUpdate
from app.utils.auth import decode_access_token

router = APIRouter(prefix="/user", tags=["用户"])


async def get_current_user(
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未授权")

    token = authorization.split(" ", 1)[1]
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Token无效")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")

    return user


@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "phone": current_user.phone,
        "nickname": current_user.nickname,
        "avatar_url": current_user.avatar_url,
        "signature": current_user.signature,
        "gender": current_user.gender,
        "age": current_user.age,
        "height": current_user.height,
        "weight": current_user.weight,
        "training_goal": current_user.training_goal,
        "training_exp": current_user.training_exp,
        "training_pref": current_user.training_pref,
        "session_duration": current_user.session_duration,
        "focus_areas": current_user.focus_areas
    }


@router.put("/fitness-info")
async def update_fitness_info(
    info: FitnessInfoUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    update_data = info.model_dump(exclude_none=True)
    for key, value in update_data.items():
        if key in ("age", "height", "weight"):
            try:
                value = float(value) if key in ("height", "weight") else int(value)
            except (ValueError, TypeError):
                pass
        setattr(current_user, key, value)

    await db.commit()
    return {"message": "更新成功"}


@router.get("/stats")
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 累计训练天数
    days_result = await db.execute(
        select(func.count(func.distinct(TrainingLog.date)))
        .where(TrainingLog.user_id == current_user.id)
    )
    total_days = days_result.scalar() or 0

    # 总时长
    hours_result = await db.execute(
        select(func.sum(TrainingLog.duration))
        .where(TrainingLog.user_id == current_user.id)
    )
    total_minutes = hours_result.scalar() or 0

    return {
        "totalDays": total_days,
        "weekCount": 0,
        "totalHours": round(total_minutes / 60, 1)
    }
