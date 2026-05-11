<script setup lang="ts">
const values = [
  {
    title: 'Comunidade em primeiro lugar',
    description: 'Cada decisão de design é guiada pelo feedback da nossa base ativa de jogadores.',
  },
  {
    title: 'Atualizações constantes',
    description: 'Lançamos novos conteúdos e balanceamentos de forma regular e transparente.',
  },
  {
    title: 'Competitivo e colaborativo',
    description: 'Batalhas PvP intensas que convivem com missões cooperativas em grupo.',
  },
  {
    title: 'Performance e estabilidade',
    description: 'Infraestrutura projetada para latência mínima e alta disponibilidade.',
  },
]

const stack = ['Vue.js', 'TypeScript', 'Node.js', 'MySQL', 'Redis', 'Tailwind CSS']
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100">
    <PageHeader subtitle="Kodar Games" title="Sobre o Projeto" />

    <main class="mx-auto max-w-3xl px-6 pt-20 pb-28">
      <PageSection label="Missão" title="Reviver o universo Dragon Ball Z">
        <p class="text-base leading-8 text-neutral-300">
          O <strong class="font-medium text-white">Dragon Ball Z RPG Online</strong> nasceu da
          paixão por reviver os momentos épicos da obra de Akira Toriyama. Nosso objetivo é
          proporcionar uma experiência imersiva onde cada jogador pode trilhar seu próprio caminho
          como um guerreiro Z, evoluindo seus poderes em um mundo persistente e competitivo.
        </p>
        <p class="mt-4 text-base leading-8 text-neutral-400">
          Acreditamos que os melhores jogos são construídos junto à comunidade. Por isso, cada
          atualização é guiada pelo feedback real dos nossos jogadores.
        </p>
      </PageSection>

      <PageSection label="Valores" title="O que nos move">
        <div class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="value in values"
            :key="value.title"
            class="rounded-xl border border-neutral-800 bg-neutral-800/30 p-6 transition-colors duration-200 hover:border-neutral-700"
          >
            <p class="text-sm font-semibold text-neutral-200">{{ value.title }}</p>
            <p class="mt-2 text-sm leading-6 text-neutral-400">{{ value.description }}</p>
          </div>
        </div>
      </PageSection>

      <PageSection label="Estúdio" title="Kodar Games">
        <p class="text-base leading-8 text-neutral-300">
          Somos um estúdio indie localizado em
          <strong class="font-medium text-white">Recife, PE</strong>, focado em criar experiências
          digitais que conectam pessoas ao universo que amam. O Dragon Ball Z RPG Online combina
          tecnologia moderna com design cuidadoso para entregar performance e diversão em cada
          sessão.
        </p>
        <div class="mt-7 flex flex-wrap gap-2">
          <span
            v-for="tech in stack"
            :key="tech"
            class="rounded-lg border border-neutral-700/50 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors duration-200 hover:border-neutral-600"
          >
            {{ tech }}
          </span>
        </div>
      </PageSection>

      <section
        class="rounded-2xl border border-neutral-800 bg-linear-to-br from-neutral-900/80 via-neutral-900/60 to-red-800/30 p-10 text-center"
      >
        <h2 class="text-xl font-bold tracking-tight text-neutral-100">Pronto para a batalha?</h2>
        <p class="mt-3 mb-8 text-sm leading-6 text-neutral-500">
          Junte-se a milhares de guerreiros Z e comece sua jornada agora. É gratuito.
        </p>

        <RouterLink
          :to="{ name: 'login' }"
          class="inline-flex h-14 w-full items-center justify-center self-center bg-red-500 text-sm font-medium text-neutral-100 uppercase no-underline outline outline-offset-4 outline-neutral-100/50 transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-neutral-900 hover:outline-neutral-100 md:h-16 md:w-75 md:px-12 md:text-base md:font-bold"
        >
          Jogue Grátis
        </RouterLink>
      </section>
    </main>
  </div>
</template>
