<script setup lang="ts">
const sections = [
  {
    index: '01',
    title: 'Aceitação dos termos',
    paragraphs: [
      'O uso do jogo constitui aceitação integral destes termos. Se você não concorda com qualquer parte deste documento, não utilize o serviço. Reservamo-nos o direito de atualizar estes termos a qualquer momento, com aviso prévio por e-mail ou notificação no jogo.',
    ],
  },
  {
    index: '02',
    title: 'Elegibilidade',
    paragraphs: [
      'O jogo é destinado a maiores de 13 anos. Menores de 18 anos devem ter autorização dos responsáveis para criar uma conta. Ao se registrar, você declara que atende a esses requisitos.',
    ],
  },
  {
    index: '03',
    title: 'Conta do jogador',
    paragraphs: ['Você é responsável por:'],
    items: [
      'Manter a segurança e confidencialidade das suas credenciais de acesso.',
      'Todas as ações realizadas dentro da sua conta.',
      'Notificar imediatamente a equipe em caso de acesso não autorizado.',
      'Fornecer informações verdadeiras no momento do cadastro.',
    ],
  },
  {
    index: '04',
    title: 'Conduta no jogo',
    paragraphs: [
      'São estritamente proibidas as seguintes condutas. Violações podem resultar em suspensão temporária ou banimento permanente, a critério exclusivo da Kodar Games.',
    ],
    prohibited: [
      'Uso de cheats, hacks ou bots',
      'Exploração de bugs para vantagem',
      'Assédio a outros jogadores',
      'Venda de contas ou itens',
      'Engenharia reversa do jogo',
      'Criação de múltiplas contas',
    ],
  },
  {
    index: '05',
    title: 'Propriedade intelectual',
    paragraphs: [
      'Todo o código, design, lógica de jogo e assets originais do Dragon Ball Z RPG Online são propriedade exclusiva da Kodar Games.',
      '"Dragon Ball Z" é uma propriedade de Akira Toriyama / Shueisha. Este projeto é de natureza não-comercial e de fã, sem fins lucrativos, e não possui qualquer afiliação oficial com os detentores da franquia.',
    ],
  },
  {
    index: '06',
    title: 'Disponibilidade do serviço',
    paragraphs: [
      'O jogo é oferecido gratuitamente. Não garantimos disponibilidade ininterrupta, podendo ocorrer manutenções programadas ou emergenciais. Reservamo-nos o direito de modificar, suspender ou encerrar o serviço a qualquer momento, com aviso prévio sempre que possível.',
    ],
  },
  {
    index: '07',
    title: 'Limitação de responsabilidade',
    paragraphs: [
      'A Kodar Games não se responsabiliza por perdas de progresso decorrentes de falhas técnicas imprevistas, ações de terceiros ou uso indevido do serviço. O jogo é fornecido "como está", sem garantias além das previstas em lei.',
    ],
  },
  {
    index: '08',
    title: 'Lei aplicável',
    paragraphs: [
      'Estes termos são regidos pelas leis da República Federativa do Brasil. Eventuais disputas serão resolvidas no foro da comarca de Recife, PE, com renúncia a qualquer outro foro, por mais privilegiado que seja.',
    ],
  },
]
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100">
    <PageHeader subtitle="Legal" title="Termos de Serviço" updatedAt="Março de 2026" />

    <div class="mx-auto max-w-3xl px-6 pt-20 pb-28">
      <p class="mb-16 text-base leading-8 text-neutral-400">
        Ao acessar ou utilizar o
        <strong class="font-medium text-neutral-200">Dragon Ball Z RPG Online</strong>, desenvolvido
        e operado pela <strong class="font-medium text-neutral-200">Kodar Games</strong>, você
        concorda com os termos descritos neste documento. Leia com atenção antes de criar sua conta
        ou iniciar o jogo.
      </p>

      <main>
        <PageSection
          v-for="section in sections"
          :key="section.index"
          :index="section.index"
          :title="section.title"
        >
          <template v-if="section.paragraphs">
            <p
              v-for="(para, i) in section.paragraphs"
              :key="i"
              class="text-sm leading-7 text-neutral-400"
              :class="{ 'mt-4': i > 0 }"
            >
              {{ para }}
            </p>
          </template>

          <div v-if="section.items" class="mt-4 space-y-3">
            <div
              v-for="item in section.items"
              :key="item"
              class="flex items-start gap-3 text-sm leading-6 text-neutral-400"
            >
              <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-600"></span>
              <span>{{ item }}</span>
            </div>
          </div>

          <div v-if="section.prohibited" class="mt-4 grid gap-3 sm:grid-cols-2">
            <div
              v-for="item in section.prohibited"
              :key="item"
              class="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-400"
            >
              {{ item }}
            </div>
          </div>
        </PageSection>

        <PageFooter>
          <template #links>
            <RouterLink :to="{ name: 'privacy-policy' }" class="hover:text-neutral-500"
              >Política de Privacidade</RouterLink
            >
            <span>·</span>
            <RouterLink :to="{ name: 'cookie-preferences' }" class="hover:text-neutral-500"
              >Preferência de Cookies</RouterLink
            >
          </template>
        </PageFooter>
      </main>
    </div>
  </div>
</template>
