<script setup lang="ts">
// Copyright 2026 WaterSprites. MIT.
import {computed,ref,watch,nextTick} from 'vue';
import {useElementSize,useRafFn} from '@vueuse/core';
import MarqueeText from './MarqueeText.vue';
import {useWidgetLyric} from './useWidgetLyric';
import {useComputedStyle} from './computedStyle';
const props=defineProps<{playable?:{key:string},mediaDetail?:{playable:{key:string},lyrics:{content?:string}}}>();
const viewport=ref<HTMLElement>(),base=ref<HTMLElement>();
const style=useComputedStyle(base),{width}=useElementSize(viewport);
const validLyrics=computed(()=>props.playable?.key===props.mediaDetail?.playable.key?props.mediaDetail?.lyrics:undefined);
const {timelineKnown,progressSeconds,currentLine,currentLineText,currentLineKey,playedWidth,scrollAnchorX,totalWidth}=useWidgetLyric(validLyrics,computed(()=>''),computed(()=>style.value?.font),computed(()=>0));
let target=0;const rendered=ref(0),clamp=(n:number,max:number)=>Math.max(0,Math.min(max,n));
watch(currentLineKey,async()=>{target=0;rendered.value=0;await nextTick();if(viewport.value)viewport.value.scrollLeft=0},{flush:'post'});
watch([scrollAnchorX,totalWidth,width],()=>{
 const size=viewport.value?.clientWidth||0,max=Math.max(0,totalWidth.value-size),anchor=scrollAnchorX.value;
 if(anchor<rendered.value||anchor-rendered.value>size*.9)target=clamp(anchor-size*.1,max);else target=clamp(target,max);
},{flush:'post'});
useRafFn(({delta})=>{
 const el=viewport.value;if(!el)return;
 if(!timelineKnown.value){target=0;rendered.value=0;el.scrollLeft=0;return}
 if(currentLine.value?.isLRC){const line=currentLine.value,fraction=clamp((progressSeconds.value*1000-line.startTime-800)/Math.max(1000,line.duration-1600),1);target=Math.max(0,totalWidth.value-el.clientWidth)*fraction}
 const difference=target-rendered.value;
 rendered.value=Math.abs(difference)<.5?target:rendered.value+difference*(1-Math.exp(-5*delta/1000));el.scrollLeft=rendered.value;
});
</script>
<template>
 <div class="lyric-wrapper">
  <MarqueeText v-if="!timelineKnown" class="lyric lyric--base lyric-marquee" :text="currentLineText"/>
  <div v-else ref="viewport" class="lyric-viewport"><div class="lyric-track"><div ref="base" class="lyric lyric--base">{{currentLineText}}</div><div class="lyric lyric--played" :style="{width:playedWidth+'px'}">{{currentLineText}}</div></div></div>
 </div>
</template>
<style scoped>
.lyric-wrapper{overflow:hidden;height:15px;line-height:15px;font-size:11px;font-weight:600;cursor:default}
.lyric{white-space:nowrap}.lyric--base{color:light-dark(rgb(0 0 0 / 50%),rgb(255 255 255 / 50%))}
.lyric-viewport{overflow:hidden;width:100%}.lyric-track{position:relative;min-width:100%;width:max-content}
.lyric--played{position:absolute;top:0;left:0;overflow:hidden;pointer-events:none;color:light-dark(rgb(0 0 0 / 90%),rgb(255 255 255 / 90%))}
</style>
