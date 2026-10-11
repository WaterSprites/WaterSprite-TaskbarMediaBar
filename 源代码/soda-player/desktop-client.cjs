const fs=require('node:fs'),path=require('node:path'),https=require('node:https');
const helper=fs.readFileSync(path.join(__dirname,'browser-helper/page-media.js'),'utf8');
const rooms=new Map();const snapshots=new Map();const {WebArtwork}=require('./web-artwork.cjs');const artwork=new WebArtwork();
function call(target,method,params){return new Promise((resolve,reject)=>{
 if(!/^ws:\/\/127\.0\.0\.1:43833\/devtools\/page\/[\w-]+$/.test(target.webSocketDebuggerUrl))return reject(Error('Invalid desktop media endpoint'));
 const ws=new WebSocket(target.webSocketDebuggerUrl);let done=false;const timer=setTimeout(()=>end(Error('Desktop media timeout')),2000);
 function end(error,result){if(done)return;done=true;clearTimeout(timer);ws.close();error?reject(error):resolve(result)}
 ws.onopen=()=>ws.send(JSON.stringify({id:1,method,params}));ws.onerror=()=>end(Error('Desktop media disconnected'));ws.onclose=()=>{if(!done)end(Error('Desktop media closed'))};ws.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.id===1){if(m.error||m.result?.exceptionDetails)return end(Error(m.error?.message||m.result?.exceptionDetails?.exception?.description||'Desktop media interface error'));end(null,m.result)}}catch(error){end(error)}};
});}
async function evaluate(t,expression){return (await call(t,'Runtime.evaluate',{expression,returnByValue:true})).result?.value;}
async function read(){
 const targets=await (await fetch('http://127.0.0.1:43833/json',{signal:AbortSignal.timeout(1500)})).json(),out=[];
 for(const t of targets.filter(t=>t.type==='page'&&/^https:\/\/(bilipc\.bilibili\.com\/player|live\.bilibili\.com\/desktop\/)/.test(t.url))){
  if(t.url.includes('live.bilibili.com/desktop/')){const id=/\/desktop\/(\d+)/.exec(t.url)?.[1];if(!id)continue;let room=rooms.get(id);if(!room||Date.now()-room.at>30000){const response=await fetch('https://api.live.bilibili.com/room/v1/Room/get_info?id='+id,{headers:{'User-Agent':'Mozilla/5.0',Referer:'https://live.bilibili.com/'+id},signal:AbortSignal.timeout(3000)});const data=await response.json();if(data.code!==0)continue;const cover=await artwork.read([{src:data.data.user_cover||data.data.keyframe,kind:'thumbnail'}]);room={at:Date.now(),title:data.data.title,cover:cover.cover};rooms.set(id,room);}const live=await evaluate(t,`(()=>{const v=window.livePlayer?.getVideoEl();return v?{playing:!v.paused&&!v.ended}:null})()`);if(live)out.push({...room,...live,position:0,duration:0,timelineKnown:false,canToggle:true,desktopControl:true,target:t,live:true});continue;}
  const state=await evaluate(t,helper+`;(()=>{const list=[...document.querySelectorAll('video')],v=TaskbarPageMedia.choose(list,null,document);if(!v)return null;const b=v.getBoundingClientRect(),m=navigator.mediaSession?.metadata,app=[...document.querySelectorAll('body > div')].find(n=>n.__vue_app__)?.__vue_app__,view=app?._context.config.globalProperties.$pinia?._s.get('useUgcStore')?.videoData?.View;return {title:document.querySelector('.header-title')?.innerText||m?.title||document.title,artist:m?.artist||'',coverUrl:view?.pic||'',position:v.currentTime,duration:Number.isFinite(v.duration)?v.duration:0,timelineKnown:Number.isFinite(v.duration)&&v.duration>0,playing:!v.paused&&!v.ended,canToggle:true,key:document.title+'|'+v.currentSrc,clip:{x:Math.max(0,b.x),y:Math.max(0,b.y),width:b.width,height:b.height,scale:Math.min(1,192/b.width)}}})()`);
  if(!state?.title)continue;
  let entry=snapshots.get(t.id);if(!entry||entry.key!==state.key){let cover='';if(state.coverUrl){const result=await artwork.read([{src:state.coverUrl.replace(/^http:/,'https:'),kind:'thumbnail'}]);cover=result.cover}entry={key:state.key,cover};snapshots.set(t.id,entry)}
  out.push({...state,cover:entry.cover,desktopControl:true,target:t});
 }
 const ids=new Set(targets.map(t=>t.id));for(const id of snapshots.keys())if(!ids.has(id))snapshots.delete(id);
 return out;
}
async function control(target,action){if(action!=='toggle')return false;if(target.url.includes('live.bilibili.com/desktop/'))return evaluate(target,`(()=>{const p=window.livePlayer,v=p?.getVideoEl();if(!v)return false;if(v.paused)p.play();else p.pause();return true})()`);return evaluate(target,helper+`;(()=>{const v=TaskbarPageMedia.choose([...document.querySelectorAll('video')],null,document);if(!v)return false;if(v.paused){v.play().catch(()=>{});}else v.pause();return true})()`);}
function choose(states,title,previousTarget){const normalize=x=>String(x||'').replace(/\s/g,'');const matching=states.filter(x=>normalize(x.title)&&normalize(title).includes(normalize(x.title)));const active=states.filter(x=>x.playing);if(matching.length===1)return matching[0];if(active.length===1)return active[0];if(previousTarget){const previous=states.find(x=>x.target.id===previousTarget.id);if(previous)return previous;}return states.length===1?states[0]:null;}
module.exports={read,control,choose};
