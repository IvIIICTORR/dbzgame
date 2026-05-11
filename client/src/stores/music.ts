import SoundBackground from '@/assets/sounds/background_suspense.mp3'
import { useSound } from '@vueuse/sound'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMusicStore = defineStore('music', () => {
  const isMuted = ref(false)
  const volume = ref(0.6)

  const { play, stop, isPlaying, sound } = useSound(SoundBackground, {
    loop: true,
    autoplay: false,
    volume: computed(() => (isMuted.value ? 0 : volume.value)),
  })

  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  return {
    play,
    stop,
    isPlaying,
    isMuted,
    toggleMute,
    sound,
  }
})
