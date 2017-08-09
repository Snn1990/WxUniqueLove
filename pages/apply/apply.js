Page({
  data: {
    industryarr:[],
    industryindex:0,
    statusarr:[],
    statusindex:0,
    jobarr:[],
    jobindex:0,
    name:"",
    classs:"",
    state:"",
    text:""
  },
  onLoad: function () {
    this.fetchData()
    console.log(getApp().globalData.userInfo)
  },
  inputName: function(e){
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
  fetchData: function(){
    this.setData({
      industryarr:["请选择","家人生日","联系电话","常用记录","工作记录","家庭记录","分享","其他"],
      statusarr:["请选择","待完成","已经完成","备忘"],
      jobarr:["请选择","其他"]
    })
  },
  bindPickerChange: function(e){ //下拉选择
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    // this.setData(Object.assign({},this.data,{name:eindex}))
    switch(name) {
      case 'industry':
        this.setData({
          industryindex: eindex
        })
        break;
      case 'status':
        this.setData({
          statusindex: eindex
        })
        break;
      case 'job':
        this.setData({
          jobindex: eindex
        })
        break;
      default:
        return
    }
  },
  
  applySubmit:function(){
    wx.showToast({
      title: '上传数据中。。',
      icon: 'loading'
    })
    console.log("name="+this.data.name)
    console.log("分类=" + this.data.industryarr[this.data.industryindex])
    console.log("状态=" + this.data.statusarr[this.data.statusindex])
    console.log("text="+this.data.text)
    
    wx.request({
      url: 'https://liuyaqing0309.com/addlogs',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        "name": this.data.name,
        "classs": this.data.industryarr[this.data.industryindex],
        "state": this.data.statusarr[this.data.statusindex],
        "text": this.data.text,
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
    }, 1800)
  }
})
