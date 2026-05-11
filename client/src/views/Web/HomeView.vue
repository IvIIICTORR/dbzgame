<script setup lang="ts">
import Logo from '@/assets/images/logo.svg'
import Wallpaper from '@/assets/images/wallpaper.webp'
</script>

<template>
  <div class="h-full bg-neutral-950">
    <section class="relative flex min-h-[88vh] w-full items-center justify-center overflow-hidden">
      <img
        :src="Wallpaper"
        alt="Background"
        class="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <div
        class="absolute inset-0 bg-linear-to-b from-neutral-950/50 via-transparent to-neutral-950"
      ></div>

      <section class="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4">
        <Image
          :src="Logo"
          alt="Dragon Ball Z Logo"
          loading="lazy"
          draggable="false"
          class="block h-auto w-44 scroll-mt-20 object-contain md:w-full md:max-w-60"
        />

        <header class="scroll-mt-20">
          <h1
            class="balance mt-8 mb-16 scroll-mt-20 text-center text-lg leading-7 font-bold tracking-normal text-neutral-100 uppercase drop-shadow-lg md:text-2xl md:tracking-widest"
          >
            Junte-se a milhares de jogadores na batalha épica de Dragon Ball Z
          </h1>
        </header>

        <div class="grid w-full scroll-mt-20 gap-8 md:w-auto">
          <RouterLink
            :to="{ name: 'login' }"
            class="inline-flex h-14.5 w-full items-center justify-center self-center bg-red-500 py-4 text-sm font-medium text-neutral-100 uppercase no-underline outline outline-offset-4 outline-neutral-100/50 transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-neutral-900 hover:outline-neutral-100 md:h-16 md:w-auto md:px-12 md:text-lg md:font-bold"
          >
            Jogue grátis
          </RouterLink>
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped>
.balance {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}
</style>
