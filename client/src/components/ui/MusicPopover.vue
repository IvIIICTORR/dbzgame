<script setup lang="ts">
import { useMusicStore } from '@/stores/music'

const music = useMusicStore()
</script>

<template>
  <div class="flex items-center gap-3 py-1">
    <button
      class="flex size-9 items-center justify-center rounded-full bg-black/8 transition-colors hover:bg-black/12"
    >
      <i-mingcute:music-2-ai-line class="size-4.5 text-black/70" />
    </button>

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium text-black/80">Tema Principal</p>
      <p class="text-xs text-black/40">{{ music.isPlaying ? 'Tocando' : 'Pausado' }}</p>
    </div>

    <button
      class="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-black/5"
      @click="music.toggleMute"
    >
      <i-mingcute:volume-line v-if="!music.isMuted" class="size-4.5 text-black/60" />
      <i-mingcute:volume-mute-line v-else class="size-4.5 text-black/40" />
    </button>
  </div>
</template>
