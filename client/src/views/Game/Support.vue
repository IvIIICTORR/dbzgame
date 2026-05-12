<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'

useHead({ title: 'Suporte Z - Dragon Ball Z RPG' })
const router = useRouter()

// ------------------------------------------------------------------------
// ARTIGOS DE DESTAQUE (Topo com Bloco Vermelho)
// ------------------------------------------------------------------------
const highlightedArticles = [
  { id: 1, title: 'Dragon Ball Z RPG – Meta de Ascensão Mística' },
  { id: 2, title: 'Perguntas Frequentes sobre Invasões Globais' },
  { id: 3, title: 'Torneio do Poder – Modo de Jogo: Desordem Total' },
  { id: 4, title: 'Códigos de erro do Sistema Anti-Cheat Z' }
]

// ------------------------------------------------------------------------
// FERRAMENTAS DE SUPORTE (Painel Neutro)
// ------------------------------------------------------------------------
const supportTools = {
  account: {
    title: 'Gerenciamento da conta',
    links: [
      { id: 'recover', label: 'Recuperar sua conta', icon: null },
      { id: 'forgot_user', label: 'Esqueci meu nome de usuário', icon: null },
      { id: 'forgot_pass', label: 'Esqueci minha senha', icon: null },
      { id: 'transfer_1', label: 'Transferência de região', icon: null },
      { id: 'transfer_2', label: 'Transferência de servidor', icon: null }
    ]
  },
  payments: {
    title: 'Pagamentos',
    links: [
      { id: 'refund_1', label: 'Reembolso de compra dentro do jogo', icon: null },
      { id: 'refund_2', label: 'Reembolso de itens Zeni', icon: null },
      { id: 'chargeback', label: 'Resolver estornos', icon: null }
    ]
  },
  privacy: {
    title: 'Privacidade e proteção de dados',
    links: [
      { id: 'data_request', label: 'Solicitar dados da conta', icon: null },
      { id: 'delete_account', label: 'Exclusão de conta', icon: null }
    ]
  }
}

// ------------------------------------------------------------------------
// STATUS DE SERVIÇO (Atualizado)
// ------------------------------------------------------------------------
const serviceStatus = [
  { id: 1, name: 'Dragon Ball Z RPG', statusText: 'Servidor Ativo', statusColor: 'bg-green-500', icon: 'i-solar:gamepad-bold' },
  { id: 2, name: 'Blue Lock Manager', statusText: 'Em Desenvolvimento', statusColor: 'bg-blue-500', icon: 'i-solar:smartphone-bold' },
  { id: 3, name: 'Naruto Shippuden', statusText: 'Em Desenvolvimento', statusColor: 'bg-blue-500', icon: 'i-solar:shield-cross-bold' },
  { id: 4, name: 'Servidor Principal', statusText: 'Nenhum relatório', statusColor: 'bg-green-500', icon: 'i-solar:ghost-bold' }
]

// ------------------------------------------------------------------------
// NOSSOS JOGOS / SERVIDORES (Cards Verticais)
// ------------------------------------------------------------------------
const ourGames = [
  { id: 'dbz-rpg', bgImage: 'https://www.kodargames.com/images/games/dragon-ball-z.webp', logoText: 'Dragon Ball Z RPG' },
  { id: 'blue-lock', bgImage: 'https://www.kodargames.com/images/games/blue-lock.webp', logoText: 'Blue Lock Manager' },
  { id: 'naruto', bgImage: 'https://cdn-bgp.bluestacks.com/BGP/us/gametiles_naruto.shippuden.andgame.google.jpg', logoText: 'Naruto Shippuden' }
]

const handleToolClick = (toolId: string) => {
  alert(`Ação de suporte: ${toolId}`)
}

const openTicket = () => {
  alert('A redirecionar para envio de ticket direto...')
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen font-sans pb-20">
    
    <header class="relative w-full h-[300px] bg-[#09090b] overflow-hidden flex flex-col justify-end pb-10 border-b-8 border-red-600 shadow-2xl">
      <img src="https://images.alphacoders.com/135/1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col items-start justify-end">
        <button @click="router.back()" class="flex items-center gap-2 text-white font-black uppercase text-[10px] bg-white/5 px-4 py-2 rounded-full hover:bg-red-600 transition-all italic border border-white/10 mb-8 backdrop-blur-sm shadow-xl w-fit">
          <i-solar:arrow-left-outline class="size-4" /> Voltar ao Jogo
        </button>
        
        <h1 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
          Suporte <span class="text-red-600">Z</span>
        </h1>
        <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-4 italic">Central de Ajuda // Atendimento</p>
      </div>
    </header>

    <section class="max-w-7xl mx-auto px-6 mt-12 animate-fade-in-up">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a v-for="article in highlightedArticles" :key="article.id" href="#" class="flex items-stretch bg-white hover:bg-neutral-100 rounded-xl overflow-hidden shadow-sm transition-all cursor-pointer group">
          <div class="w-12 bg-neutral-700 flex items-center justify-center shrink-0 group-hover:bg-neutral-800 transition-colors">
            <img src="@/assets/images/favicon.webp" alt="Logo Z" class="size-6 object-contain drop-shadow-sm" />
          </div>
          <div class="p-4 flex items-center flex-1">
            <h3 class="text-xs md:text-sm font-bold text-neutral-900 leading-tight group-hover:text-red-700 transition-colors">{{ article.title }}</h3>
          </div>
        </a>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mt-12 animate-fade-in-up" style="animation-delay: 0.1s;">
      <div class="bg-white border border-neutral-200 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-sm">
        
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight mb-2">Ferramentas de Suporte</h2>
          <p class="text-sm md:text-base text-neutral-500 font-medium max-w-2xl">Nosso catálogo de opções de autoatendimento permite que você tome medidas agora mesmo.</p>

          <hr class="border-neutral-100 my-8">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <h3 class="text-lg font-black text-neutral-900 mb-5">{{ supportTools.account.title }}</h3>
              <div class="space-y-3">
                <button v-for="link in supportTools.account.links" :key="link.id" @click="handleToolClick(link.id)" class="w-full flex items-center justify-between border-2 border-neutral-100 hover:border-red-200 bg-neutral-50 hover:bg-red-50 text-neutral-700 hover:text-red-700 px-5 py-4 rounded-xl transition-all group text-left font-bold shadow-sm hover:shadow-md">
                  <div class="flex items-center gap-3"><component :is="link.icon" v-if="link.icon" class="size-4 text-neutral-400 group-hover:text-red-500" /><span class="text-xs">{{ link.label }}</span></div>
                  <i-solar:arrow-right-up-linear class="size-4 text-red-500 shrink-0" />
                </button>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-black text-neutral-900 mb-5">{{ supportTools.payments.title }}</h3>
              <div class="space-y-3">
                <button v-for="link in supportTools.payments.links" :key="link.id" @click="handleToolClick(link.id)" class="w-full flex items-center justify-between border-2 border-neutral-100 hover:border-red-200 bg-neutral-50 hover:bg-red-50 text-neutral-700 hover:text-red-700 px-5 py-4 rounded-xl transition-all group text-left font-bold shadow-sm hover:shadow-md">
                  <div class="flex items-center gap-3"><component :is="link.icon" v-if="link.icon" class="size-4 text-neutral-400 group-hover:text-red-500" /><span class="text-xs">{{ link.label }}</span></div>
                  <i-solar:arrow-right-up-linear class="size-4 text-red-500 shrink-0" />
                </button>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-black text-neutral-900 mb-5">{{ supportTools.privacy.title }}</h3>
              <div class="space-y-3">
                <button v-for="link in supportTools.privacy.links" :key="link.id" @click="handleToolClick(link.id)" class="w-full flex items-center justify-between border-2 border-neutral-100 hover:border-red-200 bg-neutral-50 hover:bg-red-50 text-neutral-700 hover:text-red-700 px-5 py-4 rounded-xl transition-all group text-left font-bold shadow-sm hover:shadow-md">
                  <div class="flex items-center gap-3"><component :is="link.icon" v-if="link.icon" class="size-4 text-neutral-400 group-hover:text-red-500" /><span class="text-xs">{{ link.label }}</span></div>
                  <i-solar:arrow-right-up-linear class="size-4 text-red-500 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mt-12 animate-fade-in-up" style="animation-delay: 0.2s;">
      <div class="w-full bg-white border border-neutral-200 p-8 md:p-12 rounded-[2rem] shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-8 border-b border-neutral-100 pb-4">
          <h3 class="text-2xl font-black text-neutral-900 tracking-tight">Status de serviço</h3>
          <a href="#" class="text-[10px] font-black text-red-600 uppercase tracking-widest hover:text-neutral-900 transition-colors flex items-center gap-1.5">
            Todo Site <i-solar:arrow-right-up-linear class="size-4" />
          </a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="service in serviceStatus" :key="service.id" class="bg-neutral-50 p-6 rounded-2xl flex flex-col justify-between border-2 border-neutral-100 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <component :is="service.icon" class="size-6 text-neutral-400 shrink-0" />
              <span class="text-sm font-bold text-neutral-900 truncate">{{ service.name }}</span>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-neutral-200/60">
              <span class="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{{ service.statusText }}</span>
              <div :class="['size-4 rounded-full shrink-0 shadow-inner', service.statusColor]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mt-20 mb-10 text-center animate-fade-in-up" style="animation-delay: 0.3s;">
      <h2 class="text-4xl font-black text-neutral-900 mb-3 tracking-tight">Nossos Jogos</h2>
      <p class="text-neutral-500 text-sm font-medium mb-12">Selecione o universo para receber suporte especializado.</p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        <a 
          v-for="game in ourGames" :key="game.id" 
          href="#" 
          class="relative block aspect-[3/4] group shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-neutral-900"
          style="clip-path: polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px);"
        >
          <img :src="game.bgImage" alt="Game Banner" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100" />
          
          <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="absolute bottom-8 w-full text-center px-6 transition-transform duration-500 ease-out group-hover:-translate-y-2">
            <h3 class="text-2xl font-black text-white italic tracking-tighter uppercase text-shadow-sm">{{ game.logoText }}</h3>
            <div class="w-10 h-1 bg-red-600 mx-auto mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300"></div>
          </div>
        </a>
      </div>
    </section>

    <section class="relative bg-white py-20 text-center animate-fade-in-up border-y border-neutral-200 mt-20" style="animation-delay: 0.4s;">
      <div class="relative z-10 max-w-2xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-black text-neutral-900 mb-4 tracking-tight">
          Precisa de mais ajuda?<br>Entre em contato!
        </h2>
        <p class="text-sm md:text-base text-neutral-500 mb-10 font-medium leading-relaxed">
          Este site nem é nossa forma final!<br>
          Entre em contato diretamente se tiver alguma pergunta difícil de ser respondida.
        </p>
        <button @click="openTicket" class="bg-neutral-900 hover:bg-red-600 text-white font-black uppercase text-xs tracking-widest px-10 py-5 rounded-xl shadow-md hover:shadow-xl transition-all flex items-center gap-3 mx-auto">
          Enviar um Ticket <i-solar:plain-2-bold class="size-5" />
        </button>
      </div>
    </section>

  </div>
</template>

<style scoped>
.text-shadow-sm { text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
.animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>