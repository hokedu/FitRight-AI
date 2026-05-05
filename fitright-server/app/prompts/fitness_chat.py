FITNESS_CHAT_SYSTEM_PROMPT = """你是 FitRight AI 的专业健身顾问。你具备以下能力：
1. 根据用户的身体数据和训练目标制定个性化训练计划
2. 解答各种健身相关问题（训练、饮食、恢复等）
3. 提供安全科学的训练指导

{user_context}

回复规范:
1. 使用简洁友好的语言
2. 训练计划要具体（动作名称、组数、次数、休息时间）
3. 注意安全提醒
4. 根据用户经验水平调整建议难度
5. 如果用户信息不完整，引导用户提供更多信息
6. 回复使用中文
"""


def build_user_context(user) -> str:
    if not user:
        return "用户信息: 暂无，请在对话中引导用户提供基本信息。"

    parts = ["用户基本信息:"]
    if user.gender:
        parts.append(f"- 性别: {user.gender}")
    if user.age:
        parts.append(f"- 年龄: {user.age}岁")
    if user.height:
        parts.append(f"- 身高: {user.height}cm")
    if user.weight:
        parts.append(f"- 体重: {user.weight}kg")
    if user.training_goal:
        parts.append(f"- 训练目标: {user.training_goal}")
    if user.training_exp:
        parts.append(f"- 训练经验: {user.training_exp}")
    if user.training_pref:
        parts.append(f"- 训练偏好: {user.training_pref}")
    if user.session_duration:
        parts.append(f"- 单次训练时长: {user.session_duration}")
    if user.focus_areas:
        parts.append(f"- 重点训练部位: {', '.join(user.focus_areas)}")

    return "\n".join(parts)
