<script setup lang="ts">
import AvatarDefault from '@/assets/images/avatar_default.webp'
import { ref, watch } from 'vue'

const props = defineProps<{
  src?: string | null
  alt?: string
  fallbackSrc?: string
}>()

const hasError = ref(false)

watch(
  () => props.src,
  (newSrc) => {
    hasError.value = !newSrc
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200 shadow-sm">
    <img
      :src="!hasError && src ? src : fallbackSrc || AvatarDefault"
      :alt="alt || 'Avatar'"
      class="aspect-square h-full w-full object-cover transition-opacity duration-200"
      :class="{ 'opacity-80': hasError }"
      @error="hasError = true"
    />
  </div>
</template>
