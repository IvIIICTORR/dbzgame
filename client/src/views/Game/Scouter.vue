<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import AuthButton from '@/components/auth/AuthButton.vue'
import Card from '@/components/icon/Card.vue'
import Avatar from '@/components/icon/Avatar.vue'

useHead({ title: 'Rastreador Z (Scouter) - Dragon Ball Z RPG' })
const router = useRouter()

// ------------------------------------------------------------------------
// INVENTÁRIO DO JOGADOR
// ------------------------------------------------------------------------
const myInventory = ref({
  greenScouters: 3
})

// ------------------------------------------------------------------------
// ESTADOS DE PESQUISA, RASTREIO E NAVEGAÇÃO
// ------------------------------------------------------------------------
const searchQuery = ref('Vegeta_Prince')
const isScanning = ref(false)
const hasScanned = ref(false)

type ScouterTab = 'stats' | 'equipment' | 'record'
const activeTab = ref<ScouterTab>('stats')

const tabs = [
  { id: 'stats', name: 'Atributos Base', icon: 'i-solar:chart-square-bold' },
  { id: 'equipment', name: 'Equipamento', icon: 'i-solar:shield-user-bold' },
  { id: 'record', name: 'Histórico', icon: 'i-solar:history-bold' }
]

// ------------------------------------------------------------------------
// DADOS DO JOGADOR ALVO
// ------------------------------------------------------------------------
const targetPlayer = ref({
  id: '#Z-8492',
  name: 'Vegeta_Prince',
  race: 'Saiyajin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vegeta',
  level: 90,
  group: 'Guerreiros Z',
  description: 'O Príncipe dos Saiyajins! O meu orgulho não permite derrotas. Se cruzares o meu caminho, serás esmagado.',
  lastLogin: 'Há 5 minutos',
  elo: 'Diamante I',
  eloIcon: 'i-solar:cup-star-bold',
  eloColor: 'text-cyan-500',
  
  stats: { forca: 12000, velocidade: 9000, defesa: 8500, ki: 10000 },
  record: { wins: 410, losses: 12, draws: 2 },
  equipment: [
    { slot: 'Peito', name: 'Armadura de Elite (Capsule Corp)', rarity: 'epic', icon: 'i-solar:shield-user-bold' },
    { slot: 'Acessório', name: 'Luvas de Treino Pesado', rarity: 'rare', icon: 'i-solar:hand-bold' },
    { slot: 'Pernas', name: 'Traje de Combate Flexível', rarity: 'common', icon: 'i-solar:trousers-bold' }
  ]
})

// ------------------------------------------------------------------------
// AÇÕES DO SISTEMA (Scouter)
// ------------------------------------------------------------------------
const searchPlayer = () => {
  if (!searchQuery.value) return
  hasScanned.value = false
  activeTab.value = 'stats'
}

const performScan = () => {
  if (myInventory.value.greenScouters <= 0) {
    alert('Não tens Scouters Verdes suficientes no inventário!')
    return
  }

  myInventory.value.greenScouters--
  isScanning.value = true
  
  setTimeout(() => {
    isScanning.value = false
    hasScanned.value = true
  }, 1500)
}

// ------------------------------------------------------------------------
// AÇÕES SOCIAIS E PVP (Novos Botões)
// ------------------------------------------------------------------------
const challengePlayer = () => {
  alert(`Desafio enviado para ${targetPlayer.value.name}! Prepara-te para a batalha.`)
  // Lógica futura: router.push('/arena/desafio/123')
}

const sendFriendRequest = () => {
  alert(`Solicitação de amizade enviada para ${targetPlayer.value.name}.`)
}

const sendMessage = () => {
  alert(`Abrindo chat privado com ${targetPlayer.value.name}...`)
  // Lógica futura: abrir modal de mensagens
}

// ------------------------------------------------------------------------
// UTILITÁRIOS
// ------------------------------------------------------------------------
const getRarityColor = (rarity: string) => {
  const map: Record<string, string> = {
    epic: 'text-purple-600 bg-purple-100 border-purple-200',
    rare: 'text-blue-600 bg-blue-100 border-blue-200',
    common: 'text-neutral-600 bg-neutral-100 border-neutral-200'
  }
  return map[rarity] || map.common
}
</script>

<template>
  <div class="p-6 md:p-12 bg-neutral-50 min-h-screen font-sans">
    
    <header class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-neutral-200">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-green-100 text-green-600 rounded-2xl shadow-inner border border-green-200">
          <i-solar:radar-bold class="size-8" />
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 tracking-tight">Rastreador Z</h1>
          <p class="text-neutral-500 mt-1">Investiga os teus adversários e descobre os seus segredos.</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-neutral-200 shadow-sm">
          <div class="relative size-8 bg-green-50 rounded-lg border border-green-200 flex items-center justify-center">
            <i-solar:radar-bold class="size-5 text-green-500" />
          </div>
          <div>
            <span class="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Scouters Verdes</span>
            <span class="block text-lg font-black leading-none" :class="myInventory.greenScouters === 0 ? 'text-red-500' : 'text-neutral-900'">
              {{ myInventory.greenScouters }} <span class="text-xs font-bold text-neutral-400">Restantes</span>
            </span>
          </div>
        </div>
        <button @click="router.back()" class="size-12 rounded-xl bg-white border border-neutral-200 text-neutral-500 hover:text-green-600 transition-colors flex items-center justify-center shadow-sm">
          <i-solar:arrow-left-bold class="size-5" />
        </button>
      </div>
    </header>

    <div class="max-w-5xl mx-auto mb-8">
      <form @submit.prevent="searchPlayer" class="relative flex items-center">
        <div class="absolute left-4 text-neutral-400"><i-solar:user-bold class="size-6" /></div>
        <input 
          v-model="searchQuery" type="text" placeholder="Nome do jogador alvo..." 
          class="w-full bg-white border-2 border-neutral-200 hover:border-green-300 focus:border-green-500 rounded-2xl py-4 pl-14 pr-32 outline-none text-neutral-900 font-bold shadow-sm transition-colors"
        />
        <AuthButton type="submit" class="absolute right-2 top-2 bottom-2 bg-neutral-900 hover:bg-black text-white px-6 uppercase text-xs font-black tracking-widest rounded-xl">
          Procurar
        </AuthButton>
      </form>
    </div>

    <div v-if="targetPlayer" class="max-w-5xl mx-auto animate-fade-in-up">
      <Card class="bg-white border-2 border-neutral-100 rounded-3xl shadow-xl overflow-hidden flex flex-col-reverse lg:flex-row">
        
        <div class="flex-1 flex flex-col md:flex-row relative min-h-[500px]">
          
          <nav class="w-full md:w-56 border-b md:border-b-0 md:border-r border-neutral-100 bg-neutral-50/50 p-6 space-y-2">
            <h3 class="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">Análise Tática</h3>
            <button 
              v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id as ScouterTab"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all text-left border relative overflow-hidden group',
                activeTab === tab.id 
                  ? 'bg-white shadow-sm border-green-200 text-green-700' 
                  : 'bg-transparent border-transparent text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-700'
              ]"
            >
              <div v-if="activeTab === tab.id" class="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r-full"></div>
              <component :is="tab.icon" :class="['size-5 transition-transform group-hover:scale-110', activeTab === tab.id ? 'text-green-500' : 'text-neutral-400']" />
              {{ tab.name }}
            </button>
          </nav>

          <div class="flex-1 p-6 md:p-8 relative">
            
            <div v-if="!hasScanned" class="absolute inset-0 z-10 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center p-6">
              <div class="bg-white border border-neutral-200 p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none"></div>
                <div class="size-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <i-solar:lock-password-bold class="size-10 text-neutral-400" />
                  <div v-if="isScanning" class="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
                </div>
                <h3 class="text-lg font-black text-neutral-900 mb-2">Acesso Restrito</h3>
                <p class="text-xs text-neutral-500 mb-8 leading-relaxed">Usa um Scouter Verde para quebrar a criptografia e revelar o Poder de Luta e os Segredos deste jogador.</p>
                <AuthButton @click="performScan" :disabled="isScanning" class="w-full bg-green-600 hover:bg-green-700 text-white font-black uppercase text-xs py-4 flex items-center justify-center gap-2 border-none shadow-[0_4px_0_#166534] active:shadow-none active:translate-y-1 transition-all disabled:opacity-70 disabled:grayscale">
                  <i-solar:radar-bold :class="['size-5', isScanning ? 'animate-spin' : '']" />
                  {{ isScanning ? 'A Ler Dados...' : 'Rastrear (1x Scouter)' }}
                </AuthButton>
              </div>
            </div>

            <div :class="['transition-all duration-1000', hasScanned ? 'opacity-100' : 'opacity-10 blur-md pointer-events-none select-none']">
              
              <div v-if="activeTab === 'stats'" class="animate-fade-in">
                <h4 class="text-xs font-black text-neutral-800 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <i-solar:chart-square-bold class="size-5 text-neutral-400" /> Níveis de Poder Atuais
                </h4>
                <div class="space-y-5">
                  <div class="flex items-center gap-4">
                    <span class="text-xs font-bold text-neutral-600 w-24">Força Física</span>
                    <div class="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shadow-inner">
                      <div class="h-full bg-red-500" :style="`width: ${(targetPlayer.stats.forca / 15000) * 100}%`"></div>
                    </div>
                    <span class="text-sm font-mono font-black text-neutral-900 w-16 text-right">{{ targetPlayer.stats.forca.toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-xs font-bold text-neutral-600 w-24">Ki Máximo</span>
                    <div class="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shadow-inner">
                      <div class="h-full bg-blue-500" :style="`width: ${(targetPlayer.stats.ki / 15000) * 100}%`"></div>
                    </div>
                    <span class="text-sm font-mono font-black text-neutral-900 w-16 text-right">{{ targetPlayer.stats.ki.toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-xs font-bold text-neutral-600 w-24">Velocidade</span>
                    <div class="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shadow-inner">
                      <div class="h-full bg-yellow-500" :style="`width: ${(targetPlayer.stats.velocidade / 15000) * 100}%`"></div>
                    </div>
                    <span class="text-sm font-mono font-black text-neutral-900 w-16 text-right">{{ targetPlayer.stats.velocidade.toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-xs font-bold text-neutral-600 w-24">Defesa Total</span>
                    <div class="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shadow-inner">
                      <div class="h-full bg-stone-500" :style="`width: ${(targetPlayer.stats.defesa / 15000) * 100}%`"></div>
                    </div>
                    <span class="text-sm font-mono font-black text-neutral-900 w-16 text-right">{{ targetPlayer.stats.defesa.toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <div v-if="activeTab === 'equipment'" class="animate-fade-in">
                <h4 class="text-xs font-black text-neutral-800 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <i-solar:shield-user-bold class="size-5 text-neutral-400" /> Equipamento Detetado
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="(item, idx) in targetPlayer.equipment" :key="idx" class="bg-white border border-neutral-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                    <div :class="['size-12 rounded-xl flex items-center justify-center border-2', getRarityColor(item.rarity)]">
                      <component :is="item.icon" class="size-6" />
                    </div>
                    <div class="min-w-0">
                      <span class="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">{{ item.slot }}</span>
                      <span class="block text-sm font-bold text-neutral-900 truncate">{{ item.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="activeTab === 'record'" class="animate-fade-in">
                <h4 class="text-xs font-black text-neutral-800 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <i-solar:history-bold class="size-5 text-neutral-400" /> Registo de Combate
                </h4>
                <div class="grid grid-cols-3 gap-6">
                  <div class="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center shadow-sm">
                    <span class="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Vitórias</span>
                    <span class="text-4xl font-black text-blue-700">{{ targetPlayer.record.wins }}</span>
                  </div>
                  <div class="bg-red-50 border border-red-100 p-6 rounded-2xl text-center shadow-sm">
                    <span class="block text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Derrotas</span>
                    <span class="text-4xl font-black text-red-700">{{ targetPlayer.record.losses }}</span>
                  </div>
                  <div class="bg-stone-50 border border-stone-200 p-6 rounded-2xl text-center shadow-sm">
                    <span class="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2">Empates</span>
                    <span class="text-4xl font-black text-stone-700">{{ targetPlayer.record.draws }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="w-full lg:w-[350px] bg-neutral-50 p-8 border-b lg:border-b-0 lg:border-l border-neutral-100 flex flex-col items-center text-center relative shrink-0">
          
          <div class="absolute top-6 right-6 bg-white px-3 py-1.5 rounded-full border border-neutral-200 shadow-sm flex items-center gap-1.5">
            <component :is="targetPlayer.eloIcon" :class="['size-4', targetPlayer.eloColor]" />
            <span class="text-[10px] font-black text-neutral-700 uppercase">{{ targetPlayer.elo }}</span>
          </div>

          <div class="relative mb-6 mt-8">
            <div class="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
            <Avatar :src="targetPlayer.avatar" class="size-32 border-4 border-white shadow-lg relative z-10" />
            
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[11px] font-black uppercase px-4 py-1.5 rounded-full border-2 border-white shadow-md z-20">
              NV {{ targetPlayer.level }}
            </div>
          </div>

          <h2 class="text-2xl font-black text-neutral-900 mb-2 mt-2">{{ targetPlayer.name }}</h2>
          
          <div class="flex items-center justify-center gap-2 mb-6">
            <span class="px-3 py-1 bg-white border border-neutral-200 rounded-md text-[10px] font-bold text-neutral-600 uppercase tracking-widest shadow-sm">
              <i-solar:dna-bold class="size-3 inline-block mr-1 text-indigo-500" /> {{ targetPlayer.race }}
            </span>
            <span class="px-3 py-1 bg-white border border-neutral-200 rounded-md text-[10px] font-mono font-black text-neutral-400 shadow-sm">
              ID: {{ targetPlayer.id }}
            </span>
          </div>

          <p class="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6 flex items-center justify-center gap-1.5 bg-indigo-50 py-2 px-4 rounded-xl border border-indigo-100 w-full">
            <i-solar:users-group-rounded-bold class="size-4" /> {{ targetPlayer.group }}
          </p>

          <div class="w-full bg-white border border-neutral-200 p-5 rounded-2xl text-left mb-6 shadow-sm relative">
            <i-solar:document-text-bold class="absolute top-3 right-3 size-6 text-neutral-100" />
            <span class="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2 border-b border-neutral-100 pb-1.5">Biografia / Descrição</span>
            <p class="text-[11px] text-neutral-600 italic leading-relaxed font-medium relative z-10">"{{ targetPlayer.description }}"</p>
          </div>

          <div class="w-full mt-auto space-y-2.5 mb-6">
            <button @click="challengePlayer" class="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[11px] py-3.5 rounded-xl shadow-[0_4px_0_#991b1b] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
              <i-solar:target-bold class="size-4" /> Desafiar para Duelo
            </button>
            
            <div class="grid grid-cols-2 gap-2.5">
              <button @click="sendFriendRequest" class="w-full bg-white hover:bg-neutral-100 border-2 border-neutral-200 text-neutral-700 font-black uppercase text-[10px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                <i-solar:user-bold class="size-3.5 text-indigo-500" /> Add Amigo
              </button>
              <button @click="sendMessage" class="w-full bg-white hover:bg-neutral-100 border-2 border-neutral-200 text-neutral-700 font-black uppercase text-[10px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                <i-solar:chat-round-bold class="size-3.5 text-green-500" /> Mensagem
              </button>
            </div>
          </div>

          <div class="w-full pt-6 border-t border-neutral-200 flex flex-col items-center">
            <span class="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Última Atividade</span>
            <span class="text-xs font-bold text-green-600 flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <i-solar:clock-circle-bold class="size-3.5" /> {{ targetPlayer.lastLogin }}
            </span>
          </div>

        </div>
      </Card>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

nav::-webkit-scrollbar { width: 0px; height: 0px; }
</style>