// pages/player/player.js
let musiclist = [];
// 正在播放歌曲的index
let nowPlayingIndex = 0;
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 封面图片
    picUrl: '',
    isPlaying: false, // false表示不播放，true表示正在播放
    isSame: false, // 表示是否为同一首歌
    isLyricShow: false,  // 歌词是否显示标志为
    lyric: '', // 歌词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    nowPlayingIndex = options.index;
    musiclist = wx.getStorageSync('musiclist');
    this._loadMusicDetail(options.musicId);
  },

  // 根据id获取歌曲详情
  _loadMusicDetail(musicId) {
    backgroundAudioManager.stop();
    let music = musiclist[nowPlayingIndex];
    // 标题显示为歌曲的名称
    wx.setNavigationBarTitle({
      title: music.name,
    });

    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
    });

    wx.showLoading({
      title: '歌曲加载中',
    });
    // 调用云函数获取歌曲url播放地址
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then(res => {
      console.log('结果:', res)
      const musicInfo = res.result.data[0]
      // let result = JSON.parse(res.result);
      // backgroundAudioManager.src = result.data[0].url;
      // backgroundAudioManager.title = music.name;
      // backgroundAudioManager.coverImgUrl = music.al.picUrl;
      // backgroundAudioManager.singer = music.ar[0].name;
      // backgroundAudioManager.epname = music.al.name;

      backgroundAudioManager.src = musicInfo.url // 要播放歌曲的 url
      backgroundAudioManager.title = music.name // 要播放歌曲的歌 名字      
      backgroundAudioManager.coverImgUrl = music.al.picUrl // 要播放歌曲的 封面图片
      backgroundAudioManager.singer = music.ar[0].name // 要播放歌曲的 歌手名字
      backgroundAudioManager.epname = music.al.name // 要播放歌曲的 专辑名字

      // 设置成正在播放
      this.setData({
        isPlaying: true
      });
      wx.hideLoading();

      // 加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric'
        }
      }).then((res) => {
        console.log('res结果: ', res);
        let lyric = '暂无歌词';
        const lrc = res.result.lrc && res.result.lrc.lyric;
        if (lrc) {
          lyric = lrc;
        }
        this.setData({
          lyric,
        });
      });

    });
  },

  // 暂停和播放的切换
  togglePlaying() {
    // 正在播放
    if (this.data.isPlaying) {
      backgroundAudioManager.pause();
    } else {
      backgroundAudioManager.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    });
  },

  // 上一首
  onPrev() {
    nowPlayingIndex--;
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1;
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id);
  },

  // 下一首
  onNext() {
    nowPlayingIndex++;
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0;
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id);
  },

  // 歌词显示后的逻辑
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    });
  },

  // 歌词时间更新后
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime);
  },

  // 播放
  onPlay() {
    this.setData({
      isPlaying: true,
    });
  },

  // 暂停
  onPause() {
    this.setData({
      isPlaying: false,
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