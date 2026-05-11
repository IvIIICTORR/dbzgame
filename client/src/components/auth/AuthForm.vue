<script setup lang="ts">
defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <div class="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-5">
    <form
      @submit.prevent="$emit('submit')"
      class="flex flex-col bg-white px-6 py-8 shadow-xl md:px-12 md:pt-8 md:pb-6"
    >
      <h1
        class="pt-6 text-center text-2xl font-bold tracking-tight text-neutral-950 md:pt-12 md:text-3xl"
      >
        <slot name="title" />
      </h1>
      <p
        v-if="$slots.subtitle"
        class="mt-3 text-center text-lg leading-6 font-medium tracking-tight text-pretty text-neutral-500 md:text-xl"
      >
        <slot name="subtitle" />
      </p>

      <div class="mt-6 flex flex-1 flex-col text-center">
        <slot name="content" />

        <footer class="mt-8 flex flex-col items-center justify-end gap-2 md:mt-10">
          <slot name="footer" />
        </footer>
      </div>
    </form>
  </div>
</template>
