import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.models.posture_assessment import PostureAssessment
from app.routers.user import get_current_user
from app.services.ai_service import ai_service
from app.prompts.posture_assessment import POSTURE_ASSESSMENT_PROMPT
from app.config import settings

router = APIRouter(prefix="/posture", tags=["体态评估"])


class PostureAssessRequest(BaseModel):
    front_image_url: str
    side_image_url: str
    back_image_url: str


async def assess_posture_task(assessment_id: str, image_paths: list[str]):
    """后台异步评估体态"""
    from app.database import async_session

    async with async_session() as db:
        try:
            ai_result = await ai_service.analyze_images(
                image_paths, POSTURE_ASSESSMENT_PROMPT
            )

            result = await db.execute(
                select(PostureAssessment).where(PostureAssessment.id == assessment_id)
            )
            assessment = result.scalar_one()
            assessment.overall_rating = ai_result.get("overall_rating", "")
            assessment.issues = ai_result.get("issues", [])
            assessment.training_plan = ai_result.get("training_plan", {})
            assessment.status = "completed"
            await db.commit()

        except Exception as e:
            print(f"体态评估失败: {e}")
            result = await db.execute(
                select(PostureAssessment).where(PostureAssessment.id == assessment_id)
            )
            assessment = result.scalar_one_or_none()
            if assessment:
                assessment.status = "failed"
                await db.commit()


@router.post("/upload-image")
async def upload_single_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """上传单张图片，返回文件路径"""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex}_{file.filename or 'image.jpg'}"
    path = os.path.join(settings.UPLOAD_DIR, filename)
    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)
    return {"url": path, "filename": filename}


@router.post("/assess")
async def create_posture_assessment(
    req: PostureAssessRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """创建体态评估任务（图片已通过 /upload-image 上传）"""
    image_paths = [req.front_image_url, req.side_image_url, req.back_image_url]

    assessment = PostureAssessment(
        user_id=current_user.id,
        front_image_url=req.front_image_url,
        side_image_url=req.side_image_url,
        back_image_url=req.back_image_url,
        status="analyzing"
    )
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)

    background_tasks.add_task(assess_posture_task, assessment.id, image_paths)

    return {"id": assessment.id, "status": "analyzing", "message": "照片已上传，正在评估中..."}


@router.get("/{assessment_id}")
async def get_posture_result(
    assessment_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(PostureAssessment).where(
            PostureAssessment.id == assessment_id,
            PostureAssessment.user_id == current_user.id
        )
    )
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="评估记录不存在")

    return {
        "id": assessment.id,
        "status": assessment.status,
        "overall_rating": assessment.overall_rating,
        "issues": assessment.issues,
        "training_plan": assessment.training_plan,
        "created_at": str(assessment.created_at) if assessment.created_at else ""
    }


@router.get("/history")
async def get_posture_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(PostureAssessment)
        .where(PostureAssessment.user_id == current_user.id)
        .order_by(PostureAssessment.created_at.desc())
        .limit(20)
    )
    assessments = result.scalars().all()

    return [
        {
            "id": a.id,
            "status": a.status,
            "overall_rating": a.overall_rating,
            "created_at": str(a.created_at) if a.created_at else ""
        }
        for a in assessments
    ]
