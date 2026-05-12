<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

useHead({ title: 'Ranking Global - Top 30 Guerreiros | Dragon Ball Z RPG' })
const router = useRouter()

// --- ESTADOS ---
const activeCategory = ref('level')

// --- SIMULAÇÃO TOP 30 (Gerando dados para o Shiro Cobra) ---
const rankings = ref(Array.from({ length: 30 }, (_, i) => ({
  pos: i + 1,
  name: i === 0 ? 'Shiro Cobra' : `Guerreiro_Z${i + 1}`,
  group: i % 2 === 0 ? 'Z-Warriors' : 'Elite Saiyan',
  lvl: 50 - i,
  xp: `${(10 - i * 0.2).toFixed(1)}M`,
  v: 150 - i * 3,
  d: 5 + i,
  medals: 20 - i,
  str: 500 - i * 5,
  vel: 400 - i * 2,
  def: 450 - i * 3,
  work: 90 - i,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 40}`
})))

const sendFriendRequest = (name: string) => {
  alert(`Pedido de amizade enviado para ${name}!`)
}

const useScouter = (name: string) => {
  alert(`Scouter: Analisando bio-dados de ${name}... Localização: Setor Norte.`)
}

const goBack = () => router.push({ name: 'battles' })
</script>

<template>
  <div class="animate-fade-in bg-white min-h-screen pb-20 font-sans text-neutral-900 overflow-x-hidden">
    
    <header class="bg-[#09090b] pt-20 pb-16 border-b-8 border-red-600 shadow-2xl relative">
      <img src="https://images.alphacoders.com/135/1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>
      
      <div class="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="text-center md:text-left">
          <button @click="goBack" class="text-white/40 hover:text-red-500 font-black text-[9px] uppercase italic tracking-[0.4em] mb-4 transition-colors flex items-center gap-2">
            ← RETORNAR À CENTRAL
          </button>
          <h1 class="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
            RANKING TOP <span class="text-red-600">30</span>
          </h1>
          <p class="text-neutral-500 font-black italic uppercase tracking-[0.3em] text-[10px]">DATABASE DE ELITE ATUALIZADA</p>
        </div>

        <div class="flex flex-wrap justify-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 italic font-black text-[10px] uppercase">
          <button @click="activeCategory = 'level'" :class="['px-6 py-2 rounded-xl transition-all', activeCategory === 'level' ? 'bg-red-600 text-white' : 'text-neutral-500']">Nível / XP</button>
          <button @click="activeCategory = 'pvp'" :class="['px-6 py-2 rounded-xl transition-all', activeCategory === 'pvp' ? 'bg-red-600 text-white' : 'text-neutral-500']">PVP</button>
          <button @click="activeCategory = 'stats'" :class="['px-6 py-2 rounded-xl transition-all', activeCategory === 'stats' ? 'bg-red-600 text-white' : 'text-neutral-500']">Atributos</button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 mt-12">
      
      <div class="overflow-x-auto bg-white rounded-[2.5rem] border border-neutral-100 shadow-2xl">
        <table class="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr class="bg-neutral-900 text-white italic uppercase text-[9px] font-black tracking-widest">
              <th class="py-6 px-8 text-center">#</th>
              <th class="py-6 px-4">Guerreiro / Grupo</th>
              <th class="py-6 px-4 text-center">Nível / XP</th>
              <th class="py-6 px-4 text-center">PvP (V/D)</th>
              <th class="py-6 px-4 text-center">Medalhas</th>
              <th class="py-6 px-4 text-center">F / V / D</th>
              <th class="py-6 px-4 text-center">Trabalho</th>
              <th class="py-6 px-8 text-right">Ações Scouter</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-50">
            <tr v-for="user in rankings" :key="user.pos" 
                :class="['group transition-colors hover:bg-neutral-50', user.name === 'Shiro Cobra' ? 'bg-red-50/50' : '']">
              
              <td class="py-6 px-8 text-center font-black italic text-xl" :class="user.pos <= 3 ? 'text-red-600' : 'text-neutral-300'">
                {{ user.pos }}
              </td>

              <td class="py-6 px-4">
                <div class="flex items-center gap-4">
                  <div class="relative size-12 bg-neutral-900 rounded-xl overflow-hidden shadow-lg border-2" :class="user.pos === 1 ? 'border-yellow-500' : 'border-neutral-200'">
                    <img :src="user.avatar" class="size-full object-cover" />
                  </div>
                  <div class="flex flex-col">
                    <span class="font-black italic uppercase text-sm leading-none group-hover:text-red-600 transition-colors">{{ user.name }}</span>
                    <span class="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter mt-1">{{ user.group }}</span>
                  </div>
                </div>
              </td>

              <td class="py-6 px-4 text-center font-black italic">
                <div class="text-sm leading-none">{{ user.lvl }}</div>
                <div class="text-[8px] text-neutral-400 uppercase mt-0.5">{{ user.xp }}</div>
              </td>

              <td class="py-6 px-4 text-center font-black italic text-[10px]">
                <span class="text-green-600">{{ user.v }}V</span> <span class="text-neutral-200 mx-1">/</span> <span class="text-red-500">{{ user.d }}D</span>
              </td>

              <td class="py-6 px-4 text-center">
                <span class="bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full font-black italic text-[9px]">★ {{ user.medals }}</span>
              </td>

              <td class="py-6 px-4 text-center">
                <div class="flex items-center justify-center gap-3 text-[10px] font-black italic">
                  <span>{{ user.str }}</span><span class="text-neutral-200">|</span><span>{{ user.vel }}</span><span class="text-neutral-200">|</span><span>{{ user.def }}</span>
                </div>
              </td>

              <td class="py-6 px-4 text-center">
                <span class="text-[9px] font-black italic text-blue-600">{{ user.work }} PO</span>
              </td>

              <td class="py-6 px-8 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button @click="sendFriendRequest(user.name)" title="Amizade" class="p-2 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg transition-all">
                      <i-solar:users-group-rounded-bold class="size-4" />
                   </button>
                   <button @click="useScouter(user.name)" title="Scouter" class="p-2 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-red-600 transition-all">
                      <i-solar:radar-bold class="size-4" />
                   </button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

    </main>

    <footer class="mt-20 py-10 border-t border-neutral-100 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.4em] italic leading-none">
       Sincronização de Scouter Ativa // Ranking de Elite
    </footer>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Efeito Hover na Tabela */
tbody tr { cursor: default; }
</style>