// 云函数入口文件
const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
const axios = require('axios');
const BASE_URL = 'https://autumnfish.cn';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  // 首页歌单接口
  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud
      .database()
      .collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res;
      });
  });

  // 歌单点进去的歌曲列表接口
  app.router('musiclist', async(ctx, next) => {
    // ctx.body = await axios.get(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
    //   .then((res) => {
    //     return JSON.parse(res)
    //   })
    const { data } = await axios.get(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId));
    ctx.body = data;
  });

  // 获取歌曲播放地址
  app.router('musicUrl', async(ctx, next) => {
    // ctx.body = await axios.get(BASE_URL + `/song/url?id=${event.musicId}`).then((res) => {
    //   return res
    // });
    const { data } = await axios.get(BASE_URL + `/song/url?id=${event.musicId}`);
    ctx.body = data
  });

  // 获取歌词
  app.router('lyric', async(ctx, next) => {
    const { data } = await axios.get(BASE_URL + `/lyric?id=${event.musicId}`);
    ctx.body = data;
  });

  return app.serve();
};
