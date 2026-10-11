<script setup lang="ts">
// Copyright 2026 WaterSprites. MIT.
import Play from './assets/play.js';
import Pause from './assets/pause.js';
import Next from './assets/next.js';
import Previous from './assets/prev.js';
const props=defineProps<{variant:'play'|'pause'|'next'|'prev',disabled?:boolean}>();
const icons={play:Play,pause:Pause,next:Next,prev:Previous};
defineEmits(['click']);
</script>
<template><button class="action-button" :class="{'action-button--playback':props.variant==='play'||props.variant==='pause'}" :disabled="props.disabled" @click.stop="$emit('click',$event)"><component :is="icons[props.variant]"/></button></template>
<style scoped>
.action-button{display:grid;place-items:center;width:32px;height:32px;border:0;padding:0;background:transparent;cursor:pointer;color:light-dark(rgb(0 0 0 / 70%),rgb(255 255 255 / 70%))}
.action-button--playback{width:48px;border-radius:9999px;background:light-dark(rgb(0 0 0 / 7%),rgb(255 255 255 / 7%))}
.action-button:hover{color:light-dark(black,white)}.action-button--playback:hover{background:light-dark(rgb(0 0 0 / 12%),rgb(255 255 255 / 12%))}
.action-button:disabled{opacity:.35;cursor:default}
</style>
