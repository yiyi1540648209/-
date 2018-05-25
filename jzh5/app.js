//app.js
var util = require('/utils/util.js');
var app = getApp();
App({
    //获取用户openId
    getOpenId:function(){
        var that=this;
        return wx.getStorageSync('openId');
    },

    //用户登录
    userLogin: function (code){
        var that=this;
        let url = that.globalData.address + "/member/code_login";
        wx.request({
            url: url,
            data: {
                code: code,
            },
            success: function (res) {
                wx.setStorageSync('openId', res.data.data);
            }
        })
    },
    getUserInfo: function () {
        var that = this;
        var openId = (wx.getStorageSync('openId'));
        if (openId) {
            wx.getUserInfo({
                success: function (res) {
                },
                fail: function () {
                    console.log("获取失败！")
                },
            })
        } else {
            wx.login({
                success: function (res) {
                    that.userLogin(res.code);
            
                }
            })
        }
    },
   
  globalData: {
      address: "https://account.esunego.com",
     // address: "http://112.126.79.148:19080",
 },

})