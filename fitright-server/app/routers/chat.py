import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db, async_session
from app.models.user import User
from app.models.chat_session import ChatSession
from app.routers.user import get_current_user
from app.services.ai_service import ai_service
from app.prompts.fitness_chat import FITNESS_CHAT_SYSTEM_PROMPT, build_user_context
from app.schemas import ChatSendRequest

router = APIRouter(prefix="/chat", tags=["AI对话"])


@router.post("/send")
async def chat_send(
    req: ChatSendRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 获取或创建对话
    if req.session_id:
        result = await db.execute(
            select(ChatSession).where(
                ChatSession.id == req.session_id,
                ChatSession.user_id == current_user.id
            )
        )
        session = result.scalar_one_or_none()

    if not (req.session_id and session):
        session = ChatSession(
            user_id=current_user.id,
            title=req.message[:50],
            messages=[]
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)

    # 保存用户消息
    messages = list(session.messages or [])
    messages.append({"role": "user", "content": req.message})

    # 构建system prompt
    user_context = build_user_context(current_user)
    system_prompt = FITNESS_CHAT_SYSTEM_PROMPT.format(user_context=user_context)

    recent_messages = messages[-10:]
    session_id = session.id

    async def generate():
        full_response = ""
        try:
            async for chunk in ai_service.chat_stream(system_prompt, recent_messages):
                full_response += chunk
                yield f"data: {json.dumps({'type': 'text', 'content': chunk}, ensure_ascii=False)}\n\n"
        except Exception:
            error_msg = "抱歉，AI服务暂时不可用，请稍后再试。"
            full_response = error_msg
            yield f"data: {json.dumps({'type': 'text', 'content': error_msg}, ensure_ascii=False)}\n\n"

        # 在新session中保存AI回复
        messages.append({"role": "assistant", "content": full_response})
        async with async_session() as save_db:
            result = await save_db.execute(
                select(ChatSession).where(ChatSession.id == session_id)
            )
            saved_session = result.scalar_one_or_none()
            if saved_session:
                saved_session.messages = messages
                await save_db.commit()

        yield f"data: {json.dumps({'type': 'done', 'session_id': session_id}, ensure_ascii=False)}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.get("/sessions")
async def get_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .limit(20)
    )
    sessions = result.scalars().all()

    return [
        {
            "id": s.id,
            "title": s.title,
            "message_count": len(s.messages) if s.messages else 0,
            "created_at": str(s.created_at) if s.created_at else ""
        }
        for s in sessions
    ]


@router.get("/sessions/{session_id}")
async def get_session_detail(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="对话不存在")

    return {
        "id": session.id,
        "title": session.title,
        "messages": session.messages,
        "created_at": str(session.created_at) if session.created_at else ""
    }
