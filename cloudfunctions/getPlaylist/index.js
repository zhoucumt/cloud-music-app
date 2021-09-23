// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

const rp = require('request-promise');
// const URL = 'http://musicapi.xiecheng.live/personalized';
const URL = 'https://autumnfish.cn/personalized';
const playlistCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
  const list = await playlistCollection.get();

  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result;
  });

  const newData = [];
  // 去重
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true;
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false;
        break;
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }
  for (let i = 0, len = newData.length; i < len; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then(res => {
      console.log('插入成功');
    }).catch(err => {
      console.log('失败');
    });
  }

  return newData.length;
}