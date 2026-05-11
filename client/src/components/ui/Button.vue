<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

interface Props {
  to?: RouteLocationRaw
  size?: 'default' | 'icon' | 'sm'
  shape?: 'square' | 'circle'
  variant?: 'primary' | 'ghost' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  size: 'default',
  shape: 'square',
  variant: 'ghost',
})

const elementTag = computed(() => (props.to ? RouterLink : 'button'))

const classes = computed(() => {
  const base =
    'group relative flex cursor-pointer items-center justify-center transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400'

  // Tamanhos e Arredondamento
  const sizes = {
    default: props.shape === 'circle' ? 'size-12 rounded-full' : 'size-12 rounded-2xl',
    icon: props.shape === 'circle' ? 'size-8 rounded-full' : 'size-8 rounded-xl',
    sm: 'size-10 rounded-lg',
  }

  // Variantes de Estilo
  const variants = {
    primary: 'bg-black text-white',
    ghost: 'text-neutral-600',
    none: '', // Para quando o estilo vem de fora (como no Avatar)
  }

  return [base, sizes[props.size], variants[props.variant]]
})
</script>

<template>
  <component :is="elementTag" :to="to" :type="to ? undefined : 'button'" :class="classes">
    <slot />
  </component>
</template>
