<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthButton from '@/components/auth/AuthButton.vue'
import Card from '@/components/icon/Card.vue'

useHead({ title: 'Recompensas e Missões - Dragon Ball Z RPG' })

const auth = useAuthStore()
const router = useRouter()

// Controlo dos Separadores (Tabs)
const activeTab = ref<'login' | 'daily' | 'weekly' | 'monthly'>('login')

// ------------------------------------------------------------------------
// MOCKS: LOGIN DIÁRIO
// ------------------------------------------------------------------------
const loginStreak = ref(2) // Em que dia o jogador está
const hasClaimedToday = ref(false)

const loginRewards = ref([
  { day: 1, name: '500 Zeni', icon: 'i-solar:wad-of-money-bold', image: null },
  { day: 2, name: 'Semente dos Deuses', icon: 'i-solar:leaf-bold', image: null },
  { day: 3, name: '1000 EXP', icon: 'i-solar:star-bold', image: null },
  { day: 4, name: 'Cápsula Vazia', icon: 'i-solar:box-minimalistic-bold', image: null },
  { day: 5, name: '1500 Zeni', icon: 'i-solar:wad-of-money-bold', image: null },
  { day: 6, name: 'Água Sagrada', icon: 'i-solar:cup-star-bold', image: null },
  { day: 7, name: 'Aço Katchin', icon: 'i-solar:diamond-bold', image: null, isEpic: true },
])

const claimLoginReward = () => {
  hasClaimedToday.value = true
  alert('Recompensa do Dia 2 resgatada com sucesso!')
}

// ------------------------------------------------------------------------
// MOCKS: MISSÕES E TAREFAS
// ------------------------------------------------------------------------
interface Mission {
  id: number
  type: 'daily' | 'weekly' | 'monthly'
  title: string
  description: string
  progress: number
  max: number
  rewards: { zeni: number; exp: number }
  status: 'pending' | 'completed' | 'claimed'
  icon: string
}

const missions = ref<Mission[]>([
  // DIÁRIAS
  { id: 1, type: 'daily', title: 'Treino Matinal', description: 'Complete 3 trabalhos no Mapa Múndi.', progress: 1, max: 3, rewards: { zeni: 300, exp: 500 }, status: 'pending', icon: 'i-solar:map-point-bold' },
  { id: 2, type: 'daily', title: 'O Desafio', description: 'Vença 1 duelo na Arena 1v1.', progress: 1, max: 1, rewards: { zeni: 500, exp: 800 }, status: 'completed', icon: 'i-solar:target-bold' },
  { id: 3, type: 'daily', title: 'Guerreiro Saudável', description: 'Use 1 consumível de cura (Semente dos Deuses, etc).', progress: 1, max: 1, rewards: { zeni: 100, exp: 200 }, status: 'claimed', icon: 'i-solar:medical-kit-bold' },
  
  // SEMANAIS
  { id: 4, type: 'weekly', title: 'Trabalhador Árduo', description: 'Complete 25 trabalhos no Mapa Múndi.', progress: 12, max: 25, rewards: { zeni: 3000, exp: 5000 }, status: 'pending', icon: 'i-solar:suitcase-bold' },
  { id: 5, type: 'weekly', title: 'Sede de Sangue', description: 'Participe de 5 eventos da Arena Bloodbath.', progress: 5, max: 5, rewards: { zeni: 5000, exp: 7500 }, status: 'completed', icon: 'i-solar:danger-triangle-bold' },
  
  // MENSAIS
  { id: 6, type: 'monthly', title: 'Lenda Viva', description: 'Derrote 10 Chefes de Raid (Mundial).', progress: 2, max: 10, rewards: { zeni: 50000, exp: 100000 }, status: 'pending', icon: 'i-solar:crown-bold' },
])

// Filtra as missões com base na aba ativa
const filteredMissions = computed(() => {
  return missions.value.filter(m => m.type === activeTab.value)
})

const claimMission = (mission: Mission) => {
  mission.status = 'claimed'
  alert(`Recompensas da missão "${mission.title}" resgatadas!`)
}

// Utilitário para formatar a percentagem da barra de progresso
const getProgressPercent = (progress: number, max: number) => {
  return Math.min(100, Math.max(0, (progress / max) * 100))
}
</script>

<template>
  <div class="p-6 md:p-12 bg-neutral-50 min-h-screen">
    
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-200">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-yellow-100 text-yellow-600 rounded-2xl shadow-inner border border-yellow-200">
          <i-solar:gift-bold class="size-8" />
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 tracking-tight">Central de Recompensas</h1>
          <p class="text-neutral-500 mt-1">Registe o seu progresso diário e cumpra missões para enriquecer.</p>
        </div>
      </div>
      
      <button @click="router.back()" class="text-sm font-bold text-neutral-500 hover:text-yellow-600 transition-colors flex items-center gap-2 group">
        <i-solar:arrow-left-bold class="size-4 group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
      
      <nav class="space-y-3">
        <button 
          @click="activeTab = 'login'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left border',
            activeTab === 'login' ? 'bg-orange-100/60 shadow-sm border-orange-200 text-orange-700' : 'bg-transparent border-transparent text-neutral-600 hover:bg-neutral-100'
          ]"
        >
          <i-solar:calendar-date-bold :class="['size-5', activeTab === 'login' ? 'text-orange-600' : 'text-neutral-400']" />
          Registo de Login
          <span v-if="!hasClaimedToday" class="ml-auto flex size-2 rounded-full bg-red-500 animate-pulse"></span>
        </button>

        <button 
          @click="activeTab = 'daily'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left border',
            activeTab === 'daily' ? 'bg-orange-100/60 shadow-sm border-orange-200 text-orange-700' : 'bg-transparent border-transparent text-neutral-600 hover:bg-neutral-100'
          ]"
        >
          <i-solar:checklist-bold :class="['size-5', activeTab === 'daily' ? 'text-orange-600' : 'text-neutral-400']" />
          Missões Diárias
        </button>

        <button 
          @click="activeTab = 'weekly'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left border',
            activeTab === 'weekly' ? 'bg-orange-100/60 shadow-sm border-orange-200 text-orange-700' : 'bg-transparent border-transparent text-neutral-600 hover:bg-neutral-100'
          ]"
        >
          <i-solar:calendar-bold :class="['size-5', activeTab === 'weekly' ? 'text-orange-600' : 'text-neutral-400']" />
          Missões Semanais
        </button>

        <button 
          @click="activeTab = 'monthly'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left border',
            activeTab === 'monthly' ? 'bg-orange-100/60 shadow-sm border-orange-200 text-orange-700' : 'bg-transparent border-transparent text-neutral-600 hover:bg-neutral-100'
          ]"
        >
          <i-solar:crown-bold :class="['size-5', activeTab === 'monthly' ? 'text-orange-600' : 'text-neutral-400']" />
          Missões Mensais
        </button>
      </nav>

      <main class="min-h-[500px]">
        
        <div v-show="activeTab === 'login'" class="animate-fade-in space-y-6">
          <Card class="bg-white p-8 rounded-2xl border border-neutral-100 shadow-xl">
            <div class="mb-8 text-center md:text-left">
              <h2 class="text-2xl font-black text-neutral-900 tracking-tight">Login Cumulativo</h2>
              <p class="text-neutral-500 text-sm mt-1">Entre todos os dias para resgatar prêmios cada vez melhores. O ciclo reseta após 7 dias.</p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div 
                v-for="reward in loginRewards" 
                :key="reward.day"
                :class="[
                  'relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                  // Dia Passado (Já resgatado)
                  reward.day < loginStreak || (reward.day === loginStreak && hasClaimedToday) ? 'border-green-200 bg-green-50 opacity-60' : 
                  // Dia Atual (Para resgatar)
                  reward.day === loginStreak && !hasClaimedToday ? 'border-orange-500 bg-orange-50 shadow-[0_0_20px_rgba(249,115,22,0.2)] -translate-y-2' : 
                  // Dias Futuros (Bloqueados)
                  reward.isEpic ? 'border-yellow-400 bg-gradient-to-b from-yellow-50 to-orange-50 shadow-md' : 'border-neutral-200 bg-neutral-50 opacity-80'
                ]"
              >
                <span :class="[
                  'absolute -top-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-sm',
                  reward.day === loginStreak && !hasClaimedToday ? 'bg-orange-500 text-white' : 'bg-white border border-neutral-200 text-neutral-500'
                ]">
                  Dia {{ reward.day }}
                </span>
                
                <div class="mt-2 mb-3 size-12 flex items-center justify-center bg-white rounded-full shadow-inner border border-neutral-100 relative">
                  <i-solar:check-circle-bold v-if="reward.day < loginStreak || (reward.day === loginStreak && hasClaimedToday)" class="size-8 text-green-500" />
                  <component v-else :is="reward.icon" :class="['size-7', reward.isEpic ? 'text-yellow-500' : 'text-neutral-700']" />
                  
                  <div v-if="reward.day === loginStreak && !hasClaimedToday" class="absolute inset-0 border-2 border-orange-500 rounded-full animate-ping opacity-50"></div>
                </div>

                <span class="text-xs font-bold text-center leading-tight" :class="reward.isEpic ? 'text-yellow-700' : 'text-neutral-700'">
                  {{ reward.name }}
                </span>
              </div>
            </div>

            <div class="mt-10 flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-neutral-200 border-dashed">
              <p class="text-sm font-bold text-neutral-500 mb-4 uppercase tracking-widest">Recompensa de Hoje</p>
              <AuthButton 
                v-if="!hasClaimedToday" 
                @click="claimLoginReward"
                class="px-12 h-14 text-lg bg-orange-600 hover:bg-orange-700 text-white font-black shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              >
                Resgatar Prémio Diário
              </AuthButton>
              <AuthButton 
                v-else 
                disabled
                class="px-12 h-14 text-lg bg-green-100 text-green-700 font-black border-none opacity-100"
              >
                <i-solar:check-circle-bold class="size-6 mr-2" /> Resgatado
              </AuthButton>
            </div>
          </Card>
        </div>

        <div v-show="activeTab !== 'login'" class="animate-fade-in space-y-6">
          <Card class="bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 shadow-xl">
            <div class="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
              <div>
                <h2 class="text-2xl font-black text-neutral-900 tracking-tight capitalize">
                  Missões {{ activeTab === 'daily' ? 'Diárias' : activeTab === 'weekly' ? 'Semanais' : 'Mensais' }}
                </h2>
                <p class="text-neutral-500 text-sm mt-1">Cumpra os objetivos e resgate os seus prémios.</p>
              </div>
              <div class="bg-orange-50 text-orange-600 border border-orange-200 px-4 py-2 rounded-lg text-center shadow-sm">
                <span class="block text-xl font-black">{{ filteredMissions.filter(m => m.status === 'claimed').length }}/{{ filteredMissions.length }}</span>
                <span class="block text-[9px] font-bold uppercase tracking-widest">Completas</span>
              </div>
            </div>

            <div class="space-y-4">
              <div 
                v-for="mission in filteredMissions" 
                :key="mission.id"
                :class="[
                  'p-5 rounded-2xl border transition-all flex flex-col md:flex-row gap-6 md:items-center',
                  mission.status === 'completed' ? 'bg-green-50/50 border-green-300 shadow-md shadow-green-100' : 
                  mission.status === 'claimed' ? 'bg-neutral-50 border-neutral-200 opacity-60 grayscale' : 
                  'bg-white border-neutral-200 hover:border-orange-300 hover:shadow-md'
                ]"
              >
                <div :class="[
                  'size-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm border',
                  mission.status === 'completed' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                ]">
                  <component :is="mission.icon" class="size-7" />
                </div>

                <div class="flex-1">
                  <h3 class="text-lg font-bold text-neutral-900">{{ mission.title }}</h3>
                  <p class="text-xs text-neutral-500 mt-1 mb-3">{{ mission.description }}</p>
                  
                  <div class="w-full max-w-md">
                    <div class="flex justify-between items-end mb-1.5">
                      <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Progresso</span>
                      <span class="text-xs font-mono font-bold text-neutral-700">{{ mission.progress }} / {{ mission.max }}</span>
                    </div>
                    <div class="h-2.5 w-full bg-neutral-200 rounded-full overflow-hidden border border-neutral-300 shadow-inner">
                      <div 
                        :class="['h-full rounded-full transition-all duration-1000', mission.status === 'completed' || mission.status === 'claimed' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-orange-500']"
                        :style="`width: ${getProgressPercent(mission.progress, mission.max)}%`"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-200">
                  <div class="flex gap-2">
                    <span class="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                      <i-solar:wad-of-money-bold class="size-3" /> {{ mission.rewards.zeni }}
                    </span>
                    <span class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                      <i-solar:star-bold class="size-3" /> {{ mission.rewards.exp }}
                    </span>
                  </div>

                  <AuthButton 
                    v-if="mission.status === 'completed'"
                    @click="claimMission(mission)"
                    class="w-full md:w-32 bg-green-600 hover:bg-green-700 text-white font-black uppercase text-[10px] tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.4)] border-none"
                  >
                    Resgatar
                  </AuthButton>
                  
                  <AuthButton 
                    v-else-if="mission.status === 'claimed'"
                    disabled
                    class="w-full md:w-32 bg-transparent text-neutral-400 font-black uppercase text-[10px] tracking-widest border-2 border-neutral-200 hover:bg-transparent"
                  >
                    Resgatado
                  </AuthButton>

                  <AuthButton 
                    v-else
                    @click="router.push({ name: 'trabalho' })" 
                    class="w-full md:w-32 bg-neutral-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest"
                  >
                    Ir
                  </AuthButton>
                </div>

              </div>
            </div>

          </Card>
        </div>

      </main>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>