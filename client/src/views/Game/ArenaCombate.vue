<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthButton from '@/components/auth/AuthButton.vue'
import Card from '@/components/icon/Card.vue'
import Avatar from '@/components/icon/Avatar.vue'
import OpponentCard from '@/components/icon/OpponentCard.vue' // Novo Componente

useHead({ title: 'Arena em Combate - Dragon Ball Z RPG' })

const auth = useAuthStore()
const router = useRouter()

// Estado do Combate
const transformation = ref('Guerreiro Saiyajin')

// Atributos do Jogador
const stats = reactive({
  hp: { current: 4500, max: 5000 },
  ki: { current: 1200, max: 2000 },
  st: { current: 80, max: 100 },
})

// Cooldown Global (Mock Visual)
const isCooldownActive = ref(false)

// Mocks de Oponentes Detalhados (Para seleção e visualização de status)
const opponents = ref([
  { id: 1, name: 'Goku_Black', level: 85, race: 'Kaioshin', transformation: 'Base', currentHp: 4500, maxHp: 4500, currentKi: 2000, maxKi: 2000, currentSt: 100, maxSt: 100, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Black', isDead: false },
  { id: 2, name: 'Vegeta_Prince', level: 82, race: 'Saiyajin', transformation: 'Base', currentHp: 4200, maxHp: 4200, currentKi: 1900, maxKi: 1900, currentSt: 95, maxSt: 95, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vegeta', isDead: false },
  { id: 3, name: 'Hit_Assassin', level: 88, race: 'Universo 6', transformation: 'Base', currentHp: 4800, maxHp: 4800, currentKi: 2100, maxKi: 2100, currentSt: 105, maxSt: 105, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hit', isDead: false },
  // Oponente Morto (Mock)
  { id: 4, name: 'Jiren_Pride', level: 95, race: 'Pride Trooper', transformation: 'Base', currentHp: 0, maxHp: 5000, currentKi: 0, maxKi: 2000, currentSt: 0, maxSt: 100, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jiren', isDead: true },
])

const selectedOpponentId = ref<number | null>(null)

// Registo de Combate (Mock)
const battleLog = ref([
  { id: 1, text: 'A Batalha na Arena começou!', type: 'info' },
  { id: 2, text: 'Jiren Pride usou Meditação.', type: 'neutral' },
  { id: 3, text: 'Você causou 450 de dano em Vegeta_Prince.', type: 'damage_caused' },
  { id: 4, text: 'Jiren Pride foi derrotado!', type: 'death' }, // Mock de Morte
])

const triggerCooldown = () => {
  if (isCooldownActive.value) return
  isCooldownActive.value = true
  setTimeout(() => isCooldownActive.value = false, 3000)
}
</script>

<template>
  <div class="p-6 md:p-12 bg-neutral-50 min-h-screen">
    
    <header class="flex items-center justify-between mb-10 pb-6 border-b border-neutral-200">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-red-100 text-red-600 rounded-2xl shadow-inner">
          <i-solar:danger-triangle-bold class="size-8 text-red-700" />
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 tracking-tight">Arena Bloodbath - Em Combate</h1>
          <p class="text-neutral-500 mt-1">Concentre o Ki. Ataque ou defenda-se no seu turno.</p>
        </div>
      </div>
      
      <AuthButton @click="router.push({ name: 'arena' })" variant="outline" class="h-10 px-6 text-sm font-bold border-neutral-300 text-neutral-700">
        Abandonar Batalha
      </AuthButton>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
      
      <div class="space-y-8">
        
        <Card class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xl flex items-center gap-6 relative overflow-hidden">
          <Avatar :src="auth.user?.avatarUrl" :alt="auth.user?.username" class="relative z-10 size-20 border-4 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
          
          <div class="relative z-10 flex-1">
            <h2 class="text-2xl font-black text-neutral-900 tracking-tight">{{ auth.user?.username || 'Artemis' }} <span class="text-sm font-normal text-neutral-400">Nvl 85</span></h2>
            <p class="text-sm font-bold text-yellow-500 uppercase tracking-widest">{{ transformation }}</p>
            
            <div class="space-y-3 mt-4">
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-red-600 w-6">HP</span>
                <div class="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200"><div class="h-full bg-red-500 transition-all shadow-[0_0_8px_rgba(239,68,68,0.6)]" :style="`width: ${(stats.hp.current / stats.hp.max) * 100}%`"></div></div>
                <span class="text-xs font-mono font-bold text-neutral-600 w-16 text-right">{{ stats.hp.current }}/{{ stats.hp.max }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-blue-600 w-6">KI</span>
                <div class="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200"><div class="h-full bg-blue-500 transition-all shadow-[0_0_8px_rgba(59,130,246,0.6)]" :style="`width: ${(stats.ki.current / stats.ki.max) * 100}%`"></div></div>
                <span class="text-xs font-mono font-bold text-neutral-600 w-16 text-right">{{ stats.ki.current }}/{{ stats.ki.max }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-yellow-600 w-6">ST</span>
                <div class="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200"><div class="h-full bg-yellow-500 transition-all shadow-[0_0_8px_rgba(234,179,8,0.6)]" :style="`width: ${(stats.st.current / stats.st.max) * 100}%`"></div></div>
                <span class="text-xs font-mono font-bold text-neutral-600 w-16 text-right">{{ stats.st.current }}/{{ stats.st.max }}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xl relative">
          <div v-if="isCooldownActive" class="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl">
            <span class="text-4xl font-black text-white font-mono animate-pulse">03</span>
            <span class="text-xs text-neutral-300 uppercase tracking-widest mt-1">A recuperar Ki</span>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-neutral-500 uppercase tracking-widest">Painel de Ações</h3>
            </div>

            <div class="grid grid-cols-2 gap-3 pb-6 border-b border-neutral-100">
              <AuthButton @click="triggerCooldown" class="p-3 h-auto bg-neutral-900 text-white font-bold flex flex-col items-center gap-1 group">
                <i-solar:bomb-emoji-bold class="size-6 text-orange-500 group-hover:scale-110 transition-transform" />
                <span class="text-xs uppercase">Ataque Básico</span>
              </AuthButton>
              <AuthButton @click="triggerCooldown" class="p-3 h-auto bg-neutral-900 text-white font-bold flex flex-col items-center gap-1 group">
                <i-solar:bolt-circle-bold class="size-6 text-orange-500 group-hover:scale-110 transition-transform" />
                <span class="text-xs uppercase">Kamehameha</span>
              </AuthButton>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <AuthButton @click="triggerCooldown" variant="outline" class="p-3 h-auto border-neutral-300 text-neutral-700 font-bold flex flex-col items-center gap-1 group">
                <i-solar:leaf-bold class="size-6 text-green-600 group-hover:scale-110 transition-transform" />
                <span class="text-xs uppercase">Semente dos Deuses</span>
              </AuthButton>
              <AuthButton @click="triggerCooldown" variant="outline" class="p-3 h-auto border-neutral-300 text-neutral-700 font-bold flex flex-col items-center gap-1 group">
                <i-solar:box-minimalistic-bold class="size-6 text-neutral-500 group-hover:scale-110 transition-transform" />
                <span class="text-xs uppercase">Cápsula</span>
              </AuthButton>
            </div>
          </div>
        </Card>

      </div>

      <div class="grid grid-cols-1 gap-8 h-full">
        
        <div class="space-y-4 h-max">
          <h3 class="text-sm font-bold text-neutral-500 uppercase tracking-widest">Selecionar Alvo (Todos x Todos)</h3>
          
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 animate-fade-in">
            <OpponentCard 
              v-for="op in opponents" :key="op.id" 
              :opponent="op"
              :isSelected="selectedOpponentId === op.id"
              @select="(id) => selectedOpponentId = id"
            />
          </div>
        </div>
        
        <Card class="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col min-h-[300px] lg:min-h-0 lg:flex-1 overflow-hidden shadow-2xl">
          <div class="p-4 border-b border-neutral-800 bg-neutral-950/50">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <i-solar:list-bold class="text-neutral-500" /> Registo de Combate (Log)
            </h3>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs leading-relaxed scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
            <div v-for="log in battleLog" :key="log.id" :class="[
              'p-2 rounded border-l-4 transition-colors',
              log.type === 'damage_received' ? 'bg-red-950/30 border-red-500 text-red-300' :
              log.type === 'damage_caused' ? 'bg-green-950/20 border-green-500 text-green-300' :
              log.type === 'heal' ? 'bg-green-100 border-green-500 text-green-900' :
              log.type === 'transformation' ? 'bg-yellow-100 border-yellow-500 text-yellow-900 font-bold' :
              log.type === 'death' ? 'bg-neutral-800 border-neutral-600 text-red-500 font-bold' : // Estilo de Morte
              'bg-neutral-800 border-neutral-600 text-neutral-300'
            ]">
              {{ log.text }}
            </div>
          </div>
        </Card>

      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.35s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar styling for the battle log to keep it matching the dark log */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #404040;
  border-radius: 20px;
}
</style>