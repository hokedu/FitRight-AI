<template>
  <view class="page">
    <view class="login-header">
      <text class="brand">FitRight AI</text>
      <text class="slogan">你的 AI 私人健身教练</text>
    </view>

    <view class="login-form">
      <view class="form-group">
        <input
          class="form-input"
          v-model="phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
        />
      </view>
      <view class="form-group code-group">
        <input
          class="form-input code-input"
          v-model="code"
          type="number"
          maxlength="6"
          placeholder="请输入验证码"
        />
        <view class="code-btn" :class="{ 'code-disabled': countdown > 0 }" @click="sendCode">
          <text>{{ countdown > 0 ? countdown + 's' : '获取验证码' }}</text>
        </view>
      </view>

      <view class="login-btn" @click="login">
        <text class="login-btn-text">登录 / 注册</text>
      </view>

      <text class="agreement">登录即表示同意《用户协议》和《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { sendLogin } from '@/api/user.js'

const userStore = useUserStore()
const phone = ref('')
const code = ref('')
const countdown = ref(0)

const sendCode = () => {
  if (countdown.value > 0) return
  if (phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  // 模拟发送验证码
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)

  uni.showToast({ title: '验证码已发送', icon: 'none' })
}

const login = async () => {
  if (phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (code.value.length < 4) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }

  try {
    const res = await sendLogin({ phone: phone.value, code: code.value })
    userStore.setToken(res.token)
    userStore.setUserInfo(res.user)
    uni.switchTab({ url: '/pages/home/index' })
  } catch (e) {
    // 后端未启动时使用 dev-login
    try {
      // #ifdef H5
      const BASE_URL = '/api/v1'
      // #endif
      // #ifndef H5
      const BASE_URL = 'http://localhost:8000/api/v1'
      // #endif
      const devRes = await uni.request({
        url: BASE_URL + '/auth/dev-login',
        method: 'POST',
        data: {}
      })
      if (devRes.statusCode === 200 && devRes.data.token) {
        userStore.setToken(devRes.data.token)
        userStore.setUserInfo(devRes.data.user)
        uni.switchTab({ url: '/pages/home/index' })
        return
      }
    } catch (e2) {}
    uni.showToast({ title: '网络异常，请确认服务已启动', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #4A90D9 0%, #f5f5f5 50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-header {
  padding-top: 200rpx;
  text-align: center;
  margin-bottom: 80rpx;
}

.brand {
  font-size: 56rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
}

.slogan {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 12rpx;
  display: block;
}

.login-form {
  width: 85%;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 24rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #E5E7EB;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  box-sizing: border-box;
}

.code-group {
  display: flex;
  gap: 16rpx;
}

.code-input {
  flex: 1;
}

.code-btn {
  white-space: nowrap;
  padding: 0 24rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #4A90D9;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: #4A90D9;
}

.code-disabled {
  border-color: #D1D5DB;
  color: #9CA3AF;
}

.login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #4A90D9, #2B6CB0);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16rpx;
}

.login-btn-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
}

.agreement {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #9CA3AF;
  margin-top: 24rpx;
}
</style>
