//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    items: [],
    hidden: false,
    loading: false,
    plain: false,
  },
 onItemClick: function (event) {
    var targetUrl = "/pages/image/image";
    if (event.currentTarget.dataset.url != null)
      targetUrl = targetUrl + "?url=" + event.currentTarget.dataset.url;
    wx.navigateTo({
      url: targetUrl
    });
  },
  onReachBottom: function () {
    console.log('onLoad')
    var that = this
    that.setData({
      hidden: false,
    });
    requestData(that, tags[0] ,mCurrentPage + 1);
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    
    requestData(that,currentTag, mCurrentPage + 1);
  },
  onTapTag: function (e){
    var that = this
    var selectedTab = e.currentTarget.id;
    console.log(selectedTab);
    mCurrentPage = 0;
    requestData(that, selectedTab, mCurrentPage);
    // console.log(tab);
  }

})

/**
 * 定义几个数组用来存取item中的数据
 */
var mUrl = [];
var mDesc = [];
var mWho = [];
// var mTimes = [];
// var mTitles = [];
var mCurrentPage = 0;
var currentTag = 'QingXin';
// 引入utils包下的js文件
var Constant = require('../../utils/constant.js');
var scrollTop = 1;
/**
 * 请求数据
 * @param that Page的对象，用来setData更新数据
 * @param targetPage 请求的目标页码
 */
function requestData(that, tag , targetPage) {
  wx.showToast({
    title: '加载中',
    icon: 'loading'
  });
  wx.request({
    url: Constant.GET_MEIZHI_URL + "/" + tag + "/page/" + targetPage,
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (res == null ||
        res.data == null ||
        res.data.results == null ||
        res.data.results.length <= 0) {
        console.error("god bless you...");
        return;
      }
      console.log();
      if(tag == currentTag){
        console.log("一样");
      }else{
        console.log("不一样");
        currentTag = tag;
        mUrl = [];
        mDesc = [];
        mWho = [];
      }


      for (var i = 0; i < res.data.results.length; i++)
        bindData(res.data.results[i]);

      //将获得的各种数据写入itemList，用于setData
      var itemList = [];
      for (var i = 0; i < mUrl.length; i++)
        itemList.push({ url: mUrl[i], desc: mDesc[i], who: mWho[i] });
      that.setData({
        items: itemList,
        hidden: true,
        // loadmorehidden:false,
      });
      mCurrentPage = targetPage;
      wx.hideToast();
    }
  });
}

/**
 * 绑定接口中返回的数据
 * @param itemData Gank.io返回的content;
 */
function bindData(itemData) {

  var url = itemData.image_url.replace("//ww", "//ws");
  var desc = itemData.objectId;
  var who = itemData.category;

  mUrl.push(url);
  mDesc.push(desc);
  mWho.push(who);
}