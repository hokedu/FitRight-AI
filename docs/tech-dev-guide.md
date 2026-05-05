# FitRight AI — 个人开发者技术开发文档

## 一、技术架构总览

```
┌─────────────────────────────────────────────────────┐
│                   客户端 (uni-app)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ AI纠错页  │  │ AI对话页  │  │  我的页   │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       └──────────────┼──────────────┘                │
│                      │                               │
│              uni.request / SSE                        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────┴──────────────────────────────┐
│                后端 (Python FastAPI)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 用户模块  │  │ AI分析模块 │ │ 对话模块  │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       │              │              │                │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐          │
│  │ MySQL/   │  │ 对象存储  │  │ 大模型API │          │
│  │ PostgreSQL│  │ (OSS)    │  │          │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## 二、技术选型清单

### 2.1 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| uni-app | Vue3 + Vite | 跨平台框架（小程序/H5/App） |
| Vue 3 | 3.x | UI框架 |
| Pinia | 2.x | 状态管理 |
| uni-ui | latest | UI组件库 |
| lottie | - | 加载动画 |

### 2.2 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Python | 3.11+ | 开发语言 |
| FastAPI | 0.100+ | Web框架 |
| SQLAlchemy | 2.x | ORM |
| Alembic | 1.x | 数据库迁移 |
| Pydantic | 2.x | 数据验证 |
| uvicorn | 0.23+ | ASGI服务器 |
| python-jose | - | JWT认证 |
| httpx | - | 异步HTTP客户端（调用大模型API） |
| python-multipart | - | 文件上传 |

### 2.3 基础设施

| 服务 | 推荐方案 | 用途 |
|------|---------|------|
| 数据库 | PostgreSQL 15 / MySQL 8 | 持久化存储 |
| 对象存储 | 阿里云OSS / 腾讯云COS | 视频、图片存储 |
| 缓存 | Redis 7 | 会话缓存、限流 |
| 部署 | 阿里云ECS / 腾讯云轻量 | 服务器 |
| AI API | 通义千问VL / GPT-4o | 视觉+文本大模型 |

### 2.4 AI 模型API选择

| 能力 | 推荐API | 备选 | 说明 |
|------|---------|------|------|
| 运动视频分析 | 通义千问VL (qwen-vl-max) | GPT-4o Vision | 支持视频帧分析，理解动作 |
| 体态图片评估 | 通义千问VL | Claude 3.5 Sonnet | 多图理解能力 |
| 健身对话 | 通义千问 (qwen-max) | GPT-4o / DeepSeek | 文本对话，健身知识丰富 |
| 视频关键帧提取 | OpenCV (本地) | FFmpeg | 从视频中提取关键帧 |

---

## 三、项目结构

### 3.1 前端项目结构（uni-app）

```
fitright-app/
├── src/
│   ├── pages/                     # 页面目录
│   │   ├── home/                  # 首页(AI纠错Tab)
│   │   │   └── index.vue
│   │   ├── exercise-analysis/     # 运动纠错页
│   │   │   ├── index.vue          # 上传页
│   │   │   └── result.vue         # 结果页
│   │   ├── posture-assessment/    # 体态评估页
│   │   │   ├── index.vue          # 上传页
│   │   │   └── result.vue         # 结果页
│   │   ├── chat/                  # AI对话页
│   │   │   └── index.vue
│   │   ├── profile/               # 我的页面
│   │   │   └── index.vue
│   │   ├── login/                 # 登录页
│   │   │   └── index.vue
│   │   └── settings/              # 设置页
│   │       └── index.vue
│   ├── components/                # 公共组件
│   │   ├── TabBar.vue             # 底部导航栏
│   │   ├── ChatBubble.vue         # 对话气泡
│   │   ├── InfoCollectPopup.vue   # 信息采集弹窗
│   │   ├── VideoUploader.vue      # 视频上传组件
│   │   ├── ImageUploader.vue      # 图片上传组件
│   │   ├── AnalysisLoading.vue    # 分析加载动画
│   │   └── ScoreCard.vue          # 评分卡片
│   ├── stores/                    # Pinia 状态管理
│   │   ├── user.js                # 用户状态
│   │   ├── chat.js                # 对话状态
│   │   └── analysis.js            # 分析记录状态
│   ├── api/                       # 接口封装
│   │   ├── request.js             # 请求封装(拦截器/token)
│   │   ├── user.js                # 用户相关接口
│   │   ├── analysis.js            # 运动分析接口
│   │   ├── posture.js             # 体态评估接口
│   │   └── chat.js                # AI对话接口
│   ├── utils/                     # 工具函数
│   │   ├── auth.js                # 认证工具
│   │   └── format.js              # 格式化工具
│   ├── static/                    # 静态资源
│   │   ├── images/
│   │   └── icons/
│   ├── App.vue
│   ├── main.js
│   ├── manifest.json              # uni-app 配置
│   ├── pages.json                 # 路由配置
│   └── uni.scss                   # 全局样式变量
├── package.json
└── vite.config.js
```

### 3.2 后端项目结构（FastAPI）

```
fitright-server/
├── app/
│   ├── main.py                    # FastAPI 应用入口
│   ├── config.py                  # 配置管理
│   ├── database.py                # 数据库连接
│   ├── models/                    # SQLAlchemy 模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── exercise_analysis.py
│   │   ├── posture_assessment.py
│   │   ├── chat_session.py
│   │   └── training_log.py
│   ├── schemas/                   # Pydantic 数据模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── analysis.py
│   │   ├── posture.py
│   │   └── chat.py
│   ├── routers/                   # 路由模块
│   │   ├── __init__.py
│   │   ├── auth.py                # 认证接口
│   │   ├── user.py                # 用户接口
│   │   ├── analysis.py            # 运动分析接口
│   │   ├── posture.py             # 体态评估接口
│   │   └── chat.py                # AI对话接口
│   ├── services/                  # 业务逻辑层
│   │   ├── __init__.py
│   │   ├── ai_service.py          # AI模型调用封装
│   │   ├── video_service.py       # 视频处理服务
│   │   ├── storage_service.py     # 对象存储服务
│   │   └── chat_service.py        # 对话服务
│   ├── prompts/                   # AI Prompt 模板
│   │   ├── exercise_analysis.py   # 运动纠错prompt
│   │   ├── posture_assessment.py  # 体态评估prompt
│   │   └── fitness_chat.py        # 健身对话prompt
│   ├── utils/                     # 工具函数
│   │   ├── auth.py                # JWT工具
│   │   ├── video.py               # 视频帧提取
│   │   └── oss.py                 # OSS上传工具
│   └── middleware/                 # 中间件
│       ├── auth.py                # 认证中间件
│       └── rate_limit.py          # 限流中间件
├── alembic/                       # 数据库迁移
│   ├── versions/
│   └── env.py
├── alembic.ini
├── requirements.txt
├── .env                           # 环境变量（不提交git）
├── .env.example                   # 环境变量示例
└── Dockerfile
```

---

## 四、核心 API 接口设计

### 4.1 认证模块

```
POST /api/v1/auth/login          # 登录（手机号+验证码）
POST /api/v1/auth/register       # 注册
POST /api/v1/auth/refresh        # 刷新Token
```

### 4.2 用户模块

```
GET    /api/v1/user/profile      # 获取用户信息
PUT    /api/v1/user/profile      # 更新用户信息
PUT    /api/v1/user/fitness-info # 更新健身信息（信息采集弹窗提交）
GET    /api/v1/user/stats        # 获取用户训练统计数据
```

### 4.3 运动分析模块

```
POST   /api/v1/analysis/upload   # 上传视频并创建分析任务
GET    /api/v1/analysis/{id}     # 获取分析结果
GET    /api/v1/analysis/history  # 获取历史分析记录
```

**上传视频接口详细设计：**

```python
# POST /api/v1/analysis/upload
# Content-Type: multipart/form-data

# Request:
#   video: File          (必填, 视频文件, <=100MB, mp4/mov)
#   exercise_type: str   (可选, 深蹲/卧推/硬拉/引体向上/俯卧撑/弓步蹲)

# Response (202 Accepted):
{
    "id": "uuid",
    "status": "analyzing",
    "message": "视频已上传，正在分析中..."
}

# 异步处理流程:
# 1. 接收视频 → 存储到OSS
# 2. 使用OpenCV提取关键帧(每秒1-2帧)
# 3. 将关键帧发送给视觉大模型分析
# 4. 整合分析结果 → 更新数据库
# 5. 客户端轮询 GET /analysis/{id} 获取结果
```

**分析结果响应格式：**

```json
{
    "id": "uuid",
    "status": "completed",
    "exercise_type": "深蹲",
    "score": 72,
    "key_frames": [
        {"url": "https://oss.../frame1.jpg", "timestamp": 2.5}
    ],
    "issues": [
        {
            "title": "膝盖内扣",
            "severity": "中等",
            "description": "下蹲过程中膝盖向内侧塌陷",
            "harm": "可能导致膝关节半月板损伤和韧带劳损",
            "suggestion": "下蹲时注意膝盖朝向脚尖方向，可以在膝盖处绑弹力带增加外展意识"
        }
    ],
    "overall_suggestion": "整体动作完成度尚可，需重点关注膝盖轨迹和下蹲深度..."
}
```

### 4.4 体态评估模块

```
POST   /api/v1/posture/upload    # 上传照片并创建评估任务
GET    /api/v1/posture/{id}      # 获取评估结果
GET    /api/v1/posture/history   # 获取历史评估记录
```

**评估结果响应格式：**

```json
{
    "id": "uuid",
    "status": "completed",
    "overall_rating": "中度异常",
    "issues": [
        {
            "name": "圆肩",
            "severity": "中度",
            "description": "双肩明显前旋，肩胛骨前突",
            "cause": "长期伏案工作，胸肌过紧，背部肌群薄弱",
            "health_risk": "可能引起肩关节撞击综合征，颈椎病"
        }
    ],
    "training_plan": {
        "title": "圆肩改善训练方案",
        "frequency": "每周3-4次",
        "exercises": [
            {
                "name": "面拉",
                "sets": 3,
                "reps": 15,
                "tips": "使用轻重量，注重挤压肩胛骨"
            }
        ]
    }
}
```

### 4.5 AI 对话模块

```
POST   /api/v1/chat/send         # 发送消息（SSE流式响应）
GET    /api/v1/chat/sessions      # 获取对话列表
GET    /api/v1/chat/sessions/{id} # 获取对话详情
```

**SSE 流式对话接口：**

```python
# POST /api/v1/chat/send
# Content-Type: application/json

# Request:
{
    "session_id": "uuid",       # 可选，为空则新建对话
    "message": "帮我制定一个增肌训练计划"
}

# Response: text/event-stream (SSE)
# data: {"type": "text", "content": "根据"}
# data: {"type": "text", "content": "你的"}
# data: {"type": "text", "content": "情况..."}
# data: {"type": "done", "session_id": "uuid"}
```

---

## 五、AI Prompt 工程设计

### 5.1 运动纠错 Prompt 模板

```python
EXERCISE_ANALYSIS_PROMPT = """
你是一位专业的健身教练和运动科学专家。请分析以下健身动作的关键帧图片，判断动作是否标准。

用户正在进行的动作: {exercise_type}

请按照以下格式输出分析结果（JSON格式）:
{
    "score": 0-100的评分,
    "issues": [
        {
            "title": "问题简要标题",
            "severity": "轻微/中等/严重",
            "description": "问题的详细描述",
            "harm": "如果不纠正可能造成的伤害",
            "suggestion": "具体的改进方法"
        }
    ],
    "overall_suggestion": "总结性指导建议，200字以内"
}

分析要点:
1. 关注关节角度是否合理
2. 检查身体对称性
3. 评估动作幅度是否达标
4. 注意常见代偿模式
5. 关注脊柱中立位
"""
```

### 5.2 体态评估 Prompt 模板

```python
POSTURE_ASSESSMENT_PROMPT = """
你是一位专业的物理治疗师和体态评估专家。请根据用户提供的正面、侧面、背面照片，进行全面的体态评估。

请按照以下格式输出评估结果（JSON格式）:
{
    "overall_rating": "正常/轻度异常/中度异常/重度异常",
    "issues": [
        {
            "name": "体态问题名称",
            "severity": "轻度/中度/重度",
            "description": "问题的具体表现",
            "cause": "问题的可能成因",
            "health_risk": "可能引发的健康问题"
        }
    ],
    "training_plan": {
        "title": "改善训练方案名称",
        "frequency": "建议训练频率",
        "duration": "每次训练时长",
        "exercises": [
            {
                "name": "训练动作名称",
                "sets": 组数,
                "reps": 每组次数,
                "tips": "动作要领"
            }
        ]
    }
}

评估要点:
1. 头部位置（前倾/后仰）
2. 肩部（高低肩/圆肩/耸肩）
3. 脊柱（驼背/腰椎前凸/侧弯）
4. 骨盆（前倾/后倾/侧倾）
5. 膝盖（X型腿/O型腿/膝超伸）
6. 足弓（扁平足/高弓足）
"""
```

### 5.3 健身对话 System Prompt

```python
FITNESS_CHAT_SYSTEM_PROMPT = """
你是 FitRight AI 的专业健身顾问。你具备以下能力：
1. 根据用户的身体数据和训练目标制定个性化训练计划
2. 解答各种健身相关问题（训练、饮食、恢复等）
3. 提供安全科学的训练指导

用户基本信息:
- 性别: {gender}
- 年龄: {age}岁
- 身高: {height}cm
- 体重: {weight}kg
- 训练目标: {training_goal}
- 训练经验: {training_exp}
- 训练偏好: {training_pref}
- 单次训练时长: {session_duration}分钟
- 重点训练部位: {focus_areas}

回复规范:
1. 使用简洁友好的语言
2. 训练计划要具体（动作名称、组数、次数、休息时间）
3. 注意安全提醒
4. 根据用户经验水平调整建议难度
5. 如果用户信息不完整，引导用户提供更多信息
"""
```

---

## 六、核心业务流程实现

### 6.1 运动视频分析流程

```
客户端                      后端                         AI API
  │                          │                            │
  │──上传视频(multipart)────>│                            │
  │                          │──存储视频到OSS──>           │
  │                          │                            │
  │<──返回任务ID(202)────────│                            │
  │                          │                            │
  │                          │──OpenCV提取关键帧──>        │
  │                          │                            │
  │                          │──发送帧图片+prompt────────>│
  │                          │                            │
  │                          │<──返回分析结果(JSON)───────│
  │                          │                            │
  │                          │──解析结果，存入数据库       │
  │                          │                            │
  │──轮询查询结果────────────>│                            │
  │<──返回完成结果───────────│                            │
```

**关键帧提取代码示例：**

```python
import cv2
import os

def extract_key_frames(video_path: str, fps: int = 2) -> list[str]:
    """从视频中提取关键帧，默认每秒2帧"""
    cap = cv2.VideoCapture(video_path)
    video_fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(video_fps / fps)
    
    frames = []
    frame_count = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_interval == 0:
            frame_path = f"/tmp/frame_{frame_count}.jpg"
            cv2.imwrite(frame_path, frame)
            frames.append(frame_path)
        frame_count += 1
    
    cap.release()
    return frames
```

### 6.2 SSE 流式对话实现

```python
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import httpx
import json

router = APIRouter()

@router.post("/chat/send")
async def chat_send(request: ChatRequest, current_user: User = Depends(get_current_user)):
    """SSE 流式对话"""
    
    # 构建对话上下文
    system_prompt = build_system_prompt(current_user)
    messages = get_chat_history(request.session_id)
    messages.append({"role": "user", "content": request.message})
    
    async def generate():
        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
                headers={"Authorization": f"Bearer {API_KEY}"},
                json={
                    "model": "qwen-max",
                    "messages": [{"role": "system", "content": system_prompt}] + messages,
                    "stream": True
                }
            ) as response:
                full_response = ""
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]
                        if data == "[DONE]":
                            break
                        chunk = json.loads(data)
                        content = chunk["choices"][0]["delta"].get("content", "")
                        if content:
                            full_response += content
                            yield f"data: {json.dumps({'type': 'text', 'content': content})}\n\n"
                
                # 保存完整回复到数据库
                save_message(request.session_id, "assistant", full_response)
                yield f"data: {json.dumps({'type': 'done', 'session_id': str(request.session_id)})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")
```

---

## 七、开发环境搭建

### 7.1 前端环境

```bash
# 1. 安装 Node.js 18+ 和 pnpm
# 2. 安装 HBuilderX（uni-app官方IDE，推荐）或使用 VSCode + uni-app插件

# 3. 创建项目
npx degit dcloudio/uni-preset-vue#vite-ts fitright-app
cd fitright-app

# 4. 安装依赖
pnpm install
pnpm add pinia @dcloudio/uni-ui

# 5. 开发运行
pnpm dev:h5          # H5预览
pnpm dev:mp-weixin   # 微信小程序预览
```

### 7.2 后端环境

```bash
# 1. 安装 Python 3.11+

# 2. 创建项目
mkdir fitright-server && cd fitright-server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 安装依赖
pip install fastapi uvicorn sqlalchemy alembic pydantic python-jose
pip install httpx python-multipart opencv-python-headless
pip install asyncpg  # PostgreSQL异步驱动
pip install redis    # Redis缓存

# 4. 运行开发服务器
uvicorn app.main:app --reload --port 8000
```

### 7.3 数据库搭建

```bash
# PostgreSQL（推荐使用Docker）
docker run -d --name fitright-db \
  -e POSTGRES_USER=fitright \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=fitright \
  -p 5432:5432 \
  postgres:15

# Redis
docker run -d --name fitright-redis \
  -p 6379:6379 \
  redis:7
```

### 7.4 环境变量配置 (.env)

```env
# 数据库
DATABASE_URL=postgresql+asyncpg://fitright:your_password@localhost:5432/fitright

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080

# AI API (通义千问)
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxx
DASHSCOPE_VL_MODEL=qwen-vl-max
DASHSCOPE_CHAT_MODEL=qwen-max

# 对象存储 (阿里云OSS)
OSS_ACCESS_KEY_ID=your-access-key
OSS_ACCESS_KEY_SECRET=your-access-secret
OSS_BUCKET_NAME=fitright-media
OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com

# 短信验证码 (阿里云SMS)
SMS_ACCESS_KEY_ID=your-sms-key
SMS_ACCESS_KEY_SECRET=your-sms-secret
SMS_SIGN_NAME=FitRightAI
SMS_TEMPLATE_CODE=SMS_xxxxxx
```

---

## 八、MVP 开发计划（里程碑）

### Phase 1：基础框架搭建
- [ ] 前端 uni-app 项目初始化 + 路由配置 + TabBar
- [ ] 后端 FastAPI 项目初始化 + 数据库模型 + 迁移
- [ ] 用户注册/登录（手机号 + 验证码）
- [ ] 基础请求封装（Token拦截器）

### Phase 2：AI 对话功能
- [ ] 后端：AI对话接口（SSE流式）
- [ ] 后端：用户健身信息存储接口
- [ ] 前端：AI对话页面 UI
- [ ] 前端：信息采集弹窗组件
- [ ] 前端：SSE流式消息接收
- [ ] 前端：快速开始卡片交互

### Phase 3：运动纠错功能
- [ ] 后端：视频上传接口 + OSS存储
- [ ] 后端：关键帧提取服务（OpenCV）
- [ ] 后端：AI视觉分析接口（调用VL模型）
- [ ] 前端：运动纠错页面 UI
- [ ] 前端：视频选择与上传
- [ ] 前端：分析加载状态
- [ ] 前端：分析结果展示页

### Phase 4：体态评估功能
- [ ] 后端：图片上传接口
- [ ] 后端：体态评估AI接口
- [ ] 前端：体态评估页面 UI
- [ ] 前端：多图上传组件
- [ ] 前端：评估结果展示页

### Phase 5：个人中心 + 完善
- [ ] 前端：我的页面 UI
- [ ] 后端：训练统计接口
- [ ] 前端：训练进度展示
- [ ] 全局样式优化
- [ ] 接口联调测试
- [ ] 打包发布（H5 / 小程序）

---

## 九、关键技术实现要点

### 9.1 视频文件大小限制与压缩

```javascript
// 前端视频选择与压缩（uni-app）
const chooseVideo = () => {
  uni.chooseVideo({
    maxDuration: 60,        // 最长60秒
    compressed: true,        // 压缩
    sourceType: ['album'],   // 从相册选择
    success: (res) => {
      if (res.size > 100 * 1024 * 1024) {
        uni.showToast({ title: '视频不能超过100MB', icon: 'none' })
        return
      }
      uploadVideo(res.tempFilePath)
    }
  })
}
```

### 9.2 大文件分片上传

```javascript
// 前端分片上传
const uploadVideo = async (filePath) => {
  const uploadTask = uni.uploadFile({
    url: `${BASE_URL}/api/v1/analysis/upload`,
    filePath: filePath,
    name: 'video',
    formData: { exercise_type: selectedType.value },
    header: { Authorization: `Bearer ${token}` },
    success: (res) => {
      const data = JSON.parse(res.data)
      // 开始轮询分析结果
      pollAnalysisResult(data.id)
    }
  })
  
  // 监听上传进度
  uploadTask.onProgressUpdate((res) => {
    uploadProgress.value = res.progress
  })
}
```

### 9.3 轮询分析结果

```javascript
// 前端轮询
const pollAnalysisResult = async (analysisId) => {
  const maxRetries = 60  // 最多等待60次(约2分钟)
  let retries = 0
  
  const poll = setInterval(async () => {
    retries++
    const result = await api.getAnalysisResult(analysisId)
    
    if (result.status === 'completed') {
      clearInterval(poll)
      // 跳转结果页
      uni.navigateTo({
        url: `/pages/exercise-analysis/result?id=${analysisId}`
      })
    } else if (result.status === 'failed' || retries >= maxRetries) {
      clearInterval(poll)
      uni.showToast({ title: '分析失败，请重试', icon: 'none' })
    }
  }, 2000)  // 每2秒查询一次
}
```

### 9.4 后端异步任务处理

```python
from fastapi import BackgroundTasks

@router.post("/analysis/upload")
async def upload_video(
    video: UploadFile,
    exercise_type: str = Form(None),
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. 保存视频到OSS
    video_url = await storage_service.upload_video(video)
    
    # 2. 创建分析记录
    analysis = ExerciseAnalysis(
        user_id=current_user.id,
        video_url=video_url,
        exercise_type=exercise_type,
        status="analyzing"
    )
    db.add(analysis)
    await db.commit()
    
    # 3. 后台异步执行分析
    background_tasks.add_task(
        analyze_video_task, 
        analysis_id=analysis.id,
        video_url=video_url,
        exercise_type=exercise_type
    )
    
    return {"id": str(analysis.id), "status": "analyzing"}
```

---

## 十、部署方案

### 10.1 MVP 阶段（单机部署）

```
阿里云 ECS (2核4G) 或 轻量应用服务器
├── Docker
│   ├── FastAPI App (uvicorn, 端口8000)
│   ├── PostgreSQL (端口5432)
│   ├── Redis (端口6379)
│   └── Nginx (端口80/443, 反向代理)
```

### 10.2 Docker Compose 配置

```yaml
version: '3.8'
services:
  app:
    build: ./fitright-server
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://fitright:password@db:5432/fitright
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: fitright
      POSTGRES_PASSWORD: password
      POSTGRES_DB: fitright
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf

volumes:
  pgdata:
```

### 10.3 前端部署

| 平台 | 部署方式 |
|------|---------|
| H5 | 打包后放到 Nginx 静态目录 |
| 微信小程序 | 通过微信开发者工具上传到微信后台 |
| Android | uni-app 云打包生成 APK |
| iOS | uni-app 云打包 + Apple 开发者账号 |

---

## 十一、安全注意事项

1. **API 安全**
   - 所有接口使用 JWT Token 认证
   - 文件上传限制类型和大小
   - API 限流（每分钟最大请求数）
   - 输入数据验证（Pydantic Schema）

2. **数据安全**
   - 用户密码 bcrypt 哈希存储
   - 敏感配置使用环境变量
   - 数据库连接使用 SSL
   - 用户上传的视频/图片设置私有访问权限

3. **前端安全**
   - Token 安全存储（uni.setStorageSync）
   - 请求 HTTPS
   - 防止 XSS（不渲染用户原始HTML）

---

## 十二、成本估算（MVP阶段月度）

| 项目 | 规格 | 预估月费用 |
|------|------|-----------|
| 云服务器 | 2核4G ECS | ¥100-200 |
| 对象存储 | 50GB存储 + 流量 | ¥20-50 |
| AI API（通义千问） | 按调用量 | ¥100-300 |
| 域名 + SSL | .com域名 | ¥5-10 |
| 短信验证码 | 按条数 | ¥20-50 |
| **合计** | | **¥250-600/月** |

> 注：以上为个人开发者MVP阶段预估，实际费用取决于用户量和使用频率。
