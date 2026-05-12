<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthButton from '@/components/auth/AuthButton.vue'
import Card from '@/components/icon/Card.vue'
import Avatar from '@/components/icon/Avatar.vue'

useHead({ title: 'Treino Especial - Dragon Ball Z RPG' })

const auth = useAuthStore()
const router = useRouter()

// ------------------------------------------------------------------------
// SISTEMA DE PROGRESSÃO DO JOGADOR
// ------------------------------------------------------------------------
const playerLevel = ref(85)
const currentExp = ref(1200)
const expToNextLevel = ref(2000)
const hasLeveledUp = ref(false)

const expPercentage = computed(() => Math.min(100, (currentExp.value / expToNextLevel.value) * 100))

const gainExp = (amount: number) => {
  currentExp.value += amount
  if (currentExp.value >= expToNextLevel.value) {
    // Level Up!
    playerLevel.value++
    currentExp.value -= expToNextLevel.value
    expToNextLevel.value = Math.floor(expToNextLevel.value * 1.5)
    hasLeveledUp.value = true
    
    // Animação de Level Up (desaparece após 3s)
    setTimeout(() => { hasLeveledUp.value = false }, 3000)
  }
}

// ------------------------------------------------------------------------
// MESTRES E DIÁLOGO
// ------------------------------------------------------------------------
interface Master {
  id: string
  name: string
  title: string
  description: string
  color: string
  avatar: string
  introMessage: string
  successMessage: string
  failMessage: string
  expReward: number
}

const masters: Master[] = [
  {
    id: 'kame',
    name: 'Mestre Kame',
    title: 'Treino de Força Bruta',
    description: 'Empurre a pedra gigante. Requer cliques rápidos (Spam Click).',
    color: 'orange',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kame&backgroundColor=ffedd5',
    introMessage: 'Hehehe! Queres ficar mais forte? Vamos ver se tens força para empurrar aquela pedra gigante em 10 segundos!',
    successMessage: 'Muito bem, garoto! Tens futuro nas artes marciais da Escola Tartaruga.',
    failMessage: 'Faltou-te força nas pernas! Deves andar a beber muito pouco leite.',
    expReward: 400
  },
  {
    id: 'kaioh',
    name: 'Senhor Kaioh',
    title: 'Treino de Reflexos',
    description: 'Apanhe o Bubbles. Requer velocidade e precisão no rato.',
    color: 'blue',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kaioh&backgroundColor=dbeafe',
    introMessage: 'Bem-vindo ao meu planeta! A gravidade aqui é 10x maior. Tenta apanhar o meu macaco, o Bubbles!',
    successMessage: 'Impressionante! Os teus reflexos adaptaram-se perfeitamente à gravidade pesada.',
    failMessage: 'Lento demais! Até uma tartaruga apanhava o Bubbles antes de ti. Conta-me uma piada e tenta outra vez.',
    expReward: 600
  }
]

const activeMaster = ref<Master | null>(null)
const chatMessages = ref<{ speaker: 'npc' | 'system'; text: string }[]>([
  { speaker: 'system', text: 'Selecione um mestre para iniciar o treino especial.' }
])

const setMaster = (master: Master) => {
  activeMaster.value = master
  trainingPhase.value = 'briefing'
  chatMessages.value = [
    { speaker: 'npc', text: master.introMessage }
  ]
}

// ------------------------------------------------------------------------
// LÓGICA DOS MINI-JOGOS
// ------------------------------------------------------------------------
const trainingPhase = ref<'select' | 'briefing' | 'playing' | 'result'>('select')
let gameTimer: ReturnType<typeof setInterval> | null = null
const timeLeft = ref(0)
const gameResult = ref<'win' | 'lose' | null>(null)

// --- JOGO 1: KAME (Spam Click) ---
const kameClicks = ref(0)
const kameGoal = 40

const startKameGame = () => {
  trainingPhase.value = 'playing'
  kameClicks.value = 0
  timeLeft.value = 10
  gameResult.value = null
  chatMessages.value.push({ speaker: 'npc', text: 'VAI! EMPURRA COM TUDO!' })

  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame(kameClicks.value >= kameGoal ? 'win' : 'lose')
    }
  }, 1000)
}

const handleKameClick = () => {
  if (trainingPhase.value !== 'playing') return
  kameClicks.value++
  if (kameClicks.value >= kameGoal) {
    endGame('win')
  }
}

// --- JOGO 2: KAIOH (Catch the Target) ---
const kaiohScore = ref(0)
const kaiohGoal = 10
const targetPos = ref({ top: '50%', left: '50%' })
let targetInterval: ReturnType<typeof setInterval> | null = null

const startKaiohGame = () => {
  trainingPhase.value = 'playing'
  kaiohScore.value = 0
  timeLeft.value = 15
  gameResult.value = null
  chatMessages.value.push({ speaker: 'npc', text: 'Apanha-o! Ele é muito rápido!' })
  moveTarget()

  gameTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame(kaiohScore.value >= kaiohGoal ? 'win' : 'lose')
    }
  }, 1000)

  // O alvo muda de lugar a cada 0.9s se não for clicado
  targetInterval = setInterval(moveTarget, 900)
}

const moveTarget = () => {
  const top = Math.floor(Math.random() * 80) + 10 // 10% a 90%
  const left = Math.floor(Math.random() * 80) + 10 // 10% a 90%
  targetPos.value = { top: `${top}%`, left: `${left}%` }
}

const handleKaiohClick = () => {
  if (trainingPhase.value !== 'playing') return
  kaiohScore.value++
  if (kaiohScore.value >= kaiohGoal) {
    endGame('win')
  } else {
    moveTarget()
    // Reset ao intervalo de fuga para recompensar o jogador rápido
    if (targetInterval) clearInterval(targetInterval)
    targetInterval = setInterval(moveTarget, 900)
  }
}

// --- GERAL ---
const endGame = (result: 'win' | 'lose') => {
  if (gameTimer) clearInterval(gameTimer)
  if (targetInterval) clearInterval(targetInterval)
  
  trainingPhase.value = 'result'
  gameResult.value = result

  if (result === 'win' && activeMaster.value) {
    chatMessages.value.push({ speaker: 'npc', text: activeMaster.value.successMessage })
    chatMessages.value.push({ speaker: 'system', text: `Recebeste ${activeMaster.value.expReward} EXP!` })
    gainExp(activeMaster.value.expReward)
  } else if (activeMaster.value) {
    chatMessages.value.push({ speaker: 'npc', text: activeMaster.value.failMessage })
  }
}

const cancelTraining = () => {
  if (gameTimer) clearInterval(gameTimer)
  if (targetInterval) clearInterval(targetInterval)
  activeMaster.value = null
  trainingPhase.value = 'select'
  chatMessages.value = [{ speaker: 'system', text: 'Treino cancelado. Escolha um novo mestre.' }]
}

onUnmounted(() => {
  if (gameTimer) clearInterval(gameTimer)
  if (targetInterval) clearInterval(targetInterval)
})
</script>

<template>
  <div class="p-6 md:p-12 bg-neutral-50 min-h-screen relative overflow-hidden">
    
    <div v-if="hasLeveledUp" class="fixed inset-0 z-50 flex items-center justify-center bg-yellow-500/20 backdrop-blur-sm animate-fade-in pointer-events-none">
      <div class="text-center scale-150 animate-bounce">
        <h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_5px_15px_rgba(234,179,8,0.8)]">LEVEL UP!</h1>
        <p class="text-2xl font-black text-white drop-shadow-md">Chegaste ao Nível {{ playerLevel }}</p>
      </div>
    </div>

    <header class="flex items-center justify-between mb-10 pb-6 border-b border-neutral-200">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-inner border border-blue-200">
          <i-solar:dumbbell-large-bold class="size-8" />
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-neutral-900 tracking-tight">Centro de Treino</h1>
          <p class="text-neutral-500 mt-1">Supera os teus limites através de testes práticos com os Mestres.</p>
        </div>
      </div>
      <button @click="router.back()" class="text-sm font-bold text-neutral-500 hover:text-blue-600 transition-colors flex items-center gap-2">
        <i-solar:arrow-left-bold class="size-4" /> Voltar
      </button>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8">
      
      <div class="flex flex-col gap-6 h-[600px]">
        
        <Card class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xl shrink-0 relative overflow-hidden">
          <div v-if="hasLeveledUp" class="absolute inset-0 bg-yellow-400/20 animate-pulse"></div>
          
          <div class="flex items-center gap-4 mb-4">
            <Avatar :src="auth.user?.avatarUrl" :alt="auth.user?.username" class="size-14 border-2 border-neutral-200" />
            <div class="flex-1">
              <h2 class="text-lg font-black text-neutral-900 leading-none">{{ auth.user?.username || 'Artemis' }}</h2>
              <span class="text-xs font-bold text-blue-600 uppercase tracking-widest">Nível {{ playerLevel }}</span>
            </div>
          </div>
          
          <div>
            <div class="flex justify-between items-end mb-1">
              <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Experiência</span>
              <span class="text-xs font-mono font-bold text-neutral-700">{{ currentExp }} / {{ expToNextLevel }}</span>
            </div>
            <div class="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shadow-inner">
              <div 
                class="h-full bg-blue-500 transition-all duration-500"
                :style="`width: ${expPercentage}%`"
              ></div>
            </div>
          </div>
        </Card>

        <Card class="bg-white rounded-2xl border border-neutral-100 shadow-xl flex-1 flex flex-col overflow-hidden">
          <div class="p-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between shrink-0">
            <h3 class="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <i-solar:chat-round-dots-bold class="text-neutral-400" /> Comunicação
            </h3>
            <span v-if="activeMaster" :class="`text-xs font-bold text-${activeMaster.color}-600 uppercase tracking-widest`">
              {{ activeMaster.name }}
            </span>
          </div>

          <div class="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col justify-end bg-neutral-50/50">
            <div 
              v-for="(msg, idx) in chatMessages" 
              :key="idx"
              class="animate-fade-in flex"
              :class="msg.speaker === 'system' ? 'justify-center' : 'justify-start'"
            >
              <span v-if="msg.speaker === 'system'" class="inline-block bg-neutral-200/60 text-neutral-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {{ msg.text }}
              </span>
              
              <div v-else class="flex gap-3 max-w-[90%]">
                <Avatar v-if="activeMaster" :src="activeMaster.avatar" class="size-8 rounded-full border border-neutral-200 shrink-0 shadow-sm bg-white" />
                <div class="bg-white border border-neutral-200 text-sm text-neutral-700 p-3 rounded-2xl rounded-tl-sm shadow-sm leading-relaxed">
                  {{ msg.text }}
                </div>
              </div>
            </div>
          </div>
        </Card>

      </div>

      <div class="h-[600px] flex flex-col">
        <Card class="bg-white p-2 rounded-2xl border border-neutral-100 shadow-xl flex-1 flex flex-col overflow-hidden relative">
          
          <div v-if="trainingPhase === 'select'" class="flex-1 p-8 flex flex-col animate-fade-in">
            <div class="mb-8 text-center">
              <h2 class="text-2xl font-black text-neutral-900 tracking-tight">Selecione o seu Mestre</h2>
              <p class="text-neutral-500 text-sm mt-1">Cada mestre possui um teste único com recompensas diferentes.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button 
                v-for="master in masters" 
                :key="master.id"
                @click="setMaster(master)"
                :class="`p-6 rounded-2xl border-2 border-neutral-100 bg-neutral-50 hover:bg-white hover:border-${master.color}-300 hover:shadow-xl transition-all text-left group flex flex-col items-center text-center`"
              >
                <div :class="`size-24 rounded-full bg-${master.color}-50 flex items-center justify-center mb-4 border-4 border-white shadow-md group-hover:scale-105 transition-transform`">
                  <img :src="master.avatar" class="size-20 rounded-full" />
                </div>
                <h3 class="text-xl font-black text-neutral-900">{{ master.name }}</h3>
                <span :class="`text-[10px] font-bold text-${master.color}-600 uppercase tracking-widest mb-3`">{{ master.title }}</span>
                <p class="text-xs text-neutral-500 leading-relaxed">{{ master.description }}</p>
                <div class="mt-auto pt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <i-solar:star-bold /> {{ master.expReward }} EXP Garantida
                </div>
              </button>
            </div>
          </div>

          <div v-if="activeMaster && trainingPhase !== 'select'" class="flex-1 flex flex-col animate-fade-in bg-neutral-900 rounded-xl overflow-hidden relative shadow-inner">
            
            <div class="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <div class="flex items-center gap-3">
                <button @click="cancelTraining" class="pointer-events-auto size-8 bg-white/10 hover:bg-red-500/80 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors border border-white/20">
                  <i-solar:close-circle-bold class="size-5" />
                </button>
                <span class="text-white font-bold uppercase tracking-widest text-xs drop-shadow-md">Treino de {{ activeMaster.name }}</span>
              </div>
              
              <div v-if="trainingPhase === 'playing'" class="flex items-center gap-2 bg-neutral-950/80 border border-neutral-700 px-4 py-1.5 rounded-full backdrop-blur-sm">
                <i-solar:clock-circle-bold class="size-4 text-orange-500" />
                <span class="font-mono text-xl font-black" :class="timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-white'">00:{{ timeLeft.toString().padStart(2, '0') }}</span>
              </div>
            </div>

            <div v-if="trainingPhase === 'briefing'" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-8 text-center">
              <h2 class="text-4xl font-black text-white mb-2 uppercase drop-shadow-lg">{{ activeMaster.title }}</h2>
              <p class="text-neutral-300 mb-8 max-w-md">{{ activeMaster.description }}</p>
              
              <AuthButton @click="activeMaster.id === 'kame' ? startKameGame() : startKaiohGame()" class="h-14 px-12 bg-white text-neutral-900 hover:bg-neutral-200 font-black uppercase tracking-widest text-lg border-none shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                Iniciar Treino Prático
              </AuthButton>
            </div>

            <div v-if="trainingPhase === 'result'" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-8 text-center">
              <template v-if="gameResult === 'win'">
                <div class="size-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.6)] mb-6 border-4 border-white animate-bounce">
                  <i-solar:check-circle-bold class="size-12 text-white" />
                </div>
                <h2 class="text-4xl font-black text-white mb-2 uppercase drop-shadow-lg text-green-400">Sucesso!</h2>
                <p class="text-neutral-300 mb-8 font-mono">+{{ activeMaster.expReward }} EXP</p>
              </template>
              <template v-else>
                <div class="size-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] mb-6 border-4 border-white">
                  <i-solar:close-circle-bold class="size-12 text-white" />
                </div>
                <h2 class="text-4xl font-black text-white mb-2 uppercase drop-shadow-lg text-red-500">Fracasso</h2>
                <p class="text-neutral-300 mb-8">Não atingiste o objetivo a tempo.</p>
              </template>

              <div class="flex gap-4">
                <AuthButton @click="cancelTraining" variant="outline" class="h-12 border-neutral-600 text-neutral-300 hover:bg-neutral-800">
                  Voltar
                </AuthButton>
                <AuthButton @click="activeMaster.id === 'kame' ? startKameGame() : startKaiohGame()" class="h-12 bg-blue-600 text-white border-none shadow-lg shadow-blue-600/30">
                  Tentar Novamente
                </AuthButton>
              </div>
            </div>

            <div v-if="activeMaster.id === 'kame' && trainingPhase === 'playing'" class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518182170546-076616fdacac?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center">
              <div class="absolute inset-0 bg-neutral-950/70"></div>
              
              <div class="relative z-10 h-full flex flex-col items-center justify-center p-6">
                
                <div class="w-full max-w-md mb-12">
                  <div class="flex justify-between items-end mb-2">
                    <span class="text-xs font-bold text-neutral-400 uppercase tracking-widest">Força Aplicada</span>
                    <span class="text-xl font-mono font-black text-orange-500">{{ kameClicks }} / {{ kameGoal }}</span>
                  </div>
                  <div class="h-8 w-full bg-neutral-900 rounded-full overflow-hidden border-2 border-neutral-700 shadow-inner p-1">
                    <div 
                      class="h-full bg-gradient-to-r from-orange-600 to-yellow-500 rounded-full transition-all duration-100 shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                      :style="`width: ${Math.min(100, (kameClicks / kameGoal) * 100)}%`"
                    ></div>
                  </div>
                </div>

                <button 
                  @click="handleKameClick"
                  class="relative size-40 bg-neutral-800 border-4 border-neutral-600 rounded-full shadow-[0_10px_0_#404040,0_15px_20px_rgba(0,0,0,0.5)] active:shadow-[0_0_0_#404040,0_0_0_rgba(0,0,0,0.5)] active:translate-y-[10px] transition-all flex items-center justify-center group outline-none"
                >
                  <i-solar:hand-stars-bold class="size-16 text-neutral-400 group-active:text-orange-500 transition-colors" />
                  <div class="absolute inset-0 rounded-full bg-orange-500 opacity-0 group-active:opacity-20 transition-opacity"></div>
                </button>
                <p class="mt-8 text-neutral-400 font-bold uppercase tracking-widest animate-pulse">Clica o mais rápido possível!</p>

              </div>
            </div>

            <div v-if="activeMaster.id === 'kaioh' && trainingPhase === 'playing'" class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center">
              <div class="absolute inset-0 bg-blue-950/80"></div>
              
              <div class="relative z-10 h-full w-full">
                <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900/80 backdrop-blur border border-neutral-700 px-6 py-2 rounded-full text-center">
                  <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Alvos Apanhados</span>
                  <span class="text-2xl font-mono font-black text-blue-400">{{ kaiohScore }} / {{ kaiohGoal }}</span>
                </div>

                <button
                  @click.stop="handleKaiohClick"
                  class="absolute size-16 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)] flex items-center justify-center outline-none active:scale-90 transition-transform hover:bg-blue-400"
                  :style="{ top: targetPos.top, left: targetPos.left, transform: 'translate(-50%, -50%)' }"
                >
                  <i-solar:ghost-bold class="size-8 text-white animate-bounce" />
                </button>
              </div>
            </div>

          </div>
        </Card>
      </div>

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

/* Scrollbar do Chat */
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: #d4d4d8; border-radius: 10px; }
</style>