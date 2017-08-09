//index.js
//获取应用实例
// var app = getApp();
Page({
  data: {
    indexmenu: [],
    imgUrls: [],
    userInfo: null,
    weatherdate: null,
    weatherdayTime: null,
    weathernight: null,
    weathertemperature: null,
    weatherweek: null,
    weatherwind: null,
    fistOpenPage: null,
    lyb: null
  },
  onLoad: function () {
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    //调用登录接口
    var that = this;
    //调用微信登录接口
    wx.login({
      //获取code
      success: function (res) {
        getApp().globalData.code = res.code //返回code
        console.log(res.code)
        wx.request({
          url: 'https://liuyaqing0309.com/getOpenId',
          data: {
            "code": res.code
          },
          method: "GET",
          success: function (res) {
            if (res.data.codeId == 1) {
              console.log('验证openid成功：' + res.data.data)
              getApp().globalData.session_key = res.data.data.session_key;
              getApp().globalData.expires_in = res.data.data.expires_in;
              getApp().globalData.openid = res.data.data.openid;
              console.log(getApp().globalData.openid)
              console.log(getApp().globalData.session_key)
              console.log(getApp().globalData.expires_in)
              that.data.lyb = 'apply';
              //apply
              that.fetchData();
            } else {
              console.log('验证openid失败,临时openid为：' + res.data.message)
              getApp().globalData.openidTemp = res.data.message;
              wx.showToast({
                title: '验证用户权限失败',
                icon: 'fail',
                duration: 1800
              })
              that.fetchData();
            }
          },
        })
      }
    });
    wx.request({
      url: 'https://liuyaqing0309.com/getWeather',
      method: "GET",
      success: function (res) {
        if (res.data.codeId == 1) {
          console.log('天气数据：' + res.data.data)
          that.setData({
            weatherdate: res.data.data.date,
            weatherdayTime: res.data.data.dayTime,
            weathernight: res.data.data.night,
            weathertemperature: res.data.data.temperature,
            weatherweek: res.data.data.week,
            weatherwind: res.data.data.wind
          })
        } else {
          console.log('获取天气信息失败')
        }
      },
    })
    console.log('index页面重新加载数据');
    //生命周期函数--监听页面加载
    //this.fetchData();
  },
  fetchData: function () {
    console.log(this.data.lyb)
    var applyMenu = [{
      'icon': './../../images/icon_13.png',
      'text': '写备忘',
      'url': 'apply'
    }];
    this.setData({
      indexmenu: [
        {
          'icon': './../../images/icon_01.png',
          'text': '账本',
          'url': 'space'
        },
        // {
        //   'icon':'./../../images/icon_03.png',
        //   'text':'朋友',
        //   'url':'spacereserve'
        // },
        {
          'icon':'./../../images/icon_05.png',
          'text':'败家报表',
          'url':'conference'
        },
        {
          'icon': './../../images/icon_07.png',
          'text': '申请',
          'url': 'resource'
        },
        {
          'icon': './../../images/icon_09.png',
          'text': '疑问',
          'url': 'question'
        },
        // {
        //   'icon':'./../../images/icon_11.png',
        //   'text':'设置',
        //   'url':'property'
        // },
        // {
        //   'icon':'./../../images/icon_13.png',
        //   'text':'说点什么',
        //   'url': strTemp
        // }
      ],
      imgUrls: [
        '../../images/banner_01.jpg',
        '../../images/banner_02.jpg',
        '../../images/banner_03.jpg'
      ]
    });
    if (this.data.lyb) {
      this.setData({
        indexmenu: this.data.indexmenu.concat(applyMenu)
      })
    }
  },
  changeRoute: function (url) {
    console.log(getApp().globalData.openid)
    console.log(getApp().globalData.openid)
    wx.navigateTo({
      url: `../${url}/${url}`
    })
  },
  onReady: function () {
    //生命周期函数--监听页面初次渲染完成
    // console.log('onReady');
  },
  onShow: function () {
    //生命周期函数--监听页面显示
    // console.log('onShow');
  },
  onHide: function () {
    //生命周期函数--监听页面隐藏
    // console.log('onHide');
  },
  onUnload: function () {
    //生命周期函数--监听页面卸载
    // console.log('onUnload');
  },
  onPullDownRefresh: function () {
    //页面相关事件处理函数--监听用户下拉动作
    // console.log('onPullDownRefresh');
  },
  onReachBottom: function () {
    //页面上拉触底事件的处理函数
    // console.log('onReachBottom');
  }
})
