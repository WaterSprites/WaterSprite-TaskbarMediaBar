const path=require('node:path'),{execFile}=require('node:child_process');
const {WebArtwork}=require('./web-artwork.cjs');
function discover(){return new Promise(resolve=>execFile(path.join(process.env.SystemRoot||'C:\\Windows','System32','WindowsPowerShell','v1.0','powershell.exe'),['-NoProfile','-ExecutionPolicy','Bypass','-File',path.join(__dirname,'yy-endpoint.ps1')],{windowsHide:true,timeout:6000},(error,stdout)=>{try{resolve(error?[]:JSON.parse(stdout));}catch{resolve([]);}}));}
async function text(url,timeout=5000){const response=await fetch(url,{signal:AbortSignal.timeout(timeout)});if(!response.ok||Number(response.headers.get('content-length')||0)>1048576)throw Error('YY metadata unavailable');const value=await response.text();if(value.length>1048576)throw Error('YY metadata too large');return value;}
function channelFromTargets(targets){
 const ids=new Set();for(const target of targets||[]){try{const u=new URL(target.url);if(target.type==='page'&&u.protocol==='https:'&&u.hostname==='web.yy.com'&&u.pathname.startsWith('/entertainment_pc/')){const id=u.searchParams.get('sid');if(/^[1-9]\d{0,19}$/.test(id||''))ids.add(id);}}catch{}}
 return ids.size===1?[...ids][0]:'';
}
function parsePage(html,id){
 const field=name=>new RegExp('\\b'+name+'\\s*:\\s*["\x27]([^"\x27]*)["\x27]').exec(html)?.[1]||'';
 if(field('sid')!==id||!/^[1-9]\d{0,19}$/.test(field('uid')))return null;
 const encoded=/roomName\s*:\s*decodeURIComponent\(["']([^"']*)["']\)/.exec(html)?.[1];
 let title;try{title=encoded?decodeURIComponent(encoded):field('roomName');}catch{return null;}
 return title?{title:title.replace(/\s+/g,' ').trim().slice(0,320),uid:field('uid')}:null;
}
async function fetchInfo(id){
 const info=parsePage(await text('https://www.yy.com/'+id),id);if(!info)return null;
 let coverUrl='';try{const snapshots=JSON.parse(await text('https://videosnapshot.yy.com/?uid='+info.uid+'&op=listfile'));coverUrl=(snapshots[info.uid]||[]).find(value=>{try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='videosnapshot.yy.com'&&!u.username&&!u.password&&!u.port&&new RegExp('^/'+info.uid+'_\\d+$').test(u.pathname);}catch{return false;}})||'';}catch{}
 return {...info,coverUrl};
}
class YYRoom {
 constructor({discoverPorts=discover,readTargets=async port=>JSON.parse(await text('http://127.0.0.1:'+port+'/json',1500)),fetchMetadata=fetchInfo,artwork=new WebArtwork(),now=()=>Date.now()}={}){this.discoverPorts=discoverPorts;this.readTargets=readTargets;this.fetchMetadata=fetchMetadata;this.artwork=artwork;this.now=now;this.port=0;this.discoveredAt=-Infinity;this.roomId='';this.current=null;this.cache=new Map();this.requests=new Map();this.retryAt=new Map();}
 reset(){this.roomId='';this.current=null;this.port=0;this.discoveredAt=-Infinity;}
 async observe(){
  if(this.port){try{return channelFromTargets(await this.readTargets(this.port));}catch{this.port=0;}}
  if(this.now()-this.discoveredAt<5000)return '';this.discoveredAt=this.now();
  for(const entry of await this.discoverPorts()){if(!Number.isInteger(entry.port)||entry.port<1||entry.port>65535)continue;try{const id=channelFromTargets(await this.readTargets(entry.port));if(id){this.port=entry.port;return id;}}catch{}}
  return '';
 }
 async read(){
  const id=await this.observe();if(!id){this.roomId='';this.current=null;return null;}
  if(id!==this.roomId){this.roomId=id;this.current=null;}
  const cached=this.cache.get(id);if(cached)this.current=cached.value;
  if((!cached||this.now()-cached.at>30000)&&!this.requests.has(id)&&this.now()>=(this.retryAt.get(id)||0)){
   const request=(async()=>{try{const info=await this.fetchMetadata(id);if(!info)return;const image=await this.artwork.read([{src:info.coverUrl,kind:'thumbnail'}]);const value={roomId:id,title:info.title,cover:image.cover||''};this.cache.set(id,{at:this.now(),value});if(this.cache.size>16)this.cache.delete(this.cache.keys().next().value);if(this.roomId===id)this.current=value;}catch{}finally{this.requests.delete(id);this.retryAt.set(id,this.now()+5000);}})();this.requests.set(id,request);
  }
  return this.current;
 }
}
module.exports={YYRoom,channelFromTargets,parsePage};
