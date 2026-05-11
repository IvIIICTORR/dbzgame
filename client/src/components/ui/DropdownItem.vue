<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    isActive?: boolean
    danger?: boolean
  }>(),
  {
    to: undefined,
    isActive: false,
    danger: false,
  },
)

const elementTag = computed(() => (props.to ? RouterLink : 'button'))
</script>

<template>
  <component
    :is="elementTag"
    :to="to"
    :type="to ? undefined : 'button'"
    role="menuitem"
    class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none"
    :class="[
      isActive ? 'bg-neutral-50 font-semibold text-neutral-900' : 'font-medium text-neutral-700',
      danger
        ? 'hover:bg-red-50 hover:text-red-600'
        : 'hover:bg-neutral-100 hover:text-neutral-900 focus-visible:bg-neutral-100',
    ]"
  >
    <div class="flex items-center gap-3">
      <slot />
    </div>

    <div v-if="$slots.append" class="ml-2 flex items-center">
      <slot name="append" />
    </div>
  </component>
</template>
