<template>
  <view class="page">
    <!-- 顶部头部 -->
    <view class="header">
      <view class="header-top">
        <text class="header-title">我的</text>
        <view class="settings-btn" @click="goSettings">
          <text class="settings-icon">&#x2699;</text>
        </view>
      </view>
      <view class="profile-info">
        <view class="avatar">
          <text class="avatar-text">&#x263A;</text>
        </view>
        <view class="user-info">
          <text class="nickname">{{ userInfo.nickname || '健身达人' }}</text>
          <text class="signature">{{ userInfo.signature || '坚持就是胜利' }}</text>
        </view>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-num">{{ stats.totalDays }}</text>
        <text class="stat-label">累计训练 (天)</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-num">{{ stats.weekCount }}</text>
        <text class="stat-label">本周完成 (次)</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-num">{{ stats.totalHours }}</text>
        <text class="stat-label">总时长 (小时)</text>
      </view>
    </view>

    <!-- 升级Pro会员 -->
    <view class="pro-card">
      <view class="pro-left">
        <text class="pro-icon">&#x1F451;</text>
        <view class="pro-info">
          <text class="pro-title">升级 Pro 会员</text>
          <text class="pro-desc">解锁全部高级功能</text>
        </view>
      </view>
      <text class="pro-arrow">&#x276F;</text>
    </view>

    <!-- 本周训练进度 -->
    <view class="section">
      <text class="section-title">本周训练进度</text>
      <view class="week-progress">
        <view class="week-dots">
          <view v-for="(day, idx) in weekDays" :key="idx" class="day-col">
            <view class="day-dot" :class="{ 'dot-done': day.done }">
              <text v-if="day.done" class="dot-check">&#x2713;</text>
            </view>
            <text class="day-label">{{ day.label }}</text>
          </view>
        </view>
        <view class="completion-row">
          <text class="completion-label">完成率</text>
          <text class="completion-pct">{{ completionRate }}%</text>
        </view>
        <view class="completion-bar">
          <view class="completion-fill" :style="{ width: completionRate + '%' }"></view>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-section">
      <view class="menu-item" @click="goTrainingPlan">
        <text class="menu-icon">&#x1F4C5;</text>
        <text class="menu-text">我的训练计划</text>
        <text class="menu-arrow">&#x276F;</text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">&#x1F3C6;</text>
        <text class="menu-text">成就与徽章</text>
        <text class="menu-arrow">&#x276F;</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const userInfo = ref({
  nickname: '健身达人',
  signature: '坚持就是胜利'
})

const stats = ref({
  totalDays: 28,
  weekCount: 4,
  totalHours: 12.5
})

const weekDays = ref([
  { label: '一', done: true },
  { label: '二', done: true },
  { label: '三', done: false },
  { label: '四', done: true },
  { label: '五', done: true },
  { label: '六', done: false },
  { label: '日', done: false }
])

const completionRate = computed(() => {
  const done = weekDays.value.filter(d => d.done).length
  return Math.round((done / 7) * 100)
})

const goSettings = () => {
  uni.showToast({ title: '设置功能开发中', icon: 'none' })
}

const goTrainingPlan = () => {
  uni.showToast({ title: '训练计划功能开发中', icon: 'none' })
}

onMounted(() => {
  // 可以在此加载用户数据
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.header {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  padding: 0 32rpx;
  padding-top: calc(var(--status-bar-height, 44px) + 20rpx);
  padding-bottom: 48rpx;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
}

.settings-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-icon {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.9);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
}

.avatar-text {
  font-size: 48rpx;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 34rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
}

.signature {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
  display: block;
}

.stats-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  margin: -24rpx 32rpx 24rpx;
  border-radius: 20rpx;
  padding: 28rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-num {
  font-size: 40rpx;
  font-weight: bold;
  color: #1F2937;
  display: block;
}

.stat-label {
  font-size: 22rpx;
  color: #9CA3AF;
  margin-top: 4rpx;
  display: block;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: #E5E7EB;
}

.pro-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #F59E0B, #D97706);
  margin: 0 32rpx 24rpx;
  border-radius: 20rpx;
  padding: 28rpx 32rpx;
}

.pro-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.pro-icon {
  font-size: 40rpx;
}

.pro-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
}

.pro-desc {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.pro-arrow {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.8);
}

.section {
  padding: 0 32rpx;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1F2937;
  display: block;
  margin-bottom: 16rpx;
}

.week-progress {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.week-dots {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.day-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.day-dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-done {
  background: #10B981;
}

.dot-check {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: bold;
}

.day-label {
  font-size: 22rpx;
  color: #6B7280;
}

.completion-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.completion-label {
  font-size: 24rpx;
  color: #6B7280;
}

.completion-pct {
  font-size: 24rpx;
  color: #10B981;
  font-weight: 500;
}

.completion-bar {
  height: 16rpx;
  background: #E5E7EB;
  border-radius: 8rpx;
  overflow: hidden;
}

.completion-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981, #059669);
  border-radius: 8rpx;
  transition: width 0.5s;
}

.menu-section {
  padding: 0 32rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 28rpx 24rpx;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #1F2937;
}

.menu-arrow {
  font-size: 24rpx;
  color: #D1D5DB;
}
</style>
