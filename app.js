// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'ironman-1gg3h9uqa03ac40b', // 云开发环境id
    });
  },
  globalData: {
    userInfo: null,
  },
});
