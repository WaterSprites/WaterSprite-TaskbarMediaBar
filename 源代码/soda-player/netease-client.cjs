const ENDPOINT='http://127.0.0.1:43831/json';
const INIT=`(()=>{if(!window.__waterspriteRequire&&typeof webpackJsonp!=='undefined')webpackJsonp.push([[987661],{987661:(m,e,r)=>window.__waterspriteRequire=r},[[987661]]]);const r=window.__waterspriteRequire;if(!r)throw Error('网易云界面接口不可用');if(!window.__waterspriteStore){for(const m of Object.values(r.c)){for(const v of Object.values(m.exports||{})){if(v&&typeof v.getStore==='function'&&typeof v.getDispatch==='function'){const s=v.getStore();if(s.playing){window.__waterspriteStore=v;break}}}if(window.__waterspriteStore)break}}if(!window.__waterspriteStore)throw Error('网易云播放模块不可用');return true})()`;
async function evaluate(expression){
 const targets=await (await fetch(ENDPOINT,{signal:AbortSignal.timeout(1500)})).json();
 const target=targets.find(t=>t.type==='page'&&String(t.url).startsWith('orpheus://'));
 if(!target||!/^ws:\/\/127\.0\.0\.1:43831\/devtools\/page\/[\w-]+$/.test(target.webSocketDebuggerUrl))throw Error('网易云增强连接未开启');
 return new Promise((resolve,reject)=>{const ws=new WebSocket(target.webSocketDebuggerUrl);let finished=false;const timer=setTimeout(()=>end(Error('网易云接口超时')),2000);
  function end(error,value){if(finished)return;finished=true;clearTimeout(timer);ws.close();error?reject(error):resolve(value)}
  ws.onopen=()=>ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:INIT+';'+expression,returnByValue:true,awaitPromise:true}}));
  ws.onerror=()=>end(Error('网易云连接失败'));ws.onclose=()=>{if(!finished)end(Error('网易云连接关闭'))};
  ws.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.id!==1)return;if(m.error||m.result?.exceptionDetails)return end(Error(m.result?.exceptionDetails?.exception?.description||m.result?.exceptionDetails?.text||m.error?.message));end(null,m.result?.result?.value)}catch(error){end(error)}};
 });
}
const READ=`(async()=>{const r=__waterspriteRequire,s=__waterspriteStore.getStore(),p=s.playing,t=p.curPlaying?.track||p.curTrack;if(!t?.name)return null;let time=null;try{time=await r(4).AudioPlayer.getPlayedTime({playId:p.playId})}catch{}const pos=Number(time?.playedTime),duration=Number(p.resourceDuration||t.duration/1000),line=s['async:lyric'];return {id:String(p.resourceTrackId||t.id),title:t.name,artist:(t.artists||t.ar||p.resourceArtists||[]).map(a=>a.name).join(' / '),album:t.album?.name||t.al?.name||'',coverUrl:p.resourceCoverUrl||t.album?.picUrl||t.al?.picUrl||'',playing:p.playingState===2,position:Number.isFinite(pos)&&pos>=0?pos:0,duration,timelineKnown:!!time?.result&&Number.isFinite(pos)&&pos>=0&&pos<=duration+1,canToggle:true,canNext:true,canPrevious:true,lyrics:line?.scrollable&&Array.isArray(line.lyricLines)?line.lyricLines.filter(l=>l.time>=0&&l.lyric).map(l=>'['+String(Math.floor(l.time/60)).padStart(2,'0')+':'+(l.time%60).toFixed(3).padStart(6,'0')+']'+l.lyric).join('\\n'):''}})()`;
async function read(){return evaluate(READ)}
async function control(action){
 if(action==='next'||action==='previous'){const selector=action==='next'?'[data-testid=tid_playbar_next_btn]':'[data-testid=tid_playbar_prev_btn]';return evaluate(`(()=>{const b=document.querySelector(${JSON.stringify(selector)});if(!b||b.disabled||b.getAttribute('aria-disabled')==='true')return false;b.click();return true})()`);}
 const actions={toggle:'playing/switchResumeOrPause'};if(!actions[action])throw Error('未知网易云操作');
 return evaluate(`(async()=>{const d=__waterspriteStore.getDispatch();await d({type:${JSON.stringify(actions[action])},payload:{triggerScene:'sysTray'}});return true})()`);
}
module.exports={read,control,evaluate};
