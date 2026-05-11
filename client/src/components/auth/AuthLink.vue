<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
}>()
</script>

<template>
  <RouterLink
    :to="to"
    class="text-xs font-extrabold tracking-wider text-neutral-700 uppercase transition-colors hover:text-neutral-950"
  >
    <slot />
  </RouterLink>
</template>
