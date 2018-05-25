
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    billNo: '',
    accountDate: '',
    todayDate: '',
    hfmTime:'',
    price: 0.00,
    type: 'income',
    radioIncome:true,
    radioPay:false,
    content: '',
    isShowCaculator: true,//是否显示计算器（隐藏为空）
    caculatorEnd: true,//计算完毕，重新开始
    
  },
  //选择时间
  onDateChange: function (e) {
    this.setData({
        accountDate: e.detail.value,
    });
  },

  //选择类型
  radioChange: function (e) {
      this.setData({
          type: e.detail.value
      })
  },

  //备注输入
  onInputMemo: function (e) {
      var memotext = e.detail.value;
      this.setData({
          content: memotext,
      });
      if (this.data.isShowCaculator) {
          this.hiddenCaculator();
      }
  },

  //保存账单
  saveBill: function () {
      let that=this;
      let openId = app.getOpenId();
      let url = app.globalData.address + "/account/save_account";
      let data = {
          openId: openId,
          //openId: 'o5gYh0d3yDi9ZXxkeYPe9Yu6g6-0',
          accountDate: this.data.accountDate +' '+ this.data.hfmTime,
          price: this.data.price,
          type: this.data.type,
          content: this.data.content,
      };
      wx.request({
          url: url,
          data: data,
          method: 'POST', 
          header: {
              "Content-Type": "application/x-www-form-urlencoded"
          }, 
          success: function (res) {
              if (res.data.status == 0) {
                  wx.showToast({
                      title: '记账成功',
                      icon: 'success',
                      duration: 500,
                  });
                  that.clearInput();
                  setTimeout(function () {
                      wx.switchTab({
                          url: '../index/index'
                      }); 
                  }, 700)
                  
              } else {
                  wx.showModal({
                      title: '提示',
                      content: '记账失败',
                      showCancel: false,
                  });
              }
          }
      })
  },
  
  //清空input
  clearInput:function(e){
      this.setData({
         price: '0.00',
         content: '',
         radioIncome:true,
         radioPay: false,
         
    });
  },

  //显示计算器
  showCaculator: function () {
    this.setData({
      isShowCaculator: true,
    });
  },
  //隐藏计算器
  hiddenCaculator: function () {
    this.setData({
      isShowCaculator: false,
    });
  },
  
  //完成记录
  confirmData: function () {
    if (!this.data.caculatorEnd) {
      this.caculatorResult();
    }

    //金额必填
    if (parseFloat(this.data.price) == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入花费金额',
        showCancel:false,
      });
      return;
    }

    //备注必填
    if (!this.data.content) {
        wx.showModal({
            title: '提示',
            content: '请输入账单备注',
            showCancel: false,
        });
        return;
    }
    this.saveBill();
  },

  //计算器相关
  touchNum: function (e) {

    var text = e.currentTarget.dataset.num;
    var num = "";
    if (text == "+") {
      this.setData({
        caculatorEnd: false,
      });
    }
    if (parseFloat(this.data.price) != 0) {
        num = this.data.price;
      if (this.data.caculatorEnd) {
        num = "";
      }
    }
    num = num + text;
    this.setData({
        price: num == 0 ? "0.00" : num,
      caculatorEnd: false,
    });
  },
  
  //删除一个字符
  touchClear: function () {
      if (parseFloat(this.data.price) != 0) {
          var text = this.data.price;
      text = text.substring(0, text.length - 1);

      this.setData({
          price: text == 0 ? "0.00" : text,
      });
    }
  },

  //计算结果
  touchResult: function () {
    this.caculatorResult();

  },

  caculatorResult: function () {
      if (parseFloat(this.data.price) != 0) {
          var result = this.data.price + "";
      var strResult = result.split("+");
      var sum = 0;
      strResult.forEach(function (num) {
        sum += parseFloat(num == "" ? 0 : num)
      });
      this.setData({
          price: sum == 0 ? "0.00" : sum,
        caculatorEnd: true,
      });
      this.hiddenCaculator();
    }
  },


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      billNo: options.billID
    });
  },

  onReady: function () {
     this.setData({
      accountDate: util.formatTime(new Date(), "yyyy-MM-dd"),
      todayDate: util.formatTime(new Date(), "yyyy-MM-dd"),
      hfmTime: util.formatTime(new Date(), "hh:mm:ss"),
    });
  },

  onShow: function () {
    // 页面显示
  },

  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭
  },
})