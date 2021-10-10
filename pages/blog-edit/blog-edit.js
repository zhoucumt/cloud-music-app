// pages/blog-edit/blog-edit.js
// 输入文字最大的个数
const MAX_WORDS_NUM = 140;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入的文字个数
    wordsNum: 0,
    footerBottom: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
  },

  onInput(event) {
    //console.log(event.detail.value)
    let wordsNum = event.detail.value.length;
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`;
    }
    this.setData({
      wordsNum,
    });
    // content = event.detail.value;
  },

  // 获得焦点时，键盘弹起，底部也需要跟着上移，避免遮挡
  onFocus(event) {
    // 模拟器获取的键盘高度为0
    // console.log(event)
    this.setData({
      footerBottom: event.detail.height,
    });
  },

  onBlur() {
    this.setData({
      footerBottom: 0,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})