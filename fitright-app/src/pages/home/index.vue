<template>
  <view class="page">
    <!-- 顶部头部 -->
    <view class="header">
      <view class="header-content">
        <text class="header-title">FitRight AI</text>
        <text class="header-subtitle">上传训练视频，获取专业指导</text>
      </view>
    </view>

    <!-- 功能卡片区域 -->
    <view class="cards-container">
      <!-- 运动纠错卡片 -->
      <view class="feature-card" @click="goToExercise">
        <view class="card-left">
          <view class="card-icon exercise-icon">
            <text class="icon-text">&#x2699;</text>
          </view>
          <view class="card-info">
            <text class="card-title">运动纠错</text>
            <text class="card-desc">分析健身动作，纠正错误姿势</text>
          </view>
        </view>
        <view class="card-tags">
          <text class="tag tag-blue">深蹲</text>
          <text class="tag tag-blue">卧推</text>
          <text class="tag tag-blue">硬拉</text>
        </view>
      </view>

      <!-- 体态评估卡片 -->
      <view class="feature-card" @click="goToPosture">
        <view class="card-left">
          <view class="card-icon posture-icon">
            <text class="icon-text">&#x263A;</text>
          </view>
          <view class="card-info">
            <text class="card-title">体态评估</text>
            <text class="card-desc">评估身体姿态，改善体态问题</text>
          </view>
        </view>
        <view class="card-tags">
          <text class="tag tag-purple">圆肩</text>
          <text class="tag tag-purple">驼背</text>
          <text class="tag tag-purple">骨盆前倾</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const goToExercise = () => {
  uni.navigateTo({ url: '/pages/exercise-analysis/index' })
}

const goToPosture = () => {
  uni.navigateTo({ url: '/pages/posture-assessment/index' })
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
  padding-top: calc(var(--status-bar-height, 44px) + 20rpx);
  padding-bottom: 60rpx;
  border-radius: 0 0 0 0;
}

.header-content {
  padding-top: 20rpx;
}

.header-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
}

.header-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
  display: block;
}

.cards-container {
  padding: 32rpx;
  margin-top: -20rpx;
}

.feature-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.card-left {
  display: flex;
  align-items: center;
}

.card-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.exercise-icon {
  background: linear-gradient(135deg, #8B5CF6, #6D28D9);
}

.posture-icon {
  background: linear-gradient(135deg, #4A90D9, #2B6CB0);
}

.icon-text {
  font-size: 40rpx;
  color: #ffffff;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #1F2937;
  display: block;
}

.card-desc {
  font-size: 24rpx;
  color: #6B7280;
  margin-top: 6rpx;
  display: block;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 20rpx;
  padding-left: 112rpx;
}

.tag {
  font-size: 22rpx;
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
}

.tag-blue {
  background: rgba(74, 144, 217, 0.1);
  color: #4A90D9;
}

.tag-purple {
  background: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
}
</style>
