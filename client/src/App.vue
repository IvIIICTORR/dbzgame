<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

useHead({
  title: 'Home',
  titleTemplate: '%s | Dragon Ball Z RPG Online',
  htmlAttrs: {
    lang: 'pt-BR',
  },
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="!authStore.isInitialized"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-neutral-800 text-white"
    >
      <LogoKodarGames class="h-12 w-auto opacity-90" />

      <div class="relative flex items-center justify-center">
        <div class="size-8 rounded-full border-2 border-neutral-700"></div>
        <div
          class="absolute size-8 animate-spin rounded-full border-2 border-transparent border-t-white"
        ></div>
      </div>
    </div>
  </Transition>

  <RouterView />
  <ProgressBar />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
