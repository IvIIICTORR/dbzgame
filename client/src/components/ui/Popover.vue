<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  width?: string
}>()

const isOpen = ref(false)
const popoverRef = ref<HTMLElement | null>(null)
const popoverContentRef = ref<HTMLElement | null>(null)
const alignRight = ref(false)
const isMobile = ref(false)
const triggerRect = ref<DOMRect | null>(null)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 640 // breakpoint `sm` do Tailwind
}

const toggle = () => {
  if (!isOpen.value && !isMobile.value) {
    computeAlignment()
  }
  isOpen.value = !isOpen.value
}
const close = () => (isOpen.value = false)

const computeAlignment = () => {
  if (!popoverRef.value) return
  const rect = popoverRef.value.getBoundingClientRect()
  triggerRect.value = rect
  const spaceOnRight = window.innerWidth - rect.left
  const popoverWidth = 400
  alignRight.value = spaceOnRight < popoverWidth
}

const popoverStyle = computed(() => {
  if (isMobile.value || !triggerRect.value) return {}
  const rect = triggerRect.value
  const top = rect.bottom + 8 // equivalente a mt-2
  if (alignRight.value) {
    return { top: `${top}px`, right: `${window.innerWidth - rect.right}px` }
  }
  return { top: `${top}px`, left: `${rect.left}px` }
})

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  const clickedInsideTrigger = popoverRef.value?.contains(target)
  const clickedInsideContent = popoverContentRef.value?.contains(target)

  if (!clickedInsideTrigger && !clickedInsideContent) {
    close()
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div ref="popoverRef" class="relative inline-block">
    <div @click="toggle">
      <slot name="trigger" :is-open="isOpen" />
    </div>

    <!-- Backdrop (mobile only) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isOpen && isMobile" class="fixed inset-0 z-40 bg-black/40" @click="close" />
      </Transition>

      <!-- Popover: bottom sheet (mobile) ou dropdown (desktop) -->
      <Transition
        :enter-active-class="
          isMobile ? 'transition duration-300 ease-out' : 'transition duration-200 ease-out'
        "
        :enter-from-class="
          isMobile ? 'translate-y-full opacity-0' : 'translate-y-1 opacity-0 scale-95'
        "
        :enter-to-class="
          isMobile ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100 scale-100'
        "
        :leave-active-class="
          isMobile ? 'transition duration-200 ease-in' : 'transition duration-150 ease-in'
        "
        :leave-from-class="
          isMobile ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100 scale-100'
        "
        :leave-to-class="
          isMobile ? 'translate-y-full opacity-0' : 'translate-y-1 opacity-0 scale-95'
        "
      >
        <div
          v-if="isOpen"
          ref="popoverContentRef"
          :class="[
            'z-50 bg-white ring-2 ring-black/5',
            isMobile
              ? 'fixed right-0 bottom-0 left-0 max-h-[85vh] overflow-y-auto rounded-t-3xl p-5'
              : ['fixed rounded-3xl p-4', width || 'w-80'],
          ]"
          :style="isMobile ? {} : popoverStyle"
        >
          <!-- Pill de arraste (mobile only) -->
          <div v-if="isMobile" class="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />

          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
