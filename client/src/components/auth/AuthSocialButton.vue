<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'button',
    loading: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="emit('click')"
    class="flex h-8 flex-1 grow items-center justify-center rounded-xl border border-neutral-950/5 px-4 transition-all hover:opacity-90 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed"
  >
    <IconLoading v-if="loading" class="size-4" />

    <template v-else>
      <slot />
    </template>
  </button>
</template>
