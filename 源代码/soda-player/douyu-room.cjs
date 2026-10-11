const fs=require('node:fs/promises'),path=require('node:path');
const {WebArtwork}=require('./web-artwork.cjs');
function roomFromLog(text){
 let room='';
 for(const line of text.split(/\r?\n/)){
  if(!/\b(?:qmlmediadecoder|PlayerInfoStatistics)\.cpp:\d+/i.test(line))continue;
  const ids=[...new Set([...line.matchAll(/\b(?:room_?id|rid)["\s]*[=:]["\s]*([1-9]\d{0,11})\b/gi)].map(m=>m[1]))];
  if(ids.length===1)room=ids[0];
 }
 return room;
}
async function tail(file){let handle;try{handle=await fs.open(file,'r');const size=(await handle.stat()).size,position=Math.max(0,size-262144),buffer=Buffer.alloc(size-position);const {bytesRead}=await handle.read(buffer,0,buffer.length,position);return buffer.subarray(0,bytesRead).toString('utf8');}catch{return '';}finally{await handle?.close();}}
async function fetchRoom(id){
 const response=await fetch('https://open.douyucdn.cn/api/RoomApi/room/'+id,{signal:AbortSignal.timeout(5000)});
 if(!response.ok||Number(response.headers.get('content-length')||0)>262144)return null;
 const text=await response.text();if(text.length>262144)return null;
 const value=JSON.parse(text),data=value.data;
 if(value.error!==0||String(data?.room_id)!==id||!data.room_name)return null;
 return {title:String(data.room_name).slice(0,320),coverUrl:data.room_thumb||''};
}
class DouyuRoom {
 constructor({logRoot=path.join(process.env.LOCALAPPDATA||path.join(require('node:os').homedir(),'AppData','Local'),'DouyuLive','logs','PCClient'),fetchInfo=fetchRoom,artwork=new WebArtwork(),now=()=>Date.now()}={}){this.logRoot=logRoot;this.fetchInfo=fetchInfo;this.artwork=artwork;this.now=now;this.roomId='';this.current=null;this.cache=new Map();this.requests=new Map();this.retryAt=new Map();}
 reset(){this.roomId='';this.current=null;}
 async observe(){
  const today=new Date(this.now());
  for(let offset=0;offset<2;offset++){const date=new Date(today);date.setDate(date.getDate()-offset);const stamp=String(date.getFullYear())+String(date.getMonth()+1).padStart(2,'0')+String(date.getDate()).padStart(2,'0');const id=roomFromLog(await tail(path.join(this.logRoot,'DouyuLive.exe.INFO.'+stamp)));if(id)return id;}
  return '';
 }
 async read(){
  const id=await this.observe();
  if(!id){this.reset();return null;}
  if(id!==this.roomId){this.roomId=id;this.current=null;}
  const cached=this.cache.get(id);if(cached)this.current=cached.value;
  if((!cached||this.now()-cached.at>30000)&&!this.requests.has(id)&&this.now()>=(this.retryAt.get(id)||0)){
   const request=(async()=>{try{const info=await this.fetchInfo(id);if(!info)return;const image=await this.artwork.read([{src:info.coverUrl,kind:'thumbnail'}]);const value={roomId:id,title:info.title,cover:image.cover||''};this.cache.set(id,{at:this.now(),value});if(this.cache.size>16)this.cache.delete(this.cache.keys().next().value);if(this.roomId===id)this.current=value;}catch{}finally{this.requests.delete(id);this.retryAt.set(id,this.now()+5000);}})();
   this.requests.set(id,request);
  }
  return this.current;
 }
}
module.exports={DouyuRoom,roomFromLog};
