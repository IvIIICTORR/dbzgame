<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

useHead({ title: 'Arena Survival - Inscrições Abertas | Dragon Ball Z RPG' })
const router = useRouter()

const currentTime = ref(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
const isRegistered = ref(false)
const playersJoined = ref(64)
const maxVagas = 100

// --- LISTA DE INSCRITOS RECENTES (ESTILO CARDS) ---
const recentEntries = ref([
  { id: 1, name: 'Shiro Cobra', pl: '890k', level: 45, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artemis' },
  { id: 2, name: 'Vegeta_Prince', pl: '910k', level: 48, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vegeta' },
  { id: 3, name: 'Goku_Black', pl: '1.2M', level: 52, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Black' },
  { id: 4, name: 'Trunks_Future', pl: '880k', level: 43, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trunks' }
])

const schedules = [
  { inscricao: '06:30', combate: '07:00', tipo: 'Off Season', status: 'Finalizado' },
  { inscricao: '10:30', combate: '11:00', tipo: 'Normal', status: 'Finalizado' },
  { inscricao: '12:30', combate: '13:00', tipo: 'Normal', status: 'AGORA' },
  { inscricao: '15:30', combate: '16:00', tipo: 'Normal', status: 'Próximo' },
  { inscricao: '18:30', combate: '19:00', tipo: 'Normal', status: 'Aguardando' },
  { inscricao: '22:30', combate: '23:00', tipo: 'Off Season', status: 'Aguardando' },
]

// --- LÓGICA DE BOTÕES ---
const canRegister = ref(true) // Simulado para o horário de 12:30
const canEnter = ref(false)

const register = () => {
  if (!isRegistered.value) {
    isRegistered.value = true
    playersJoined.value++
  }
}

const goBack = () => router.push({ name: 'battles' })
</script>

<template>
  <div class="animate-fade-in bg-white min-h-screen pb-20 font-sans text-neutral-900 overflow-x-hidden">
    
    <header class="relative w-full h-[400px] bg-[#09090b] overflow-hidden flex flex-col justify-end pb-12 border-b-8 border-orange-600 shadow-2xl">
      <img src="https://images2.alphacoders.com/884/884576.jpg" class="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 blur-[1px]" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <button @click="goBack" class="flex items-center gap-2 text-white font-black uppercase text-[10px] bg-white/5 px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all italic border border-white/10 mb-8 backdrop-blur-md w-fit">
            <i-solar-arrow-left-outline class="size-4" /> Voltar para Base
          </button>
          <div class="flex items-center gap-3 mb-2">
            <span class="w-3 h-3 bg-orange-600 rounded-full animate-ping shadow-[0_0_12px_#ea580c]"></span>
            <p class="text-orange-500 font-black italic uppercase tracking-[0.4em] text-[10px]">Arena Multiverso: Protocolo de Inscrição</p>
          </div>
          <h1 class="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
            SURVIVAL <span class="text-orange-600">ARENA</span>
          </h1>
        </div>

        <div class="bg-neutral-900/90 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] min-w-[340px] shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl text-white italic">Z</div>
          
          <div class="flex justify-between items-end mb-6">
             <div>
                <span class="text-[9px] font-black text-neutral-500 uppercase italic block mb-1">Status da Sala</span>
                <span class="text-2xl font-black text-white italic uppercase">{{ playersJoined }} / {{ maxVagas }} <span class="text-orange-600">Vagas</span></span>
             </div>
             <div class="text-right">
                <span class="text-[9px] font-black text-neutral-500 uppercase italic block mb-1">Time</span>
                <span class="text-xl font-black text-white italic leading-none">{{ currentTime }}</span>
             </div>
          </div>
          
          <button v-if="!isRegistered && canRegister" @click="register" class="w-full bg-orange-600 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest text-lg hover:bg-orange-500 hover:-translate-y-1 transition-all shadow-[0_10px_20px_rgba(234,88,12,0.3)]">
            Confirmar Presença
          </button>
          
          <button v-else-if="isRegistered && !canEnter" class="w-full bg-neutral-800 text-neutral-400 py-5 rounded-2xl font-black italic uppercase tracking-widest text-lg border border-white/5 cursor-not-allowed">
            Inscrito (Aguardando)
          </button>

          <button v-else-if="canEnter" class="w-full bg-green-600 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest text-lg hover:bg-green-500 transition-all shadow-[0_10px_20px_rgba(22,163,74,0.3)]">
            Entrar na Arena
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <div class="lg:col-span-8 space-y-10">
        <div class="flex items-center justify-between mb-4">
           <h2 class="text-2xl font-black uppercase italic tracking-tighter border-l-4 border-orange-600 pl-4">Inscritos <span class="text-orange-600">Recentemente</span></h2>
           <span class="text-[10px] font-black text-neutral-400 uppercase italic tracking-widest animate-pulse">Monitorando Scouters...</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="player in recentEntries" :key="player.id" 
               class="group flex flex-col md:flex-row bg-white border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
               style="clip-path: polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%);">
            
            <div class="relative w-full md:w-[35%] h-[160px] md:h-auto bg-neutral-950 overflow-hidden" style="clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%);">
              <img :src="player.avatar" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" />
            </div>

            <div class="p-6 flex flex-col flex-1 justify-center">
              <div class="flex items-center justify-between mb-2">
                 <h3 class="text-xl font-black italic uppercase tracking-tighter text-neutral-900 group-hover:text-orange-600 transition-colors">{{ player.name }}</h3>
                 <span class="text-[9px] font-black bg-neutral-100 px-2 py-0.5 rounded italic">LVL {{ player.level }}</span>
              </div>
              <div class="flex gap-4 mt-2 border-t border-neutral-50 pt-3">
                 <div class="flex flex-col">
                    <span class="text-[8px] font-black text-neutral-400 uppercase italic">Power Level</span>
                    <span class="text-xs font-black italic text-orange-600">{{ player.pl }}</span>
                 </div>
                 <div class="flex flex-col">
                    <span class="text-[8px] font-black text-neutral-400 uppercase italic">Status</span>
                    <span class="text-[10px] font-black text-green-500 italic">PRONTO</span>
                 </div>
              </div>
            </div>
            <div class="absolute bottom-0 left-0 h-1 w-0 bg-orange-600 group-hover:w-full transition-all duration-700"></div>
          </div>
        </div>

        <section class="mt-16">
           <h2 class="text-2xl font-black uppercase italic tracking-tighter mb-8 border-l-4 border-orange-600 pl-4">Regulamento de Sobrevivência</h2>
           <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="(rule, i) in [
                'Vida adicional: x 30', 'Custo Ataque: 25 Stamina', 'Rodada: Cada 1 Minuto',
                'Sem Pausas pós-início', 'Vence o Único Campeão', 'Inatividade: Eliminação'
              ]" :key="i" class="bg-neutral-50 p-6 border border-neutral-100 rounded-3xl group hover:bg-neutral-900 hover:text-white transition-all duration-300">
                <span class="text-orange-600 font-black text-xs block mb-2 italic">0{{ i + 1 }}.</span>
                <p class="text-[11px] font-bold uppercase italic leading-tight">{{ rule }}</p>
              </div>
           </div>
        </section>
      </div>

      <div class="lg:col-span-4 space-y-8">
        
        <div class="bg-neutral-50 p-8 rounded-[3rem] border border-neutral-100 shadow-inner sticky top-24">
           <div class="flex items-center justify-between mb-8">
              <h3 class="text-sm font-black uppercase italic tracking-widest text-neutral-900">Cronograma</h3>
              <i-solar-clock-circle-bold class="size-5 text-orange-600" />
           </div>

           <div class="space-y-4">
              <div v-for="s in schedules" :key="s.inscricao" 
                   :class="['flex items-center justify-between p-4 rounded-2xl transition-all border', 
                           s.status === 'AGORA' ? 'bg-orange-600 text-white border-orange-400 shadow-lg scale-105' : 'bg-white text-neutral-900 border-neutral-100 opacity-60']">
                 <div class="flex flex-col">
                    <span :class="['text-[8px] font-black uppercase italic', s.status === 'AGORA' ? 'text-white/60' : 'text-neutral-400']">Inscrição</span>
                    <span class="text-sm font-black italic">{{ s.inscricao }}</span>
                 </div>
                 <div class="text-center">
                    <span :class="['text-[9px] font-black px-2 py-0.5 rounded italic uppercase', s.status === 'AGORA' ? 'bg-white/20' : 'bg-neutral-100']">{{ s.status }}</span>
                 </div>
                 <div class="flex flex-col text-right">
                    <span :class="['text-[8px] font-black uppercase italic', s.status === 'AGORA' ? 'text-white/60' : 'text-orange-600']">Guerra</span>
                    <span class="text-sm font-black italic">{{ s.combate }}</span>
                 </div>
              </div>
           </div>

           <div class="mt-8 bg-neutral-900 p-6 rounded-[2rem] text-white">
              <span class="text-[8px] font-black text-orange-500 uppercase tracking-widest block mb-4 italic">Bônus de Eliminação (XP)</span>
              <div class="flex justify-between items-end">
                 <div class="text-center"><p class="text-[7px] text-neutral-500 uppercase font-black">Free</p><p class="text-xs font-black italic">150k</p></div>
                 <div class="text-center border-x border-white/10 px-4"><p class="text-[7px] text-neutral-500 uppercase font-black">VIP</p><p class="text-xs font-black italic text-orange-500">180k</p></div>
                 <div class="text-center"><p class="text-[7px] text-neutral-500 uppercase font-black">Over</p><p class="text-xs font-black italic">200k</p></div>
              </div>
           </div>
        </div>

      </div>
    </main>

    <footer class="mt-32 py-16 border-t border-neutral-100 flex flex-col items-center gap-4 opacity-30">
      <div class="flex items-center gap-3">
        <div class="size-8 bg-neutral-950 text-white rounded flex items-center justify-center font-black italic text-[10px]">Z</div>
        <p class="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.4em]">Arena Survival Protocol // 2026</p>
      </div>
    </footer>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Máscara de Degradê Sutil (Igual Sagas) */
.mask-gradient-b {
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}
</style>