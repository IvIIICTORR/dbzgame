<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// Em um cenário real, você buscaria esses dados via API usando o route.params.id
const post = {
  title: 'Sistema de Torneio de Artes Marciais',
  subtitle: 'Update v1.2',
  date: '10 de Abril, 2026',
  author: 'Equipe Kodar Games',
  content: [
    {
      type: 'paragraph',
      text: 'É com grande entusiasmo que anunciamos a chegada do lendário Torneio de Artes Marciais ao nosso RPG. Este sistema foi projetado para testar as habilidades de cada jogador em combates PvP equilibrados e emocionantes.',
    },
    {
      type: 'list',
      title: 'O que há de novo?',
      items: [
        'Arenas dinâmicas com base no cenário do anime.',
        'Sistema de matchmaking por nível de poder (KI).',
        'Recompensas semanais incluindo Zenis e itens raros.',
        'Ranking global de lutadores atualizado em tempo real.',
      ],
    },
    {
      type: 'paragraph',
      text: 'O torneio ocorrerá todos os finais de semana. Prepare seu personagem, ajuste suas técnicas e prove que você é o guerreiro mais forte do universo!',
    },
  ],
}

const sharePost = async () => {
  const shareData = {
    title: `${post.title} | Dragon Ball Z RPG Online`,
    text: `Confira as novidades do Dragon Ball Z RPG Online: ${post.subtitle}`,
    url: window.location.href,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
      console.log('Postagem compartilhada com sucesso!')
    } else {
      await navigator.clipboard.writeText(shareData.url)
      alert('Link copiado para a área de transferência!')
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.log('Compartilhamento cancelado pelo usuário.')
      return
    }

    console.error('Erro ao processar compartilhamento:', error)
    alert('Não foi possível compartilhar ou copiar o link automaticamente.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100">
    <PageHeader :subtitle="post.subtitle" :title="post.title" :updatedAt="post.date" />

    <div class="mx-auto max-w-3xl px-6 pt-20 pb-28">
      <RouterLink
        :to="{ name: 'news.index' }"
        class="mb-10 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-red-500"
      >
        <span class="text-lg">←</span> Voltar para notícias
      </RouterLink>

      <main>
        <PageSection :label="post.author">
          <div class="prose prose-invert max-w-none">
            <template v-for="(block, index) in post.content" :key="index">
              <p
                v-if="block.type === 'paragraph'"
                class="mb-6 text-base leading-8 text-neutral-400"
              >
                {{ block.text }}
              </p>

              <div
                v-if="block.type === 'list'"
                class="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6"
              >
                <h3 class="mb-4 text-lg font-bold text-neutral-200">{{ block.title }}</h3>
                <ul class="space-y-3">
                  <li
                    v-for="item in block.items"
                    :key="item"
                    class="flex items-start gap-3 text-sm leading-6 text-neutral-400"
                  >
                    <span class="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-red-600"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </PageSection>

        <div class="mt-16 flex items-center justify-between border-t border-neutral-800 pt-8">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold tracking-widest text-neutral-600 uppercase"
              >Postado por</span
            >
            <span class="text-sm font-medium text-neutral-300">{{ post.author }}</span>
          </div>

          <div class="flex gap-4">
            <button
              @click="sharePost"
              type="button"
              class="text-neutral-500 transition-colors hover:text-white"
            >
              <span class="sr-only">Compartilhar</span>
              <i-mingcute:share-2-line class="size-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
