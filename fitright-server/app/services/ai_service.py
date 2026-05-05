import httpx
import json
import base64
from typing import AsyncGenerator
from app.config import settings


class AIService:
    """封装大模型API调用"""

    def __init__(self):
        self.api_key = settings.DASHSCOPE_API_KEY
        self.base_url = settings.DASHSCOPE_BASE_URL
        self.vl_model = settings.DASHSCOPE_VL_MODEL
        self.chat_model = settings.DASHSCOPE_CHAT_MODEL

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def analyze_images(self, image_paths: list[str], prompt: str) -> dict:
        """使用视觉模型分析图片，返回JSON结果"""
        content = []
        for path in image_paths:
            with open(path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode()
            content.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{b64}"}
            })
        content.append({"type": "text", "text": prompt})

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self._headers(),
                json={
                    "model": self.vl_model,
                    "messages": [{"role": "user", "content": content}],
                    "max_tokens": 2000
                }
            )
            resp.raise_for_status()
            data = resp.json()
            text = data["choices"][0]["message"]["content"]

            # 尝试提取JSON
            return self._extract_json(text)

    async def chat_stream(self, system_prompt: str, messages: list[dict]) -> AsyncGenerator[str, None]:
        """流式对话，yield每个文本片段"""
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                headers=self._headers(),
                json={
                    "model": self.chat_model,
                    "messages": [{"role": "system", "content": system_prompt}] + messages,
                    "stream": True,
                    "max_tokens": 2000
                }
            ) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str.strip() == "[DONE]":
                            break
                        try:
                            chunk = json.loads(data_str)
                            delta = chunk["choices"][0]["delta"]
                            content = delta.get("content", "")
                            if content:
                                yield content
                        except (json.JSONDecodeError, KeyError, IndexError):
                            continue

    async def chat_simple(self, system_prompt: str, messages: list[dict]) -> str:
        """非流式对话，返回完整文本"""
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self._headers(),
                json={
                    "model": self.chat_model,
                    "messages": [{"role": "system", "content": system_prompt}] + messages,
                    "max_tokens": 2000
                }
            )
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    @staticmethod
    def _extract_json(text: str) -> dict:
        """从AI返回文本中提取JSON"""
        # 去掉可能的markdown代码块
        text = text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            lines = lines[1:]  # 去掉第一行 ```json
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines)

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # 尝试找到第一个 { 和最后一个 }
            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end > start:
                try:
                    return json.loads(text[start:end])
                except json.JSONDecodeError:
                    pass
            return {"error": "无法解析AI返回结果", "raw": text}


ai_service = AIService()
