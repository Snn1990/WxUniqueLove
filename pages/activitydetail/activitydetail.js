import util from './../../utils/util.js';
Page({
  data: {
    sortindex: 0,  //排序索引
    sortid: null,  //排序id
    sort: [],
    activitylist: [], //会议室列表列表
    scrolltop: null,  //滚动位置
    page: 0,  //分页
    lastPage: false, //最后一页
    dataName: '本月消费总额',
    dataMoney: 0,
    money: [],
    pageId:0,
    selectType:null,
    selectData:null
  },
  onLoad: function (options) { //加载数据渲染页面
    console.log(options.id);
    
    var oDate = new Date();
    if (options.id == 0){
      //月记录
      this.data.selectType = 'month'
      this.data.selectData = oDate.getMonth() + 1;
    } else if (options.id == 1){
      //日记录
      this.data.selectType = 'day'
      this.data.selectData = oDate.getDate();
    }else{
      //年记录
      this.data.selectType = 'year'
      this.data.selectData = oDate.getFullYear();
    }
    if (getApp().globalData.openid) {
      this.fetchConferenceData(options.id);
      //this.fetchSortData();
    } else {
      wx.showToast({
        title: '未通过认证，无法操作，请先申请',
        icon: 'faild',
        duration: 3000
      });
      setTimeout(function () {
        wx.switchTab({
          url: '../index/index',
        })
      }, 2800)
    };
  },
  
  fetchConferenceData: function (selectType) {  //活动列表
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    const newlist = [];
    var that = this;
    wx.request({
      url: 'https://liuyaqing0309.com/getBlanceBySelect',
      data: {
        "openId": getApp().globalData.openid,
        "selectType": that.data.selectType,
        "selectData": that.data.selectData,
        "pageId": that.data.pageId
      },
      method: "GET",
      success: function (res) {
        console.log(res)
        console.log("返回数据量："+res.data.data.numberOfElements)
        if (res.data.data.last == false) {
          console.log("不是最后一页，可以滚动加载" + res.data.data.last)
          that.setData({
            pageId: that.data.page + 1,
            lastPage: false
          })
        } else {
          console.log("设置为最后一页" + res.data.data.last)
          that.setData({
            lastPage: true
          })
        }
        //数据展示
        for (var i = 0; i < res.data.data.numberOfElements; i++) {
          newlist.push({
            "id": i + 1,
            "name": res.data.data.content[i].style,
            "time": res.data.data.content[i].createTime,
            "coments": res.data.data.content[i].money,
            "address": res.data.data.content[i].descInfo
          })
        }
        setTimeout(() => {
          that.setData({
            activitylist: that.data.activitylist.concat(newlist)
          })
        }, 100)
      },
    })
  },
  scrollLoading: function(){ //滚动加载
    if (this.data.lastPage) {
      console.log("已经是最后一页，不能再次请求")
    } else {
      this.fetchConferenceData();
      this.setData({
        lastPage: true
      })
    }

  },

})