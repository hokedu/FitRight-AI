import request from './request'

export const sendLogin = (data) => request({ url: '/auth/login', method: 'POST', data })

export const getUserProfile = () => request({ url: '/user/profile' })

export const updateUserProfile = (data) => request({ url: '/user/profile', method: 'PUT', data })

export const updateFitnessInfo = (data) => request({ url: '/user/fitness-info', method: 'PUT', data })

export const getUserStats = () => request({ url: '/user/stats' })
