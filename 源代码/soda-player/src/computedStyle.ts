import type { Ref } from 'vue'

import { ref, watch } from 'vue'

import { useMutationObserver } from '@vueuse/core'



export function useComputedStyle(el: Ref<HTMLElement | undefined>) {

  const computedStyle = ref<CSSStyleDeclaration>()

  const incr = ref(0)

  useMutationObserver(el, (e) => {

    if (e.some(t => ['style', 'class'].includes(t.attributeName ?? ''))) {

      incr.value++

    }

  }, {

    attributes: true,

  })

  watch([el, incr], ([el]) => {

    if (el) {

      computedStyle.value = getComputedStyle(el)

    }

  }, {

    immediate: true,

  })

  return computedStyle

}

