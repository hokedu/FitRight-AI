<template>
  <view class="popup-mask" v-if="visible" @click.stop>
    <view class="popup-container">
      <view class="popup-header">
        <text class="popup-title">完善你的健身信息</text>
        <text class="popup-step">{{ currentStep }}/{{ totalSteps }}</text>
      </view>

      <!-- Step 1: 基本信息 -->
      <view v-if="currentStep === 1" class="step-content">
        <text class="step-title">基本信息</text>
        <view class="form-group">
          <text class="form-label">性别</text>
          <view class="radio-group">
            <view class="radio-item" :class="{ active: form.gender === '男' }" @click="form.gender = '男'">
              <text>男</text>
            </view>
            <view class="radio-item" :class="{ active: form.gender === '女' }" @click="form.gender = '女'">
              <text>女</text>
            </view>
          </view>
        </view>
        <view class="form-group">
          <text class="form-label">年龄</text>
          <input type="number" v-model="form.age" placeholder="请输入年龄" class="form-input" />
        </view>
        <view class="form-row">
          <view class="form-group half">
            <text class="form-label">身高(cm)</text>
            <input type="digit" v-model="form.height" placeholder="170" class="form-input" />
          </view>
          <view class="form-group half">
            <text class="form-label">体重(kg)</text>
            <input type="digit" v-model="form.weight" placeholder="65" class="form-input" />
          </view>
        </view>
      </view>

      <!-- Step 2: 训练目标 -->
      <view v-if="currentStep === 2" class="step-content">
        <text class="step-title">你的训练目标</text>
        <view class="option-grid">
          <view
            v-for="item in goalOptions"
            :key="item"
            class="option-item"
            :class="{ active: form.training_goal === item }"
            @click="form.training_goal = item"
          >
            <text>{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- Step 3: 训练经验 + 偏好 -->
      <view v-if="currentStep === 3" class="step-content">
        <text class="step-title">训练经验</text>
        <view class="option-grid">
          <view
            v-for="item in expOptions"
            :key="item"
            class="option-item"
            :class="{ active: form.training_exp === item }"
            @click="form.training_exp = item"
          >
            <text>{{ item }}</text>
          </view>
        </view>
        <text class="step-title" style="margin-top: 32rpx;">训练方式</text>
        <view class="option-grid">
          <view
            v-for="item in prefOptions"
            :key="item"
            class="option-item"
            :class="{ active: form.training_pref === item }"
            @click="form.training_pref = item"
          >
            <text>{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- Step 4: 时长 + 部位 -->
      <view v-if="currentStep === 4" class="step-content">
        <text class="step-title">单次训练时长</text>
        <view class="option-grid">
          <view
            v-for="item in durationOptions"
            :key="item"
            class="option-item"
            :class="{ active: form.session_duration === item }"
            @click="form.session_duration = item"
          >
            <text>{{ item }}</text>
          </view>
        </view>
        <text class="step-title" style="margin-top: 32rpx;">重点训练部位（可多选）</text>
        <view class="option-grid">
          <view
            v-for="item in areaOptions"
            :key="item"
            class="option-item"
            :class="{ active: form.focus_areas.includes(item) }"
            @click="toggleArea(item)"
          >
            <text>{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 进度指示器 -->
      <view class="progress-dots">
        <view v-for="i in totalSteps" :key="i" class="dot" :class="{ 'dot-active': i <= currentStep }"></view>
      </view>

      <!-- 底部按钮 -->
      <view class="popup-footer">
        <view v-if="currentStep > 1" class="footer-btn btn-prev" @click="prevStep">
          <text>上一步</text>
        </view>
        <view v-if="currentStep < totalSteps" class="footer-btn btn-next" @click="nextStep">
          <text>下一步</text>
        </view>
        <view v-if="currentStep === totalSteps" class="footer-btn btn-submit" @click="submit">
          <text>完成</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close', 'submit'])

const currentStep = ref(1)
const totalSteps = 4

const form = reactive({
  gender: '',
  age: '',
  height: '',
  weight: '',
  training_goal: '',
  training_exp: '',
  training_pref: '',
  session_duration: '',
  focus_areas: []
})

const goalOptions = ['增肌', '减脂', '塑形', '体能提升', '康复训练']
const expOptions = ['新手', '初级', '中级', '高级']
const prefOptions = ['健身房', '徒手', '家庭器械']
const durationOptions = ['30分钟', '45分钟', '60分钟', '90分钟']
const areaOptions = ['胸部', '背部', '腿部', '肩部', '手臂', '核心', '全身']

const toggleArea = (item) => {
  const idx = form.focus_areas.indexOf(item)
  if (idx > -1) {
    form.focus_areas.splice(idx, 1)
  } else {
    form.focus_areas.push(item)
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const nextStep = () => {
  if (currentStep.value < totalSteps) currentStep.value++
}

const submit = () => {
  emit('submit', { ...form })
}
</script>

<style lang="scss" scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 999;
}

.popup-container {
  width: 100%;
  background: #ffffff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx 32rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom, 0px));
  max-height: 80vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1F2937;
}

.popup-step {
  font-size: 26rpx;
  color: #9CA3AF;
}

.step-content {
  min-height: 300rpx;
}

.step-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #4B5563;
  display: block;
  margin-bottom: 20rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  font-size: 26rpx;
  color: #6B7280;
  display: block;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #E5E7EB;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 20rpx;
}

.half {
  flex: 1;
}

.radio-group {
  display: flex;
  gap: 16rpx;
}

.radio-item {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #E5E7EB;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #6B7280;
}

.radio-item.active {
  background: rgba(74, 144, 217, 0.1);
  border-color: #4A90D9;
  color: #4A90D9;
}

.option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.option-item {
  padding: 16rpx 28rpx;
  border: 2rpx solid #E5E7EB;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: #6B7280;
}

.option-item.active {
  background: rgba(74, 144, 217, 0.1);
  border-color: #4A90D9;
  color: #4A90D9;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin: 32rpx 0;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #E5E7EB;
}

.dot-active {
  background: #4A90D9;
}

.popup-footer {
  display: flex;
  gap: 16rpx;
}

.footer-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 500;
}

.btn-prev {
  background: #F3F4F6;
  color: #6B7280;
}

.btn-next {
  background: linear-gradient(135deg, #4A90D9, #2B6CB0);
  color: #ffffff;
}

.btn-submit {
  background: linear-gradient(135deg, #8B5CF6, #6D28D9);
  color: #ffffff;
}
</style>
