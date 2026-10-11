import {reactive} from 'vue';
export const state=reactive({title:'',artist:'',source:'',web:false,webName:'',webDetail:'',audioMode:false,playing:false,commandPending:false,position:0,duration:0,timelineKnown:false,receivedAt:performance.now(),theme:'dark',docked:false,dockHeight:40,cover:'',lyrics:'',lyricTrack:'',sessions:[],error:'',canToggle:false,canNext:false,canPrevious:false});
window.playerBridge.onState((next:any)=>{
  if(next.type==='error'){state.error=next.message;return}
  const key=next.lyricTrack||[next.source,next.title,next.artist||''].join('|');
  if(next.type==='state' && key!==state.lyricTrack){state.lyrics='';state.lyricTrack=key}
  Object.assign(state,next);if('position' in next)state.receivedAt=performance.now();
});
