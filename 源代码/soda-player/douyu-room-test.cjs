const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {DouyuRoom,roomFromLog}=require('./douyu-room.cjs');
(async()=>{
 assert.equal(roomFromLog('Recommendation.cpp:1 roomid=999\nqmlmediadecoder.cpp:677 roomid=5908256\nChat.cpp:1 rid=888'),'5908256');
 assert.equal(roomFromLog('PlayerInfoStatistics.cpp:217 roomid=5908256\nqmlmediadecoder.cpp:882 rid=226037'),'226037');
 assert.equal(roomFromLog('qmlmediadecoder.cpp:1 rid=2 roomid=3'),'');
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'watersprite-douyu-room-'));
 try{
  const date=new Date(),stamp=String(date.getFullYear())+String(date.getMonth()+1).padStart(2,'0')+String(date.getDate()).padStart(2,'0'),file=path.join(root,'DouyuLive.exe.INFO.'+stamp);
  const deferred=new Map(),calls=[];
  const reader=new DouyuRoom({logRoot:root,fetchInfo:id=>{calls.push(id);return new Promise(resolve=>deferred.set(id,resolve));},artwork:{read:async items=>({cover:'image:'+items[0].src})}});
  await fs.writeFile(file,'qmlmediadecoder.cpp:677 roomid=5908256');
  assert.equal(await reader.read(),null);assert.deepEqual(calls,['5908256']);
  await reader.read();assert.equal(calls.length,1,'No duplicate requests while waiting');
  await fs.appendFile(file,'\nqmlmediadecoder.cpp:882 rid=226037');
  assert.equal(await reader.read(),null,'Clear old room during change');
  deferred.get('5908256')({title:'Previous room',coverUrl:'old'});await reader.requests.get('5908256');
  assert.equal(reader.current,null,'Stale response cannot overwrite new room');
  deferred.get('226037')({title:'Current room',coverUrl:'new'});await reader.requests.get('226037');
  assert.deepEqual(await reader.read(),{roomId:'226037',title:'Current room',cover:'image:new'});
  assert.equal(calls.length,2,'Resolved room metadata cached');
  reader.reset();assert.equal(reader.current,null);
  await fs.writeFile(file,'Recommendation.cpp:1 rid=999');
  assert.equal(await reader.read(),null,'Missing player record must not use recommendation');
  console.log('PASS: player-only room fields, switch clearing, stale response exclusion, request coalescing, cache and reset.');
 }finally{await fs.rm(root,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1});
