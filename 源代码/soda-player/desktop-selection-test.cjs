const assert=require('node:assert/strict'),{choose}=require('./desktop-client.cjs');
const video={title:'已暂停的视频',playing:false,target:{id:'video'}},live={title:'当前直播间',playing:true,target:{id:'live'}};
assert.equal(choose([video,live],'哔哩哔哩',null),live);
const paused={...live,playing:false};assert.equal(choose([video,paused],'哔哩哔哩',live.target),paused);
assert.equal(choose([video,paused],video.title,live.target),video);
assert.equal(choose([],live.title,live.target),null);
assert.equal(choose([video,paused],'哔哩哔哩',null),null);
console.log('同时存在视频和直播时，暂停后保留目标；退出后不保留失效连接。');
