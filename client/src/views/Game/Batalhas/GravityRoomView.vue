<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

useHead({ title: 'Sala de Gravidade - Treinamento Intensivo | Dragon Ball Z RPG' })
const router = useRouter()

// --- ESTADOS DO JOGADOR ---
const playerStamina = ref(100)
const playerKi = ref(100)
const xpGained = ref(0)
const isTraining = ref(false)

// --- CONFIGURAÇÃO DE GRAVIDADE ---
const selectedG = ref(10)
const gravityLevels = [
  { value: 10, multiplier: 1.5, cost: 5 },
  { value: 50, multiplier: 3.0, cost: 15 },
  { value: 100, multiplier: 5.5, cost: 30 },
  { value: 300, multiplier: 10.0, cost: 60 },
  { value: 500, multiplier: 25.0, cost: 120 },
]

const currentLevel = computed(() => gravityLevels.find(l => l.value === selectedG.value)!)

// --- LÓGICA DE TREINO ---
let trainingInterval: any = null

const toggleTraining = () => {
  if (isTraining.value) {
    stopTraining()
    return
  }
  
  if (playerStamina.value < currentLevel.value.cost) return
  
  isTraining.value = true
  trainingInterval = setInterval(() => {
    if (playerStamina.value >= currentLevel.value.cost) {
      playerStamina.value -= currentLevel.value.cost / 10
      playerKi.value = Math.max(0, playerKi.value - 1)
      xpGained.value += 100 * currentLevel.value.multiplier
    } else {
      stopTraining()
    }
  }, 1000)
}

const stopTraining = () => {
  isTraining.value = false
  clearInterval(trainingInterval)
}

const goBack = () => {
  stopTraining()
  router.push({ name: 'game-home' })
}

onUnmounted(() => stopTraining())
</script>

<template>
  <div class="animate-fade-in bg-white min-h-screen pb-20 font-sans text-neutral-900 overflow-x-hidden">
    
    <header class="bg-[#0c0c0e] pt-16 pb-20 border-b-8 border-cyan-500 shadow-2xl relative">
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <button @click="goBack" class="text-white/40 hover:text-cyan-500 font-black text-[9px] uppercase italic tracking-[0.3em] mb-4 transition-colors">← ABANDONAR TREINO</button>
        <h1 class="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
          GRAVITY <span class="text-cyan-500">ROOM</span>
        </h1>
        
        <div class="max-w-3xl bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
          <h2 class="text-cyan-500 font-black italic uppercase text-[10px] tracking-[0.4em] mb-4">Protocolo de Superação Física</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-[9px] font-bold text-white/60 uppercase italic">
            <p class="border-l border-cyan-500/30 pl-3">● Multiplicador: x{{ currentLevel.multiplier }}</p>
            <p class="border-l border-cyan-500/30 pl-3">● Estresse: {{ currentLevel.cost }} STA/s</p>
            <p class="border-l border-cyan-500/30 pl-3">● Recuperação: Senzu Only</p>
            <p class="border-l border-cyan-500/30 pl-3">● Status: {{ isTraining ? 'ATIVO' : 'IDLE' }}</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <div class="lg:col-span-8 space-y-12">
        <div :class="['relative p-12 rounded-[4rem] border-b-8 transition-all duration-700 shadow-2xl overflow-hidden', 
                      isTraining ? 'bg-cyan-950 border-cyan-400 scale-[1.01]' : 'bg-neutral-900 border-neutral-800']">
          
          <div v-if="isTraining" class="absolute inset-0 bg-[radial-gradient(circle_at_center,_#22d3ee22_0%,_transparent_70%)] animate-pulse"></div>
          
          <div class="relative z-10 text-center">
            <div class="mb-12">
               <span class="text-cyan-500 font-black italic uppercase text-xs tracking-widest block mb-2">Simulação de Gravidade</span>
               <h3 class="text-white text-7xl font-black italic leading-none">{{ selectedG }}<span class="text-3xl text-cyan-500">G</span></h3>
            </div>

            <div class="relative size-48 mx-auto mb-12">
              <div :class="['absolute inset-0 rounded-full border-4 border-dashed border-cyan-500/30', isTraining ? 'animate-spin-slow' : '']"></div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Artemis" 
                   :class="['size-full object-cover rounded-full p-4 transition-all duration-500', isTraining ? 'brightness-125 scale-110 blur-[0.5px]' : 'grayscale opacity-50']" />
            </div>

            <div class="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 inline-block min-w-[200px]">
               <span class="text-[9px] font-black text-neutral-500 uppercase italic block mb-1">XP ACUMULADO</span>
               <span class="text-2xl font-black text-white italic tracking-tighter">{{ Math.floor(xpGained).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="px-4">
           <h4 class="text-xl font-black uppercase italic tracking-tighter mb-6 border-l-4 border-cyan-500 pl-4">Funcionamento da Sala</h4>
           <p class="text-neutral-500 italic text-sm leading-relaxed mb-4">
             Aumentar a gravidade permite que suas células se adaptem a condições extremas. 
             Quanto maior a carga gravitacional, maior será a <strong>Experiência ($XP$)</strong> recebida por segundo, porém o consumo de Estamina aumenta exponencialmente.
           </p>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-black uppercase italic text-neutral-400">
             <div class="bg-neutral-50 p-4 border border-neutral-100">● Treinar acima de 300G requer nível 150+.</div>
             <div class="bg-neutral-50 p-4 border border-neutral-100">● O treino é interrompido se a Estamina chegar a zero.</div>
           </div>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-8">
        <div class="bg-neutral-50 p-10 rounded-[3rem] border border-neutral-100 shadow-inner">
           <h3 class="text-sm font-black uppercase italic text-neutral-900 mb-8 tracking-widest">Ajustes de Sistema</h3>
           
           <div class="space-y-6 mb-12">
              <div v-for="level in gravityLevels" :key="level.value" 
                   @click="!isTraining && (selectedG = level.value)"
                   :class="['p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center', 
                           selectedG === level.value ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg' : 'bg-white border-neutral-100 opacity-60 hover:opacity-100']">
                 <span class="font-black italic">{{ level.value }}G</span>
                 <span class="text-[9px] font-black uppercase">{{ level.multiplier }}x XP</span>
              </div>
           </div>

           <div class="space-y-4 mb-10">
              <div>
                <div class="flex justify-between text-[9px] font-black uppercase italic mb-1">
                   <span>Estamina</span>
                   <span class="text-cyan-600">{{ Math.floor(playerStamina) }}%</span>
                </div>
                <div class="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                   <div class="h-full bg-cyan-500 transition-all duration-300" :style="{ width: playerStamina + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-[9px] font-black uppercase italic mb-1">
                   <span>Ki Focus</span>
                   <span class="text-purple-600">{{ Math.floor(playerKi) }}%</span>
                </div>
                <div class="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                   <div class="h-full bg-purple-500 transition-all duration-300" :style="{ width: playerKi + '%' }"></div>
                </div>
              </div>
           </div>

           <button @click="toggleTraining" 
                   :class="['w-full py-6 rounded-3xl font-black italic uppercase tracking-widest text-xl transition-all shadow-2xl', 
                           isTraining ? 'bg-red-600 text-white animate-pulse' : 'bg-neutral-950 text-white hover:bg-cyan-600']">
             {{ isTraining ? 'ABORTAR' : 'INICIAR TREINO' }}
           </button>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
.animate-spin-slow { animation: spin 10s linear infinite; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>