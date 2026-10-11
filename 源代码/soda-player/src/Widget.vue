<script setup>
import {computed,ref} from 'vue';
import {state} from './state';
import ActionButton from './ActionButton.vue';
import WidgetLyric from './WidgetLyric.vue';
import MarqueeText from './MarqueeText.vue';
import CrossSvg from './assets/cross.js';
import softwareWhite from '../icons/cover-dark.png';
import softwareBlack from '../icons/cover-light.png';
const failedCover=ref('');
const realCover=computed(()=>state.cover&&state.cover!==failedCover.value);
const hover=ref(false),bridge=window.playerBridge;
const playable=computed(()=>({key:state.lyricTrack,track:{vocal:0}}));
const mediaDetail=computed(()=>({playable:playable.value,lyrics:{content:state.lyrics}}));
const hasMedia=computed(()=>!!state.source);
const displayTitle=computed(()=>hasMedia.value?(state.web?state.webName:[state.title,state.artist].filter(Boolean).join(' - ')):'WaterSprite');
const action=(a)=>bridge.command(a);
</script>
<template>
 <div class="wrapper" :data-theme="state.theme" :data-hover="hover?'':null" :data-docked="state.docked?'':null" @mouseenter="hover=true" @mouseleave="hover=false" @contextmenu.prevent="bridge.menu()">
  <div class="container" :style="{height:(state.docked?state.dockHeight:40)+'px'}">
   <div class="drag-handler-wrapper" aria-label="按住拖动，可吸附到任一屏幕任务栏的左端或右端"><div class="drag-handler"/></div>
   <div class="cover-slot"><button v-if="realCover" class="cover" aria-label="打开当前播放软件" @click="action('open')"><img :src="state.cover" alt="歌曲封面" @error="failedCover=state.cover" draggable="false" @dragstart.prevent><span class="cover-open" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 10V4h6M4 4l7 7M20 14v6h-6M20 20l-7-7"/></svg></span></button><button v-else-if="hasMedia" class="cover cover-fallback" aria-label="打开当前播放软件" @click="action('open')"><img :src="state.theme==='dark'?softwareWhite:softwareBlack" alt="WaterSprite TaskbarMediaBar" draggable="false" @dragstart.prevent></button><div v-else-if="!hasMedia" class="cover cover-idle"><img :src="state.theme==='dark'?softwareWhite:softwareBlack" alt="WaterSprite TaskbarMediaBar" draggable="false"></div></div>
   <div class="info-wrapper"><MarqueeText class="title" :text="displayTitle"/><div class="lyric-slot"><MarqueeText v-if="hasMedia && state.web" class="web-detail" :text="state.webDetail"/><WidgetLyric v-else-if="hasMedia" :playable="playable" :media-detail="mediaDetail"/><span v-else class="idle-lyric">柔雾黑丝</span></div></div>
   <div class="action-wrapper"><ActionButton variant="prev" aria-label="上一首" :disabled="!state.canPrevious" @click="action('previous')"/><ActionButton :variant="state.playing?'pause':'play'" :aria-label="state.canToggle?(state.playing?'暂停':'播放'):'此音源暂未接通播放控制'" :disabled="!state.canToggle" @click="action('toggle')"/><ActionButton variant="next" aria-label="下一首" :disabled="!state.canNext" @click="action('next')"/></div>
   <button class="close-wrapper" aria-label="隐藏到托盘" @click="bridge.close()"><CrossSvg/></button>
  </div>
 </div>
</template>
<style scoped lang="scss">
.wrapper{width:344px;max-width:100%;margin-left:0;height:100%;display:flex;align-items:flex-end;color-scheme:light}.wrapper[data-theme=dark]{color-scheme:dark}
.container{height:40px;max-height:100%;flex-shrink:0;width:100%;position:relative;display:flex;align-items:center;padding:0 12px 0 22px;gap:10px;border-radius:8px;border:0;background:light-dark(rgba(255,255,255,.32),rgba(32,32,32,.60));transition:background .1s ease-out}
.wrapper[data-docked] .container{border-color:transparent;background:transparent}.wrapper[data-docked][data-hover] .container{background:light-dark(rgba(255,255,255,.30),rgba(255,255,255,.04))}
.drag-handler-wrapper{position:absolute;inset:0 auto 0 0;width:22px;display:grid;place-items:center;background:rgba(0,0,0,.01);cursor:grab;touch-action:none;app-region:drag;-webkit-app-region:drag}.drag-handler-wrapper:active{cursor:grabbing}.drag-handler{width:2px;height:16px;border-radius:8px;background:light-dark(rgba(0,0,0,.12),rgba(255,255,255,.12))}.drag-handler-wrapper:hover .drag-handler{background:light-dark(rgba(0,0,0,.5),rgba(255,255,255,.5))}
.cover-slot{width:28px;height:28px;flex:0 0 28px}.cover{position:relative;width:28px;height:28px;padding:0;border:0;background:transparent;border-radius:4px;overflow:hidden;display:grid;place-items:center;cursor:pointer}.cover img{width:100%;height:100%;object-fit:cover;pointer-events:none;user-select:none;transition:filter .16s,transform .16s}.cover-open{position:absolute;inset:0;display:grid;place-items:center;color:white;background:#0005;opacity:0;transition:opacity .16s,transform .16s;transform:scale(.8)}.cover-open svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.cover:hover img{filter:brightness(.75);transform:scale(1.04)}.cover:hover .cover-open,.cover:focus-visible .cover-open{opacity:1;transform:scale(1)}
.cover-idle{cursor:default}.cover-idle img{opacity:1;object-fit:contain}.cover-fallback img{opacity:1;object-fit:contain;padding:2px}
.info-wrapper{width:128px;height:29px;min-width:0;flex:0 0 128px;display:grid;grid-template-rows:14px 15px;gap:0}.lyric-slot{height:15px;min-height:15px;overflow:hidden}
.idle-lyric{display:block;height:15px;white-space:nowrap}
.web-detail,.idle-lyric{font-size:10px;font-weight:600;line-height:15px;color:light-dark(rgba(0,0,0,.9),rgba(255,255,255,.9))}
.idle-lyric{color:light-dark(rgba(0,0,0,.5),rgba(255,255,255,.5))}
.title{font-size:10px;font-weight:500;line-height:14px;color:light-dark(rgba(0,0,0,.5),rgba(255,255,255,.5))}
.action-wrapper{display:flex;flex:0 0 auto;align-items:center;gap:10px;margin-left:auto}
.close-wrapper{position:absolute;right:3px;top:2px;width:8px;height:8px;display:grid;place-items:center;border:0;padding:0;background:transparent;color:light-dark(rgba(0,0,0,.25),rgba(255,255,255,.25));opacity:0;cursor:pointer;transition:opacity .1s}.wrapper[data-hover] .close-wrapper{opacity:1}.close-wrapper:hover{color:light-dark(#000,#fff)}
</style>
