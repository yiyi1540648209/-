
var util = require('../../utils/util.js');
var app = getApp();

Page({
    data: {
        accountDate: '',
        todayDate: '',
        hfmTime: '',
        price: 0.00,
        type: '',
        radioIncome: true,
        radioPay: false,
        content: '',
        id:'',
        urlType:'',
        isShowCaculator: true,//是否显示计算器（隐藏为空）
        caculatorEnd: true,//计算完毕，重新开始

    },
    onLoad: function (e) {
        this.setData({
            id: e.id,
            urlType: e.urlType
        });
        console.log(e.urlType);
        var that = this;
        that.getDetail();
    },

    //获取账单详情
    getDetail:function(){
        let that = this;
        let url = app.globalData.address + "/account/account_edit_info";
        wx.request({
            url: url,
            data:{
                id:this.data.id,
            },
            success:function(res){
                if (res.data.status == 0) {
                    console.log(res.data);
                    let datas = res.data.data;
                    that.setData({
                        accountDate: (datas.accountDateStr).split(" ")[0],
                        price: datas.price,
                        type: datas.type,
                        content: datas.content
                    })
                    if (that.data.type =="income"){
                        that.setData({
                            radioIncome:true,
                            radioPay:false
                        })   
                    }else{
                        that.setData({
                            radioIncome: false,
                            radioPay: true
                        }) 
                    }
                }
            },
        })
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

    //确认编辑后账单
    editBill: function () {
        let that = this;
        let openId = app.getOpenId();
        let url = app.globalData.address + "/account/update_account";
        let data = {
            openId: openId,
            //openId: 'o5gYh0d3yDi9ZXxkeYPe9Yu6g6-0',
            id: this.data.id,
            accountDate: this.data.accountDate + ' ' + this.data.hfmTime,
            price: this.data.price,
            type: this.data.type,
            content: this.data.content,
        };
        wx.request({
            url: url,
            data: data,
            success: function (res) {
                if (res.data.status == 0) {
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 500,
                    });
                    that.autoGoBack();
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '修改失败',
                        showCancel: false,
                    });
                    wx.navigateBack({
                        url:"../index/index",
                    });
                }
            }
        })
    },


    //删除账单
    delBill: function () {
        let that = this;
        let openId = app.getOpenId();
        let url = app.globalData.address + "/account/del_account";
        wx.request({
            url: url,
            data: {
                openId:openId,
                id: this.data.id,
            },
            success: function (res) {
                if (res.data.status == 0) {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 500,
                    });
                    that.autoGoBack();
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '删除失败',
                        showCancel: false,
                    });
                    wx.navigateBack({
                        url: "../index/index",
                    });
                }
            }
        })
    },

    autoGoBack:function(){
        let that=this;
        setTimeout(function () {
            var backUrl = '';
            if (that.data.urlType == "index") {
                backUrl= '../index/index' //返回首页
            } else {
                backUrl= '../bill/bill' //返回历史账单页面
            }
            wx.switchTab({
                url: backUrl
            });
        }, 700)
    },
    onReady: function () {
        this.setData({
            //accountDate: util.formatTime(new Date(), "yyyy-MM-dd"),
            todayDate: util.formatTime(new Date(), "yyyy-MM-dd"),
            hfmTime: util.formatTime(new Date(), "hh:mm:ss"),
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
                showCancel: false,
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
        this.editBill();
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