<script setup lang="ts">
import {ref,watch,nextTick,onMounted} from 'vue';
import {useElementSize,useRafFn} from '@vueuse/core';
const props=defineProps<{text:string}>();
const viewport=ref<HTMLElement>(),textEl=ref<HTMLElement>();
const {width}=useElementSize(viewport);
const offset=ref(0);let phase=0,pause=1200;
async function reset(){await nextTick();offset.value=0;phase=0;pause=1200}
watch([()=>props.text,width],reset);onMounted(reset);
useRafFn(({delta})=>{
 const max=Math.max(0,(textEl.value?.scrollWidth||0)-(viewport.value?.clientWidth||0));
 if(max<1){offset.value=0;return}
 if(pause>0){pause-=delta;return}
 offset.value=Math.max(0,Math.min(max,offset.value+(phase===0?1:-1)*delta*.022));
 if((phase===0&&offset.value>=max)||(phase===1&&offset.value<=0)){phase=1-phase;pause=1200}
});
</script>
<template><div ref="viewport" class="marquee-viewport"><span ref="textEl" class="marquee-text" :style="{transform:`translateX(-${offset}px)`}">{{text}}</span></div></template>
<style scoped>.marquee-viewport{overflow:hidden;width:100%;white-space:nowrap}.marquee-text{display:inline-block;white-space:nowrap;will-change:transform}</style>
