<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useMusicStore } from '@/stores/music'
import { onMounted, onUnmounted } from 'vue'

const authStore = useAuthStore()
const music = useMusicStore()

// Função para tentar dar o play e limpar os eventos
const unlockAudio = () => {
  music.play()

  // Se começou a tocar, removemos os ouvintes para economizar memória
  if (music.isPlaying) {
    removeUnlockEvents()
  }
}

const removeUnlockEvents = () => {
  window.removeEventListener('click', unlockAudio)
  window.removeEventListener('touchstart', unlockAudio)
  window.removeEventListener('keydown', unlockAudio)
}

onMounted(() => {
  // 1. Tenta o play imediato (pode falhar e gerar o erro no console, é normal)
  music.play()

  // 2. Adiciona ouvintes para "capturar" a primeira interação do usuário
  window.addEventListener('click', unlockAudio)
  window.addEventListener('touchstart', unlockAudio)
  window.addEventListener('keydown', unlockAudio)
})

onUnmounted(() => {
  removeUnlockEvents()
})
</script>

<template>
  <header class="fixed top-0 z-50 flex h-15 items-center justify-start gap-2 px-4">
    <Tooltip text="Perfil">
      <Button shape="circle" variant="none">
        <Avatar :src="authStore.user?.avatarUrl" class="size-12 ring-2 ring-black/10" outline />
      </Button>
    </Tooltip>

    <nav class="flex h-12 w-auto items-center rounded-full bg-white/50 backdrop-blur-xs">
      <Tooltip text="Mais">
        <Button shape="circle" variant="ghost">
          <i-mingcute:menu-line class="size-6" />
        </Button>
      </Tooltip>

      <Popover width="w-100">
        <template #trigger="{ isOpen }">
          <Tooltip text="Conversas">
            <Button shape="circle" variant="ghost" :class="{ 'text-black!': isOpen }">
              <i-mingcute:chat-1-line class="size-6" />
              <span
                class="absolute top-2.25 right-2.25 size-1.75 rounded-full bg-blue-400 ring-2 ring-blue-200"
              ></span>
            </Button>
          </Tooltip>
        </template>

        <ChatIndex />
      </Popover>

      <Popover width="w-64">
        <template #trigger="{ isOpen }">
          <Tooltip text="Música">
            <Button shape="circle" variant="ghost" :class="{ 'text-black!': isOpen }">
              <i-mingcute:headphone-line class="size-6" />
            </Button>
          </Tooltip>
        </template>

        <template #default>
          <MusicPopover />
        </template>
      </Popover>
    </nav>
  </header>

  <main class="h-screen">
    <RouterView />
  </main>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e5e5;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d4d4d4;
}
</style>
