<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    side?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    side: 'bottom',
  },
)

const isVisible = ref(false)

// Mapeamento de posições
const positionClasses = computed(() => {
  const map = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }
  return map[props.side]
})

// Handlers para mouse e teclado
const show = () => (isVisible.value = true)
const hide = () => (isVisible.value = false)
</script>

<template>
  <div
    class="relative inline-flex"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isVisible"
        role="tooltip"
        :class="[
          'pointer-events-none absolute z-50 rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-neutral-200 shadow-lg ring-1 shadow-black/20 ring-black/10',
          positionClasses,
        ]"
      >
        {{ text }}
      </div>
    </Transition>
  </div>
</template>
