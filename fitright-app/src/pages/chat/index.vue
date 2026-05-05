<template>
  <view class="page">
    <!-- 顶部头部 -->
    <view class="header">
      <view class="header-content">
        <text class="header-icon">&#x2728;</text>
        <text class="header-title">AI 健身顾问</text>
        <text class="header-subtitle">智能定制你的训练计划</text>
      </view>
    </view>

    <!-- 消息区域 -->
    <scroll-view
      class="chat-area"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
    >
      <!-- 快速开始 (仅在无消息时显示) -->
      <view v-if="messages.length <= 1" class="quick-start">
        <text class="quick-title">快速开始</text>
        <view class="quick-cards">
          <view class="quick-card" @click="quickSend('帮我制定一份增肌训练计划')">
            <text class="quick-card-icon">&#x1F4AA;</text>
            <text class="quick-card-text">增肌训练计划</text>
          </view>
          <view class="quick-card" @click="quickSend('帮我制定一份减脂方案')">
            <text class="quick-card-text">减脂方案</text>
          </view>
          <view class="quick-card" @click="quickSend('帮我安排一周的训练计划')">
            <text class="quick-card-icon">&#x1F4C5;</text>
            <text class="quick-card-text">每周训练安排</text>
          </view>
        </view>
      </view>

      <!-- 消息列表 -->
      <view class="messages">
        <view
          v-for="(msg, idx) in messages"
          :key="idx"
          class="message-item"
          :class="'msg-' + msg.role"
        >
          <view v-if="msg.role === 'assistant'" class="msg-avatar ai-avatar">
            <text>AI</text>
          </view>
          <view class="msg-bubble" :class="'bubble-' + msg.role">
            <view v-if="msg.role === 'assistant'" class="ai-label">
              <text class="ai-label-icon">&#x2728;</text>
              <text class="ai-label-text">AI 助手</text>
            </view>
            <text class="msg-text" :user-select="true">{{ msg.content }}</text>
          </view>
        </view>

        <!-- 打字指示器 -->
        <view v-if="isLoading" class="message-item msg-assistant">
          <view class="msg-avatar ai-avatar"><text>AI</text></view>
          <view class="msg-bubble bubble-assistant">
            <view class="typing-indicator">
              <view class="typing-dot"></view>
              <view class="typing-dot"></view>
              <view class="typing-dot"></view>
            </view>
          </view>
        </view>
      </view>

      <view class="scroll-anchor"></view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <view class="input-wrap">
        <input
          class="chat-input"
          v-model="inputText"
          placeholder="输入你的健身问题..."
          :confirm-type="'send'"
          @confirm="sendMessage"
        />
        <view class="send-btn" :class="{ 'send-active': inputText.trim() }" @click="sendMessage">
          <text class="send-icon">&#x27A4;</text>
        </view>
      </view>
    </view>

    <!-- 信息采集弹窗 -->
    <InfoCollectPopup
      :visible="showInfoPopup"
      @close="showInfoPopup = false"
      @submit="onInfoSubmit"
    />
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { updateFitnessInfo } from '@/api/user.js'
import InfoCollectPopup from '@/components/InfoCollectPopup.vue'

const userStore = useUserStore()
const messages = ref([])
const inputText = ref('')
const isLoading = ref(false)
const scrollTop = ref(0)
const showInfoPopup = ref(false)

onMounted(() => {
  // 添加欢迎消息
  messages.value.push({
    role: 'assistant',
    content: '你好！我是 FitRight AI 健身助手。我可以帮你定制专属训练计划，解答健身问题。请告诉我你的健身目标？'
  })

  // 首次使用弹出信息采集
  if (!userStore.isInfoCollected) {
    setTimeout(() => {
      showInfoPopup.value = true
    }, 500)
  }
})

const scrollToBottom = () => {
  nextTick(() => {
    scrollTop.value = scrollTop.value === 99999 ? 99998 : 99999
  })
}

const onInfoSubmit = async (info) => {
  showInfoPopup.value = false
  userStore.setFitnessInfo(info)

  try {
    await updateFitnessInfo(info)
  } catch (e) {
    // 静默失败，信息已缓存本地
  }

  messages.value.push({
    role: 'assistant',
    content: `已收到你的信息！${info.gender}，${info.age}岁，${info.height}cm/${info.weight}kg，训练目标：${info.training_goal}，经验：${info.training_exp}。现在可以问我任何健身问题，或者让我帮你制定训练计划！`
  })
  scrollToBottom()
}

const quickSend = (text) => {
  inputText.value = text
  sendMessage()
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    const token = uni.getStorageSync('token')
    // #ifdef H5
    const BASE_URL = '/api/v1'
    // #endif
    // #ifndef H5
    const BASE_URL = 'http://localhost:8000/api/v1'
    // #endif

    // 发起 SSE 请求
    const res = await new Promise((resolve, reject) => {
      let fullContent = ''

      // 在 H5 环境下使用 fetch + ReadableStream
      // #ifdef H5
      fetch(`${BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      }).then(async (response) => {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let assistantAdded = false

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'text') {
                  fullContent += data.content
                  if (!assistantAdded) {
                    messages.value.push({ role: 'assistant', content: fullContent })
                    assistantAdded = true
                  } else {
                    messages.value[messages.value.length - 1].content = fullContent
                  }
                  scrollToBottom()
                } else if (data.type === 'done') {
                  resolve(fullContent)
                }
              } catch (e) {}
            }
          }
        }
        resolve(fullContent)
      }).catch(reject)
      // #endif

      // #ifndef H5
      // 非H5环境使用 uni.request
      uni.request({
        url: `${BASE_URL}/chat/send`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: { message: text },
        success: (res) => {
          if (res.data && res.data.content) {
            messages.value.push({ role: 'assistant', content: res.data.content })
          }
          resolve(res.data)
        },
        fail: reject
      })
      // #endif
    })
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: '抱歉，网络出现了问题，请稍后重试。'
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #8B5CF6, #6D28D9);
  padding: 0 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 20rpx);
  padding-bottom: 32rpx;
  flex-shrink: 0;
}

.header-content {
  padding-top: 16rpx;
}

.header-icon {
  font-size: 36rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-top: 4rpx;
}

.header-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
  display: block;
}

.chat-area {
  flex: 1;
  padding: 24rpx 32rpx;
  overflow-y: auto;
}

.quick-start {
  margin-bottom: 32rpx;
}

.quick-title {
  font-size: 28rpx;
  color: #6B7280;
  display: block;
  margin-bottom: 16rpx;
}

.quick-cards {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.quick-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.quick-card-icon {
  font-size: 32rpx;
}

.quick-card-text {
  font-size: 28rpx;
  color: #1F2937;
  font-weight: 500;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.message-item {
  display: flex;
  gap: 16rpx;
}

.msg-user {
  justify-content: flex-end;
}

.msg-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 22rpx;
  font-weight: bold;
}

.ai-avatar {
  background: linear-gradient(135deg, #8B5CF6, #6D28D9);
  color: #ffffff;
}

.msg-bubble {
  max-width: 80%;
  padding: 20rpx 24rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  line-height: 1.6;
}

.bubble-assistant {
  background: #ffffff;
  color: #1F2937;
  border-top-left-radius: 6rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.bubble-user {
  background: linear-gradient(135deg, #8B5CF6, #6D28D9);
  color: #ffffff;
  border-top-right-radius: 6rpx;
}

.ai-label {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 8rpx;
}

.ai-label-icon {
  font-size: 24rpx;
}

.ai-label-text {
  font-size: 22rpx;
  color: #8B5CF6;
  font-weight: 500;
}

.msg-text {
  font-size: 28rpx;
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.typing-indicator {
  display: flex;
  gap: 8rpx;
  padding: 8rpx 0;
}

.typing-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #9CA3AF;
  animation: bounce 1.4s ease-in-out infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8rpx); }
}

.scroll-anchor {
  height: 20rpx;
}

.input-area {
  flex-shrink: 0;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom, 0px));
  background: #ffffff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: #F3F4F6;
  border-radius: 44rpx;
  padding: 8rpx 8rpx 8rpx 28rpx;
}

.chat-input {
  flex: 1;
  height: 72rpx;
  font-size: 28rpx;
  background: transparent;
}

.send-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.send-active {
  background: linear-gradient(135deg, #8B5CF6, #6D28D9);
}

.send-icon {
  font-size: 32rpx;
  color: #ffffff;
}
</style>
