<template>
  <div class="absolute inset-0 z-10 flex animate-pulse items-center justify-center bg-gray-200">
    <div
      class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent"
    ></div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
