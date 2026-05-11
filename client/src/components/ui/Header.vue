<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// 1. Definimos a prop booleana
const props = defineProps({
  dynamic: {
    type: Boolean,
    default: false,
  },
})

// 2. Estado para controlar se o scroll passou de um ponto (ex: 50px)
const isScrolled = ref(false)

const handleScroll = () => {
  // Se o scroll for maior que 20px, ativamos a cor
  isScrolled.value = window.scrollY > 20
}

// 3. Adicionamos e limpamos o evento de scroll
onMounted(() => {
  if (props.dynamic) {
    window.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    :class="[
      'z-100 flex h-20 w-full items-center px-8 font-sans text-sm font-bold transition-all duration-300 ease-in-out',
      !props.dynamic
        ? 'fixed top-0 bg-neutral-900'
        : 'fixed top-0 ' +
          (isScrolled
            ? 'border-b-2 border-neutral-800 bg-neutral-900 shadow-md'
            : 'bg-transparent'),
    ]"
  >
    <slot />
  </header>
</template>
