function emptyMedia(next={}){return {...next,source:'',sourceName:'',selected:'',title:'暂无媒体会话',artist:'',album:'',cover:'',coverKnown:true,coverOrigin:'',coverError:'',lyrics:'',lyricTrack:'',position:0,duration:0,timelineKnown:false,playing:false,canToggle:false,canNext:false,canPrevious:false,web:false,webName:'',webDetail:'',browserControl:false,neteaseControl:false,desktopControl:false,neteaseSongId:'',coverUrl:'',commandPending:false};}
// A paused track stays selected. A new idle session is not evidence of a source switch.
class MediaState {
 constructor(){this.current=null;this.missingSince=null;}
 accept(next,now=Date.now()){
  const old=this.current;
  const observations=new Map((next.sessions||[]).map(s=>[s.source,!!s.playing]));
  for(const a of next.audio||[])observations.set('audio:'+a.pid,!!a.active&&!a.muted&&a.peak>.002);
  if(next.source&&!Array.isArray(next.sessions)&&!Array.isArray(next.audio))observations.set(next.source,!!next.playing&&(!next.audioMode||next.confirmedPlaying===true));
  const oldPlaying=old?(observations.has(old.source)?observations.get(old.source):false):false;
  let value=next;
  const reportedPresent=!next.source||observations.has(next.source)||next.source.startsWith('mpc:')&&(next.mpc||[]).some(p=>'mpc:'+p.pid===next.source);
  if(!reportedPresent||!next.source)value=emptyMedia(next);
  const oldPresent=!!old?.source&&observations.has(old.source);
  if(oldPresent||!old?.source)this.missingSince=null;
  else if(this.missingSince===null)this.missingSince=now;
  if(!next.selected&&!next.selectionChanged&&!next.audibleSelected&&old?.source&&next.source!==old.source){
   const started=next.source&&next.playing&&(!next.audioMode||next.confirmedPlaying===true);
   const departed=!oldPresent&&now-this.missingSince>=1500;
   if(oldPresent&&!started&&!departed)value={...old,selected:'',sessions:next.sessions,audio:next.audio,mpc:next.mpc,playing:oldPlaying,canToggle:old.canToggle&&oldPresent,canNext:old.canNext&&oldPresent,canPrevious:old.canPrevious&&oldPresent};
  }
  if(old&&value.source===old.source&&!value.playing){
   if(!value.title||value.title==='暂无媒体会话')value={...value,title:old.title,artist:old.artist,album:old.album};
   if(value.title===old.title&&(value.artist===old.artist||!value.artist)&&(!value.filepath||!old.filepath||value.filepath===old.filepath)){
    value={...value,artist:value.artist||old.artist,album:value.album||old.album,cover:value.coverKnown?value.cover:(value.cover||old.cover),lyrics:value.lyrics||old.lyrics};
    if((value.timelineKnown===false||!value.duration)&&old.timelineKnown)value={...value,position:old.position,duration:old.duration,timelineKnown:true};
   }
  }
  if(value.source!==old?.source)this.missingSince=null;
  this.current={...value};return value;
 }
}
module.exports={MediaState,emptyMedia};
