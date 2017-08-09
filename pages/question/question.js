import util from './../../utils/util.js';
Page({
  data: {
    showtab:0,  //顶部选项卡索引
    showtabtype:'', //选中类型
    showfootertab:0,  //底部标签页索引
    tabnav:{},  //顶部选项卡数据
    questionsall:[],  //所有问题
    questions:[], //问题列表
    showquestionindex:null, //查看问题索引,
    uploadimgs:[], //上传图片列表
    editable: false, //是否可编辑
    reqName:null,
    reqPhone:null,
    reqDesc:null
  },
  inputName: function (e) {
    console.log("更改inputName的值")
    this.setData({
      reqName: e.detail.value
    })
  },
  inputPhone: function (e) {
    console.log("更改inputPhone的值")
    this.setData({
      reqPhone: e.detail.value
    })
  },
  inputDesc: function (e) {
    console.log("更改inputDesc的值")
    this.setData({
      reqDesc: e.detail.value
    })
  },
  onLoad: function () {
    this.setData({
      tabnav:{
        tabnum:5,
        tabitem:[
          {
            "id":0,
            "type":"",
            "text":"全部"
          },
          {
            "id":1,
            "type":"A",
            "text":"认证问题"
          },
          {
            "id":2,
            "type":"B",
            "text":"日志问题"
          },
          {
            "id":3,
            "type":"C",
            "text":"活动问题"
          },
          {
            "id":4,
            "type":"D",
            "text":"入驻问题"
          }
        ]
      },
      uploadimgs:[]
    })
    this.fetchQuestions();
  },
  chooseImage:function() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if(res.tapIndex == 0){
            _this.chooseWxImage('album')
          }else if(res.tapIndex == 1){
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage:function(type){
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          uploadimgs: _this.data.uploadimgs.concat(res.tempFilePaths)
        })
      }
    })
  },
  editImage:function(){
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg:function(e){
    console.log(e.currentTarget.dataset.index);
    const imgs = this.data.uploadimgs
    // Array.prototype.remove = function(i){
    //   const l = this.length;
    //   if(l==1){
    //     return []
    //   }else if(i>1){
    //     return [].concat(this.splice(0,i),this.splice(i+1,l-1))
    //   }
    // }
    this.setData({
      uploadimgs: imgs.remove(e.currentTarget.dataset.index)
    })
  },
  questionSubmit:function(){
    var that = this;
    if (!that.data.reqDesc){
      wx.showModal({
        title: '',
        content: '描述不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (!that.data.reqName){
      wx.showModal({
        title: '',
        content: '名字不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (!that.data.reqPhone){
      wx.showModal({
        title: '',
        content: '手机号不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }else{
      wx.request({
        url: 'https://liuyaqing0309.com/addQuestion',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          "questionDesc": that.data.reqDesc,
          "name": that.data.reqName,
          "phoneNum": that.data.reqPhone,
          "openId": getApp().globalData.openid
        },
        success: function (res) {
          console.log(res.data)
          wx.showModal({
            title: '提交成功',
            showCancel:false,
            confirmText:'返回首页',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: '../index/index',
                })
              }else{
                console.log('用户点击取消')
                that.setData({
                  reqName: null,
                  reqPhone: null,
                  reqDesc: null
                })
              }
            }
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },
  fetchQuestions:function(){  //获取问题列表
    const newquestions = [];
    newquestions.push({
      "id": 1,
      "type": util.getRandomArrayElement(["A", "B", "C", "D"]),
      "q": "为什么提示验证失败？",
      "a": "你需要在首页面点击申请，进行身份认证，这样才能使用后续的功能。"
    })
    newquestions.push({
      "id": 2,
      "type": util.getRandomArrayElement(["A", "B", "C", "D"]),
      "q": "申请认证需要多少时间？",
      "a": "这个需要看程序猿哥哥的反应速度哦，如果您认识他，当然是最快的。申请的时候一定要写上您的姓名和申请原因哦，一条给力的申请原因，能大大提高认证的成功度。"
    })
    
    this.setData({
      questions:newquestions,
      questionsall:newquestions
    })
  },
  setTab:function(e){ //设置选项卡选中索引
    const edata = e.currentTarget.dataset;
    this.setData({
      showtab: edata.tabindex,
      showtabtype: edata.type,
      questions: !edata.type ? this.data.questionsall:this.data.questionsall.filter(l=>l.type === edata.type),
      showquestionindex: this.data.showtab==edata.tabindex?this.data.showquestionindex:null
    })
  },
  showTab:function(e){  //切换选项卡
    const eindex = e.currentTarget.dataset.index;
    if(eindex==1&&!this.data.questions){
      console.log("text");
    }
    wx.setNavigationBarTitle({
      title:eindex==1?"常见问题":"问题反馈"
    })
    this.setData({
      showfootertab:eindex
    });
  },
  foldQuestion:function(e){ //展开收起问题
    const eindex = e.currentTarget.dataset.qindex;
    const oldqindex = this.data.showquestionindex;
    this.setData({
      showquestionindex: eindex===oldqindex?null:eindex
    })
  },
  callContact: function(e){  //拨打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.ponenumber
    })
  }
})
