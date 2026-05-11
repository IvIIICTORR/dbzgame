<template>
  <div class="flex flex-col bg-neutral-900 pt-28">
    <section
      class="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-12 pb-24 text-center"
    >
      <div class="relative mb-10 flex flex-col items-center">
        <span
          class="text-[120px] leading-none font-black tracking-tighter text-neutral-800/40 select-none md:text-[160px]"
        >
          404
        </span>
        <div class="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <p class="text-sm font-bold tracking-[0.3em] text-red-500 uppercase">Caminho Perdido</p>
        </div>
      </div>

      <div class="mb-12 space-y-4">
        <h2 class="text-xl font-bold tracking-tight text-neutral-200 uppercase">
          A página que você procura não existe ou foi removida.
        </h2>
      </div>

      <div class="w-full max-w-xs">
        <RouterLink
          :to="{ name: 'home' }"
          class="inline-flex h-14 w-full items-center justify-center self-center bg-red-500 py-4 text-sm font-medium text-neutral-100 uppercase no-underline outline outline-offset-4 outline-neutral-100/50 transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-neutral-900 hover:outline-neutral-100 md:h-15.5 md:w-auto md:px-12 md:text-sm md:font-bold"
        >
          Voltar para o Início
        </RouterLink>
      </div>

      <div class="mt-20 flex items-center gap-4 opacity-10">
        <span class="h-px w-12 bg-neutral-400"></span>
        <div class="h-2 w-2 rotate-45 bg-neutral-300"></div>
        <span class="h-px w-12 bg-neutral-400"></span>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Efeito sutil no número de fundo */
span.select-none {
  background: linear-gradient(to bottom, #262626, #171717);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
