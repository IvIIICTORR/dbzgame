<script setup lang="ts">
defineProps<{
  src?: string | null
  alt?: string
  size?: string
}>()
</script>

<template>
  <div class="relative overflow-hidden rounded-full" :class="size || 'size-10'">
    <img
      :src="src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'"
      :alt="alt || 'Avatar'"
      class="w-full h-full object-cover"
    />
  </div>
</template>
