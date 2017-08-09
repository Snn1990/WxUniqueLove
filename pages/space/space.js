Page({
  data: {
    checitems: [],
    // selected:null,
    selectedid: 1,
    money:null,
    descInfo:null
  },
  onLoad: function () {
    this.setData({
      checitems: [
        {
          "id": 1,
          "text": "购物"
        },
        {
          "id": 2,
          "text": "日常花费"
        },
        {
          "id": 3,
          "text": "吃喝玩乐"
        },
        {
          "id": 4,
          "text": "成长钱"
        },
        {
          "id": 5,
          "text": "话费"
        },
        {
          "id": 6,
          "text": "随礼"
        }
      ]
    })
  },

  inputMoney:function(e){
    console.log(e.detail.value)
    this.data.money = e.detail.value;
  },
  inputText:function (e) {
    console.log(e.detail.value)
    this.data.descInfo = e.detail.value;
  },

  clickOk:function(){
    console.log("消费类型：" + this.data.checitems[this.data.selectedid-1].text);
    console.log("消费金额：" + this.data.money );
    console.log("消费描述：" + this.data.descInfo);
    
    wx.showToast({
      title: '这笔消费已经成功记录',
    })
    var that=this;
    wx.request({
      url: 'https://liuyaqing0309.com/addBalance',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "number": that.data.selectedid,
        "style": this.data.checitems[this.data.selectedid-1].text,
        "descInfo": that.data.descInfo,
        "money": that.data.money,
        "openId": getApp().globalData.openid
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (err) {
        console.log(err)
      }
    })
    setTimeout(function () {
      wx.switchTab({
        url: '../index/index',
      })
    }, 700)
  },
  onSelectTag: function (e) {
    const eid = e.currentTarget.dataset.id;
    const selected = this.data.selected;
    this.setData({
      // selected:selected.indexOf(eid)>-1?selected.filter(i=>i!=eid):selected.concat(eid)
      selectedid: eid
    })
    console.log(this.data.selectedid);
  }
})
