<script setup lang="ts">
import { useImage } from '@vueuse/core'
import { computed, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    draggable?: boolean
  }>(),
  {
    draggable: false,
  },
)

const emit = defineEmits<{
  (e: 'error', error: unknown): void
  (e: 'load'): void
}>()

const { isLoading, error } = useImage(
  computed(() => ({
    src: props.src,
  })),
)

watch(error, (val) => {
  if (val) emit('error', val)
})
</script>

<template>
  <div class="relative overflow-hidden">
    <Skeleton v-if="isLoading" />

    <img
      :src="src"
      :alt="alt"
      :draggable="draggable"
      class="h-full w-full object-cover transition-opacity duration-500"
      :class="{ 'opacity-0': isLoading, 'opacity-100': !isLoading }"
    />
  </div>
</template>
