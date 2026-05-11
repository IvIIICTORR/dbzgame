<script setup lang="ts">
defineProps<{
  subtitle: string
  title: string
  updatedAt?: string
}>()
</script>

<template>
  <section class="relative flex h-[45vh] w-full items-end justify-center overflow-hidden pb-16">
    <img
      src="@/assets/images/wallpaper.webp"
      alt="Background"
      class="absolute inset-0 h-full w-full object-cover opacity-10"
    />
    <div
      class="absolute inset-0 bg-linear-to-b from-neutral-900/20 via-neutral-900/60 to-neutral-900"
    ></div>
    <div class="relative z-10 px-4 text-center">
      <p class="mb-3 text-xs font-semibold tracking-[0.2em] text-red-500 uppercase">
        {{ subtitle }}
      </p>
      <h1 class="text-3xl font-bold tracking-tight text-neutral-100 uppercase md:text-5xl">
        {{ title }}
      </h1>
      <p v-if="updatedAt" class="mt-3 text-sm text-neutral-500">
        Última atualização: {{ updatedAt }}
      </p>
    </div>
  </section>
</template>
