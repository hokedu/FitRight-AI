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
        <text class="header-title">运动纠错</text>
        <text class="header-subtitle">上传训练视频，AI 帮你纠正动作</text>
      </view>
    </view>

    <!-- 上传区域 -->
    <view class="upload-section">
      <view class="upload-card">
        <!-- 未选择视频 -->
        <view v-if="!uploading && !analyzing" class="upload-area" @click="chooseVideo">
          <view class="upload-icon-wrap">
            <text class="upload-icon">&#x2934;</text>
          </view>
          <text class="upload-title">上传运动视频</text>
          <text class="upload-desc">支持深蹲、卧推、硬拉等多种动作分析</text>
          <view class="upload-btn">
            <text class="btn-icon">&#x21E7;</text>
            <text class="btn-text">选择视频</text>
          </view>
        </view>

        <!-- 上传进度 -->
        <view v-if="uploading" class="progress-section">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: progress + '%' }"></view>
          </view>
          <text class="progress-text">上传中 {{ progress }}%</text>
        </view>

        <!-- 分析中 -->
        <view v-if="analyzing" class="analyzing-section">
          <view class="analyzing-spinner"></view>
          <text class="analyzing-text">AI 正在分析您的动作...</text>
          <text class="analyzing-hint">预计需要 15-30 秒</text>
        </view>
      </view>
    </view>

    <!-- 动作类型选择 -->
    <view class="type-section">
      <text class="section-title">选择动作类型（可选）</text>
      <view class="type-tags">
        <view
          v-for="item in exerciseTypes"
          :key="item"
          class="type-tag"
          :class="{ 'type-tag-active': selectedType === item }"
          @click="selectedType = item"
        >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { uploadVideo, getAnalysisResult } from '@/api/analysis.js'

const exerciseTypes = ['深蹲', '卧推', '硬拉', '引体向上', '俯卧撑', '弓步蹲']
const selectedType = ref('')
const uploading = ref(false)
const analyzing = ref(false)
const progress = ref(0)

const goBack = () => {
  uni.navigateBack()
}

const chooseVideo = () => {
  uni.chooseVideo({
    maxDuration: 60,
    compressed: true,
    sourceType: ['album', 'camera'],
    success: (res) => {
      if (res.size > 100 * 1024 * 1024) {
        uni.showToast({ title: '视频不能超过100MB', icon: 'none' })
        return
      }
      startUpload(res.tempFilePath)
    }
  })
}

const startUpload = async (filePath) => {
  uploading.value = true
  progress.value = 0

  try {
    const result = await uploadVideo(filePath, selectedType.value, (res) => {
      progress.value = res.progress
    })

    uploading.value = false
    analyzing.value = true
    pollResult(result.id)

  } catch (e) {
    uploading.value = false
    uni.showToast({ title: '上传失败，请重试', icon: 'none' })
  }
}

const pollResult = (analysisId) => {
  let retries = 0
  const maxRetries = 90

  const timer = setInterval(async () => {
    retries++
    try {
      const result = await getAnalysisResult(analysisId)
      if (result.status === 'completed') {
        clearInterval(timer)
        analyzing.value = false
        uni.navigateTo({
          url: `/pages/exercise-analysis/result?id=${analysisId}`
        })
      } else if (result.status === 'failed' || retries >= maxRetries) {
        clearInterval(timer)
        analyzing.value = false
        uni.showToast({ title: '分析失败，请重试', icon: 'none' })
      }
    } catch (e) {
      if (retries >= maxRetries) {
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
  margin-top: -10rpx;
}

.upload-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.upload-area {
  width: 100%;
}

.upload-icon-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(74, 144, 217, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24rpx;
}

.upload-icon {
  font-size: 56rpx;
  color: #4A90D9;
}

.upload-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #1F2937;
  display: block;
}

.upload-desc {
  font-size: 24rpx;
  color: #9CA3AF;
  margin-top: 12rpx;
  display: block;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  background: linear-gradient(135deg, #4A90D9, #2B6CB0);
  color: #ffffff;
  padding: 20rpx 56rpx;
  border-radius: 48rpx;
  margin-top: 40rpx;
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 30rpx;
  font-weight: 500;
}

.progress-section {
  width: 100%;
}

.progress-bar {
  height: 12rpx;
  background: #E5E7EB;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A90D9, #2B6CB0);
  border-radius: 6rpx;
  transition: width 0.3s;
}

.progress-text {
  font-size: 24rpx;
  color: #6B7280;
  margin-top: 12rpx;
  display: block;
}

.analyzing-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.analyzing-spinner {
  width: 64rpx;
  height: 64rpx;
  border: 6rpx solid #E5E7EB;
  border-top-color: #4A90D9;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.analyzing-text {
  font-size: 28rpx;
  color: #4A90D9;
  margin-top: 20rpx;
  font-weight: 500;
  display: block;
}

.analyzing-hint {
  font-size: 22rpx;
  color: #9CA3AF;
  margin-top: 8rpx;
  display: block;
}

.type-section {
  padding: 0 32rpx 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1F2937;
  display: block;
  margin-bottom: 20rpx;
}

.type-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.type-tag {
  padding: 16rpx 32rpx;
  background: #ffffff;
  border: 2rpx solid #E5E7EB;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: #6B7280;
}

.type-tag-active {
  background: rgba(74, 144, 217, 0.1);
  border-color: #4A90D9;
  color: #4A90D9;
}
</style>
