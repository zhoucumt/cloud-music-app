// components/progress-bar/progress-bar.js
let movableAreaWidth = 0;
let movableViewWidth = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager();
let currentSec = -1; // 当前的秒数
let duration = 0; // 当前歌曲的总时长，以秒为单位

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00',
    },
    movableDis: 0,
    progress: 0,
  },

  lifetimes: {
    ready() {
      this._getMovableDis();
      this._bindBGMEvent();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取可移动区域相关的宽度
    _getMovableDis() {
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect();
      query.select('.movable-view').boundingClientRect();
      query.exec((rect) => {
        console.log(rect);
        // 设置可移动区域的宽
        movableAreaWidth = rect[0].width;
        // 设置圆圈的宽
        movableViewWidth = rect[1].width;
      });
    },

    // 播放相关的事件监听
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {});

      backgroundAudioManager.onStop(() => {
        console.log('onStop');
      });

      backgroundAudioManager.onPause(() => {
        console.log('Pause');
      });

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      });

      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay');
        // console.log(backgroundAudioManager.duration)
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime();
        } else {
          // 防止有的机型上的坑
          setTimeout(() => {
            this._setTime();
          }, 1000)
        }
      });

      backgroundAudioManager.onTimeUpdate(() => {
        const currentTime = backgroundAudioManager.currentTime;
        const duration = backgroundAudioManager.duration;
        const sec = currentTime.toString().split('.')[0];
        if (sec != currentSec) {
          // console.log(currentTime)
          const currentTimeFmt = this._dateFormat(currentTime);
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
            progress: currentTime / duration * 100,
            ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
          });
          currentSec = sec;
        }
      });

      backgroundAudioManager.onEnded(() => {
        console.log("onEnded");
      });

      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg);
        console.error(res.errCode);
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      });
    },

    // 设置歌曲总时间
    _setTime() {
      duration = backgroundAudioManager.duration;
      const durationFmt = this._dateFormat(duration);
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      });
    },

    // 格式化时间
    _dateFormat(sec) {
      // 分钟
      const min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec),
      };
    },

    // 补零
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec;
    },
  }
})