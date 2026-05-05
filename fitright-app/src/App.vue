<script>
export default {
  onLaunch() {
    console.log('FitRight AI App Launch')
    this.autoLogin()
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  methods: {
    async autoLogin() {
      // 已有有效 token 则跳过
      const token = uni.getStorageSync('token')
      if (token) return

      try {
        // #ifdef H5
        const BASE_URL = '/api/v1'
        // #endif
        // #ifndef H5
        const BASE_URL = 'http://localhost:8000/api/v1'
        // #endif
        const res = await uni.request({
          url: BASE_URL + '/auth/dev-login',
          method: 'POST',
          data: {}
        })
        if (res.statusCode === 200 && res.data.token) {
          uni.setStorageSync('token', res.data.token)
          console.log('dev auto-login success')
        }
      } catch (e) {
        console.log('dev-login failed, will retry on next action')
      }
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

view, text, image {
  box-sizing: border-box;
}
</style>
