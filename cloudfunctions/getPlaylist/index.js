// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

const rp = require('request-promise');
// const URL = 'http://musicapi.xiecheng.live/personalized';
const URL = 'https://autumnfish.cn/personalized';
// const playlistCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result;
  });

  for (let i = 0, len = playlist.length; i < len; i++) {
    await db.collection('playlist').add({
      data: {
        ...playlist[i],
        createTime: db.serverDate(),
      }
    }).then(res => {
      console.log('插入成功');
    }).catch(err => {
      console.log('失败');
    });
  }
}