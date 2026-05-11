<script setup lang="ts">
defineProps<{
  title?: string
  label?: string
  index?: string
}>()
</script>

<template>
  <section class="mb-16">
    <div class="mb-5 flex items-center gap-3">
      <template v-if="index">
        <span class="text-xs font-semibold text-neutral-600">{{ index }}</span>
        <span class="h-px flex-1 bg-neutral-800"></span>
      </template>
      <template v-else>
        <span class="h-px w-8 shrink-0 bg-red-600"></span>
        <span class="text-xs font-semibold tracking-widest text-red-500 uppercase">
          {{ label }}
        </span>
      </template>
    </div>
    <h2 v-if="title" class="mb-5 text-2xl font-bold tracking-tight text-neutral-100">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
