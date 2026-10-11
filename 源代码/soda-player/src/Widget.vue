<script setup>
// Copyright 2026 WaterSprites. MIT.
import {computed,ref} from 'vue';
import {state} from './state';
import ActionButton from './ActionButton.vue';
import WidgetLyric from './WidgetLyric.vue';
import MarqueeText from './MarqueeText.vue';
import Cross from './assets/cross.js';
import lightNote from '../icons/cover-light.png';
import darkNote from '../icons/cover-dark.png';
const bridge=window.playerBridge,hover=ref(false),badImage=ref('');
const active=computed(()=>Boolean(state.source));
const cover=computed(()=>state.cover&&state.cover!==badImage.value);
const softwareIcon=computed(()=>state.theme==='dark'?darkNote:lightNote);
const title=computed(()=>active.value?(state.web?state.webName:[state.title,state.artist].filter(Boolean).join(' - ')):'WaterSprite');
const track=computed(()=>({key:state.lyricTrack}));
const detail=computed(()=>({playable:track.value,lyrics:{content:state.lyrics}}));
const command=name=>bridge.command(name);
</script>
<template>
 <div class="wrapper" :data-theme="state.theme" :data-hover="hover?'':null" :data-docked="state.docked?'':null" @mouseenter="hover=true" @mouseleave="hover=false" @contextmenu.prevent="bridge.menu()">
  <div class="container" :style="{height:(state.docked?state.dockHeight:40)+'px'}">
   <div class="drag-handler-wrapper" aria-label="按住拖动，可吸附到任一屏幕任务栏的左端或右端"><div class="drag-handler"/></div>
   <div class="cover-slot">
    <button v-if="active" class="cover" :class="{'cover-fallback':!cover}" aria-label="打开当前播放软件" @click="command('open')">
     <img :src="cover?state.cover:softwareIcon" alt="歌曲封面" draggable="false" @error="badImage=state.cover">
     <span v-if="cover" class="cover-open" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 10V4h6M4 4l7 7M20 14v6h-6M20 20l-7-7"/></svg></span>
    </button>
    <div v-else class="cover cover-idle"><img :src="softwareIcon" alt="WaterSprite TaskbarMediaBar" draggable="false"></div>
   </div>
   <div class="info-wrapper">
    <MarqueeText class="title" :text="title"/>
    <div class="lyric-slot"><MarqueeText v-if="active&&state.web" class="web-detail" :text="state.webDetail"/><WidgetLyric v-else-if="active" :playable="track" :media-detail="detail"/><span v-else class="idle-lyric">柔雾黑丝</span></div>
   </div>
   <div class="action-wrapper">
    <ActionButton variant="prev" aria-label="上一首" :disabled="!state.canPrevious" @click="command('previous')"/>
    <ActionButton :variant="state.playing?'pause':'play'" :aria-label="state.canToggle?(state.playing?'暂停':'播放'):'此音源暂未接通播放控制'" :disabled="!state.canToggle" @click="command('toggle')"/>
    <ActionButton variant="next" aria-label="下一首" :disabled="!state.canNext" @click="command('next')"/>
   </div>
   <button class="close-wrapper" aria-label="隐藏到托盘" @click="bridge.close()"><Cross/></button>
  </div>
 </div>
</template>
<style scoped>
.wrapper{display:flex;align-items:flex-end;width:344px;max-width:100%;height:100%;color-scheme:light}
.wrapper[data-theme=dark]{color-scheme:dark}
.container{display:flex;align-items:center;position:relative;box-sizing:border-box;width:100%;max-height:100%;flex-shrink:0;padding:0 12px 0 22px;gap:10px;border-radius:8px;background:light-dark(rgb(255 255 255 / 32%),rgb(32 32 32 / 60%));transition:background .1s ease-out}
.wrapper[data-docked] .container{background:transparent}.wrapper[data-docked][data-hover] .container{background:light-dark(rgb(255 255 255 / 30%),rgb(255 255 255 / 4%))}
.drag-handler-wrapper{position:absolute;left:0;top:0;bottom:0;width:22px;display:grid;place-items:center;background:rgb(0 0 0 / 1%);cursor:grab;touch-action:none;-webkit-app-region:drag}
.drag-handler-wrapper:active{cursor:grabbing}.drag-handler{width:2px;height:16px;border-radius:8px;background:light-dark(rgb(0 0 0 / 12%),rgb(255 255 255 / 12%))}
.drag-handler-wrapper:hover .drag-handler{background:light-dark(rgb(0 0 0 / 50%),rgb(255 255 255 / 50%))}
.cover-slot{width:28px;height:28px;flex:0 0 28px}.cover{display:grid;place-items:center;position:relative;width:28px;height:28px;padding:0;border:0;border-radius:4px;background:transparent;overflow:hidden;cursor:pointer}
.cover img{width:100%;height:100%;object-fit:cover;pointer-events:none;user-select:none;transition:filter .16s,transform .16s}
.cover-open{position:absolute;inset:0;display:grid;place-items:center;color:white;background:rgb(0 0 0 / 33.333%);opacity:0;transform:scale(.8);transition:opacity .16s,transform .16s}
.cover-open svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cover:hover img{filter:brightness(.75);transform:scale(1.04)}.cover:hover .cover-open,.cover:focus-visible .cover-open{opacity:1;transform:scale(1)}
.cover-idle{cursor:default}.cover-idle img,.cover-fallback img{object-fit:contain}.cover-fallback img{padding:2px}
.info-wrapper{display:grid;grid-template-rows:14px 15px;gap:0;flex:0 0 128px;min-width:0;width:128px;height:29px}.lyric-slot{height:15px;min-height:15px;overflow:hidden}
.title{font-size:10px;font-weight:500;line-height:14px;color:light-dark(rgb(0 0 0 / 50%),rgb(255 255 255 / 50%))}
.idle-lyric,.web-detail{font-size:10px;font-weight:600;line-height:15px;color:light-dark(rgb(0 0 0 / 90%),rgb(255 255 255 / 90%))}
.idle-lyric{display:block;height:15px;white-space:nowrap;color:light-dark(rgb(0 0 0 / 50%),rgb(255 255 255 / 50%))}
.action-wrapper{display:flex;align-items:center;flex:0 0 auto;margin-left:auto;gap:10px}
.close-wrapper{display:grid;place-items:center;position:absolute;right:3px;top:2px;width:8px;height:8px;padding:0;border:0;background:transparent;color:light-dark(rgb(0 0 0 / 25%),rgb(255 255 255 / 25%));opacity:0;cursor:pointer;transition:opacity .1s}
.wrapper[data-hover] .close-wrapper{opacity:1}.close-wrapper:hover{color:light-dark(black,white)}
</style>
