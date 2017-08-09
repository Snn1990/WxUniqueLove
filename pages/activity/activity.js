import util from './../../utils/util.js';
Page({
  data: {
    sortindex:0,  //排序索引
    sortid:0,  //排序id
    sort:[],
    activitylist:[], //会议室列表列表
    scrolltop:null, //滚动位置
    page: 0,  //分页
    lastPage:true, //最后一页
    dataName:'本月消费总额',
    dataMoney:0,
    money:[],
    fistOpenPage:null
  },
  onShow:function(e){
    console.log('onShow');
    if (this.data.fistOpenPage){
      //不是第一次点击账单，重新加载数据
      this.onLoad();
    }
    this.setData({
      fistOpenPage:1
    })
  },
  // onHide:function(e){
  //   console.log('onHide');
  // },
  // onUnload:function(e){
  //   console.log('onUnload');
  // },
  checkInfo: function () {
    var that = getApp();
    console.log('子页面登录验证');
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
              that.globalData.session_key = res.data.data.session_key;
              that.globalData.expires_in = res.data.data.expires_in;
              that.globalData.openid = res.data.data.openid;
              console.log(that.globalData.openid)
              console.log(that.globalData.session_key)
              console.log(that.globalData.expires_in)
            } else {
              console.log('验证openid失败,临时openid为：' + res.data.message)
              that.globalData.openidTemp = res.data.message;
              wx.showToast({
                title: '验证用户权限失败',
                icon: 'fail',
                duration: 1800
              })
            }
          },
        })
      }
    })
  },
  onLoad: function () { //加载数据渲染页面
    this.checkInfo();
    if (getApp().globalData.openid) {
      this.fetchConferenceData();
      this.fetchSortData();
    } else {
      wx.showModal({
        title: '',
        content: '未通过认证，无法操作，请先申请',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    };
  },
  fetchSortData:function(){ //获取筛选条件
    this.setData({
      "sort": [
          {
              "id": 0,
              "title": "月统计"
          },
          {
              "id": 1,
              "title": "日统计"
          },
          {
              "id": 2,
              "title": "年统计"
          },
      ]
    })
  },
  fetchConferenceData:function(){  //活动列表
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    const newlist = [];
    var that = this;
    wx.request({
      url: 'https://liuyaqing0309.com/getBalacenSum',
      data: {
        "openId": getApp().globalData.openid
      },
      method: "GET",
      success: function (res) {
        console.log(res);
        
        var moneyTemp = [];
        moneyTemp.push({
          "id":0,
          "money": res.data.data.moneyMonth
        },
        {
          "id": 1,
          "money": res.data.data.monryDay
        },
        {
          "id": 2,
          "money": res.data.data.moneyYear
        })
        that.data.dataMoney = moneyTemp[that.data.sortindex].money
        newlist.push({
          "id": 1,
          "name": that.data.dataName,
          "time": util.formatTime(new Date),
          "coments": that.data.dataMoney + ' 元',
          "address": "点击查看详细消费 "
        });

        that.setData({
          money: moneyTemp
        })
      },
    })
  
    setTimeout(() => {
      that.setData({
        activitylist: newlist
      })
    }, 1500)
    console.log(this.data.activitylist)
    // this.setData({
    //   lastPage: true
    // })
  },
  setSortBy:function(e){ //选择排序方式
    const d= this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex:dataset.sortindex,
      sortid:dataset.sortid
    })
    this.data.activitylist=[];
    console.log('排序方式id：' + this.data.sort[this.data.sortindex].title);
    if (this.data.sortindex == 0){
      this.data.dataName = '本月消费总额'
    } else if (this.data.sortindex == 1){
      this.data.dataName = '当日消费总额'
    }else{
      this.data.dataName = '年度消费总额'
    }
    const newlist = [];
    newlist.push({
      "id": 1,
      "name": this.data.dataName,
      "time": util.formatTime(new Date),
      "coments": this.data.money[this.data.sortindex].money + ' 元',
      "address": "点击查看详细消费 "
    });
    this.setData({
      activitylist:newlist
    })
  },
  setStatusClass:function(e){ //设置状态颜色
    console.log(e);
  },
  scrollHandle:function(e){ //滚动事件
    this.setData({
      scrolltop:e.detail.scrollTop
    })
  },
  goToTop:function(){ //回到顶部
    this.setData({
      scrolltop:0
    })
  },
  scrollLoading:function(){ //滚动加载
    if (true){
    
    }else{
      this.fetchConferenceData();
      this.setData({
        lastPage:true
      })
    }
    
  },
  refushData:function(){ //刷新
    
    this.fetchConferenceData();
    //this.data.sortindex=0;
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },1000)
  }
  
})