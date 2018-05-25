var util = require('../../utils/util.js');
var app = getApp();
var touchStartTime = 0;
var touchEndTime = 0;
Page({
  data: {
    startDate:'',
    expend:0,
    income:0,
    balance:0,
    monthData:[],
    scrollHeight: "100%",
  },
  //更改开始日期
  startDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    });
    this.getMonthData();
  },
  
  onLoad: function (options) {
      var startDate = util.addDay(-7);
      this.setData({
          startDate: util.formatTime(startDate, "yyyy-MM"),
      });
      //this.getMonthData(); 
  },

  onShow: function () {
      var startDate = util.addDay(-7);
      this.setData({
          startDate: util.formatTime(startDate, "yyyy-MM"),
      });
      this.getMonthData();
  },

  getMonthData: function () {
      let that = this;
      let openId = app.getOpenId();
      let url = app.globalData.address + "/account/month_list";
      wx.request({
          url: url,
          data: {
              openId: openId,
              //openId: 'o5gYh0d3yDi9ZXxkeYPe9Yu6g6-0',
              selectMonthDate: that.data.startDate,
          },
          success: function (res) {
              that.setData({
                  expend: res.data.data.monthBalance.payCount,
                  income: res.data.data.monthBalance.incomeCount,
                  balance: res.data.data.monthBalance.balance,
                  monthData:res.data.data.dayBalanceList,
              })
          },
          fail: function (err) {
              console.log(err)
          }
      })
  },

  onTouchStart: function (e) {
    touchStartTime = e.timeStamp;
  },

  onTouchEnd: function (e) {
    touchEndTime = e.timeStamp;
  },

  //今日账单item点击
  onTodayBillItemClick: function (e) {
      let that = this;
      let id = e.currentTarget.dataset.id;
      if (touchEndTime - touchStartTime > 500) {
          wx.showModal({
              title: '提示',
              content: '确认删除本条账单记录！！！',
              success: function (res) {
                  if (res.confirm) {
                      that.delBill(id);
                  }
              }
          })
      } else {
          wx.navigateTo({
              url: '../edit/edit?id='+id+"&urlType=bill",
          })
      }
  },

  delBill: function (id) {
      let that = this;
      let openId = app.getOpenId();
      let url = app.globalData.address + "/account/del_account";
      wx.request({
          url: url,
          data: {
              openId:openId,
              id:id
          },
          success: function (res) {
              if (res.data.status == 0) {
                  wx.showToast({
                      title: '删除成功',
                      icon: 'success',
                      duration: 500,
                  });
                  that.getMonthData();
              } else {
                  wx.showModal({
                      title: '提示',
                      content: '删除失败',
                      showCancel: false,
                  });
              }
          }
      })
  },

  onReady: function () {
    // 页面渲染完成
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})