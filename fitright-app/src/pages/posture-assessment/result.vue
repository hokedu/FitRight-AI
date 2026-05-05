<template>
  <view class="page">
    <!-- 总评区域 -->
    <view class="rating-section">
      <text class="rating-label">体态总评</text>
      <view class="rating-badge" :class="'rating-' + (result.overall_rating || '')">
        <text class="rating-text">{{ result.overall_rating || '--' }}</text>
      </view>
    </view>

    <!-- 问题列表 -->
    <view class="section" v-if="result.issues && result.issues.length">
      <text class="section-title">检测到的体态问题</text>
      <view class="issue-card" v-for="(issue, idx) in result.issues" :key="idx">
        <view class="issue-header">
          <text class="issue-name">{{ issue.name }}</text>
          <view class="severity-badge" :class="'severity-' + issue.severity">
            <text>{{ issue.severity }}</text>
          </view>
        </view>
        <text class="issue-desc">{{ issue.description }}</text>
        <view class="detail-box cause-box">
          <text class="detail-label">成因分析</text>
          <text class="detail-text">{{ issue.cause }}</text>
        </view>
        <view class="detail-box risk-box">
          <text class="detail-label">健康风险</text>
          <text class="detail-text">{{ issue.health_risk }}</text>
        </view>
      </view>
    </view>

    <!-- 训练改善方案 -->
    <view class="section" v-if="result.training_plan">
      <text class="section-title">{{ result.training_plan.title || '改善训练方案' }}</text>
      <view class="plan-info">
        <text class="plan-freq">训练频率: {{ result.training_plan.frequency }}</text>
      </view>
      <view class="exercise-list">
        <view class="exercise-item" v-for="(ex, idx) in (result.training_plan.exercises || [])" :key="idx">
          <view class="exercise-header">
            <text class="exercise-index">{{ idx + 1 }}</text>
            <text class="exercise-name">{{ ex.name }}</text>
            <text class="exercise-sets">{{ ex.sets }}组 x {{ ex.reps }}次</text>
          </view>
          <text class="exercise-tips">{{ ex.tips }}</text>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading-wrap">
      <view class="spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPostureResult } from '@/api/posture.js'

const result = ref({})
const loading = ref(true)

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const id = page.$page?.options?.id || page.options?.id
  if (id) loadResult(id)
})

const loadResult = async (id) => {
  try {
    result.value = await getPostureResult(id)
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.rating-section {
  background: linear-gradient(135deg, #4A90D9, #2B6CB0);
  padding: 60rpx 32rpx;
  text-align: center;
}

.rating-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 16rpx;
}

.rating-badge {
  display: inline-block;
  padding: 12rpx 40rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.2);
}

.rating-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
}

.section {
  padding: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1F2937;
  display: block;
  margin-bottom: 20rpx;
}

.issue-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.issue-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.issue-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #1F2937;
}

.severity-badge {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.severity-轻度 {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.severity-中度 {
  background: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.severity-重度 {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.issue-desc {
  font-size: 26rpx;
  color: #6B7280;
  line-height: 1.6;
  display: block;
  margin-bottom: 16rpx;
}

.detail-box {
  padding: 16rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.cause-box {
  background: rgba(59, 130, 246, 0.05);
}

.risk-box {
  background: rgba(239, 68, 68, 0.05);
}

.detail-label {
  font-size: 24rpx;
  font-weight: 500;
  color: #1F2937;
  display: block;
  margin-bottom: 6rpx;
}

.detail-text {
  font-size: 24rpx;
  color: #6B7280;
  line-height: 1.6;
  display: block;
}

.plan-info {
  margin-bottom: 20rpx;
}

.plan-freq {
  font-size: 26rpx;
  color: #4A90D9;
  font-weight: 500;
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.exercise-item {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.exercise-index {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #4A90D9;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.exercise-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #1F2937;
  flex: 1;
}

.exercise-sets {
  font-size: 24rpx;
  color: #4A90D9;
  font-weight: 500;
}

.exercise-tips {
  font-size: 24rpx;
  color: #6B7280;
  margin-left: 60rpx;
  line-height: 1.5;
  display: block;
}

.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}

.spinner {
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

.loading-text {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #9CA3AF;
}
</style>
