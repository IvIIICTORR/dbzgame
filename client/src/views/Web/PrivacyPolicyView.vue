<script setup lang="ts">
const sections = [
  {
    index: '01',
    title: 'Coleta de dados',
    body: 'Para garantir a melhor experiência no jogo, coletamos informações mínimas e necessárias durante o processo de autenticação via Discord ou Google OAuth:',
    items: [
      'Endereço de e-mail para identificação única da conta.',
      'Nome de usuário e avatar públicos do provedor (Discord/Google).',
      'Dados de progresso e inventário do personagem no jogo.',
    ],
  },
  {
    index: '02',
    title: 'Uso das informações',
    body: 'Seus dados são utilizados exclusivamente para fins relacionados ao jogo:',
    items: [
      'Autenticação segura e proteção da sua conta.',
      'Sincronização de progresso entre diferentes dispositivos.',
      'Comunicações essenciais sobre atualizações e manutenções do jogo.',
      'Geração de estatísticas anônimas para melhorar o balanceamento.',
    ],
  },
  {
    index: '03',
    title: 'Segurança',
    body: 'Utilizamos criptografia de nível profissional para garantir que seus dados pessoais estejam protegidos contra acessos não autorizados. Não compartilhamos suas informações com terceiros para fins publicitários ou comerciais de nenhuma natureza.',
  },
  {
    index: '04',
    title: 'Seus direitos (LGPD)',
    body: 'Em conformidade com a Lei nº 13.709/2018, você tem direito a:',
    rights: [
      'Acessar seus dados pessoais',
      'Corrigir dados incorretos',
      'Solicitar exclusão de conta',
      'Portabilidade dos dados',
      'Revogar consentimento',
      'Receber informações claras',
    ],
  },
  {
    index: '05',
    title: 'Cookies',
    body: 'Utilizamos cookies estritamente necessários para manter sua sessão ativa e salvar preferências básicas. Não utilizamos cookies de rastreamento de terceiros para fins publicitários. Você pode gerenciar suas preferências em',
    linkText: 'Você pode gerenciar suas preferências em',
  },
]
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100">
    <PageHeader subtitle="Legal" title="Aviso de Privacidade" updatedAt="Março de 2026" />

    <div class="mx-auto max-w-3xl px-6 pt-20 pb-28">
      <p class="mb-16 text-base leading-8 text-neutral-400">
        A <strong class="font-medium text-neutral-200">Kodar Games</strong> leva a privacidade dos
        seus jogadores a sério. Este aviso descreve de forma transparente quais dados coletamos,
        como os utilizamos e como protegemos suas informações ao usar o
        <strong class="font-medium text-neutral-200">Dragon Ball Z RPG Online</strong>.
      </p>

      <main>
        <PageSection
          v-for="section in sections"
          :key="section.title"
          :index="section.index"
          :title="section.title"
        >
          <p v-if="section.body" class="text-sm leading-7 text-neutral-400">{{ section.body }}</p>

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

          <div v-if="section.rights" class="mt-4 grid gap-3 sm:grid-cols-2">
            <div
              v-for="right in section.rights"
              :key="right"
              class="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-400"
            >
              {{ right }}
            </div>
          </div>

          <p v-if="section.linkText" class="mt-4 text-sm leading-7 text-neutral-400">
            {{ section.linkText }}
            <RouterLink
              :to="{ name: 'cookie-preferences' }"
              class="text-red-500 underline underline-offset-2 transition-colors hover:text-red-400"
            >
              Preferências de Cookies </RouterLink
            >.
          </p>
        </PageSection>

        <PageFooter>
          <template #links>
            <RouterLink :to="{ name: 'terms-of-service' }" class="hover:text-neutral-500"
              >Termos de Serviço</RouterLink
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
