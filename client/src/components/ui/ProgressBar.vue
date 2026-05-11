<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
const progress = useProgressStore()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="progress.isVisible"
      class="fixed top-0 left-0 z-1000 h-0.75 bg-linear-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-300 ease-out"
      :style="{ width: progress.width + '%' }"
    ></div>
  </Transition>
</template>

<style scoped>
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>
