//index.js
//获取应用实例
var util = require('../../utils/util.js');
var app = getApp();
var touchStartTime = 0;
var touchEndTime = 0;
var canClick = true;
Page({
    data: {
        dayList:[], 
        day:"",
        week:"",
        openId:'',
        yearIncome: 0,  //年收入
        yearExpend: 0,  //年支出
        yearBalance: 0,  //年结余
        monthIncome: 0,  //月收入
        monthExpend: 0,  //月支出
        monthBalance: 0,  //月结余
        dayIncome: 0,  //本日收入
        dayExpend: 0,  //本日支出
        dayBalance: 0,  //本日结余
    },

    onReady: function () {
        
    },
    onLoad: function () {
        let that = this;
        app.getUserInfo();
        console.log(1)
        var times = setInterval(function () {
            var openId = (wx.getStorageSync('openId'));
            if (openId){
                that.getDataList();
                clearInterval(times);
            }
            console.log(222);
        });
    },

    onShow: function () {
        console.log(11)
        let that = this;
        that.getDataList();

    },

    //加载数据
    getDataList: function () {
        console.log(111)
        let that = this;
        let openId = app.getOpenId();
        let url = app.globalData.address + "/account/member_banlance";
        //if(openId){
            
        //}
        wx.request({
            url: url,
            data: {
                openId: openId,
            },
            success: function (res) {
                if (res.data.status==0){
                    let datas = res.data.data;
                    let dayData = res.data.data.dayBalance;
                    let monthData = res.data.data.monthBalance;
                    let yearData = res.data.data.yearBalance
                    that.setData({
                        dayList: dayData.accountList,
                        day: dayData.accountDate,
                        week: dayData.week,

                        yearIncome: yearData.incomeCount,
                        yearExpend: yearData.payCount,
                        yearBalance: yearData.balance,

                        monthIncome: monthData.incomeCount,
                        monthExpend: monthData.payCount,
                        monthBalance: monthData.balance,

                        dayIncome: dayData.dayBalance.incomeCount,
                        dayExpend: dayData.dayBalance.payCount,
                        dayBalance: dayData.dayBalance.balance,
                    })
                }
                
            },
            fail: function (err) {
                console.log(err)
            }
        })
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
                url: '../edit/edit?id=' + id +"&urlType=index",
            })
        }
    },
    
    //删除记录
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
                    that.getDataList();
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

    onTouchStart: function (e) {
        touchStartTime = e.timeStamp;
    },

    onTouchEnd: function (e) {
        touchEndTime = e.timeStamp;
    },

    onShareAppMessage: function () {
        return {
            title: '账单',
            path: 'pages/index/index',
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    },

})
