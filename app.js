//app.js
App({
  onLaunch: function () {
    //小程序初始化完成只执行一次
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData: {
    //全局信息
    userInfo: null,
    code: null,
    session_key: null,
    expires_in: null,
    openid: null,
    openidTemp: null,
    balanceInfoOnShow: null,
    nickName:null
  },
  onShow: function () {
    //启动小程序或者从后台进入前台
  },
  onHide: function () {
    //从前台进入后台
  },
}) 