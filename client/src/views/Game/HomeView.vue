<script setup lang="ts">
const updates = [
  {
    id: 1,
    date: 'Hoje',
    tag: 'Novo',
    tagColor: 'bg-emerald-50 text-emerald-600',
    title: 'Sistema de chat entre jogadores',
    description: 'Converse em tempo real com outros jogadores pelo ícone de chat no topo.',
  },
  {
    id: 2,
    date: '18 Abr',
    tag: 'Melhoria',
    tagColor: 'bg-blue-50 text-blue-600',
    title: 'Trilha sonora do game',
    description: 'Música ambiente adicionada com controle de silenciamento.',
  },
  {
    id: 3,
    date: '15 Abr',
    tag: 'Em breve',
    tagColor: 'bg-amber-50 text-amber-600',
    title: 'Sistema de batalhas',
    description: 'O modo de combate está sendo desenvolvido e chegará em breve.',
  },
  {
    id: 4,
    date: '10 Abr',
    tag: 'Em breve',
    tagColor: 'bg-amber-50 text-amber-600',
    title: 'Seleção de personagens',
    description: 'Escolha seu guerreiro favorito do universo Dragon Ball Z.',
  },
]
</script>

<template>
  <!-- Hero -->
  <section class="relative flex min-h-[52vh] w-full items-center justify-center overflow-hidden">
    <img
      src="@/assets/images/wallpaper_game_home.webp"
      alt="Background"
      class="absolute inset-0 h-full w-full object-cover opacity-15"
    />
    <div class="absolute inset-0 bg-linear-to-b from-white/50 via-transparent to-white" />

    <div class="relative z-10 flex flex-col items-center gap-5 px-4 text-center">
      <img
        src="@/assets/images/logo.svg"
        alt="Dragon Ball Z"
        draggable="false"
        class="h-auto w-40 object-contain md:w-56"
      />

      <!-- Badge de status -->
      <div
        class="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5"
      >
        <span class="size-1.5 animate-pulse rounded-full bg-amber-500" />
        <span class="text-xs font-semibold tracking-widest text-amber-600 uppercase">
          Em desenvolvimento
        </span>
      </div>

      <h1
        class="max-w-lg text-xl leading-snug font-black tracking-wide text-balance text-neutral-900 uppercase md:text-3xl"
      >
        O game está sendo forjado.<br />Acompanhe cada evolução.
      </h1>

      <p class="max-w-sm text-sm leading-relaxed text-neutral-500">
        Enquanto preparamos a batalha, use o chat para se conectar com outros jogadores que também
        estão aguardando.
      </p>
    </div>
  </section>

  <!-- Conteúdo -->
  <section class="mx-auto max-w-2xl px-4 pb-20">
    <!-- Dica do chat -->
    <div class="mb-10 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
        <i-mingcute:chat-1-line class="size-5 text-blue-500" />
      </div>
      <div>
        <p class="text-sm font-semibold text-neutral-800">Chat disponível agora</p>
        <p class="mt-0.5 text-sm text-neutral-500">
          Clique no ícone de balão no topo da tela e comece a conversar com outros jogadores em
          tempo real.
        </p>
      </div>
    </div>

    <!-- Feed de atualizações -->
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xs font-semibold tracking-widest text-neutral-400 uppercase">Atualizações</h2>
      <span class="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
        Ao vivo
      </span>
    </div>

    <ul class="flex flex-col gap-3">
      <li
        v-for="update in updates"
        :key="update.id"
        class="flex gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 transition-colors hover:bg-neutral-100/70"
      >
        <!-- Linha do tempo -->
        <div class="flex flex-col items-center gap-1 pt-1">
          <span class="size-2 rounded-full bg-neutral-300 ring-2 ring-neutral-100" />
          <span class="w-px flex-1 bg-neutral-200" />
        </div>

        <div class="flex-1 pb-1">
          <div class="mb-2 flex items-center gap-2">
            <span :class="['rounded-full px-2.5 py-0.5 text-xs font-semibold', update.tagColor]">
              {{ update.tag }}
            </span>
            <span class="text-xs text-neutral-400">{{ update.date }}</span>
          </div>
          <p class="text-sm font-semibold text-neutral-800">{{ update.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-neutral-500">{{ update.description }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>
