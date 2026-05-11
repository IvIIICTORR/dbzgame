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
    class="flex size-18 items-center justify-center rounded-3xl bg-red-600 text-white transition-all focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:border-2 disabled:border-neutral-200 disabled:bg-transparent disabled:text-neutral-400"
  >
    <IconLoading v-if="loading" class="size-8" />

    <template v-else>
      <slot>
        <i-ic:baseline-arrow-forward class="h-8 w-8" />
      </slot>
    </template>
  </button>
</template>
