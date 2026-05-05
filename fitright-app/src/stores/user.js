import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(uni.getStorageSync('token') || '')
  const userInfo = ref(null)
  const fitnessInfo = ref(null)
  const isInfoCollected = ref(uni.getStorageSync('isInfoCollected') || false)

  const setToken = (t) => {
    token.value = t
    uni.setStorageSync('token', t)
  }

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const setFitnessInfo = (info) => {
    fitnessInfo.value = info
    isInfoCollected.value = true
    uni.setStorageSync('isInfoCollected', true)
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    fitnessInfo.value = null
    isInfoCollected.value = false
    uni.removeStorageSync('token')
    uni.removeStorageSync('isInfoCollected')
    uni.reLaunch({ url: '/pages/login/index' })
  }

  const isLoggedIn = () => !!token.value

  return { token, userInfo, fitnessInfo, isInfoCollected, setToken, setUserInfo, setFitnessInfo, logout, isLoggedIn }
})
