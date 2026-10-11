<script setup lang="ts">
import PlaySvg from './assets/play.js'
import PauseSvg from './assets/pause.js'
import NextSvg from './assets/next.js'
import PrevSvg from './assets/prev.js'
import HeartOutlineSvg from './assets/heart-outline.js'
import HeartFilledSvg from './assets/heart-filled.js'
defineProps<{
  variant: 'prev' | 'play' | 'pause' | 'next' | 'heartOutline' | 'heartFilled'
}>()
const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()
const ICONS_MAP = {
  play: PlaySvg,
  pause: PauseSvg,
  next: NextSvg,
  prev: PrevSvg,
  heartOutline: HeartOutlineSvg,
  heartFilled: HeartFilledSvg,
}
</script>
<template>
  <button
    class="action-button"
    :class="{
      'action-button--playback': ['play', 'pause'].includes(variant),
      'action-button--heart-filled': variant === 'heartFilled',
    }"
    @click.stop="emit('click', $event)"
  >
    <component :is="ICONS_MAP[variant]" />
  </button>
</template>
<style scoped lang="scss">
.action-button {
  height: 32px;
  border: none;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: light-dark( rgba(0, 0, 0, 0.70), rgba(255, 255, 255, 0.70));
  cursor: pointer;
  width: 32px;
  &--playback {
    width: 48px;
    border-radius: 9999px;
    background: light-dark( rgba(0, 0, 0, 0.07), rgba(255, 255, 255, 0.07));
    &:hover {
      background: light-dark( rgba(0, 0, 0, 0.12), rgba(255, 255, 255, 0.12));
    }
  }
  &:hover {
    color: light-dark( #000, #fff);
  }
  &:disabled {opacity:.35;cursor:default}
  &--heart-filled {
    color: #E0214F;
    &:hover {
      color: #E0214F;
    }
  }
}
</style>
