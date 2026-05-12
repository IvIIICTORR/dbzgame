<template>
  <div class="relative overflow-hidden" :class="$attrs.class">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>
