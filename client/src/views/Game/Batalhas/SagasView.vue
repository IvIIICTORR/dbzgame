<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { client } from '@/api/client.gen'

useHead({ title: 'Sagas - Campanha | Dragon Ball Z RPG' })
const router = useRouter()

const goBack = () => {
  router.push({ name: 'battles' }) 
}

interface SagaItem {
  id: string
  title: string
  episode: string
  desc: string
  difficulty: string
  reward: string
  image: string | null
  rank: string
  status: 'CONCLUÍDO' | 'EM PROGRESSO' | 'BLOQUEADO'
  unlocked: boolean
}

const sagas = ref<SagaItem[]>([])
const isLoading = ref(true)

const syncPercentage = computed(() => {
  if (!sagas.value || sagas.value.length === 0) return 0
  const completed = sagas.value.filter(s => s.status === 'CONCLUÍDO').length
  return Math.round((completed / sagas.value.length) * 100)
})

const fetchSagas = async () => {
  try {
    isLoading.value = true
    const response = await client.get({ url: '/sagas' })
    if (Array.isArray(response.data)) {
      sagas.value = response.data as SagaItem[]
    }
  } catch (err) {
    console.error('Erro ao carregar sagas:', err)
  } finally {
    isLoading.value = false
  }
}

const enterSaga = (saga: SagaItem) => {
  if (!saga.unlocked) return
  router.push({ name: 'sagas_luta', params: { sagaId: saga.id } })
}

onMounted(() => {
  fetchSagas()
})
</script>

<template>
  <div class="animate-fade-in bg-white min-h-screen pb-20 text-neutral-900 font-sans">
    
    <header class="relative w-full h-[350px] bg-[#09090b] overflow-hidden flex flex-col justify-end pb-12 border-b border-red-600/30 shadow-2xl">
      <img src="https://images.alphacoders.com/135/1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full px-6">
        <button @click="goBack" class="flex items-center gap-2 text-white font-black uppercase text-[10px] bg-white/5 px-5 py-2.5 rounded-full hover:bg-red-600 transition-all italic border border-white/10 mb-8 backdrop-blur-md w-fit shadow-xl">
          <i-solar:arrow-left-outline class="size-4" /> Abortar Missão
        </button>
        
        <div class="flex items-center gap-3 mb-2">
            <span class="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 italic uppercase">Modo História</span>
            <span class="text-neutral-500 text-[9px] font-black uppercase tracking-[0.3em]">Sincronização: {{ syncPercentage }}%</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
          SAGAS <span class="text-red-600">LENDÁRIAS</span>
        </h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 mt-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div v-for="saga in sagas" :key="saga.id" 
             @click="enterSaga(saga)"
             :class="['group flex flex-col md:flex-row md:h-[280px] bg-white border border-neutral-100 shadow-sm transition-all duration-500 overflow-hidden relative',
                      saga.unlocked ? 'hover:shadow-2xl cursor-pointer' : 'opacity-60 grayscale cursor-not-allowed']">
          
          <div class="relative w-full md:w-[40%] shrink-0 h-[250px] md:h-full overflow-hidden" style="clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);">
            <img :src="saga.image" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div v-if="saga.rank !== '-'" class="absolute top-4 left-4 z-20 size-10 bg-neutral-950 border border-red-600 flex items-center justify-center font-black text-xl italic text-red-600 shadow-xl">
              {{ saga.rank }}
            </div>
            <div v-if="!saga.unlocked" class="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                <i-solar:lock-bold class="size-12 text-white/50" />
            </div>
          </div>

          <div class="p-8 flex flex-col flex-1 justify-center">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-black text-red-600 uppercase italic tracking-widest">{{ saga.episode }}</span>
              <span class="text-[9px] font-black text-neutral-400 uppercase italic">{{ saga.difficulty }}</span>
            </div>
            <h2 class="text-2xl font-black text-neutral-900 uppercase italic tracking-tighter leading-tight mb-4 group-hover:text-red-600 transition-colors">
              {{ saga.title }}
            </h2>
            <p class="text-xs text-neutral-500 leading-relaxed font-medium mb-6 italic line-clamp-2">
              {{ saga.desc }}
            </p>

            <div class="mt-auto flex items-center justify-between pt-6 border-t border-neutral-50">
              <div class="flex flex-col">
                  <span class="text-[8px] font-black text-neutral-400 uppercase italic">Recompensa:</span>
                  <span class="text-[10px] font-bold text-neutral-700 uppercase italic">{{ saga.reward }}</span>
              </div>
              <div v-if="saga.unlocked" class="flex items-center gap-3">
                  <span class="text-[10px] font-black text-neutral-900 uppercase italic group-hover:text-red-600 transition-colors">Entrar na Saga</span>
                  <div class="size-8 bg-neutral-950 rounded-full flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                    <i-solar:play-bold class="size-3" />
                  </div>
              </div>
            </div>
          </div>
          <div :class="['absolute bottom-0 left-0 h-1.5 transition-all duration-700', saga.status === 'CONCLUÍDO' ? 'bg-green-500 w-full' : 'bg-red-600 w-0 group-hover:w-full']"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>