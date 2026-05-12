<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AuthButton from '@/components/auth/AuthButton.vue'
import Card from '@/components/icon/Card.vue'

// ------------------------------------------------------------------------
// ESTADO DO EVENTO GLOBAL
// ------------------------------------------------------------------------
// 'idle' = invisível | 'alert' = a tremer a tela | 'combat' = a lutar | 'victory' | 'defeat'
const invasionState = ref<'idle' | 'alert' | 'combat' | 'victory' | 'defeat'>('idle')

// ------------------------------------------------------------------------
// DADOS DO BOSS E JOGADOR
// ------------------------------------------------------------------------
const boss = ref({
  name: 'Imperador Freeza',
  maxHp: 1000000,
  currentHp: 1000000,
  imageUrl: new URL('@/assets/templates/frieza_boss.png', import.meta.url).href, // Substitui por PNG
  isAttacking: false,
  isTakingDamage: false
})

const player = ref({
  maxHp: 10000,
  currentHp: 10000
})

// ------------------------------------------------------------------------
// SISTEMA DE DIÁLOGO ANIMADO (TYPEWRITER)
// ------------------------------------------------------------------------
const bossFullMessage = ref('')
const displayedMessage = ref('')
let typewriterInterval: ReturnType<typeof setInterval> | null = null

const speak = (text: string) => {
  if (typewriterInterval) clearInterval(typewriterInterval)
  bossFullMessage.value = text
  displayedMessage.value = ''
  
  let i = 0
  typewriterInterval = setInterval(() => {
    if (i < text.length) {
      displayedMessage.value += text.charAt(i)
      i++
    } else {
      if (typewriterInterval) clearInterval(typewriterInterval)
    }
  }, 30) // Velocidade da fala
}

// ------------------------------------------------------------------------
// SISTEMA DE COMBATE E DROPS
// ------------------------------------------------------------------------
interface LogEntry { id: number; text: string; type: 'info' | 'damage' | 'heal' | 'drop' | 'boss' }
const combatLog = ref<LogEntry[]>([])
const logContainer = ref<HTMLElement | null>(null)
let logId = 0

const addLog = (text: string, type: LogEntry['type']) => {
  combatLog.value.push({ id: logId++, text, type })
  if (combatLog.value.length > 50) combatLog.value.shift()
  nextTick(() => {
    if (logContainer.value) logContainer.value.scrollTop = logContainer.value.scrollHeight
  })
}

const triggerRandomDrop = () => {
  const roll = Math.random()
  if (roll > 0.95) {
    addLog('✨ INCRÍVEL! Encontraste uma Esfera do Dragão (3 Estrelas) no meio da poeira!', 'drop')
  } else if (roll > 0.80) {
    addLog('💰 O boss deixou cair 5,000 Zeni!', 'drop')
  } else if (roll > 0.60) {
    addLog('⭐ Absorveste 500 EXP de Combate!', 'drop')
  }
}

// Ações do Jogador
const playerAttack = () => {
  if (invasionState.value !== 'combat') return

  const damage = Math.floor(Math.random() * 5000) + 2000 // Dano entre 2k e 7k
  boss.value.currentHp -= damage
  boss.value.isTakingDamage = true
  setTimeout(() => boss.value.isTakingDamage = false, 200)

  addLog(`Atacaste ${boss.value.name} causando ${damage} de dano!`, 'damage')
  triggerRandomDrop()

  if (boss.value.currentHp <= 0) {
    victory()
    return
  }

  // Boss Reage a cada X ataques
  if (Math.random() > 0.7) {
    speak('Inseto insolente! Achas que isso me magoa?')
    bossCounterAttack()
  }
}

const playerHeal = () => {
  const heal = 3000
  player.value.currentHp = Math.min(player.value.maxHp, player.value.currentHp + heal)
  addLog(`Usaste um item médico e recuperaste ${heal} HP.`, 'heal')
}

// Ações do Boss
const bossCounterAttack = () => {
  setTimeout(() => {
    if (invasionState.value !== 'combat') return
    
    boss.value.isAttacking = true
    setTimeout(() => boss.value.isAttacking = false, 300)

    const damage = Math.floor(Math.random() * 2000) + 1000
    player.value.currentHp -= damage
    addLog(`${boss.value.name} disparou um Raio da Morte! Sofreste ${damage} de dano!`, 'boss')
    
    // Animação de tremor no ecrã quando leva dano
    shakeScreen()

    if (player.value.currentHp <= 0) defeat()
  }, 1000)
}

// ------------------------------------------------------------------------
// CONTROLO DO EVENTO
// ------------------------------------------------------------------------
const isShaking = ref(false)

const shakeScreen = () => {
  isShaking.value = true
  setTimeout(() => isShaking.value = false, 800)
}

// Função para Iniciar a Invasão (Chamada por cronómetro ou admin)
const triggerInvasion = () => {
  invasionState.value = 'alert'
  boss.value.currentHp = boss.value.maxHp
  player.value.currentHp = player.value.maxHp
  combatLog.value = []
  shakeScreen()
  
  // Toca um som de sirene aqui (se tiveres)
}

const joinBattle = () => {
  invasionState.value = 'combat'
  speak('Hahaha! Então decidiste aparecer para morrer? O teu planeta agora pertence-me!')
  addLog('Entraste no Campo de Batalha Global!', 'info')
}

const ignoreInvasion = () => {
  invasionState.value = 'idle'
  // Penalidade opcional
}

const victory = () => {
  invasionState.value = 'victory'
  speak('Impossível... Como fui derrotado por um macaco?!')
}

const defeat = () => {
  invasionState.value = 'defeat'
  speak('Patético. Era só isto que a Terra tinha para oferecer?')
}

// Exposto para testes (Normalmente seria ativado por um WebSocket ou Timer)
defineExpose({ triggerInvasion })
</script>

<template>
  <div v-if="invasionState !== 'idle'" class="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center font-sans">
    
    <div :class="['absolute inset-0 pointer-events-auto transition-all duration-1000', invasionState === 'alert' ? 'bg-red-950/80 backdrop-blur-sm' : 'bg-neutral-950/95 backdrop-blur-md', isShaking ? 'animate-shake' : '']">
      
      <div v-if="invasionState === 'alert'" class="absolute inset-0 border-[16px] border-red-600/50 animate-pulse pointer-events-none shadow-[inset_0_0_100px_rgba(220,38,38,0.8)]"></div>

      <div v-if="invasionState === 'alert'" class="h-full flex items-center justify-center p-4">
        <Card class="bg-black border-2 border-red-600 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.6)] max-w-xl text-center relative overflow-hidden transform scale-100 animate-fade-in-up">
          <div class="absolute -top-10 -left-10 size-40 bg-red-600 blur-[80px] opacity-50"></div>
          
          <i-solar:danger-triangle-bold class="size-24 text-red-500 mx-auto mb-6 animate-pulse" />
          <h1 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 text-shadow-red">Alerta Global</h1>
          <h2 class="text-xl font-bold text-red-400 uppercase tracking-widest mb-6">Invasão em Andamento!</h2>
          
          <p class="text-neutral-300 text-sm md:text-base leading-relaxed mb-8">
            Atenção a todos os guerreiros! <strong class="text-white">{{ boss.name }}</strong> desceu na Terra. O exército não está a aguentar! Precisamos que todos os jogadores se unam para derrotá-lo. As recompensas de participação serão colossais.
          </p>

          <div class="flex flex-col md:flex-row gap-4 justify-center">
            <AuthButton @click="ignoreInvasion" variant="outline" class="border-red-900 text-red-500 hover:bg-red-950 px-8 py-4 font-black uppercase tracking-widest text-xs">
              Esconder-me
            </AuthButton>
            <AuthButton @click="joinBattle" class="bg-red-600 hover:bg-red-500 text-white px-8 py-4 font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.6)] text-xs border-none animate-bounce">
              <i-solar:sword-bold class="size-5 mr-2" /> Entrar no Combate
            </AuthButton>
          </div>
        </Card>
      </div>

      <div v-if="invasionState === 'combat'" class="h-full w-full max-w-6xl mx-auto flex flex-col p-4 md:p-8 relative animate-fade-in">
        
        <div class="w-full text-center mt-4 mb-8">
          <h2 class="text-3xl font-black text-red-500 uppercase tracking-widest drop-shadow-md flex items-center justify-center gap-3">
            <i-solar:danger-triangle-bold class="size-8" /> {{ boss.name }} <i-solar:danger-triangle-bold class="size-8" />
          </h2>
          <div class="mt-4 max-w-3xl mx-auto bg-neutral-900 p-1.5 rounded-full border-2 border-red-900/50 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <div class="h-6 w-full bg-neutral-800 rounded-full overflow-hidden relative">
              <div class="h-full bg-gradient-to-r from-red-800 to-red-500 transition-all duration-300 ease-out" :style="`width: ${(boss.currentHp / boss.maxHp) * 100}%`"></div>
              <span class="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white uppercase drop-shadow-md">
                {{ boss.currentHp.toLocaleString() }} / {{ boss.maxHp.toLocaleString() }} HP
              </span>
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
          
          <div :class="['relative size-64 md:size-96 transition-transform duration-100', boss.isTakingDamage ? 'scale-95 brightness-150 grayscale' : boss.isAttacking ? 'scale-110 translate-y-4' : 'animate-float']">
            <div class="absolute inset-0 bg-purple-600/30 blur-[50px] rounded-full animate-pulse"></div>
            <img :src="boss.imageUrl" alt="Boss" class="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
          </div>

          <div v-if="displayedMessage" class="w-full md:w-96 bg-neutral-900/90 backdrop-blur border border-purple-500/50 p-6 rounded-2xl rounded-bl-none shadow-[0_0_20px_rgba(168,85,247,0.2)] relative animate-fade-in-up">
            <div class="absolute -bottom-4 -left-4 size-8 bg-neutral-900 border-b border-l border-purple-500/50 rotate-45 z-0 hidden md:block"></div>
            <div class="flex items-center gap-2 mb-2 border-b border-neutral-700 pb-2">
              <i-solar:chat-round-bold class="text-purple-400 size-4" />
              <span class="text-xs font-black text-purple-400 uppercase tracking-widest">{{ boss.name }}</span>
            </div>
            <p class="text-white text-sm md:text-base font-bold leading-relaxed min-h-[60px]">{{ displayedMessage }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 mt-8">
          
          <Card class="bg-neutral-900 border border-neutral-700 p-6 rounded-3xl flex flex-col justify-between">
            <div class="mb-6 flex justify-between items-end">
              <div>
                <span class="block text-xs font-bold text-neutral-400 uppercase mb-1">A Tua Vida (HP)</span>
                <span class="text-2xl font-black text-green-400">{{ player.currentHp.toLocaleString() }}</span>
              </div>
              <div class="w-1/2 bg-neutral-800 h-3 rounded-full overflow-hidden border border-neutral-700">
                <div class="h-full bg-green-500 transition-all" :style="`width: ${(player.currentHp / player.maxHp) * 100}%`"></div>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button @click="playerAttack" class="bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] md:text-xs uppercase p-4 rounded-xl shadow-[0_4px_0_#9a3412] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center gap-2">
                <i-solar:sword-bold class="size-6" /> Atacar
              </button>
              <button class="bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] md:text-xs uppercase p-4 rounded-xl shadow-[0_4px_0_#1e3a8a] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center gap-2">
                <i-solar:bolt-bold class="size-6" /> Ki Blast
              </button>
              <button @click="playerHeal" class="bg-green-600 hover:bg-green-500 text-white font-black text-[10px] md:text-xs uppercase p-4 rounded-xl shadow-[0_4px_0_#166534] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center gap-2">
                <i-solar:medical-kit-bold class="size-6" /> Curar
              </button>
              <button class="bg-neutral-600 hover:bg-neutral-500 text-white font-black text-[10px] md:text-xs uppercase p-4 rounded-xl shadow-[0_4px_0_#404040] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center gap-2">
                <i-solar:shield-bold class="size-6" /> Defender
              </button>
            </div>
          </Card>

          <div class="bg-neutral-950 border border-neutral-800 rounded-3xl p-4 flex flex-col h-48 lg:h-full relative overflow-hidden">
            <h3 class="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 border-b border-neutral-800 pb-2 flex items-center gap-2">
              <i-solar:document-text-bold class="size-3" /> Relatório de Batalha
            </h3>
            <div ref="logContainer" class="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
              <div v-for="log in combatLog" :key="log.id" class="text-xs animate-fade-in font-mono leading-relaxed"
                   :class="{
                     'text-neutral-400': log.type === 'info',
                     'text-orange-400 font-bold': log.type === 'damage',
                     'text-red-500 font-black': log.type === 'boss',
                     'text-green-400': log.type === 'heal',
                     'text-yellow-400 font-black bg-yellow-900/30 px-2 py-1 rounded': log.type === 'drop'
                   }">
                > {{ log.text }}
              </div>
            </div>
            <div class="absolute top-10 left-0 right-0 h-4 bg-gradient-to-b from-neutral-950 to-transparent pointer-events-none"></div>
          </div>

        </div>
      </div>

      <div v-if="['victory', 'defeat'].includes(invasionState)" class="h-full flex items-center justify-center p-4">
        <Card class="bg-black border border-neutral-800 p-10 rounded-3xl text-center max-w-md w-full animate-fade-in-up">
          
          <div v-if="invasionState === 'victory'">
            <div class="size-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(234,179,8,0.5)]">
              <i-solar:crown-bold class="size-12 text-white" />
            </div>
            <h2 class="text-4xl font-black text-yellow-400 uppercase tracking-tighter mb-2">Vitória Épica!</h2>
            <p class="text-neutral-300 text-sm mb-6">O servidor uniu forças e derrotou {{ boss.name }}.</p>
            <div class="bg-neutral-900 p-4 rounded-xl mb-6">
              <span class="block text-[10px] text-neutral-500 uppercase font-bold mb-2">Recompensas Finais</span>
              <p class="text-yellow-400 font-black text-lg">+ 50,000 EXP</p>
              <p class="text-green-400 font-black text-lg">+ 100,000 Zeni</p>
            </div>
          </div>

          <div v-else>
            <div class="size-24 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(127,29,29,0.5)]">
              <i-solar:skull-bold class="size-12 text-red-500" />
            </div>
            <h2 class="text-4xl font-black text-red-500 uppercase tracking-tighter mb-2">Foste Esmagado</h2>
            <p class="text-neutral-300 text-sm mb-6">A tua luz apagou-se. {{ boss.name }} destruiu a Terra.</p>
          </div>

          <AuthButton @click="invasionState = 'idle'" class="w-full bg-neutral-800 text-white font-black uppercase tracking-widest border-none hover:bg-neutral-700">
            Voltar ao Jogo
          </AuthButton>
        </Card>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Animações UI Globais */
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
.animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Efeito de Tremor da Invasão (Screen Shake) */
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 2px, 0); }
  20%, 80% { transform: translate3d(4px, -3px, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 4px, 0); }
  40%, 60% { transform: translate3d(6px, -4px, 0); }
}

/* Flutuação Suave do Boss */
.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

/* Sombra Dramática no Texto Vermelho */
.text-shadow-red {
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.8);
}

/* Scrollbar do Log */
.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background-color: #3f3f46; border-radius: 10px; }
</style>