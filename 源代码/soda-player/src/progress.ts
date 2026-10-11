import {computed} from 'vue';
import {useTimestamp} from '@vueuse/core';
import {state} from './state';
export function hasValidLyricTimeline(media=state){
  return media.timelineKnown!==false && Number.isFinite(media.duration) && media.duration>0 && Number.isFinite(media.position) && media.position>=0 && media.position<=media.duration;
}
export function useLyricTimelineKnown(){return computed(()=>hasValidLyricTimeline());}
export function useInterpolatedProgressSeconds(){
  const now=useTimestamp({interval:'requestAnimationFrame'});
  return computed(()=>{now.value;const position=Number.isFinite(state.position)&&state.position>=0?state.position:0;return position+(hasValidLyricTimeline()&&state.playing?Math.max(0,performance.now()-state.receivedAt)/1000:0)});
}
