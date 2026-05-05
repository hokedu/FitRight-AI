import os
import uuid
import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.exercise_analysis import ExerciseAnalysis
from app.routers.user import get_current_user
from app.services.ai_service import ai_service
from app.prompts.exercise_analysis import EXERCISE_ANALYSIS_PROMPT
from app.config import settings

router = APIRouter(prefix="/analysis", tags=["运动分析"])


async def analyze_video_task(analysis_id: str, video_path: str, exercise_type: str):
    """后台异步分析视频任务"""
    from app.database import async_session

    frames = []
    async with async_session() as db:
        try:
            frames = extract_key_frames(video_path)

            if not frames:
                result = await db.execute(
                    select(ExerciseAnalysis).where(ExerciseAnalysis.id == analysis_id)
                )
                analysis = result.scalar_one()
                analysis.status = "failed"
                await db.commit()
                return

            prompt = EXERCISE_ANALYSIS_PROMPT.format(
                exercise_type=exercise_type or "未指定"
            )

            ai_result = await ai_service.analyze_images(frames, prompt)

            result = await db.execute(
                select(ExerciseAnalysis).where(ExerciseAnalysis.id == analysis_id)
            )
            analysis = result.scalar_one()
            analysis.score = ai_result.get("score", 0)
            analysis.issues = ai_result.get("issues", [])
            analysis.overall_suggestion = ai_result.get("overall_suggestion", "")
            analysis.status = "completed"
            await db.commit()

        except Exception as e:
            print(f"分析失败: {e}")
            result = await db.execute(
                select(ExerciseAnalysis).where(ExerciseAnalysis.id == analysis_id)
            )
            analysis = result.scalar_one_or_none()
            if analysis:
                analysis.status = "failed"
                await db.commit()
        finally:
            for f in frames:
                try:
                    os.remove(f)
                except OSError:
                    pass


def extract_key_frames(video_path: str, max_frames: int = 15) -> list[str]:
    """从视频中均匀提取关键帧，覆盖整个时长"""
    try:
        import cv2
    except ImportError:
        return []

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_fps = cap.get(cv2.CAP_PROP_FPS)
    if video_fps <= 0:
        video_fps = 30
    if total_frames <= 0:
        total_frames = video_fps * 60  # 默认按60秒算

    # 均匀采样：每隔 N 帧取一帧，确保覆盖整段视频
    step = max(1, total_frames // max_frames)
    frames = []
    candidates = range(0, total_frames, step)

    for idx, target_frame in enumerate(candidates):
        if len(frames) >= max_frames:
            break
        cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
        ret, frame = cap.read()
        if ret:
            frame_path = os.path.join(settings.UPLOAD_DIR, f"frame_{uuid.uuid4().hex[:8]}.jpg")
            cv2.imwrite(frame_path, frame)
            frames.append(frame_path)

    cap.release()
    return frames


@router.post("/upload")
async def upload_video(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    exercise_type: str = Form(""),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """上传视频并立即开始AI分析"""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    video_filename = f"{uuid.uuid4().hex}_{video.filename}"
    video_path = os.path.join(settings.UPLOAD_DIR, video_filename)

    content = await video.read()
    with open(video_path, "wb") as f:
        f.write(content)

    analysis = ExerciseAnalysis(
        user_id=current_user.id,
        video_url=video_path,
        exercise_type=exercise_type,
        status="analyzing"
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)

    background_tasks.add_task(analyze_video_task, analysis.id, video_path, exercise_type)

    return {"id": analysis.id, "status": "analyzing", "message": "视频已上传，正在分析中..."}


@router.get("/{analysis_id}")
async def get_analysis_result(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ExerciseAnalysis).where(
            ExerciseAnalysis.id == analysis_id,
            ExerciseAnalysis.user_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="分析记录不存在")

    return {
        "id": analysis.id,
        "status": analysis.status,
        "exercise_type": analysis.exercise_type,
        "score": analysis.score,
        "issues": analysis.issues,
        "key_frames": analysis.key_frames,
        "overall_suggestion": analysis.overall_suggestion,
        "created_at": str(analysis.created_at) if analysis.created_at else ""
    }


@router.get("/history")
async def get_analysis_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ExerciseAnalysis)
        .where(ExerciseAnalysis.user_id == current_user.id)
        .order_by(ExerciseAnalysis.created_at.desc())
        .limit(20)
    )
    analyses = result.scalars().all()

    return [
        {
            "id": a.id,
            "status": a.status,
            "exercise_type": a.exercise_type,
            "score": a.score,
            "created_at": str(a.created_at) if a.created_at else ""
        }
        for a in analyses
    ]
