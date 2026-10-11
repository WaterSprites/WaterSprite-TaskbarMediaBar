// Copyright 2026 WaterSprites. MIT.
import {computed,type Ref} from 'vue';
import {parseLyrics,lineAt,highlightedWidth} from './lyric-timeline.mjs';
import {useInterpolatedProgressSeconds,useLyricTimelineKnown} from './progress';
import {getTextWidth} from './text';
const cache=new Map<string,ReturnType<typeof parseLyrics>>();
function timeline(content:string){
 if(!cache.has(content)){cache.set(content,parseLyrics(content));if(cache.size>32)cache.delete(cache.keys().next().value!)}
 return cache.get(content)!;
}
export function useWidgetLyric(lyrics:Ref<{content?:string}|undefined>,fallback:Ref<string>,font:Ref<string|undefined>,offset:Ref<number>){
 const progressSeconds=useInterpolatedProgressSeconds(),timelineKnown=useLyricTimelineKnown();
 const time=computed(()=>progressSeconds.value*1000+offset.value),currentLine=computed(()=>lineAt(timeline(lyrics.value?.content||''),time.value));
 const currentLineText=computed(()=>currentLine.value?.chars.map((c:any)=>c.char).join('')||fallback.value);
 const currentLineKey=computed(()=>String(currentLine.value?.startTime??'')+'|'+currentLineText.value);
 const metrics=computed(()=>getTextWidth(currentLineText.value,font.value));
 const playedWidth=computed(()=>timelineKnown.value&&font.value?highlightedWidth(currentLine.value,metrics.value.subWidths,time.value):0);
 return {progressSeconds,timelineKnown,currentLine,currentLineText,currentLineKey,playedWidth,scrollAnchorX:computed(()=>currentLine.value?.isLRC?0:playedWidth.value),totalWidth:computed(()=>metrics.value.width)};
}
