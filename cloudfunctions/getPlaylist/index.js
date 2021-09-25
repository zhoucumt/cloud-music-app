// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

const axios = require('axios');
// const URL = 'http://musicapi.xiecheng.live/personalized';
const URL = 'https://autumnfish.cn/personalized';
const playlistCollection = db.collection('playlist');
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playlistCollection.get();
  // 查询数据库中总的条数，返回的是一个对象
  const countResult = await playlistCollection.count()
  // 从对象中取到总条数
  const total = countResult.total
  // 需要查询的次数
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  // 突破云函数每次最多查询100条数据的限制
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  const playlist = await axios.get(URL).then((res) => {
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