// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
  },

  // 发布功能
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        console.log('success逻辑: ', res);
        if (res) {
          console.log('res存在');
          // 如果能够获取到用户信息，则直接跳转
          const userInfo = wx.getStorageSync('userinfo');
          console.log('缓存里的数据: ', userInfo);
          if (userInfo) {
            this.onLoginSuccess({
              detail: userInfo
            });
          } else {
            wx.getUserProfile({
              lang: 'zh_CN',
              desc: "获取您的昵称、头像、地区及性别",
              success: (res) => {
                console.log('获取您的昵称、头像、地区及性别成功: ', res);
                wx.setStorageSync('userinfo', res.userInfo);
                this.onLoginSuccess({
                  detail: res.userInfo
                });
              },
              fail: (res) => {
                this.onLoginFail();
              }
            });
          }
        } else {
          console.log('打开底部弹层');
          this.setData({
            modalShow: true,
          });
        }
      }
    });
  },

  onLoginSuccess(event) {
    console.log(event);
    const detail = event.detail;
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    });
  },

  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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