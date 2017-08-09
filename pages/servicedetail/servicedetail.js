Page({
  data: {
    servicedetail:{},
  },
  onLoad: function (options) {
    const i = options.id;
    console.log(options.id);
    console.log(options.name);
    console.log(options.classs);
    console.log(options.state);
    console.log(options.text);
    this.setData({
      servicedetail:{
        "name": options.name,
        "classs": options.classs,
        "state": options.state,
        "text": options.text
      }
    })
    wx.setNavigationBarTitle({
      title: this.data.servicedetail.name
    })
  }
})
