// #ifdef H5
const BASE_URL = '/api/v1'
// #endif
// #ifndef H5
const BASE_URL = 'http://localhost:8000/api/v1'
// #endif

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 401) {
          uni.removeStorageSync('token')
          uni.reLaunch({ url: '/pages/login/index' })
          reject(new Error('未授权'))
          return
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          uni.showToast({ title: res.data.detail || '请求失败', icon: 'none' })
          reject(res.data)
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      }
    })
  })
}

export const uploadFile = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const uploadTask = uni.uploadFile({
      url: BASE_URL + options.url,
      filePath: options.filePath,
      name: options.name || 'file',
      formData: options.formData || {},
      timeout: 120000,
      header: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(res.data))
        } else {
          reject(JSON.parse(res.data))
        }
      },
      fail: reject
    })
    if (options.onProgress) {
      uploadTask.onProgressUpdate(options.onProgress)
    }
  })
}

export default request
