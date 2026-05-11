<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <p
    v-if="message"
    class="mt-1 flex items-center justify-start gap-1 text-start text-xs font-bold tracking-tight text-red-500 uppercase"
  >
    <i-solar:danger-triangle-bold class="size-3.5 shrink-0" />
    <span>{{ message }}</span>
  </p>
</template>
