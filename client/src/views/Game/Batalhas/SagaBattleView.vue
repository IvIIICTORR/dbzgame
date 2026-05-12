<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const exitSaga = () => router.push({ name: 'sagas' })

// --- ESTADOS DO JOGO ---
const timer = ref(99)
const isGameOver = ref(false)
const screenEffect = ref<'' | 'flash' | 'shake'>('')

// --- STATUS DOS PERSONAGENS ---
const gokuHp = ref(100)
const gokuKi = ref(5)
const gokuStamina = ref(100)
const gokuLevel = 50

const jirenHp = ref(100)
const jirenStamina = ref(100)
const jirenLevel = 99

// --- ESTADOS DE FORMA E BUFFS ---
const playerForm = ref('Base')
const kaiokenLevel = ref(0) 

const currentFormText = computed(() => {
  let text = playerForm.value
  if (kaiokenLevel.value > 0) {
    text += ` (Kaioken x${kaiokenLevel.value})`
  }
  return text
})

// Classes dinâmicas para a etiqueta de transformação
const formBadgeClasses = computed(() => {
  if (kaiokenLevel.value > 0 && playerForm.value !== 'Base') {
    // Super Saiyajin + Kaioken
    return 'text-red-700 border-red-500 bg-gradient-to-r from-yellow-100 to-red-100 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
  }
  if (kaiokenLevel.value > 0) {
    // Apenas Kaioken
    return 'text-red-600 border-red-400 bg-red-50 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
  }
  if (playerForm.value === 'Super Saiyajin 2') {
    // SSJ 2 (Brilho mais intenso e cor mais quente)
    return 'text-yellow-600 border-yellow-500 bg-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.8)]'
  }
  if (playerForm.value === 'Super Saiyajin') {
    // SSJ 1
    return 'text-yellow-600 border-yellow-400 bg-yellow-50 shadow-[0_0_8px_rgba(250,204,21,0.5)]'
  }
  // Base
  return 'text-neutral-500 border-neutral-300 bg-white/50'
})

// --- SISTEMA DE TURNOS ---
const currentTurn = ref<'player' | 'enemy'>('player')
const turnTimeLeft = ref(120) // 120 segundos = 2 minutos
let turnInterval: ReturnType<typeof setInterval>

const startTurnTimer = () => {
  clearInterval(turnInterval)
  turnTimeLeft.value = 120
  turnInterval = setInterval(() => {
    if (isGameOver.value) return
    
    turnTimeLeft.value--
    
    // Regra de roubo de turno por inatividade
    if (turnTimeLeft.value <= 0) {
      if (currentTurn.value === 'player') {
        addToLog('Goku hesitou por muito tempo! Jiren tomou a iniciativa!', 'system')
        currentTurn.value = 'enemy'
        executeEnemyTurn()
      } else {
        addToLog('Jiren perdeu o foco! Goku tomou a iniciativa!', 'system')
        currentTurn.value = 'player'
        startTurnTimer()
      }
    }
  }, 1000)
}

// --- SISTEMA DE ATAQUES ---
const attacks = [
  { id: 'soco', name: 'Soco', kiCost: 0, staCost: 5, damage: 3, type: 'attack' },
  { id: 'chute', name: 'Chute', kiCost: 0, staCost: 5, damage: 3, type: 'attack' },
  { id: 'powerup', name: 'Power Up', kiCost: 0, staCost: 0, damage: 0, type: 'powerup' },
  { id: 'dynamite', name: 'Dynamite Kick', kiCost: 0, staCost: 15, damage: 8, type: 'attack' },
  { id: 'socos-chutes', name: 'Socos e Chutes', kiCost: 0, staCost: 20, damage: 12, type: 'attack' },
  { id: 'solar', name: 'Solar Fist', kiCost: 1, staCost: 10, damage: 0, type: 'defend' },
  { id: 'hashyu', name: 'Hashyu Ken', kiCost: 1, staCost: 10, damage: 10, type: 'attack' },
  { id: 'zanzouken', name: 'Zanzouken', kiCost: 1, staCost: 15, damage: 0, type: 'defend' },
  { id: 'thunder', name: 'Thunder Flash', kiCost: 2, staCost: 20, damage: 15, type: 'attack' },
  { id: 'bunshin', name: 'Bunshin', kiCost: 2, staCost: 20, damage: 0, type: 'defend' },
  { id: 'crusher', name: 'Crusher Ball', kiCost: 2, staCost: 15, damage: 14, type: 'attack' },
  { id: 'masenkou', name: 'Masenkou', kiCost: 2, staCost: 15, damage: 16, type: 'attack' },
  { id: 'finish', name: 'Finish Flash', kiCost: 2, staCost: 20, damage: 18, type: 'attack' },
  { id: 'kienzan', name: 'Kienzan', kiCost: 3, staCost: 20, damage: 22, type: 'attack' },
  { id: 'kikouhou', name: 'Kikouhou', kiCost: 3, staCost: 30, damage: 26, type: 'attack' },
  { id: 'shyougeki', name: 'Shyougeki Há', kiCost: 1, staCost: 10, damage: 10, type: 'attack' },
  { id: 'kakusan', name: 'Kakusan Kikou Ha', kiCost: 3, staCost: 20, damage: 20, type: 'attack' },
  { id: 'gallic', name: 'Gallic Gun', kiCost: 3, staCost: 20, damage: 24, type: 'attack' },
  { id: 'energydan', name: 'Energy Dan', kiCost: 1, staCost: 5, damage: 6, type: 'attack' },
  { id: 'kamehameha', name: 'Kame Hame Ha', kiCost: 3, staCost: 25, damage: 25, type: 'attack' },
  { id: 'bigbang', name: 'Big Bang Attack', kiCost: 4, staCost: 30, damage: 32, type: 'attack' },
  { id: 'finalflash', name: 'Final Flash', kiCost: 4, staCost: 35, damage: 38, type: 'attack' },
  { id: 'kaioken', name: 'Kaioken (Aumenta Poder)', kiCost: 1, staCost: 10, damage: 0, type: 'buff' },
  { id: 'genkidama', name: 'Genki Dama', kiCost: 5, staCost: 50, damage: 70, type: 'attack' },
  { id: 'ssj', name: 'Super Saiyajin (Transformação)', kiCost: 2, staCost: 20, damage: 0, type: 'transform' },
  { id: 'ssj2', name: 'Super Saiyajin 2 (Transformação)', kiCost: 4, staCost: 40, damage: 0, type: 'transform' }
]
const selectedAttack = ref('soco')

// --- SISTEMA DE ITENS ---
const items = [
  { id: 'semente', name: 'Semente dos Deuses', desc: 'Restaura 100% de HP, KI e STA' },
  { id: 'peixe', name: 'Peixe Verde', desc: 'Recupera 50% de STA' },
  { id: 'lanche', name: 'Lanchinho', desc: 'Recupera 5-15% de HP' },
  { id: 'maca', name: 'Maçã Envenenada', desc: 'Causa 5-10% de dano ao rival' }
]
const selectedItem = ref('semente')

// --- LOG DE COMBATE ---
const combatLog = ref<{ msg: string, type: 'goku' | 'jiren' | 'system', time: string }[]>([
  { msg: 'O combate por turnos começou! Sua vez de agir.', type: 'system', time: '99' }
])

let clockInterval: ReturnType<typeof setInterval>

// --- LÓGICA DO JOGADOR ---
const executeAction = () => {
  if (isGameOver.value || currentTurn.value !== 'player') return

  const atk = attacks.find(a => a.id === selectedAttack.value)!

  if (gokuKi.value < atk.kiCost) {
    addToLog('Ki insuficiente para esta técnica.', 'system')
    return
  }
  if (gokuStamina.value < atk.staCost) {
    addToLog('Estamina insuficiente! Você precisa recuperar fôlego.', 'system')
    return
  }

  // Consome recursos
  gokuKi.value -= atk.kiCost
  gokuStamina.value -= atk.staCost

  // Multiplicadores
  let damageMultiplier = 1
  if (playerForm.value === 'Super Saiyajin') damageMultiplier += 0.5
  else if (playerForm.value === 'Super Saiyajin 2') damageMultiplier += 1.0
  if (kaiokenLevel.value > 0) damageMultiplier += (kaiokenLevel.value * 0.1)

  const finalDamage = Math.floor(atk.damage * damageMultiplier)

  // Efeitos da Técnica
  if (atk.type === 'transform') {
    playerForm.value = atk.name.split(' (')[0]
    addToLog(`Goku explodiu em fúria e assumiu a forma ${playerForm.value}!`, 'goku')
    screenEffect.value = 'flash'
    setTimeout(() => screenEffect.value = '', 300)
    
  } else if (atk.type === 'buff' && atk.id === 'kaioken') {
    if (kaiokenLevel.value === 0) kaiokenLevel.value = 2
    else if (kaiokenLevel.value === 2) kaiokenLevel.value = 3
    else if (kaiokenLevel.value === 3) kaiokenLevel.value = 4
    else if (kaiokenLevel.value === 4) kaiokenLevel.value = 10
    else if (kaiokenLevel.value === 10) kaiokenLevel.value = 20
    
    addToLog(`Goku ativou o Kaioken x${kaiokenLevel.value}!`, 'goku')
    screenEffect.value = 'shake'
    setTimeout(() => screenEffect.value = '', 200)

  } else if (atk.type === 'powerup') {
    gokuKi.value = Math.min(5, gokuKi.value + 2)
    gokuStamina.value = Math.min(100, gokuStamina.value + 30)
    addToLog('Goku concentrou seu KI! (+2 KI, +30 STA)', 'goku')
    
  } else if (atk.type === 'defend') {
    gokuKi.value = Math.min(5, gokuKi.value + 1)
    addToLog(`Goku usou ${atk.name} estrategicamente! A defesa o fortalece. (+1 KI)`, 'goku')
    screenEffect.value = 'flash'
    setTimeout(() => screenEffect.value = '', 150)
    
  } else {
    // Ataque
    jirenHp.value = Math.max(0, jirenHp.value - finalDamage)
    
    let logMsg = `Goku disparou ${atk.name}! `
    if (finalDamage >= 30) {
      logMsg += `A guarda de Jiren foi obliterada! (-${finalDamage} de HP)`
    } else if (finalDamage >= 12) {
      logMsg += `Jiren tentou bloquear, mas recebeu impacto direto. (-${finalDamage} de HP)`
    } else {
      logMsg += `Jiren bloqueou com os braços cruzados, minimizando o dano. (-${finalDamage} de HP)`
    }
    
    addToLog(logMsg, 'goku')
    screenEffect.value = 'flash'
    setTimeout(() => screenEffect.value = '', 150)
  }

  if (atk.kiCost === 0 && atk.type === 'attack') {
    gokuKi.value = Math.min(5, gokuKi.value + 0.5)
  }

  // Passa o turno se o jogo não acabou
  checkWinCondition()
  if (!isGameOver.value) {
    currentTurn.value = 'enemy'
    executeEnemyTurn()
  }
}

// --- LÓGICA DE ITENS ---
const useItem = () => {
  if (isGameOver.value || currentTurn.value !== 'player') return

  const item = items.find(i => i.id === selectedItem.value)!

  if (item.id === 'semente') {
    gokuHp.value = 100
    gokuKi.value = 5
    gokuStamina.value = 100
    addToLog('Goku engoliu a Semente dos Deuses! HP, Ki e Estamina 100% restaurados!', 'goku')
    screenEffect.value = 'flash'
  } else if (item.id === 'peixe') {
    gokuStamina.value = Math.min(100, gokuStamina.value + 50)
    addToLog('Goku comeu o Peixe Verde! Recuperou seu fôlego rapidamente.', 'goku')
  } else if (item.id === 'lanche') {
    const heal = Math.floor(Math.random() * 11) + 5
    gokuHp.value = Math.min(100, gokuHp.value + heal)
    addToLog(`Goku fez um Lanchinho rápido! Recuperou ${heal} de HP.`, 'goku')
  } else if (item.id === 'maca') {
    const dmg = Math.floor(Math.random() * 6) + 5
    jirenHp.value = Math.max(0, jirenHp.value - dmg)
    addToLog(`Goku arremessou a Maçã Envenenada! A toxina corroeu a defesa inimiga, causando ${dmg} de dano!`, 'goku')
    screenEffect.value = 'shake'
  }

  setTimeout(() => screenEffect.value = '', 200)

  checkWinCondition()
  if (!isGameOver.value) {
    currentTurn.value = 'enemy'
    executeEnemyTurn()
  }
}

// --- LÓGICA DO INIMIGO ---
const executeEnemyTurn = () => {
  if (isGameOver.value) return
  startTurnTimer() 

  // Simula "pensamento" e ação do Boss (2.5 segundos)
  setTimeout(() => {
    if (isGameOver.value || currentTurn.value !== 'enemy') return
    
    const jirenDamage = Math.floor(Math.random() * 12) + 5
    gokuHp.value = Math.max(0, gokuHp.value - jirenDamage)
    
    // Custo de estamina do ataque do Jiren
    jirenStamina.value = Math.max(0, jirenStamina.value - 15)
    
    let enemyMsg = `Jiren ataca com ferocidade! `
    if (jirenDamage >= 12) {
      enemyMsg += `A defesa de Goku foi rompida sem piedade! (-${jirenDamage} de HP)`
    } else {
      enemyMsg += `Goku consegue esquivar de boa parte do impacto. (-${jirenDamage} de HP)`
    }
    
    addToLog(enemyMsg, 'jiren')
    
    screenEffect.value = 'shake'
    setTimeout(() => screenEffect.value = '', 300)

    // Recuperação de estamina no fim do turno (Cadência de RPG)
    gokuStamina.value = Math.min(100, gokuStamina.value + 15)
    jirenStamina.value = Math.min(100, jirenStamina.value + 15)

    checkWinCondition()

    if (!isGameOver.value) {
      currentTurn.value = 'player'
      startTurnTimer()
    }
  }, 2500)
}

const addToLog = (msg: string, type: 'goku' | 'jiren' | 'system') => {
  combatLog.value.unshift({ msg, type, time: timer.value.toString().padStart(2, '0') })
  if (combatLog.value.length > 20) combatLog.value.pop()
}

const checkWinCondition = () => {
  if (gokuHp.value <= 0 || jirenHp.value <= 0 || timer.value <= 0) {
    isGameOver.value = true
    clearInterval(clockInterval)
    clearInterval(turnInterval)
    
    if (gokuHp.value <= 0) addToLog('VITÓRIA DE JIREN. O Universo 7 será apagado.', 'system')
    else if (jirenHp.value <= 0) addToLog('VITÓRIA DE GOKU! Jiren foi derrotado.', 'system')
    else addToLog('TEMPO ESGOTADO. Empate.', 'system')
  }
}

onMounted(() => {
  clockInterval = setInterval(() => {
    if (timer.value > 0 && !isGameOver.value) {
      timer.value--
      if (timer.value === 0) checkWinCondition()
    }
  }, 1000)
  
  // Inicia o turno do jogador
  startTurnTimer()
})

onUnmounted(() => {
  clearInterval(clockInterval)
  clearInterval(turnInterval)
})
</script>

<template>
  <div :class="['relative w-full h-screen bg-[#f4f4f5] overflow-hidden font-sans select-none transition-all flex flex-col', screenEffect]">
    
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_#e4e4e7_100%)]"></div>
      <div class="absolute top-1/3 left-1/4 size-32 border-[0.5px] border-neutral-300/60 transform rotate-12 bg-white/30 backdrop-blur-sm animate-float shadow-xl"></div>
      <div class="absolute bottom-1/4 right-1/4 size-48 border-[0.5px] border-neutral-300/40 transform -rotate-45 bg-white/20 backdrop-blur-sm animate-float-delayed shadow-xl"></div>
    </div>

    <button @click="exitSaga" class="absolute top-6 left-6 z-50 text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-2 cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
      <span class="font-bold text-sm tracking-widest uppercase mt-0.5">Sair</span>
    </button>

    <div class="absolute inset-0 z-10 flex justify-between items-end px-10 pb-[5%] pointer-events-none">
      <div class="relative w-[40%] h-[85%] animate-slide-right flex items-end">
        <div class="absolute bottom-10 left-1/4 w-[60%] h-[70%] bg-cyan-400/30 blur-[100px] rounded-full z-0"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#f4f4f5] via-transparent to-transparent z-10"></div>
        <img src="/templates/goku.png?auto=format&fit=crop&w=800&q=80" 
             class="w-full h-full object-cover object-top mask-gradient-immersive drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] filter grayscale-[10%] contrast-125 z-0" 
             alt="Goku" />
      </div>

      <div class="relative w-[35%] h-[80%] animate-slide-left flex items-end opacity-95">
        <div class="absolute bottom-10 right-1/4 w-[60%] h-[70%] bg-red-500/20 blur-[100px] rounded-full z-0"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#f4f4f5] via-transparent to-transparent z-10"></div>
        <img src="/templates/jiren.png?auto=format&fit=crop&w=800&q=80" 
             class="w-full h-full object-cover object-top mask-gradient-immersive drop-shadow-[0_0_20px_rgba(220,38,38,0.2)] filter contrast-125 sepia-[20%] hue-rotate-[-20deg] z-0" 
             alt="Jiren" />
      </div>
    </div>

    <header class="absolute top-0 left-0 w-full z-20 flex justify-between items-start p-6 md:px-12 md:pt-8 pointer-events-none">
      
      <div class="w-[40%] max-w-[500px] flex flex-col gap-2 mt-10">
        <div class="flex items-end gap-3 mb-1">
          <img src="/templates/equipamentos/goku.png" class="size-14 rounded-md border-2 border-white shadow-md object-cover object-top bg-neutral-200" alt="Goku Avatar" />
          <div class="flex flex-col justify-end">
            <div class="flex items-baseline gap-2">
              <h2 class="text-neutral-900 font-black italic tracking-widest text-xl uppercase drop-shadow-md leading-none">[DBG] GOKU</h2>
              <span class="text-neutral-700 font-black italic text-xs">Nvl {{ gokuLevel }}</span>
            </div>
            <span :class="['font-bold italic text-[10px] mt-1 px-1.5 rounded-sm uppercase border w-max transition-all', formBadgeClasses]">
              {{ currentFormText }}
            </span>
          </div>
        </div>
        
        <div class="relative w-full h-6 bg-neutral-300/80 backdrop-blur-md overflow-hidden border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] skew-x-[-15deg] origin-left flex items-center justify-center">
          <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300" :style="{ width: gokuHp + '%' }">
            <div class="absolute top-0 right-0 w-4 h-full bg-white/50 blur-sm"></div>
          </div>
          <span class="z-10 text-white font-black italic text-xs tracking-widest skew-x-[15deg] text-shadow-hard">{{ Math.floor(gokuHp) }} / 100</span>
        </div>
        
        <div class="flex gap-3 w-full pl-2">
          <div class="relative w-[60%] flex gap-1 h-4 skew-x-[-15deg] origin-left">
            <div v-for="i in 5" :key="'k'+i" :class="['flex-1 h-full border border-white transition-all', gokuKi >= i ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]' : 'bg-neutral-300/30']"></div>
            <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <span class="text-white font-black italic text-[9px] tracking-widest skew-x-[15deg] text-shadow-hard">{{ Math.floor(gokuKi) }} / 5</span>
            </div>
          </div>
          <div class="relative w-[35%] h-4 bg-neutral-300/80 border border-white skew-x-[-15deg] overflow-hidden shadow-sm flex items-center justify-center">
            <div class="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-300" :style="{ width: gokuStamina + '%' }"></div>
            <span class="z-10 text-white font-black italic text-[9px] tracking-widest skew-x-[15deg] text-shadow-hard">{{ Math.floor(gokuStamina) }} / 100</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center pt-10">
        <div class="relative flex items-center justify-center size-20 bg-white/90 backdrop-blur-xl rounded-full border-[3px] border-neutral-300 shadow-xl">
          <span class="text-neutral-900 font-medium text-4xl tracking-tighter tabular-nums text-center">
            <span class="text-3xl">∞</span>
          </span>
        </div>
      </div>

      <div class="w-[40%] max-w-[500px] flex flex-col gap-2 items-end mt-10">
        <div class="flex items-end gap-3 mb-1 flex-row-reverse text-right">
          <img src="/templates/equipamentos/jiren.png" class="size-14 rounded-md border-2 border-white shadow-md object-cover object-top bg-neutral-200" alt="Jiren Avatar" />
          <div class="flex flex-col justify-end items-end">
            <div class="flex items-baseline gap-2 flex-row-reverse">
              <h2 class="text-neutral-900 font-black italic tracking-widest text-xl uppercase drop-shadow-md leading-none">[DBS] JIREN</h2>
              <span class="text-neutral-700 font-black italic text-xs">Nvl {{ jirenLevel }}</span>
            </div>
            <span class="text-neutral-500 font-bold italic text-[10px] mt-1 bg-white/50 px-1.5 rounded-sm uppercase border border-neutral-300 w-max">Poder Total</span>
          </div>
        </div>
        
        <div class="relative w-full h-6 bg-neutral-300/80 backdrop-blur-md overflow-hidden border-2 border-white shadow-[0_0_15px_rgba(220,38,38,0.4)] skew-x-[15deg] origin-right flex items-center justify-center">
          <div class="absolute top-0 right-0 h-full bg-gradient-to-l from-orange-500 to-red-600 transition-all duration-300" :style="{ width: jirenHp + '%' }">
            <div class="absolute top-0 left-0 w-4 h-full bg-white/50 blur-sm"></div>
          </div>
          <span class="z-10 text-white font-black italic text-xs tracking-widest skew-x-[-15deg] text-shadow-hard">{{ Math.floor(jirenHp) }} / 100</span>
        </div>
        
        <div class="flex gap-3 w-full pr-2 flex-row-reverse">
          <div class="relative w-[60%] flex gap-1 h-4 skew-x-[15deg] origin-right justify-end flex-row-reverse">
            <div v-for="i in 5" :key="'jk'+i" class="flex-1 h-full border border-white bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <span class="text-white font-black italic text-[9px] tracking-widest skew-x-[-15deg] text-shadow-hard">5 / 5</span>
            </div>
          </div>
          <div class="relative w-[35%] h-4 bg-neutral-300/80 border border-white skew-x-[15deg] overflow-hidden shadow-sm flex items-center justify-center">
            <div class="absolute top-0 right-0 h-full bg-yellow-500 transition-all duration-300" :style="{ width: jirenStamina + '%' }"></div>
            <span class="z-10 text-white font-black italic text-[9px] tracking-widest skew-x-[-15deg] text-shadow-hard">{{ Math.floor(jirenStamina) }} / 100</span>
          </div>
        </div>
      </div>
    </header>

    <main class="absolute inset-0 z-30 flex justify-center items-center pointer-events-none mt-16">
      <div class="w-[800px] bg-[#f8f9fa]/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col pointer-events-auto border border-white/80 text-neutral-800 overflow-hidden">
        
        <div class="p-6 h-[200px] flex flex-col bg-white/40">
          <h3 class="text-sm font-light tracking-widest uppercase border-b border-neutral-300 pb-2 mb-3 text-neutral-600">Registro de Combate | Combat Log</h3>
          <div class="overflow-y-auto flex flex-col gap-2 flex-1 scrollbar-hide text-[13px] leading-relaxed">
            <div v-for="(log, i) in combatLog" :key="i" class="flex gap-2">
              <span v-if="log.type === 'system'" class="text-neutral-500 font-bold">[SISTEMA]</span>
              <span v-else-if="log.type === 'goku'" class="text-cyan-600 font-bold">[JOGADOR]</span>
              <span v-else-if="log.type === 'jiren'" class="text-red-600 font-bold">[INIMIGO]</span>
              <span class="text-neutral-800">{{ log.msg }}</span>
            </div>
          </div>
        </div>

        <div class="w-full h-px bg-neutral-300 shadow-[0_1px_2px_rgba(255,255,255,1)]"></div>

        <div class="flex flex-col p-8 bg-white/20 items-center justify-center">
          
          <div class="w-full flex flex-col gap-1.5 mb-6">
            <div class="flex justify-between items-end">
              <label class="text-[10px] font-black uppercase tracking-widest" :class="currentTurn === 'player' ? 'text-cyan-600' : 'text-red-600'">
                {{ currentTurn === 'player' ? 'Sua Vez de Agir!' : 'Turno do Inimigo...' }}
              </label>
              <span class="text-[10px] font-bold text-neutral-500 tabular-nums">
                (Tempo limite: {{ turnTimeLeft }}s)
              </span>
            </div>
            <div class="h-2.5 w-full bg-neutral-300 rounded-full overflow-hidden shadow-inner border border-white/50">
              <div :class="['h-full transition-all duration-1000 ease-linear', currentTurn === 'player' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]']" :style="{ width: (turnTimeLeft / 120) * 100 + '%' }"></div>
            </div>
          </div>

          <div class="flex gap-8 w-full">
            
            <div class="flex-1 flex flex-col gap-3">
              <h3 class="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Técnicas de Combate</h3>
              <div class="relative w-full">
                <select v-model="selectedAttack" class="w-full appearance-none bg-white border border-neutral-300 text-neutral-800 font-bold text-[11px] tracking-wider uppercase p-4 rounded-xl outline-none focus:border-cyan-600 transition-all cursor-pointer shadow-sm">
                  <option v-for="atk in attacks" :key="atk.id" :value="atk.id">
                    {{ atk.name }} | KI: {{ atk.kiCost }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span class="text-neutral-400 text-xs">▼</span>
                </div>
              </div>
              <button @click="executeAction" :disabled="isGameOver || currentTurn !== 'player'" 
                      class="w-full bg-neutral-950 text-white p-4 rounded-xl font-black italic uppercase tracking-tighter text-lg hover:bg-cyan-600 disabled:opacity-40 disabled:grayscale transition-all shadow-xl flex justify-center items-center cursor-pointer">
                {{ currentTurn === 'player' ? 'EXECUTAR GOLPE' : 'AGUARDE...' }}
              </button>
            </div>

            <div class="flex-1 flex flex-col gap-3">
              <h3 class="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Itens (Consumíveis)</h3>
              <div class="relative w-full">
                <select v-model="selectedItem" class="w-full appearance-none bg-white border border-neutral-300 text-neutral-800 font-bold text-[11px] tracking-wider uppercase p-4 rounded-xl outline-none focus:border-green-600 transition-all cursor-pointer shadow-sm">
                  <option v-for="item in items" :key="item.id" :value="item.id">
                    {{ item.name }} — ({{ item.desc }})
                  </option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span class="text-neutral-400 text-xs">▼</span>
                </div>
              </div>
              <button @click="useItem" :disabled="isGameOver || currentTurn !== 'player'" 
                      class="w-full bg-green-600 text-white p-4 rounded-xl font-black italic uppercase tracking-tighter text-lg hover:bg-green-500 disabled:opacity-40 disabled:grayscale transition-all shadow-xl flex justify-center items-center cursor-pointer">
                USAR ITEM
              </button>
            </div>

          </div>

        </div>
      </div>
    </main>

    <div v-if="isGameOver" class="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/80 backdrop-blur-sm pointer-events-auto">
      <div class="bg-white px-20 py-10 rounded-2xl shadow-2xl text-center border-2 border-neutral-300">
        <h1 class="text-5xl font-black italic tracking-widest uppercase text-neutral-900 mb-6">{{ gokuHp <= 0 ? 'K.O.' : 'VITÓRIA' }}</h1>
        <button @click="() => location.reload()" class="px-10 py-4 bg-neutral-900 text-white font-black italic uppercase tracking-[0.2em] text-sm hover:bg-red-600 transition-all rounded-xl shadow-lg">
          Lutar Novamente
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Ocultar barra de rolagem mas permitir rolagem interna no log */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Mascara gradiente RADIAL Imersiva (Nítido no centro, degradê para os cantos) */
.mask-gradient-immersive {
  mask-image: radial-gradient(circle, black 50%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 100%);
}

/* Sombra Escura Fixa para Textos sobre Fundos Claros */
.text-shadow-hard {
  text-shadow: 
    1px 1px 0px #000, 
    -1px -1px 0px #000, 
    1px -1px 0px #000, 
    -1px 1px 0px #000, 
    0px 2px 4px rgba(0,0,0,0.8);
}

/* Animações Personagens */
.animate-slide-right { animation: slideR 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slide-left { animation: slideL 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideR { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideL { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 0.95; } }

/* Efeitos Visuais (VFX) */
.shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
.flash { animation: flashWhite 0.2s ease-out both; }
@keyframes shake {
  10%, 90% { transform: translate3d(-3px, 0, 0); box-shadow: inset 0 0 50px rgba(220,38,38,0.2); }
  20%, 80% { transform: translate3d(5px, 0, 0); box-shadow: inset 0 0 50px rgba(220,38,38,0.2); }
  30%, 50%, 70% { transform: translate3d(-10px, 0, 0); }
  40%, 60% { transform: translate3d(10px, 0, 0); }
}
@keyframes flashWhite {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.3); box-shadow: inset 0 0 100px rgba(255,255,255,1); }
  100% { filter: brightness(1); }
}
</style>