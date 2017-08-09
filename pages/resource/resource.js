Page({
  data: {
    industryarr: [],
    industryindex: 0,
    statusarr: [],
    statusindex: 0,
    jobarr: [],
    jobindex: 0,
    name: "",
    classs: "",
    state: "",
    text: ""
  },
  onLoad: function () {
    console.log(getApp().globalData.openid)
    if (getApp().globalData.openid){
      wx.showToast({
        title: '您已经是认证用户，不需要申请',
        icon: 'success',
        duration: 2000
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      }, 1800)
    }
  },
  inputName: function (e) {
    console.log("更改inputName的值")
    this.setData({
      name: e.detail.value
    })
  },
  inputText: function (e) {
    console.log("更改inputText的值")
    this.setData({
      text: e.detail.value
    })
  },

  applySubmit: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })

    wx.request({
      url: 'https://liuyaqing0309.com/apply',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "name": this.data.name,
        "text": this.data.text,
        "openId": getApp().globalData.openidTemp
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.codeId == 1002){
          wx.showToast({
            title: '请不要多次申请哦',
            icon: 'fail',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '申请成功，请耐心等待审核',
            icon: 'success',
            duration: 2000
          })
        }
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
            success:function(e){
              var page = getCurrentPages().pop(); 
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }, 1800)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})
