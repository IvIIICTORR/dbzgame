<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100">
    <PageHeader subtitle="Kodar Games" title="Trabalhe Conosco" />

    <main class="mx-auto max-w-3xl px-6 pt-20 pb-28">
      <PageSection label="Carreiras" title="Junte-se ao nosso time">
        <p class="text-base leading-8 text-neutral-300">
          Na Kodar Games, estamos sempre em busca de talentos apaixonados por tecnologia e pelo
          universo de Dragon Ball Z. Mesmo que não tenhamos vagas abertas agora, adoramos conhecer
          novos desenvolvedores.
        </p>
      </PageSection>

      <section
        class="mt-12 rounded-2xl border border-neutral-800 bg-neutral-800/20 p-12 text-center"
      >
        <div class="flex flex-col items-center">
          <div class="mb-4 rounded-full bg-neutral-800 p-4">
            <i-mingcute:search-3-line class="h-8 w-8 text-neutral-500" />
          </div>
          <h2 class="text-lg font-semibold text-neutral-200">
            Nenhum cargo disponível no momento.
          </h2>
          <p class="mt-2 text-sm text-neutral-500">
            Fique de olho em nossas redes sociais para futuras oportunidades.
          </p>
        </div>
      </section>

      <div class="mt-10 text-center">
        <RouterLink
          to="/"
          class="text-sm font-bold tracking-widest text-neutral-400 uppercase transition-colors hover:text-red-500"
        >
          ← Voltar para o site
        </RouterLink>
      </div>
    </main>
  </div>
</template>
