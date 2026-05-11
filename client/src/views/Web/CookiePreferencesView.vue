<script setup lang="ts">
import { ref } from 'vue'

const preferences = ref({
  essential: true,
  functional: true,
  analytics: false,
})

const savePreferences = () => {
  console.log('Preferências salvas:', preferences.value)
  alert('Suas preferências de cookies foram atualizadas com sucesso!')
}

const cookieGroups = [
  {
    id: 'essential',
    title: 'Cookies Estritamente Necessários',
    description:
      'Estes cookies são essenciais para que o jogo funcione corretamente, permitindo a autenticação segura (Google/Discord) e a persistência da sua sessão.',
    required: true,
  },
  {
    id: 'functional',
    title: 'Cookies de Funcionalidade',
    description:
      'Utilizados para lembrar suas preferências básicas de interface, como o idioma selecionado e configurações de som do jogo.',
    required: false,
  },
  {
    id: 'analytics',
    title: 'Cookies de Desempenho',
    description:
      'Ajudam nossa equipe a entender como o jogo é utilizado através de dados anônimos, permitindo melhorias no balanceamento e performance.',
    required: false,
  },
]
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-neutral-100">
    <PageHeader subtitle="Privacidade" title="Preferências de Cookies" updatedAt="Março de 2026" />

    <div class="mx-auto max-w-3xl px-6 pt-20 pb-28">
      <p class="mb-16 text-base leading-8 text-neutral-400">
        Nós utilizamos cookies para melhorar sua experiência no
        <strong class="font-medium text-neutral-200">Dragon Ball Z RPG Online</strong>. Abaixo você
        pode personalizar quais tecnologias deseja permitir. Cookies essenciais não podem ser
        desativados pois o jogo não funcionaria sem eles.
      </p>

      <main>
        <PageSection label="Configurações">
          <div class="space-y-6">
            <div
              v-for="group in cookieGroups"
              :key="group.id"
              class="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-neutral-700"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <h3 class="font-bold text-neutral-100">{{ group.title }}</h3>
                  <p class="mt-1 text-sm leading-6 text-neutral-400">
                    {{ group.description }}
                  </p>
                </div>

                <label class="relative inline-flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    v-model="preferences[group.id as keyof typeof preferences]"
                    :disabled="group.required"
                    class="peer sr-only"
                  />
                  <div
                    class="h-6 w-11 rounded-full bg-neutral-800 transition-colors peer-checked:bg-red-600 peer-disabled:opacity-50 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-neutral-500 after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:bg-white"
                  ></div>
                </label>
              </div>

              <span
                v-if="group.required"
                class="mt-3 inline-block text-[10px] font-bold tracking-widest text-red-500 uppercase"
              >
                Obrigatório
              </span>
            </div>
          </div>

          <div class="mt-10 flex justify-end">
            <button
              @click="savePreferences"
              class="cursor-pointer rounded-lg bg-red-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-red-500 active:scale-95"
            >
              Salvar Preferências
            </button>
          </div>
        </PageSection>

        <PageFooter>
          <template #links>
            <RouterLink :to="{ name: 'terms-of-service' }" class="hover:text-neutral-500">
              Termos de Serviço
            </RouterLink>
            <span>·</span>
            <RouterLink :to="{ name: 'privacy-policy' }" class="hover:text-neutral-500">
              Política de Privacidade
            </RouterLink>
          </template>
        </PageFooter>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Estilização extra para o switch se necessário */
input:disabled + div {
  cursor: not-allowed;
}
</style>
