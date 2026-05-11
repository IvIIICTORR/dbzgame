<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

interface Props {
  to?: RouteLocationRaw
  text?: string
  variant?: 'link' | 'button'
}

withDefaults(defineProps<Props>(), {
  variant: 'link',
})
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    :class="[
      'inline-flex items-center justify-center uppercase transition-all duration-200 active:scale-95',
      variant === 'link'
        ? 'rounded-lg px-4 py-2 text-[13px] font-semibold tracking-[1.04px] text-neutral-100 hover:bg-white/10'
        : '',
      variant === 'button'
        ? 'h-9 rounded-xl bg-linear-to-r from-red-600 to-red-400 px-5 text-[13px] font-bold tracking-widest'
        : '',
    ]"
  >
    <slot>{{ text }}</slot>
  </component>
</template>
