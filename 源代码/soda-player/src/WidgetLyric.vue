<script setup lang="ts">
import { useElementSize, useRafFn } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import { useComputedStyle } from './computedStyle'
import MarqueeText from './MarqueeText.vue'

type MediaDetail = any
type Playable = any
import { useWidgetLyric } from './useWidgetLyric'
const props = withDefaults(defineProps<{
  playable?: Playable
  mediaDetail?: MediaDetail
}>(), {
  playable: undefined,
  mediaDetail: undefined,
})

const progressOffsetMs = computed(() => 0)
const LYRIC_SCROLL_TRIGGER_RATIO = 0.9
const LYRIC_SCROLL_ANCHOR_RATIO = 0.1
const LYRIC_SCROLL_LERP_SPEED = 5
const lyricViewport = ref<HTMLDivElement>()
const lyricTextBase = ref<HTMLDivElement>()
const lyricComputedStyle = useComputedStyle(lyricTextBase)
const renderedScrollLeft = ref(0)
const targetScrollLeft = ref(0)
const resolvedMediaDetail = computed(() => {
  if (!props.playable || !props.mediaDetail) {
    return undefined
  }
  if (props.mediaDetail.playable.key !== props.playable.key) {
    return undefined
  }
  return props.mediaDetail
})
const fallbackText = computed(() => '')
const {
  timelineKnown,
  progressSeconds,
  currentLine,
  currentLineKey,
  currentLineText,
  playedWidth,
  scrollAnchorX,
  totalWidth,
} = useWidgetLyric(
  computed(() => resolvedMediaDetail.value?.lyrics),
  fallbackText,
  computed(() => lyricComputedStyle.value?.font),
  progressOffsetMs,
)
const { width: lyricViewportWidth } = useElementSize(lyricViewport)
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
function syncScrollTarget() {
  const viewport = lyricViewport.value
  if (!viewport) {
    return
  }
  const maxScrollLeft = Math.max(0, totalWidth.value - viewport.clientWidth)
  if (maxScrollLeft <= 0) {
    targetScrollLeft.value = 0
    return
  }
  const anchor = scrollAnchorX.value
  const visibleAnchorX = anchor - renderedScrollLeft.value
  const triggerX = viewport.clientWidth * LYRIC_SCROLL_TRIGGER_RATIO
  const anchorX = viewport.clientWidth * LYRIC_SCROLL_ANCHOR_RATIO
  if (anchor < renderedScrollLeft.value) {
    targetScrollLeft.value = clamp(anchor - anchorX, 0, maxScrollLeft)
    return
  }
  if (visibleAnchorX > triggerX) {
    targetScrollLeft.value = clamp(anchor - anchorX, 0, maxScrollLeft)
    return
  }
  targetScrollLeft.value = clamp(targetScrollLeft.value, 0, maxScrollLeft)
}
watch(() => currentLineKey.value, async () => {
  await nextTick()
  renderedScrollLeft.value = 0
  targetScrollLeft.value = 0
  lyricViewport.value?.scrollTo({ left: 0 })
}, {
  immediate: true,
})
watch([
  () => currentLineKey.value,
  () => scrollAnchorX.value,
  () => totalWidth.value,
  () => lyricViewportWidth.value,
], async () => {
  await nextTick()
  syncScrollTarget()
}, {
  immediate: true,
})
useRafFn(({ delta }) => {
  const viewport = lyricViewport.value
  if (!viewport) {
    return
  }
  if (!timelineKnown.value) {
    renderedScrollLeft.value = 0
    targetScrollLeft.value = 0
    viewport.scrollLeft = 0
    return
  }
  const diff = targetScrollLeft.value - renderedScrollLeft.value
  // LRC has line times without a word anchor: travel across the line gradually.
  if (currentLine.value?.isLRC) {
    const max = Math.max(0, totalWidth.value - viewport.clientWidth)
    const seconds = progressSeconds.value
    const line = currentLine.value
    const fraction = clamp((seconds*1000-line.startTime-800)/Math.max(1000,line.duration-1600),0,1)
    targetScrollLeft.value = max*fraction
  }
  if (Math.abs(diff) < 0.5) {
    renderedScrollLeft.value = targetScrollLeft.value
    viewport.scrollLeft = targetScrollLeft.value
    return
  }
  const dt = delta / 1000
  const lerpRatio = 1 - Math.exp(-LYRIC_SCROLL_LERP_SPEED * dt)
  renderedScrollLeft.value += diff * lerpRatio
  viewport.scrollLeft = renderedScrollLeft.value
})
</script>
<template>
  <div class="lyric-wrapper">
    <MarqueeText v-if="!timelineKnown" class="lyric lyric--base lyric-marquee" :text="currentLineText" />
    <div
      v-else
      ref="lyricViewport"
      class="lyric-viewport"
    >
      <div class="lyric-track">
        <div
          ref="lyricTextBase"
          class="lyric lyric--base"
        >
          {{ currentLineText }}
        </div>
        <div
          class="lyric lyric--played"
          :style="{ width: `${playedWidth}px` }"
        >
          {{ currentLineText }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.lyric {
  white-space: nowrap;
  &--base {
    color: light-dark(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5));
  }
  &--played {
    position: absolute;
    inset: 0 auto 0 0;
    overflow: hidden;
    color: light-dark(rgba(0, 0, 0, 0.9), rgba(255, 255, 255, 0.9));
    pointer-events: none;
  }
}
.lyric-wrapper {
  cursor: default;
  overflow: hidden;
  font-size: 11px;
  font-weight: 600;
  line-height: 15px;
  height: 1lh;
}
.lyric-viewport {
  width: 100%;
  overflow: hidden;
}
.lyric-track {
  position: relative;
  width: fit-content;
  min-width: 100%;
}
</style>
