<template>
  <view class="page">
    <!-- 评分区域 -->
    <view class="score-section">
      <view class="score-circle">
        <text class="score-num">{{ result.score || '--' }}</text>
        <text class="score-label">综合评分</text>
      </view>
      <text class="exercise-type">{{ result.exercise_type || '动作分析' }}</text>
    </view>

    <!-- 问题列表 -->
    <view class="section" v-if="result.issues && result.issues.length">
      <text class="section-title">检测到的问题</text>
      <view class="issue-card" v-for="(issue, idx) in result.issues" :key="idx">
        <view class="issue-header">
          <view class="issue-severity" :class="'severity-' + issue.severity">
            <text>{{ issue.severity }}</text>
          </view>
          <text class="issue-title">{{ issue.title }}</text>
        </view>
        <text class="issue-desc">{{ issue.description }}</text>
        <view class="issue-detail">
          <view class="detail-item danger">
            <text class="detail-label">&#x26A0; 潜在危害</text>
            <text class="detail-text">{{ issue.harm }}</text>
          </view>
          <view class="detail-item success">
            <text class="detail-label">&#x2705; 改进建议</text>
            <text class="detail-text">{{ issue.suggestion }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 总结建议 -->
    <view class="section" v-if="result.overall_suggestion">
      <text class="section-title">总结建议</text>
      <view class="summary-card">
        <text class="summary-text">{{ result.overall_suggestion }}</text>
      </view>
    </view>

    <!-- 无数据提示 -->
    <view v-if="loading" class="loading-wrap">
      <view class="spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAnalysisResult } from '@/api/analysis.js'

const result = ref({})
const loading = ref(true)

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const id = page.$page?.options?.id || page.options?.id
  if (id) {
    loadResult(id)
  }
})

const loadResult = async (id) => {
  try {
    result.value = await getAnalysisResult(id)
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

.score-section {
  background: linear-gradient(135deg, #4A90D9, #2B6CB0);
  padding: 60rpx 32rpx;
  text-align: center;
}

.score-circle {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 6rpx solid rgba(255, 255, 255, 0.4);
}

.score-num {
  font-size: 64rpx;
  font-weight: bold;
  color: #ffffff;
}

.score-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

.exercise-type {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 20rpx;
  display: block;
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
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.issue-severity {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.severity-轻微,
.severity-轻度 {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.severity-中等,
.severity-中度 {
  background: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.severity-严重,
.severity-重度 {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.issue-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1F2937;
}

.issue-desc {
  font-size: 26rpx;
  color: #6B7280;
  display: block;
  margin-bottom: 16rpx;
  line-height: 1.6;
}

.issue-detail {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.detail-item {
  padding: 16rpx;
  border-radius: 12rpx;
}

.detail-item.danger {
  background: rgba(239, 68, 68, 0.05);
}

.detail-item.success {
  background: rgba(16, 185, 129, 0.05);
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

.summary-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.summary-text {
  font-size: 26rpx;
  color: #4B5563;
  line-height: 1.8;
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
