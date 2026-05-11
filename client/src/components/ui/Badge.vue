<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    count?: number
    dot?: boolean
    max?: number
    show?: boolean
  }>(),
  {
    count: 0,
    dot: false,
    max: 99,
    show: true,
  },
)

const displayValue = computed(() => {
  if (props.dot) return ''
  return props.count > props.max ? `${props.max}+` : props.count
})

// Define classes baseadas no estado (ponto vs número)
const badgeClasses = computed(() => {
  if (props.dot) {
    return 'size-2'
  }
  return 'min-w-3.5 h-3.5 px-1.25 text-[10px]'
})
</script>

<template>
  <div class="relative inline-flex align-middle">
    <slot />

    <Transition name="fade">
      <span
        v-if="show && (dot || count > 0)"
        class="absolute top-0 right-0 z-10 flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 leading-0 font-bold text-white ring-2 ring-white"
        :class="badgeClasses"
      >
        {{ displayValue }}
      </span>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(50%, -50%) scale(0.5);
}
</style>
