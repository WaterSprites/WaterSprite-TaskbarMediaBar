const {windowTrack}=require('./legacy-media.cjs');
class LegacyState {
 constructor(){this.players=[];this.at=0;this.previous=new Map();this.lastSource='';}
 update(packet,now=Date.now()){
  this.at=now;this.players=(packet.players||[]).map(player=>{
   const track=windowTrack(player),old=this.previous.get(player.pid);
   const known=!!track&&Number.isFinite(player.position)&&Number.isFinite(player.duration)&&player.duration>0&&player.position>=0&&player.position<=player.duration;
   const same=old?.windowTitle===player.windowTitle;
   const moving=known&&same&&player.position>old.position&&now-old.at<5000;
   const value={...player,...track,known,moving,at:now};this.previous.set(player.pid,value);return value;
  });
 }
 merge(state,now=Date.now()){
  const players=now-this.at<4500?this.players.filter(p=>(!Array.isArray(state.liveProcessIds)||state.liveProcessIds.includes(p.pid))&&(p.visible!==false||(state.audio||[]).some(a=>a.pid===p.pid&&a.active))):[];
  const sessions=[...(state.sessions||[])];
  for(const p of players){if(!sessions.some(s=>s.source==='audio:'+p.pid)&&!sessions.some(s=>/kwmusic|cloudmusic/i.test(s.source)&&s.source.toLowerCase().includes(p.name)))sessions.push({source:'audio:'+p.pid,description:p.name});}
  let player;
  if(state.selected?.startsWith('audio:'))player=players.find(p=>'audio:'+p.pid===state.selected);
  else if(!state.selected){
   player=players.find(p=>'audio:'+p.pid===state.source);
   if(!player&&!state.source&&!state.playing)player=players.find(p=>p.moving)||players.find(p=>'audio:'+p.pid===this.lastSource)||players.find(p=>p.known);
  }
  if(!player?.title)return {...state,sessions};
  if(state.source&&!state.audioMode&&state.source!=='audio:'+player.pid&&(state.selected||state.playing||!player.moving))return {...state,sessions};
  const audio=(state.audio||[]).find(a=>a.pid===player.pid);
  const source='audio:'+player.pid;this.lastSource=source;
  return {...state,sessions,source,sourceName:player.name,title:player.title,artist:player.artist,album:'',audioMode:true,
   cover:state.source===source?state.cover:'',coverError:'',playing:state.source===source?state.playing:!!audio?.active,confirmedPlaying:player.moving||!!audio?.active&&!audio.muted&&audio.peak>.002,
   canToggle:state.source===source&&!!state.canToggle,canNext:state.source===source&&!!state.canNext,canPrevious:state.source===source&&!!state.canPrevious,position:player.known?player.position:0,duration:player.known?player.duration:0,timelineKnown:player.known};
 }
}
module.exports={LegacyState};
