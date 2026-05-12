<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

useHead({ title: 'Radar Scouter - Matchmaking | Dragon Ball Z RPG' })
const router = useRouter()

// --- CONFIGURAÇÕES DE BALANCEAMENTO ---
const playerPL = 890000 // Power Level do Shiro Cobra
const rangeTolerance = ref(50000) // Começa buscando +/- 50k de diferença
const isSearching = ref(false)
const searchStatus = ref('Iniciando Scouter...')
const foundOpponent = ref<any>(null)
const searchProgress = ref(0)
let timer: any = null

// --- BANCO DE DADOS SIMULADO (OPONENTES NO SERVIDOR) ---
const serverPlayers = [
  { id: 1, name: 'Vegeta_Prince', pl: 910000, lvl: 46, race: 'Saiyajin', wr: '68%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vegeta' },
  { id: 2, name: 'Krilin_Destructo', pl: 450000, lvl: 30, race: 'Humano', wr: '45%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Krilin' },
  { id: 3, name: 'Trunks_Future', pl: 895000, lvl: 45, race: 'Híbrido', wr: '72%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trunks' },
  { id: 4, name: 'Cell_Perfect', pl: 1200000, lvl: 55, race: 'Androide', wr: '90%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cell' },
  { id: 5, name: 'Kyabe_U6', pl: 875000, lvl: 44, race: 'Saiyajin', wr: '60%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kyabe' }
]

// --- LÓGICA DO MATCHMAKING ---
const startSearch = () => {
  isSearching.value = true
  foundOpponent.value = null
  searchProgress.value = 0
  rangeTolerance.value = 50000 // Reset da tolerância
  
  timer = setInterval(() => {
    searchProgress.value += 2
    
    // Simula o Scouter expandindo a busca se não achar rápido
    if (searchProgress.value === 40) {
      searchStatus.value = 'Expandindo área de busca (+/- 100k PL)...'
      rangeTolerance.value = 100000
    }
    
    if (searchProgress.value === 80) {
      searchStatus.value = 'Sinal instável... Localizando guerreiros remotos...'
      rangeTolerance.value = 200000
    }

    if (searchProgress.value >= 100) {
      findBalancedMatch()
    }
  }, 100)
}

const findBalancedMatch = () => {
  clearInterval(timer)
  
  // Filtra jogadores que estão dentro da faixa de PL do Shiro Cobra
  const matches = serverPlayers.filter(p => {
    return Math.abs(p.pl - playerPL) <= rangeTolerance.value && p.name !== 'Shiro Cobra'
  })

  // Seleciona um aleatório dos que passaram no filtro de balanceamento
  if (matches.length > 0) {
    foundOpponent.value = matches[Math.floor(Math.random() * matches.length)]
    isSearching.value = false
    searchStatus.value = 'ALVO LOCALIZADO!'
  } else {
    searchStatus.value = 'Nenhum oponente compatível encontrado.'
    isSearching.value = false
  }
}

const cancelSearch = () => {
  clearInterval(timer)
  isSearching.value = false
  searchProgress.value = 0
}

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="animate-fade-in bg-white min-h-screen pb-20 font-sans text-neutral-900">
    
    <header class="bg-[#09090b] pt-24 pb-16 border-b-4 border-blue-600 shadow-2xl relative overflow-hidden text-center">
      <div class="max-w-4xl mx-auto px-6 relative z-10">
        <p class="text-blue-500 font-black italic uppercase tracking-[0.4em] text-[10px] mb-4">Módulo de Matchmaking v2.0</p>
        <h1 class="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-8">RADAR <span class="text-blue-600">SCOUTER</span></h1>
        
        <div class="inline-flex items-center gap-8 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
          <div class="text-left border-r border-white/10 pr-8">
            <span class="block text-[8px] font-black text-neutral-500 uppercase italic">Seu Power Level</span>
            <span class="text-2xl font-black text-white italic">890.000</span>
          </div>
          <div class="text-left">
            <span class="block text-[8px] font-black text-neutral-400 uppercase italic">Classe Atual</span>
            <span class="text-2xl font-black text-blue-500 italic uppercase">Elite Z</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 mt-16 text-center">
      
      <div v-if="isSearching" class="space-y-12 py-10">
        <div class="relative inline-block">
          <div class="size-48 border-4 border-blue-600/20 rounded-full flex items-center justify-center animate-spin-slow">
            <div class="size-32 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center font-black text-2xl italic animate-pulse text-blue-600">
            {{ searchProgress }}%
          </div>
        </div>
        
        <div class="space-y-4">
          <h2 class="text-2xl font-black uppercase italic tracking-tighter">{{ searchStatus }}</h2>
          <button @click="cancelSearch" class="text-neutral-400 font-black uppercase italic text-xs hover:text-red-600 tracking-widest transition-colors">Abortar Varredura</button>
        </div>
      </div>

      <div v-else-if="foundOpponent" class="animate-slide-up py-10">
        <h2 class="text-sm font-black text-neutral-400 uppercase italic tracking-[0.3em] mb-6">Resultado do Balanceamento</h2>
        
        <div class="group flex flex-col md:flex-row bg-white border-2 border-blue-600 shadow-2xl overflow-hidden relative text-left max-w-3xl mx-auto">
          <div class="relative w-full md:w-[40%] h-[240px] md:h-auto bg-[#111] overflow-hidden" style="clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);">
            <img :src="foundOpponent.avatar" class="w-full h-full object-cover" />
            <div class="absolute top-4 left-4 z-20 bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 uppercase italic border border-white/10 shadow-xl">
               OPONENTE IDEAL
            </div>
          </div>

          <div class="p-8 flex flex-col flex-1 justify-center bg-white">
            <h3 class="text-3xl font-black italic uppercase tracking-tighter text-neutral-900 mb-4">{{ foundOpponent.name }}</h3>
            
            <div class="grid grid-cols-2 gap-6 mb-6 border-y border-neutral-100 py-4 font-black italic">
               <div class="flex flex-col">
                  <span class="text-[8px] text-neutral-400 uppercase italic">Power Level</span>
                  <span class="text-lg text-blue-600">{{ foundOpponent.pl.toLocaleString() }}</span>
               </div>
               <div class="flex flex-col">
                  <span class="text-[8px] text-neutral-400 uppercase italic">Win Rate</span>
                  <span class="text-lg text-neutral-800">{{ foundOpponent.wr }}</span>
               </div>
            </div>

            <div class="flex gap-4">
               <button @click="foundOpponent = null" class="flex-1 bg-neutral-100 text-neutral-400 py-4 rounded-xl font-black text-[10px] uppercase italic hover:bg-neutral-200 transition-all">Pular Alvo</button>
               <button class="flex-[2] bg-neutral-950 text-white py-4 rounded-xl font-black text-[10px] uppercase italic hover:bg-blue-600 transition-all shadow-xl">Desafiar Agora</button>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 h-2 w-full bg-blue-600 shadow-[0_0_15px_#3b82f6]"></div>
        </div>
      </div>

      <div v-else class="py-10 space-y-8">
        <div class="bg-neutral-50 p-12 rounded-[3rem] border-2 border-dashed border-neutral-200">
          <h2 class="text-3xl font-black uppercase italic tracking-tighter mb-4">Pronto para o <span class="text-blue-600">Combate?</span></h2>
          <p class="text-neutral-500 italic text-sm max-w-sm mx-auto mb-10 leading-relaxed font-medium">
            Nosso sistema balanceado levará em conta seu Power Level de 890k para encontrar um oponente justo no servidor.
          </p>
          <button @click="startSearch" class="bg-neutral-950 text-white px-12 py-6 rounded-2xl font-black italic uppercase tracking-tighter text-2xl hover:bg-blue-600 hover:scale-105 transition-all shadow-2xl">
            INICIAR SCOUTER
          </button>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
.animate-spin-slow { animation: spin 3s linear infinite; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>