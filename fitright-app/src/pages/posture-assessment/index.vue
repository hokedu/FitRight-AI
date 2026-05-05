<template>
  <view class="page">
    <!-- 顶部头部 -->
    <view class="header">
      <view class="header-top">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">&#x2190;</text>
          <text class="back-text">返回首页</text>
        </view>
      </view>
      <view class="header-content">
        <text class="header-title">体态评估</text>
        <text class="header-subtitle">上传正面、侧面、背面照片进行评估</text>
      </view>
    </view>

    <!-- 上传区域 -->
    <view class="upload-section">
      <text class="section-title">上传照片</text>
      <text class="section-hint">请分别上传站立状态下的正面、侧面、背面全身照</text>

      <view class="upload-grid">
        <view class="upload-item" @click="chooseImage('front')">
          <image v-if="images.front" :src="images.front" mode="aspectFill" class="preview-img" />
          <view v-else class="upload-placeholder">
            <text class="placeholder-icon">+</text>
            <text class="placeholder-text">正面照</text>
          </view>
        </view>

        <view class="upload-item" @click="chooseImage('side')">
          <image v-if="images.side" :src="images.side" mode="aspectFill" class="preview-img" />
          <view v-else class="upload-placeholder">
            <text class="placeholder-icon">+</text>
            <text class="placeholder-text">侧面照</text>
          </view>
        </view>

        <view class="upload-item" @click="chooseImage('back')">
          <image v-if="images.back" :src="images.back" mode="aspectFill" class="preview-img" />
          <view v-else class="upload-placeholder">
            <text class="placeholder-icon">+</text>
            <text class="placeholder-text">背面照</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 拍摄提示 -->
    <view class="tips-section">
      <text class="tips-title">拍摄注意事项</text>
      <view class="tips-list">
        <text class="tip-item">&#x2022; 穿着贴身衣物，便于观察体态</text>
        <text class="tip-item">&#x2022; 保持自然站姿，不要刻意调整</text>
        <text class="tip-item">&#x2022; 拍摄全身照，确保从头到脚完整</text>
        <text class="tip-item">&#x2022; 背景简洁，光线充足</text>
      </view>
    </view>

    <!-- 开始评估按钮 -->
    <view class="btn-section">
      <view
        class="submit-btn"
        :class="{ 'btn-disabled': !canSubmit }"
        @click="startAssessment"
      >
        <text v-if="!analyzing" class="btn-text">开始评估</text>
        <view v-else class="btn-loading">
          <view class="spinner"></view>
          <text class="btn-text">AI 评估中...</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { uploadPostureImages, getPostureResult } from '@/api/posture.js'

const images = ref({ front: '', side: '', back: '' })
const analyzing = ref(false)

const canSubmit = computed(() => {
  return images.value.front && images.value.side && images.value.back && !analyzing.value
})

const goBack = () => {
  uni.navigateBack()
}

const chooseImage = (type) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      images.value[type] = res.tempFilePaths[0]
    }
  })
}

const startAssessment = async () => {
  if (!canSubmit.value) {
    uni.showToast({ title: '请上传三张照片', icon: 'none' })
    return
  }

  analyzing.value = true

  try {
    const result = await uploadPostureImages(
      images.value.front,
      images.value.side,
      images.value.back
    )
    pollResult(result.id)
  } catch (e) {
    analyzing.value = false
    uni.showToast({ title: '上传失败，请重试', icon: 'none' })
  }
}

const pollResult = (assessmentId) => {
  let retries = 0
  const timer = setInterval(async () => {
    retries++
    try {
      const result = await getPostureResult(assessmentId)
      if (result.status === 'completed') {
        clearInterval(timer)
        analyzing.value = false
        uni.navigateTo({
          url: `/pages/posture-assessment/result?id=${assessmentId}`
        })
      } else if (result.status === 'failed' || retries >= 60) {
        clearInterval(timer)
        analyzing.value = false
        uni.showToast({ title: '评估失败，请重试', icon: 'none' })
      }
    } catch (e) {
      if (retries >= 60) {
        clearInterval(timer)
        analyzing.value = false
      }
    }
  }, 2000)
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.header {
  background: linear-gradient(135deg, #4A90D9, #2B6CB0);
  padding: 0 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 10rpx);
  padding-bottom: 40rpx;
}

.header-top {
  padding-bottom: 16rpx;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.back-icon {
  font-size: 32rpx;
  color: #ffffff;
}

.back-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.header-content {
  padding-top: 8rpx;
}

.header-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
}

.header-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 6rpx;
  display: block;
}

.upload-section {
  padding: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1F2937;
  display: block;
}

.section-hint {
  font-size: 24rpx;
  color: #9CA3AF;
  margin-top: 8rpx;
  margin-bottom: 24rpx;
  display: block;
}

.upload-grid {
  display: flex;
  gap: 20rpx;
}

.upload-item {
  flex: 1;
  aspect-ratio: 3/4;
  border-radius: 16rpx;
  overflow: hidden;
  background: #ffffff;
  border: 2rpx dashed #D1D5DB;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.placeholder-icon {
  font-size: 56rpx;
  color: #D1D5DB;
  font-weight: 300;
}

.placeholder-text {
  font-size: 22rpx;
  color: #9CA3AF;
}

.preview-img {
  width: 100%;
  height: 100%;
}

.tips-section {
  padding: 0 32rpx;
}

.tips-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #6B7280;
  display: block;
  margin-bottom: 12rpx;
}

.tips-list {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
}

.tip-item {
  font-size: 24rpx;
  color: #6B7280;
  line-height: 2;
  display: block;
}

.btn-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom, 0px));
  background: #ffffff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.submit-btn {
  background: linear-gradient(135deg, #4A90D9, #2B6CB0);
  border-radius: 48rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-disabled {
  opacity: 0.5;
}

.btn-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.spinner {
  width: 36rpx;
  height: 36rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
