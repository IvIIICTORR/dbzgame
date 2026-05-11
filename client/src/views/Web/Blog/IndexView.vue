<script setup lang="ts">
// Exemplo de dados de notícias
const news = [
  {
    id: 1,
    date: '10 Abr, 2026',
    category: 'Update',
    title: 'Sistema de Torneio de Artes Marciais',
    description:
      'Preparem-se! O novo sistema de torneios PvP foi implementado com recompensas exclusivas para os vencedores da semana.',
    image:
      'https://wallpapers-clan.com/wp-content/uploads/2026/01/goku-lightning-blast-anime-dragon-ball-desktop-wallpaper-preview.jpg',
  },
  {
    id: 2,
    date: '28 Mar, 2026',
    category: 'Manutenção',
    title: 'Otimização dos Servidores ',
    description:
      'Realizamos uma limpeza geral nos bancos de dados para garantir que a experiência de progressão em tempo real seja fluida.',
    image:
      'https://wallpapers-clan.com/wp-content/uploads/2025/02/dragon-ball-z-goku-vegeta-split-face-desktop-wallpaper-preview.jpg',
  },
  {
    id: 3,
    date: '16 Mar, 2026',
    category: 'Lançamento',
    title: 'Início do Desenvolvimento: Dragon Ball Z RPG Online',
    description:
      'Hoje marcamos o início oficial da jornada. O projeto focado em fãs começa sua fase Alpha de testes internos.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100">
    <PageHeader subtitle="Fique por dentro" title="Notícias & Updates" />

    <div class="mx-auto max-w-4xl px-6 pt-20 pb-28">
      <main>
        <PageSection label="Últimas Novidades">
          <div class="grid gap-8">
            <article
              v-for="item in news"
              :key="item.id"
              class="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all hover:border-neutral-700 md:flex-row md:items-center"
            >
              <div
                v-if="item.image"
                class="h-48 w-full shrink-0 overflow-hidden rounded-xl md:h-32 md:w-48"
              >
                <img
                  :src="item.image"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Thumbnail"
                />
              </div>

              <div class="flex-1">
                <div class="mb-2 flex items-center gap-3">
                  <span class="text-[10px] font-bold tracking-widest text-red-500 uppercase">
                    {{ item.category }}
                  </span>
                  <span class="h-1 w-1 rounded-full bg-neutral-700"></span>
                  <span class="text-xs text-neutral-500">{{ item.date }}</span>
                </div>

                <h2
                  class="mb-2 text-xl font-bold text-neutral-100 transition-colors group-hover:text-red-500"
                >
                  {{ item.title }}
                </h2>

                <p class="line-clamp-2 text-sm leading-6 text-neutral-400">
                  {{ item.description }}
                </p>

                <RouterLink
                  to="#"
                  class="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white"
                >
                  Ler mais
                  <span class="text-red-500">→</span>
                </RouterLink>
              </div>
            </article>
          </div>
        </PageSection>
      </main>
    </div>
  </div>
</template>
