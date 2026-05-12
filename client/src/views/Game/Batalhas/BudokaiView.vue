<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- ESTADOS DO SISTEMA ---
const isRegistered = ref(false)
const tournamentStarted = ref(false)
const maxPlayers = 8

// --- LISTA DE JOGADORES (Simulando preenchimento) ---
const players = ref([
  { id: 1, name: 'Vegeta_Hakai', pl: '910k', lvl: 48, winrate: '85%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vegeta' },
  { id: 2, name: 'Goku_Black', pl: '1.2M', lvl: 52, winrate: '92%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Black' },
  { id: 3, name: 'Trunks_Future', pl: '880k', lvl: 43, winrate: '70%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trunks' },
  { id: 4, name: 'Freeza_Gold', pl: '1.2M', lvl: 55, winrate: '88%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Freeza' },
  { id: 5, name: 'Cell_Max', pl: '1.1M', lvl: 50, winrate: '65%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cell' },
  { id: 6, name: 'Gohan_Beast', pl: '950k', lvl: 49, winrate: '80%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gohan' },
  { id: 7, name: 'Piccolo_Orange', pl: '900k', lvl: 47, winrate: '78%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Piccolo' },
])

const brackets = ref<any[]>([])

// --- LÓGICA DE INSCRIÇÃO AUTOMÁTICA ---
const register = () => {
  if (!isRegistered.value && players.value.length < maxPlayers) {
    players.value.push({
      id: 8,
      name: 'Shiro Cobra',
      pl: '890k',
      lvl: 45,
      winrate: '100%',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artemis'
    })
    isRegistered.value = true
  }
}

// --- SORTEIO AUTOMÁTICO AO PREENCHER ---
watch(players, (newPlayers) => {
  if (newPlayers.length === maxPlayers) {
    setTimeout(() => {
      const shuffled = [...newPlayers].sort(() => Math.random() - 0.5)
      const matches = []
      const today = new Date()
      
      for (let i = 0; i < shuffled.length; i += 2) {
        const matchDate = new Date(today)
        matchDate.setHours(14 + i, 0, 0) // Define horários sequenciais
        
        matches.push({
          p1: shuffled[i],
          p2: shuffled[i+1],
          time: matchDate.toLocaleTimeString([], { hour: '2d', minute: '2d' }),
          date: 'Amanhã'
        })
      }
      brackets.value = matches
      tournamentStarted.value = true
    }, 1500)
  }
}, { deep: true })

const goBack = () => router.push({ name: 'battles' })
</script>

<template>
  <div class="bg-white min-h-screen pb-20 font-sans text-neutral-900">
    
    <header class="bg-[#0c0c0e] pt-16 pb-20 border-b-8 border-yellow-500 shadow-2xl relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <button @click="goBack" class="text-white/40 hover:text-yellow-500 font-black text-[10px] uppercase italic tracking-[0.3em] mb-6 flex items-center gap-2">
           ← VOLTAR AO MAPA
        </button>
        <h1 class="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
          BUDOKAI <span class="text-yellow-500">TENKAICHI</span>
        </h1>
        
        <div class="max-w-3xl bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
          <h2 class="text-yellow-500 font-black italic uppercase text-[10px] tracking-[0.4em] mb-3">Protocolo do Torneio Mundial</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-[9px] font-bold text-white/70 uppercase italic">
            <p class="border-l border-yellow-500/30 pl-2">● Mata-Mata Direto</p>
            <p class="border-l border-yellow-500/30 pl-2">● Fora da Arena = Derrota</p>
            <p class="border-l border-yellow-500/30 pl-2">● Sem Armas Externas</p>
            <p class="border-l border-yellow-500/30 pl-2">● Vitória por Nocaute</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <div class="lg:col-span-8">
        
        <div v-if="tournamentStarted" class="space-y-10 animate-fade-in">
          <h2 class="text-2xl font-black uppercase italic tracking-tighter border-l-4 border-yellow-500 pl-4">Chaveamento <span class="text-yellow-500">Oficial</span></h2>
          
          <div class="grid grid-cols-1 gap-8 relative">
            <div v-for="(match, i) in brackets" :key="i" class="flex flex-col md:flex-row items-center gap-4 group">
              <div class="flex-1 w-full bg-neutral-900 text-white p-5 rounded-2xl flex items-center gap-4 border-b-4 border-neutral-800 group-hover:border-yellow-500 transition-all">
                <img :src="match.p1.avatar" class="size-12 bg-white/10 rounded-lg" />
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="font-black italic uppercase text-sm">{{ match.p1.name }}</span>
                    <span class="text-[8px] text-yellow-500 font-bold">WR: {{ match.p1.winrate }}</span>
                  </div>
                  <span class="text-[9px] text-neutral-500 font-bold uppercase">Nível {{ match.p1.lvl }}</span>
                </div>
              </div>

              <div class="flex flex-col items-center">
                <div class="size-10 bg-yellow-500 rounded-full flex items-center justify-center font-black italic text-xs shadow-xl border-4 border-white">VS</div>
                <span class="text-[8px] font-black uppercase mt-2 text-neutral-400">{{ match.date }} às {{ match.time }}</span>
              </div>

              <div class="flex-1 w-full bg-neutral-900 text-white p-5 rounded-2xl flex items-center gap-4 border-b-4 border-neutral-800 group-hover:border-yellow-500 transition-all text-right flex-row-reverse">
                <img :src="match.p2.avatar" class="size-12 bg-white/10 rounded-lg" />
                <div class="flex-1">
                  <div class="flex justify-between items-center flex-row-reverse">
                    <span class="font-black italic uppercase text-sm">{{ match.p2.name }}</span>
                    <span class="text-[8px] text-yellow-500 font-bold">WR: {{ match.p2.winrate }}</span>
                  </div>
                  <span class="text-[9px] text-neutral-500 font-bold uppercase">Nível {{ match.p2.lvl }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-8">
          <h2 class="text-2xl font-black uppercase italic tracking-tighter border-l-4 border-yellow-500 pl-4">Guerreiros <span class="text-yellow-500">na Espera</span></h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="player in players" :key="player.id" class="flex items-center bg-white border border-neutral-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
              <div class="size-16 bg-neutral-900 shrink-0 overflow-hidden" style="clip-path: polygon(15% 0, 100% 0, 85% 100%, 0 100%);">
                <img :src="player.avatar" class="size-full object-cover" />
              </div>
              <div class="ml-6 flex-1">
                <div class="flex justify-between items-start">
                   <h4 class="text-lg font-black italic uppercase text-neutral-900 leading-none">{{ player.name }}</h4>
                   <span class="text-[8px] font-black bg-neutral-100 px-2 py-1 rounded italic">LV. {{ player.lvl }}</span>
                </div>
                <div class="flex gap-4 mt-2">
                  <span class="text-[9px] font-black text-yellow-600 uppercase italic">PL: {{ player.pl }}</span>
                  <span class="text-[9px] font-black text-neutral-400 uppercase italic">Winrate: {{ player.winrate }}</span>
                </div>
              </div>
              <div class="absolute right-0 top-0 h-full w-1 bg-yellow-500"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <div class="bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100 shadow-inner">
           <h3 class="text-sm font-black uppercase italic text-neutral-900 mb-6 flex items-center gap-2">
              <span class="w-1 h-4 bg-yellow-500"></span> Status do Setor
           </h3>
           
           <div class="space-y-4 mb-8">
              <div class="flex justify-between items-center p-4 bg-white rounded-2xl border border-neutral-100 italic">
                 <span class="text-[10px] font-black uppercase text-neutral-400">Vagas</span>
                 <span class="text-xl font-black">{{ players.length }} / {{ maxPlayers }}</span>
              </div>
              <div v-if="tournamentStarted" class="p-4 bg-yellow-500 text-black rounded-2xl text-center italic font-black uppercase text-[10px] tracking-widest shadow-lg">
                Sorteio Concluído!
              </div>
              <div v-else class="p-4 bg-neutral-900 text-white rounded-2xl text-center italic font-black uppercase text-[10px] tracking-widest animate-pulse">
                Aguardando Guerreiros...
              </div>
           </div>

           <button v-if="!isRegistered && !tournamentStarted" @click="register" class="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black italic uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl">
             Inscrever Shiro Cobra
           </button>
           <button v-else-if="isRegistered && !tournamentStarted" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest shadow-xl cursor-not-allowed">
             Inscrito no Budokai
           </button>
           <button v-else class="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest shadow-xl">
             Acompanhar Lutas
           </button>
        </div>
      </div>
    </main>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>