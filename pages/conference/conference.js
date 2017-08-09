import config from '../../mars/conf/config'
var charts = require('../../mars/modules/charts')
var hiway = require('../../mars/modules/mars')

Page({
  data: {
    deviceH: 0,
    deviceW: 0,
  },
  onLoad: function (options) {
    let _this = this

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          deviceH: res.windowHeight,
          deviceW: res.windowWidth,
        })
      }
    })
  },
  //初始化图表
  initGraph: function () {
    var that = this;
    wx.request({
      url: 'https://liuyaqing0309.com/countPie',
      method: "GET",
      data:{
        'openId': getApp().globalData.openid
      },
      success: function (res) {
        console.log(res.data.data.cur);
        console.log(res.data.data.last);
        var mapCur = res.data.data.cur;
        var mapLast= res.data.data.last;

        let params = {}
        params.canvas_id = 'pieGraph'
        params.data = [
          {
            "data": parseInt(mapCur['1']),
            "name": '购物'
          },
          {
            "data": parseInt(mapCur['2']),
            "name": '日常花费'
          },
          {
            "data": parseInt(mapCur['3']),
            "name": '吃喝玩乐'
          },
          {
            "data": parseInt(mapCur['4']),
            "name": '成长钱'
          },
          {
            "data": parseInt(mapCur['5']),
            "name": '话费'
          },
          {
            "data": parseInt(mapCur['6']),
            "name": '随礼'
          }
        ]
        params.width = that.data.deviceW
        charts.shapePie(params)

        params.canvas_id = 'lineGraph'
        params.ytitle = '消费金额 (元)'
        params.xcate = ['购物', '日常花费', '吃喝玩乐', '成长钱', '话费', '随礼']
        params.data = [{
          name: '本月',
          data: [
            parseInt(mapCur['1']),
            parseInt(mapCur['2']),
            parseInt(mapCur['3']),
            parseInt(mapCur['4']),
            parseInt(mapCur['5']),
            parseInt(mapCur['6'])],
          format: function (val) {
            return val.toFixed(2) + '元';
          }
        }, {
          name: '上月',
          data: [
           parseInt(mapLast['1']),
           parseInt(mapLast['2']),
           parseInt(mapLast['3']), 
           parseInt(mapLast['4']), 
           parseInt(mapLast['5']), 
           parseInt(mapLast['6'])],
          format: function (val) {
            return val.toFixed(2) + '元';
          }
        }]
        charts.shapeLine(params)
      },
    })
  },

  onReady: function () {
    this.initGraph()
  }

})