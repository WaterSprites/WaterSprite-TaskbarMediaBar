const {sourceName}=require('./source-names.cjs');
const music=/^(QQ音乐|酷我音乐|网易云音乐|汽水音乐|酷狗音乐|Apple Music|MPC-HC|VLC|PotPlayer|媒体播放器)$/;
const browser=/^(Chrome|Edge|Firefox|Brave|Opera|QQ浏览器|360浏览器)$/;
const live=/^(斗鱼|虎牙|哔哩哔哩|YY)$/;
class SourceRouter {
 constructor(){this.heard=new Map();this.last='';this.clock=0;this.webHeard=new Map();this.sessionHeard=new Map();}
 playing(state,now=Date.now()){
  const label=sourceName(state.sourceName||state.source);
  const audio=(state.audio||[]).filter(a=>'audio:'+a.pid===state.source||sourceName(a.name)===label);
  const session=(state.sessions||[]).find(s=>s.source===state.source);
  if(music.test(label)&&session)return !!session.playing&&(!audio.length||audio.some(a=>a.active&&!a.muted));
  if(!audio.length)return state.playing;
  return audio.some(a=>a.active&&!a.muted&&now-(this.heard.get(a.pid)?.last||0)<1000);
 }
 choose(state,now=Date.now()){
  if(state.selected)return null;
  const candidates=[];const pages=state.webSources||[];for(const page of pages){const old=this.webHeard.get(page.source);const started=page.playing&&(!old?.playing||old.title!==page.title)?now:old?.started||0;this.webHeard.set(page.source,{playing:page.playing,started,title:page.title});if(page.playing)candidates.push({source:page.source,label:page.browser,rank:2,started,sounding:true});}const pageIds=new Set(pages.map(p=>p.source));for(const id of this.webHeard.keys())if(!pageIds.has(id))this.webHeard.delete(id);
  // An explicit music playback session remains eligible during quiet samples.
  const musicSessions=new Set();
  for(const session of state.sessions||[]){const label=sourceName(session.source);if(!music.test(label))continue;const audio=(state.audio||[]).filter(a=>sourceName(a.name)===label);const eligible=!!session.playing&&(!audio.length||audio.some(a=>a.active&&!a.muted));const old=this.sessionHeard.get(session.source),started=eligible&&!old?.playing?now:old?.started||0;this.sessionHeard.set(session.source,{playing:eligible,started});if(eligible){musicSessions.add(label);candidates.push({source:session.source,label,rank:3,started,sounding:true});}}
  const sessionIds=new Set((state.sessions||[]).map(s=>s.source));for(const id of this.sessionHeard.keys())if(!sessionIds.has(id))this.sessionHeard.delete(id);
  for(const audio of state.audio||[]){
   const label=sourceName(audio.name),rank=music.test(label)?3:browser.test(label)?2:live.test(label)?1:0;
   const musicSession=music.test(label)&&(state.sessions||[]).find(s=>sourceName(s.source)===label);
   if(musicSessions.has(label)||musicSession&&!musicSession.playing)continue;
   if(!rank||browser.test(label)&&pages.some(p=>p.browser===label))continue;
   const previous=this.heard.get(audio.pid);
   const sounding=audio.active&&!audio.muted&&audio.peak>.002;
   let record=previous;
   if(sounding){record={last:now,active:true,started:previous?.active&&now-previous.last<1500?previous.started:now};this.heard.set(audio.pid,record);}
   else if(record&&!audio.active)this.heard.set(audio.pid,{...record,active:false});
   if(!audio.active||audio.muted||!record||now-record.last>1500)continue;
   const session=(state.sessions||[]).find(s=>sourceName(s.source)===label);
   candidates.push({source:session?.source||'audio:'+audio.pid,label,rank,started:record.started,sounding});
  }
  candidates.sort((a,b)=>b.rank-a.rank||b.started-a.started||Number(b.label===state.foregroundName)-Number(a.label===state.foregroundName)||Number(b.source===state.source)-Number(a.source===state.source));
  const livePids=new Set((state.audio||[]).map(a=>a.pid));for(const pid of this.heard.keys())if(!livePids.has(pid))this.heard.delete(pid);
  const lastPresent=(state.sessions||[]).some(s=>s.source===this.last)||(state.audio||[]).some(a=>'audio:'+a.pid===this.last);
  if(!lastPresent)this.last='';
  if(candidates.length)this.last=candidates[0].source;
  return this.last||null;
 }
}
module.exports={SourceRouter};
