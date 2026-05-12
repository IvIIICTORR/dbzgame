<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthButton from '@/components/auth/AuthButton.vue'
import Card from '@/components/icon/Card.vue'

useHead({ title: 'Mapa Múndi - Trabalhos e Raids' })

const auth = useAuthStore()
const router = useRouter()

// ------------------------------------------------------------------------
// MOCKS: SISTEMA DE MAPA E TRABALHOS (DRAGON BALL THEMED PNGs)
// ------------------------------------------------------------------------

interface Job {
  id: string
  title: string
  description: string
  duration: number // em segundos
  rewards: { zeni: number; exp: number }
  imageUrl: string // Alterado para imageUrl (.png)
}

interface Location {
  id: string
  name: string
  type: string
  x: string // Posição Horizontal no Mapa (%)
  y: string // Posição Vertical no Mapa (%)
  color: string
  imageUrl: string // Alterado para imageUrl (.png tático)
  jobs: Job[]
}

// Marcadores do Mapa (Usando PNGs de DBZ)
// Nota: Substitui as URLs .png pelos teus ficheiros reais na pasta @/assets/templates/
const locations = ref<Location[]>([
  {
    id: 'freeza',
    name: 'Freeza',
    type: 'Cidade Oeste',
    x: '25%', y: '35%',
    color: 'blue',
    imageUrl: new URL('@/assets/templates/freeza.png', import.meta.url).href, // Placeholder
    jobs: [
      { id: 'cc_1', title: 'Testar Nova Nave', description: 'Ajudar a Bulma nos testes de gravidade da nova nave espacial.', duration: 60, rewards: { zeni: 500, exp: 150 }, imageUrl: new URL('@/assets/templates/spaceship.png', import.meta.url).href },
      { id: 'cc_2', title: 'Organizar Arquivos', description: 'Um trabalho chato, mas o Sr. Briefs paga bem.', duration: 30, rewards: { zeni: 200, exp: 50 }, imageUrl: new URL('@/assets/templates/folder.png', import.meta.url).href }
    ]
  },
  {
    id: 'vegeta',
    name: 'Vegeta',
    type: 'Oceano Sul',
    x: '75%', y: '70%',
    color: 'orange',
    imageUrl: new URL('@/assets/templates/vegeta.png', import.meta.url).href, // Placeholder
    jobs: [
      { id: 'kh_1', title: 'Entregar Leite', description: 'O treino matinal clássico. Corre pela ilha a entregar garrafas de leite.', duration: 120, rewards: { zeni: 300, exp: 400 }, imageUrl: new URL('@/assets/templates/milk_bottle.png', import.meta.url).href },
      { id: 'kh_2', title: 'Ajudar a Tartaruga', description: 'Encontrar cogumelos raros na floresta para o Mestre Kame.', duration: 45, rewards: { zeni: 100, exp: 200 }, imageUrl: new URL('@/assets/templates/mushroom.png', import.meta.url).href }
    ]
  },
  {
    id: 'cell',
    name: 'Cell',
    type: 'Zona Selvagem',
    x: '55%', y: '25%',
    color: 'stone',
    imageUrl: new URL('@/assets/templates/cell.png', import.meta.url).href, // Placeholder
    jobs: [
      { id: 'wl_1', title: 'Caçar Dinossauro', description: 'Uma raid rápida contra um T-Rex gigante que está a aterrorizar a zona.', duration: 300, rewards: { zeni: 1200, exp: 800 }, imageUrl: new URL('@/assets/templates/dinosaur_bone.png', import.meta.url).href },
      { id: 'wl_2', title: 'Procurar Minérios', description: 'Escavar o terreno em busca de metais valiosos.', duration: 90, rewards: { zeni: 600, exp: 100 }, imageUrl: new URL('@/assets/templates/minerals.png', import.meta.url).href }
    ]
  },
  {
    id: 'piccolo',
    name: 'Piccolo',
    type: 'Santuário de Kami',
    x: '40%', y: '15%',
    color: 'green',
    imageUrl: new URL('@/assets/templates/piccolo.png', import.meta.url).href, // Placeholder
    jobs: [
      { id: 'lk_1', title: 'Limpar a Plataforma', description: 'O Sr. Popo precisa de ajuda com a manutenção do piso mágico.', duration: 180, rewards: { zeni: 0, exp: 1000 }, imageUrl: new URL('@/assets/templates/broom.png', import.meta.url).href }
    ]
  }
])

const selectedLocation = ref<Location | null>(locations.value[0])

// ------------------------------------------------------------------------
// ESTADO DE TRABALHO ATIVO (TIMER)
// ------------------------------------------------------------------------
const activeJob = ref<{ job: Job; location: Location; timeRemaining: number; totalTime: number } | null>(null)
let timerInterval: ReturnType<typeof setInterval> | null = null

const startJob = (job: Job, location: Location) => {
  if (activeJob.value) return // Já está num trabalho
  
  activeJob.value = {
    job,
    location,
    timeRemaining: job.duration,
    totalTime: job.duration
  }

  timerInterval = setInterval(() => {
    if (activeJob.value && activeJob.value.timeRemaining > 0) {
      activeJob.value.timeRemaining--
    } else {
      finishJob()
    }
  }, 1000)
}

const finishJob = () => {
  if (timerInterval) clearInterval(timerInterval)
  
  // Chamada à API para adicionar Zeni e EXP...
  alert(`Trabalho Concluído! Ganhaste ${activeJob.value?.job.rewards.zeni} Zeni e ${activeJob.value?.job.rewards.exp} EXP.`)
  
  activeJob.value = null
}

const cancelJob = () => {
  if (timerInterval) clearInterval(timerInterval)
  activeJob.value = null
}

// Formatar o tempo (ex: 90s -> 01:30)
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const progressPercentage = computed(() => {
  if (!activeJob.value) return 0
  const passed = activeJob.value.totalTime - activeJob.value.timeRemaining
  return (passed / activeJob.value.totalTime) * 100
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

// Mapeamento de cores para o Tailwind (Néon Táctico)
const getColorClasses = (color: string) => {
  const map: Record<string, string> = {
    blue: 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]',
    orange: 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]',
    stone: 'border-stone-500 shadow-[0_0_15px_rgba(120,113,108,0.6)]',
    green: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]',
  }
  return map[color] || map.blue
}
</script>

<template>
  <div class="p-6 md:p-12 bg-neutral-50 min-h-screen selection:bg-orange-200">
    
    <header class="flex items-center justify-between mb-10 pb-6 border-b border-neutral-200">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-orange-100 text-orange-600 rounded-2xl shadow-inner border border-orange-200">
          <i-solar:map-point-bold class="size-8" />
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 tracking-tight">Mapa Múndi</h1>
          <p class="text-neutral-500 mt-1">Viaje pelo mundo, realize trabalhos e ganhe Zeni.</p>
        </div>
      </div>
      
      <button @click="router.back()" class="text-sm font-bold text-neutral-500 hover:text-orange-600 transition-colors flex items-center gap-2 group">
        <i-solar:arrow-left-bold class="size-4 group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-7 space-y-6">
        <Card class="bg-white p-2 rounded-2xl border border-neutral-100 shadow-2xl overflow-hidden relative">
          
          <div class="relative w-full aspect-video bg-neutral-950 rounded-xl overflow-hidden shadow-inner bg-[url('https://areajugones.sport.es/wp-content/uploads/2019/10/kakarot-mapa-1560x880.jpg.webp')] bg-cover bg-center">
            
            <div v-if="activeJob" class="absolute inset-0 bg-neutral-950/60 backdrop-blur-[2px] z-10 transition-all duration-500"></div>

            <button
              v-for="loc in locations"
              :key="loc.id"
              @click="!activeJob ? selectedLocation = loc : null"
              :disabled="!!activeJob"
              class="absolute z-20 -translate-x-1/2 -translate-y-1/2 group outline-none"
              :style="{ left: loc.x, top: loc.y }"
            >
              <div 
                v-if="selectedLocation?.id === loc.id && !activeJob"
                class="absolute inset-0 rounded-full bg-red-500 blur-md animate-pulse opacity-80"
              ></div>
              
              <div 
                :class="[
                  'relative size-16 rounded-full flex items-center justify-center border-4 transition-all duration-300',
                  getColorClasses(loc.color),
                  selectedLocation?.id === loc.id ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'border-neutral-700 hover:scale-105 hover:border-neutral-200',
                  activeJob ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer bg-neutral-900/40 p-1.5'
                ]"
              >
                <img :src="loc.imageUrl" :alt="loc.name" class="w-full h-full object-contain" />
              </div>

              <div class="absolute top-18 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-max bg-neutral-950/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-neutral-700">
                {{ loc.name }}
                <div class="absolute -top-1 left-1/2 -translate-x-1/2 size-2 bg-neutral-950rotate-45"></div>
              </div>
            </button>
            
          </div>
          
          <div class="px-4 py-3 bg-neutral-50 border-t border-neutral-100 text-xs font-bold text-neutral-400 flex justify-between uppercase tracking-widest mt-2 rounded-b-xl">
            <span>Mundo: Planeta Terra (Wasteland)</span>
            <span><i-solar:satellite-bold class="inline size-4 mr-1 text-neutral-500" /> GPS Táctico Z Ativo</span>
          </div>

        </Card>
      </div>

      <div class="lg:col-span-5 flex flex-col h-full">
        
        <Card class="bg-white rounded-2xl border border-neutral-100 shadow-xl flex flex-col h-full relative overflow-hidden">
          
          <div v-if="!activeJob" class="flex flex-col h-full p-6 animate-fade-in">
            <template v-if="selectedLocation">
              <div class="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-100">
                <div :class="['size-16 rounded-2xl border-2 p-1.5 flex items-center justify-center shrink-0 bg-neutral-900', getColorClasses(selectedLocation.color).split(' ')[0]]">
                  <img :src="selectedLocation.imageUrl" class="size-full object-contain" />
                </div>
                <div>
                  <h2 class="text-2xl font-black text-neutral-900 tracking-tight leading-tight">{{ selectedLocation.name }}</h2>
                  <span class="text-xs font-bold text-neutral-400 uppercase tracking-widest">{{ selectedLocation.type }}</span>
                </div>
              </div>

              <div class="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-neutral-200">
                <div 
                  v-for="job in selectedLocation.jobs" 
                  :key="job.id"
                  class="bg-white border border-neutral-100 hover:border-orange-200 rounded-2xl p-5 transition-all hover:shadow-lg group"
                >
                  <div class="flex items-start gap-4">
                    <div class="mt-0.5 size-14 bg-neutral-50 border border-neutral-200 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-inner group-hover:border-orange-100 transition-colors">
                      <img :src="job.imageUrl" class="size-full object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-lg font-bold text-neutral-900">{{ job.title }}</h3>
                      <p class="text-xs text-neutral-500 mt-1 leading-relaxed">{{ job.description }}</p>
                      
                      <div class="mt-5 flex flex-wrap gap-2 pt-3 border-t border-neutral-100">
                        <span class="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                          <i-solar:wad-of-money-bold class="size-3.5" /> {{ job.rewards.zeni }} Zeni
                        </span>
                        <span class="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                          <i-solar:star-bold class="size-3.5" /> {{ job.rewards.exp }} EXP
                        </span>
                        <span class="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ml-auto">
                          <i-solar:clock-circle-bold class="size-3.5" /> {{ formatTime(job.duration) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <AuthButton 
                    @click="startJob(job, selectedLocation)"
                    class="w-full mt-5 h-12 bg-neutral-900 hover:bg-black text-white font-black uppercase tracking-widest text-sm shadow-md"
                  >
                    Iniciar Trabalho
                  </AuthButton>
                </div>
              </div>
            </template>
            
            <template v-else>
              <div class="flex flex-col items-center justify-center h-full text-center opacity-50 p-10">
                <i-solar:map-bold class="size-16 text-neutral-400 mb-5" />
                <p class="text-sm font-bold text-neutral-500">Selecione uma localização no mapa tático<br/>para ver os trabalhos disponíveis.</p>
              </div>
            </template>
          </div>

          <div v-else class="flex flex-col h-full p-8 items-center justify-center text-center animate-fade-in bg-orange-50/30 relative">
            
            <div class="relative size-28 bg-white border-4 border-orange-100 rounded-full p-4 flex items-center justify-center shadow-xl mb-6">
              <img :src="activeJob.job.imageUrl" class="size-full object-contain animate-pulse" />
            </div>

            <h2 class="text-2xl font-black text-neutral-900 tracking-tight mb-2">{{ activeJob.job.title }}</h2>
            <p class="text-sm font-bold text-orange-600 uppercase tracking-widest mb-10">{{ activeJob.location.name }}</p>

            <div class="w-full max-w-sm mb-6 bg-white p-4 rounded-2xl border border-neutral-100 shadow-md">
              <div class="flex justify-between items-end mb-3">
                <span class="text-xs font-bold text-neutral-500 uppercase tracking-widest">A Sincronizar Ki...</span>
                <span class="text-3xl font-mono font-black text-neutral-900">{{ formatTime(activeJob.timeRemaining) }}</span>
              </div>
              <div class="h-4 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shadow-inner">
                <div 
                  class="h-full bg-orange-500 relative transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                  :style="`width: ${progressPercentage}%`"
                >
                </div>
              </div>
            </div>

            <div class="flex justify-center gap-4 text-xs font-bold mb-12 bg-white px-5 py-3 rounded-xl border border-neutral-200 shadow-sm w-full max-w-sm">
              <span class="flex items-center gap-1 text-yellow-600"><i-solar:wad-of-money-bold class="size-4" /> {{ activeJob.job.rewards.zeni }} Zeni</span>
              <span class="flex items-center gap-1 text-blue-600"><i-solar:star-bold class="size-4" /> {{ activeJob.job.rewards.exp }} EXP</span>
            </div>

            <button @click="cancelJob" class="text-xs font-bold text-neutral-400 hover:text-red-600 transition-colors uppercase tracking-widest underline decoration-neutral-300 hover:decoration-red-500 underline-offset-4">
              Cancelar Trabalho Z (Perder Progresso)
            </button>
          </div>

        </Card>

      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar styling for the job list to keep it matching the clear style */
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #f1f1f1;
  border-radius: 10px;
}
.group:hover .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #fbd38d; /* orange-300 */
}
</style>