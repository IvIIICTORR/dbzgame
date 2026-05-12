<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const exitSaga = () => router.push({ name: 'sagas' })

// --- ESTADOS DO JOGO ---
const timer = ref(99)
const isGameOver = ref(false)
const screenEffect = ref<'' | 'flash' | 'shake'>('')
const isScouterActive = ref(false)
const fusionInvite = ref<{ to: string, enemyId: string } | null>(null)

// --- ESTADOS DE FUSÃO ---
const isFused = ref(false)
const fusionTimeLeft = ref(0)
const fusionDamageTaken = ref(0)
const canAttackInFusion = ref(true)
let originalStats = { hp: 100, maxHp: 100, name: 'GOKU', ki: 5, stamina: 100 }
let partnerStats = { hp: 0, maxHp: 0, name: '' }
let fusionClock: any = null

// --- STATUS DO JOGADOR (GOKU) ---
const gokuName = ref('GOKU')
const gokuHp = ref(100)
const gokuMaxHp = ref(100)
const gokuKi = ref(5)
const gokuMaxKi = ref(5) 
const gokuStamina = ref(100)
const gokuMaxStamina = ref(100)
const gokuLevel = ref(50)
const gokuStr = ref(60)
const gokuSpd = ref(60)
const gokuDef = ref(60)
const playerForm = ref('Base')
const kaiokenLevel = ref(0) 

const currentFormText = computed(() => {
  let text = playerForm.value
  if (kaiokenLevel.value > 0) {
    text += ` (Kaioken x${kaiokenLevel.value})`
  }
  return text
})

// --- SISTEMA DE ARENA E INIMIGOS ---
interface ArenaPlayer {
  id: string
  name: string
  level: number
  hp: number
  maxHp: number
  ki: number
  stamina: number
  form: string
  avatar: string
  tag: string
  str: number
  spd: number
  def: number
  pl: string 
  hasScouter?: boolean 
  hasPotara?: boolean
}

const arenaPlayers = ref<ArenaPlayer[]>([
  { id: 'jiren', name: 'Jiren', level: 99, hp: 150, maxHp: 150, ki: 5, stamina: 100, form: 'Poder Total', tag: 'DBS', str: 99, spd: 95, def: 99, pl: '15.000.000', avatar: '/templates/equipamentos/jiren.png' },
  { id: 'broly', name: 'Broly', level: 90, hp: 140, maxHp: 140, ki: 5, stamina: 100, form: 'Lendário', tag: 'DBS', str: 120, spd: 85, def: 90, pl: '14.500.000', avatar: '/templates/equipamentos/brolly.png' },
  { id: 'vegeta', name: 'Vegeta', level: 85, hp: 110, maxHp: 110, ki: 5, stamina: 100, form: 'Super Saiyajin 2', tag: 'DBZ', str: 85, spd: 85, def: 80, pl: '8.500.000', avatar: '/templates/equipamentos/vegeta.png', hasScouter: true, hasPotara: true },
  { id: 'hit', name: 'Hit', level: 88, hp: 100, maxHp: 100, ki: 5, stamina: 100, form: 'Salto Temporal', tag: 'DBS', str: 80, spd: 120, def: 75, pl: '10.000.000', avatar: '/templates/equipamentos/hit.avif' },
  { id: 'frieza', name: 'Freeza', level: 85, hp: 105, maxHp: 105, ki: 5, stamina: 100, form: 'Golden', tag: 'DBS', str: 85, spd: 90, def: 80, pl: '9.000.000', avatar: '/templates/equipamentos/freeza.png' },
  { id: 'cell', name: 'Cell', level: 75, hp: 115, maxHp: 115, ki: 5, stamina: 100, form: 'Perfeito', tag: 'DBZ', str: 75, spd: 75, def: 80, pl: '4.500.000', avatar: '/templates/equipamentos/cell.png' },
  { id: 'majinbuu', name: 'Majin Buu', level: 70, hp: 130, maxHp: 130, ki: 5, stamina: 100, form: 'Inocente', tag: 'DBZ', str: 70, spd: 65, def: 95, pl: '4.000.000', avatar: '/templates/equipamentos/majin_boo.png' },
  { id: 'kidbuu', name: 'Kid Buu', level: 80, hp: 110, maxHp: 110, ki: 5, stamina: 100, form: 'Pura Maldade', tag: 'DBZ', str: 85, spd: 95, def: 75, pl: '5.500.000', avatar: '/templates/equipamentos/kidbuu.avif' },
  { id: 'gokublack', name: 'Goku Black', level: 87, hp: 105, maxHp: 105, ki: 5, stamina: 100, form: 'Super Saiyajin Rosé', tag: 'DBS', str: 88, spd: 88, def: 82, pl: '9.500.000', avatar: '/templates/equipamentos/gokublack.avif', hasPotara: true },
  { id: 'zamasu', name: 'Zamasu', level: 82, hp: 100, maxHp: 100, ki: 5, stamina: 100, form: 'Fusão', tag: 'DBS', str: 80, spd: 85, def: 90, pl: '11.000.000', avatar: '/templates/equipamentos/zamasu.avif', hasPotara: true },
  { id: 'kefla', name: 'Kefla', level: 86, hp: 100, maxHp: 100, ki: 5, stamina: 100, form: 'Super Saiyajin 2', tag: 'DBS', str: 87, spd: 92, def: 78, pl: '10.500.000', avatar: '/templates/equipamentos/kefla.avif' },
  { id: 'toppo', name: 'Toppo', level: 92, hp: 125, maxHp: 125, ki: 5, stamina: 100, form: 'Hakaishin', tag: 'DBS', str: 95, spd: 80, def: 98, pl: '13.000.000', avatar: '/templates/equipamentos/toppo.png' },
  { id: 'dyspo', name: 'Dyspo', level: 80, hp: 85, maxHp: 85, ki: 5, stamina: 100, form: 'Velocidade Máxima', tag: 'DBS', str: 70, spd: 110, def: 65, pl: '7.500.000', avatar: '/templates/equipamentos/dyspo.avif' },
  { id: 'piccolo', name: 'Piccolo', level: 65, hp: 95, maxHp: 95, ki: 5, stamina: 100, form: 'Super Namekuseijin', tag: 'DBZ', str: 65, spd: 65, def: 75, pl: '2.500.000', avatar: '/templates/equipamentos/piccolo.png' },
  { id: 'gohan', name: 'Gohan', level: 84, hp: 100, maxHp: 100, ki: 5, stamina: 100, form: 'Místico', tag: 'DBZ', str: 88, spd: 85, def: 80, pl: '7.000.000', avatar: '/templates/equipamentos/gohan.png' },
  { id: 'trunks', name: 'Trunks', level: 78, hp: 95, maxHp: 95, ki: 5, stamina: 100, form: 'Super Saiyajin', tag: 'DBZ', str: 75, spd: 78, def: 70, pl: '3.500.000', avatar: '/templates/equipamentos/trunks.png' },
  { id: 'android17', name: 'Android 17', level: 82, hp: 90, maxHp: 90, ki: 5, stamina: 100, form: 'Ciborgue', tag: 'DBS', str: 75, spd: 85, def: 95, pl: '6.500.000', avatar: '/templates/equipamentos/android17.avif' },
  { id: 'android18', name: 'Android 18', level: 75, hp: 85, maxHp: 85, ki: 5, stamina: 100, form: 'Ciborgue', tag: 'DBZ', str: 70, spd: 75, def: 70, pl: '2.000.000', avatar: '/templates/equipamentos/android18.avif' },
  { id: 'krillin', name: 'Kuririn', level: 50, hp: 70, maxHp: 70, ki: 5, stamina: 100, form: 'Humano', tag: 'DBZ', str: 45, spd: 50, def: 45, pl: '75.000', avatar: '/templates/equipamentos/krillin.avif' },
  { id: 'tien', name: 'Tenshinhan', level: 52, hp: 75, maxHp: 75, ki: 5, stamina: 100, form: 'Humano', tag: 'DBZ', str: 50, spd: 50, def: 48, pl: '85.000', avatar: '/templates/equipamentos/tien.avif' },
  { id: 'yamcha', name: 'Yamcha', level: 45, hp: 65, maxHp: 65, ki: 5, stamina: 100, form: 'Humano', tag: 'DBZ', str: 40, spd: 45, def: 40, pl: '50.000', avatar: '/templates/equipamentos/yamcha.avif' },
  { id: 'roshi', name: 'Mestre Kame', level: 60, hp: 80, maxHp: 80, ki: 5, stamina: 100, form: 'Poder Máximo', tag: 'DBS', str: 55, spd: 45, def: 60, pl: '120.000', avatar: '/templates/equipamentos/mrkame.png' },
  { id: 'raditz', name: 'Raditz', level: 25, hp: 50, maxHp: 50, ki: 5, stamina: 100, form: 'Base', tag: 'DBZ', str: 30, spd: 35, def: 30, pl: '1.500', avatar: '/templates/equipamentos/raditz.avif', hasScouter: true },
  { id: 'nappa', name: 'Nappa', level: 35, hp: 70, maxHp: 70, ki: 5, stamina: 100, form: 'Base', tag: 'DBZ', str: 45, spd: 30, def: 50, pl: '4.000', avatar: '/templates/equipamentos/nappa.avif', hasScouter: true },
  { id: 'ginyu', name: 'Capitão Ginyu', level: 45, hp: 85, maxHp: 85, ki: 5, stamina: 100, form: 'Base', tag: 'DBZ', str: 50, spd: 55, def: 50, pl: '120.000', avatar: '/templates/equipamentos/ginyu.avif', hasScouter: true },
  { id: 'zarbon', name: 'Zarbon', level: 40, hp: 75, maxHp: 75, ki: 5, stamina: 100, form: 'Monstro', tag: 'DBZ', str: 45, spd: 45, def: 45, pl: '30.000', avatar: '/templates/equipamentos/zarbon.avif', hasScouter: true },
  { id: 'dodoria', name: 'Dodoria', level: 38, hp: 80, maxHp: 80, ki: 5, stamina: 100, form: 'Base', tag: 'DBZ', str: 48, spd: 35, def: 45, pl: '22.000', avatar: '/templates/equipamentos/dodoria.avif', hasScouter: true },
  { id: 'cooler', name: 'Cooler', level: 70, hp: 105, maxHp: 105, ki: 5, stamina: 100, form: 'Forma Final', tag: 'DBZ', str: 72, spd: 70, def: 75, pl: '3.500.000', avatar: '/templates/equipamentos/kooler.png' },
  { id: 'janemba', name: 'Janemba', level: 82, hp: 110, maxHp: 110, ki: 5, stamina: 100, form: 'Super Janemba', tag: 'DBZ', str: 82, spd: 88, def: 75, pl: '6.000.000', avatar: '/templates/equipamentos/janemba.avif' },
  { id: 'omega', name: 'Omega Shenron', level: 95, hp: 140, maxHp: 140, ki: 5, stamina: 100, form: 'Dragão Maligno', tag: 'DBGT', str: 95, spd: 90, def: 95, pl: '13.500.000', avatar: '/templates/equipamentos/omega.avif' },
  { id: 'baby', name: 'Baby Vegeta', level: 85, hp: 115, maxHp: 115, ki: 5, stamina: 100, form: 'Oozaru Dourado', tag: 'DBGT', str: 90, spd: 70, def: 85, pl: '8.000.000', avatar: '/templates/equipamentos/baby.avif' },
  { id: 'caulifla', name: 'Caulifla', level: 76, hp: 95, maxHp: 95, ki: 5, stamina: 100, form: 'Super Saiyajin 2', tag: 'DBS', str: 75, spd: 80, def: 70, pl: '4.500.000', avatar: '/templates/equipamentos/caulifla.avif' }
])

const selectedTargetId = ref(arenaPlayers.value[0].id)
const currentTarget = computed(() => arenaPlayers.value.find(p => p.id === selectedTargetId.value)!)
const aliveEnemies = computed(() => arenaPlayers.value.filter(p => p.hp > 0))

// --- SISTEMA DE PASSIVAS ---
const getPassiveState = (player: any) => {
  const hpPct = player.hp / player.maxHp;
  const name = player.name.toLowerCase();
  
  let type = 'default';
  if (['goku', 'vegeta', 'broly', 'gohan', 'trunks', 'caulifla', 'kefla', 'nappa', 'raditz'].some(n => name.includes(n))) type = 'saiyan';
  else if (name.includes('piccolo')) type = 'namek';
  else if (name.includes('android') || name.includes('cell')) type = 'android';
  else if (['krillin', 'tien', 'yamcha', 'roshi'].some(n => name.includes(n))) type = 'human';
  else if (name.includes('buu') || name.includes('janemba')) type = 'majin';
  else if (name.includes('frieza') || name.includes('cooler')) type = 'frost_demon';
  else if (name.includes('jiren') || name.includes('toppo') || name.includes('zamasu') || name.includes('hit')) type = 'godly';

  switch (type) {
    case 'saiyan': return { icon: '🔥', title: 'Zenkai (+Dano quando HP < 30%)', active: hpPct <= 0.3, type };
    case 'namek': return { icon: '🌿', title: 'Regeneração (Cura a cada ciclo)', active: hpPct < 1, type };
    case 'android': return { icon: '⚙️', title: 'Energia Infinita (-1 Custo Ki)', active: true, type };
    case 'human': return { icon: '🛡️', title: 'Determinação (+Defesa quando HP < 50%)', active: hpPct <= 0.5, type };
    case 'majin': return { icon: '🍬', title: 'Corpo Maleável (Reduz Dano Recebido)', active: hpPct <= 0.4, type };
    case 'frost_demon': return { icon: '❄️', title: 'Sobrevivência (+Velocidade quando STA < 50%)', active: player.stamina <= 50, type };
    case 'godly': return { icon: '✨', title: 'Pressão Divina (+Dano quando Ki Cheio)', active: player.ki >= 4, type };
    default: return { icon: '🌟', title: 'Espirito de Luta', active: hpPct <= 0.2, type };
  }
}

const gokuPassive = computed(() => getPassiveState({ name: gokuName.value, hp: gokuHp.value, maxHp: gokuMaxHp.value, ki: gokuKi.value, stamina: gokuStamina.value }))

// Cores dinâmicas para transformações
const getFormBadgeClasses = (formName: string, kLevel: number = 0) => {
  if (kLevel > 0 && formName !== 'Base') return 'text-red-700 border-red-500 bg-gradient-to-r from-yellow-100 to-red-100 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
  if (kLevel > 0) return 'text-red-600 border-red-400 bg-red-50 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
  if (formName.includes('Super Saiyajin 2')) return 'text-yellow-600 border-yellow-500 bg-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.8)]'
  if (formName.includes('Super Saiyajin') || formName === 'Oozaru' || formName === 'Místico') return 'text-yellow-600 border-yellow-400 bg-yellow-50 shadow-[0_0_8px_rgba(250,204,21,0.5)]'
  if (formName === 'Poder Total' || formName === 'Hakaishin' || formName === 'Pura Maldade') return 'text-orange-600 border-orange-500 bg-orange-50 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
  if (formName === 'Lendário') return 'text-green-600 border-green-500 bg-green-50 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
  if (formName === 'Golden') return 'text-yellow-700 border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.8)]'
  if (formName === 'Super Saiyajin Rosé') return 'text-pink-600 border-pink-400 bg-pink-50 shadow-[0_0_10px_rgba(219,39,119,0.5)]'
  if (formName === 'Super Namekuseijin') return 'text-green-700 border-green-600 bg-green-100 shadow-[0_0_8px_rgba(21,128,61,0.5)]'
  
  return 'text-neutral-500 border-neutral-300 bg-white/50'
}

// --- SISTEMA DE TURNOS E LOG ---
const turnTimeLeft = ref(60) // Ciclo de 1 minuto
let turnInterval: ReturnType<typeof setInterval>

type LogType = 'goku' | 'enemy' | 'system' | 'announcer'
const combatLog = ref<{ msg: string, type: LogType, time: string }[]>([])

const addToLog = (msg: string, type: LogType) => {
  combatLog.value.unshift({ msg, type, time: timer.value.toString().padStart(2, '0') })
  if (combatLog.value.length > 25) combatLog.value.pop()
}

const announce = (msg: string) => addToLog(msg, 'announcer')

const startTurnTimer = () => {
  clearInterval(turnInterval)
  turnTimeLeft.value = 60
  turnInterval = setInterval(() => {
    if (isGameOver.value) return
    turnTimeLeft.value--
    
    if (turnTimeLeft.value <= 0) {
      // Fim do ciclo de 1 minuto
      executeEnemyTurn() // Inimigos agem
      
      // Regeneração de Passivas (Namekuseijin)
      if (gokuPassive.value.type === 'namek' && gokuPassive.value.active) {
        gokuHp.value = Math.min(gokuMaxHp.value, gokuHp.value + (gokuMaxHp.value * 0.05))
      }
      aliveEnemies.value.forEach(e => {
        const p = getPassiveState(e)
        if (p.type === 'namek' && p.active) e.hp = Math.min(e.maxHp, e.hp + (e.maxHp * 0.05))
      })

      turnTimeLeft.value = 60
    }
  }, 1000)
}

// --- SISTEMA DE ATAQUES E ITENS ---
const attacks = [
  { id: 'soco', name: 'Soco', kiCost: 0, staCost: 5, damage: 3, type: 'attack' },
  { id: 'powerup', name: 'Power Up', kiCost: 0, staCost: 0, damage: 0, type: 'powerup' },
  { id: 'defesa', name: 'Defesa Perfeita', kiCost: 1, staCost: 10, damage: 0, type: 'defend' },
  { id: 'kamehameha', name: 'Kame Hame Ha', kiCost: 3, staCost: 25, damage: 25, type: 'attack' },
  { id: 'genkidama', name: 'Genki Dama', kiCost: 5, staCost: 50, damage: 70, type: 'attack' },
  { id: 'kaioken', name: 'Kaioken (Aumenta Poder)', kiCost: 1, staCost: 10, damage: 0, type: 'buff' },
  { id: 'ssj', name: 'Super Saiyajin (Transformação)', kiCost: 2, staCost: 20, damage: 0, type: 'transform' },
  { id: 'ssj2', name: 'Super Saiyajin 2 (Transformação)', kiCost: 4, staCost: 40, damage: 0, type: 'transform' }
]
const selectedAttack = ref('soco')

const items = [
  { id: 'potara', name: 'Brinco Potara', desc: 'Funde atributos e nome com o parceiro' },
  { id: 'scouter', name: 'Scouter (Verde)', desc: 'Lê Atributos e Poder de Luta do Alvo' },
  { id: 'semente', name: 'Semente dos Deuses', desc: 'Restaura 100% de HP, KI e STA' },
  { id: 'peixe', name: 'Peixe Verde', desc: 'Recupera 50% de STA' },
  { id: 'lanche', name: 'Lanchinho', desc: 'Recupera 5-15% de HP' },
  { id: 'maca', name: 'Maçã Envenenada', desc: 'Causa 5-10% de dano ao alvo' }
]
const selectedItem = ref('semente')

let clockInterval: ReturnType<typeof setInterval>

const selectTarget = (id: string) => {
  selectedTargetId.value = id
}

// ATAQUE EM TEMPO REAL
const executeAction = () => {
  if (isGameOver.value) return

  if (isFused.value && !canAttackInFusion.value) {
    addToLog('Você é o elo mais fraco da fusão e está impossibilitado de atacar!', 'system')
    return
  }

  const atk = attacks.find(a => a.id === selectedAttack.value)!
  let actualKiCost = atk.kiCost

  // Passiva Android
  if (gokuPassive.value.type === 'android' && gokuPassive.value.active) {
    actualKiCost = Math.max(0, actualKiCost - 1)
  }

  if (gokuKi.value < actualKiCost) {
    addToLog('Ki insuficiente para esta técnica.', 'system')
    return
  }
  if (gokuStamina.value < atk.staCost) {
    addToLog('Estamina insuficiente! Você precisa recuperar fôlego.', 'system')
    return
  }

  gokuKi.value -= actualKiCost
  gokuStamina.value -= atk.staCost

  let damageMultiplier = 1
  if (playerForm.value === 'Super Saiyajin') damageMultiplier += 0.5
  else if (playerForm.value === 'Super Saiyajin 2') damageMultiplier += 1.0
  if (kaiokenLevel.value > 0) damageMultiplier += (kaiokenLevel.value * 0.1)
  
  // Multiplicadores de Passiva
  if (gokuPassive.value.type === 'saiyan' && gokuPassive.value.active) damageMultiplier += 0.5
  if (gokuPassive.value.type === 'godly' && gokuPassive.value.active) damageMultiplier += 0.2

  const finalDamage = Math.floor(atk.damage * damageMultiplier)

  if (atk.type === 'transform') {
    playerForm.value = atk.name.split(' (')[0]
    announce(`O PODER ESTÁ TRANSBORDANDO! GOKU ASSUMIU A FORMA ${playerForm.value.toUpperCase()}!`)
    screenEffect.value = 'flash'
  } else if (atk.type === 'buff' && atk.id === 'kaioken') {
    kaiokenLevel.value = kaiokenLevel.value === 0 ? 2 : (kaiokenLevel.value >= 10 ? 20 : kaiokenLevel.value + 1)
    addToLog(`Goku ativou o Kaioken x${kaiokenLevel.value}!`, 'goku')
    screenEffect.value = 'shake'
  } else if (atk.type === 'powerup') {
    gokuKi.value = Math.min(gokuMaxKi.value, gokuKi.value + 2)
    gokuStamina.value = Math.min(gokuMaxStamina.value, gokuStamina.value + 30)
    addToLog('Goku concentrou seu KI! (+2 KI, +30 STA)', 'goku')
  } else if (atk.type === 'defend') {
    gokuKi.value = Math.min(gokuMaxKi.value, gokuKi.value + 1)
    addToLog(`Goku adotou postura defensiva perfeita. (+1 KI)`, 'goku')
    screenEffect.value = 'flash'
  } else {
    // Redução de dano por passiva do inimigo
    let targetDmg = finalDamage
    const targetPassive = getPassiveState(currentTarget.value)
    if (targetPassive.type === 'human' && targetPassive.active) targetDmg = Math.floor(targetDmg * 0.7)
    if (targetPassive.type === 'majin' && targetPassive.active) targetDmg = Math.floor(targetDmg * 0.6)

    currentTarget.value.hp = Math.max(0, currentTarget.value.hp - targetDmg)
    
    let logMsg = `Goku disparou ${atk.name} em ${currentTarget.value.name}! `
    if (targetDmg >= 25) {
      logMsg += `(-${targetDmg} HP)`
      announce(`UM GOLPE ABSOLUTAMENTE DEVASTADOR DE GOKU QUE ESTREMECE A ARENA!`)
    } else {
      logMsg += `Impacto direto! (-${targetDmg} HP)`
    }
    
    addToLog(logMsg, 'goku')
    screenEffect.value = 'flash'
  }

  if (atk.kiCost === 0 && atk.type === 'attack') gokuKi.value = Math.min(gokuMaxKi.value, gokuKi.value + 0.5)

  setTimeout(() => screenEffect.value = '', 200)
  
  if (currentTarget.value.hp <= 0 && aliveEnemies.value.length > 0) {
    announce(`K.O.! ${currentTarget.value.name.toUpperCase()} CAIU E ESTÁ ELIMINADO DA ARENA!`)
    selectedTargetId.value = aliveEnemies.value[0].id
  }
  checkWinCondition()
}

const useItem = () => {
  if (isGameOver.value) return
  const item = items.find(i => i.id === selectedItem.value)!

  if (item.id === 'potara') {
    if (currentTarget.value.hasPotara) {
      fusionInvite.value = { to: currentTarget.value.name, enemyId: currentTarget.value.id }
      announce(`SOLICITAÇÃO DE FUSÃO ENVIADA PARA ${currentTarget.value.name.toUpperCase()}!`)
    } else {
      addToLog(`${currentTarget.value.name} não possui o Brinco Potara.`, 'system')
    }
    return 
  } else if (item.id === 'scouter') {
    isScouterActive.value = true
    announce('GOKU EQUIPOU O SCOUTER! OS DADOS DE COMBATE DOS INIMIGOS ESTÃO EXPOSTOS!')
    screenEffect.value = 'flash'
  } else if (item.id === 'semente') {
    gokuHp.value = gokuMaxHp.value; gokuKi.value = gokuMaxKi.value; gokuStamina.value = gokuMaxStamina.value
    announce('INACREDITÁVEL! GOKU SE RECUPEROU COMPLETAMENTE COM UMA SEMENTE DOS DEUSES!')
    screenEffect.value = 'flash'
  } else if (item.id === 'peixe') {
    gokuStamina.value = Math.min(gokuMaxStamina.value, gokuStamina.value + 50)
    addToLog('Goku comeu o Peixe Verde! Stamina recuperada.', 'goku')
  } else if (item.id === 'lanche') {
    const heal = Math.floor(Math.random() * 11) + 5
    gokuHp.value = Math.min(gokuMaxHp.value, gokuHp.value + heal)
    addToLog(`Goku fez um lanche rápido. (+${heal} HP)`, 'goku')
  } else if (item.id === 'maca') {
    const dmg = Math.floor(Math.random() * 6) + 5
    currentTarget.value.hp = Math.max(0, currentTarget.value.hp - dmg)
    addToLog(`Goku atirou a Maçã Envenenada em ${currentTarget.value.name}! (-${dmg} HP)`, 'goku')
    screenEffect.value = 'shake'
  }

  setTimeout(() => screenEffect.value = '', 200)
  checkWinCondition()
}

const confirmFusion = (accepted: boolean) => {
  if (accepted && fusionInvite.value) {
    const partner = arenaPlayers.value.find(p => p.id === fusionInvite.value?.enemyId)!
    
    originalStats = { hp: gokuHp.value, maxHp: gokuMaxHp.value, name: gokuName.value, ki: gokuKi.value, stamina: gokuStamina.value }
    partnerStats = { hp: partner.hp, maxHp: partner.maxHp, name: partner.name }
    
    canAttackInFusion.value = gokuLevel.value >= partner.level
    
    const newName = gokuName.value.substring(0, 3) + partner.name.substring(partner.name.length - 3)
    gokuName.value = newName.toUpperCase()
    
    gokuMaxHp.value += partner.maxHp
    gokuHp.value = gokuMaxHp.value
    gokuMaxKi.value += 5 
    gokuKi.value = gokuMaxKi.value
    gokuMaxStamina.value += 100 
    gokuStamina.value = gokuMaxStamina.value
    gokuLevel.value += partner.level
    gokuStr.value += partner.str
    gokuSpd.value += partner.spd
    gokuDef.value += partner.def
    
    playerForm.value = 'FUSÃO POTARA'
    isFused.value = true
    fusionTimeLeft.value = 300 
    fusionDamageTaken.value = 0
    
    startFusionTimer()

    announce(`A FUSÃO FOI UM SUCESSO! SURGE ${gokuName.value}!`)
    if (!canAttackInFusion.value) announce('AVISO: VOCÊ É O COMPONENTE MAIS FRACO. ATAQUES BLOQUEADOS.')
    
    screenEffect.value = 'flash'
    partner.hp = 0
  } else {
    addToLog('A fusão foi cancelada.', 'system')
  }
  fusionInvite.value = null
}

const startFusionTimer = () => {
  clearInterval(fusionClock)
  fusionClock = setInterval(() => {
    if (fusionTimeLeft.value > 0) {
      fusionTimeLeft.value--
    } else {
      unfuse()
    }
  }, 1000)
}

const unfuse = () => {
  clearInterval(fusionClock)
  isFused.value = false
  
  const currentFusionHpPct = gokuHp.value / gokuMaxHp.value
  
  gokuName.value = originalStats.name
  gokuMaxHp.value = originalStats.maxHp
  gokuHp.value = Math.max(1, originalStats.maxHp * currentFusionHpPct)
  gokuMaxKi.value = 5
  gokuMaxStamina.value = 100
  playerForm.value = 'Base'
  
  const partnerInArena = arenaPlayers.value.find(p => p.name === partnerStats.name)
  if (partnerInArena) {
    partnerInArena.hp = Math.max(1, partnerStats.maxHp * currentFusionHpPct)
  }

  announce(`A FUSÃO ACABOU! ${gokuName.value} E ${partnerStats.name} SE SEPARARAM!`)
  screenEffect.value = 'shake'
}

// INIMIGOS ATACAM A CADA 1 MINUTO
const executeEnemyTurn = () => {
  if (isGameOver.value || aliveEnemies.value.length === 0) return

  aliveEnemies.value.forEach(attacker => {
    let dmg = Math.floor(Math.random() * 8) + 4
    
    const ePassive = getPassiveState(attacker)
    if (ePassive.type === 'saiyan' && ePassive.active) dmg = Math.floor(dmg * 1.5)

    gokuHp.value = Math.max(0, gokuHp.value - dmg)
    attacker.stamina = Math.max(0, attacker.stamina - 15)
    
    if (isFused.value) fusionDamageTaken.value += dmg
  })

  addToLog(`A ARENA INTEIRA AVANÇA EM UM ATAQUE COORDENADO!`, 'enemy')
  
  screenEffect.value = 'shake'
  setTimeout(() => screenEffect.value = '', 300)

  gokuStamina.value = Math.min(gokuMaxStamina.value, gokuStamina.value + 10)
  aliveEnemies.value.forEach(e => e.stamina = Math.min(100, e.stamina + 10))

  checkWinCondition()
}

const checkWinCondition = () => {
  if (gokuHp.value <= 0 || aliveEnemies.value.length === 0 || timer.value <= 0) {
    isGameOver.value = true
    clearInterval(clockInterval)
    clearInterval(turnInterval)
    clearInterval(fusionClock)
    
    if (gokuHp.value <= 0) announce('E A VITÓRIA ESCAPA DE SUAS MÃOS! GOKU ESTÁ DERROTADO!')
    else if (aliveEnemies.value.length === 0) announce('É O FIM! TEMOS UM CAMPEÃO! GOKU É O ÚLTIMO DE PÉ NA ARENA!')
    else announce('O TEMPO ACABOU! A SOBREVIVÊNCIA ESTÁ CONCLUÍDA!')
  }
}

onMounted(() => {
  announce('🎙️ SENHORAS E SENHORES! BEM-VINDOS AO TORNEIO DE SOBREVIVÊNCIA! QUE COMECE A BATALHA!')
  clockInterval = setInterval(() => {
    if (timer.value > 0 && !isGameOver.value) {
      timer.value--
      if (timer.value === 0) checkWinCondition()
    }
  }, 1000)
  startTurnTimer()
})

onUnmounted(() => {
  clearInterval(clockInterval)
  clearInterval(turnInterval)
  clearInterval(fusionClock)
})
</script>

<template>
  <div :class="['relative w-full h-screen bg-[#f4f4f5] overflow-hidden font-sans select-none transition-all flex flex-col', screenEffect]">
    
    <div class="absolute inset-0 z-0 pointer-events-none">
      <img src="/templates/arena_background.jpg" 
           class="w-full h-full object-cover opacity-70" 
           alt="Arena de Batalha" />
      <div class="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
    </div>

    <button @click="exitSaga" class="absolute top-6 left-6 z-50 text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-2 cursor-pointer bg-white/50 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm border border-white/50">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
      <span class="font-bold text-xs tracking-widest uppercase mt-0.5">Sair</span>
    </button>

    <header class="absolute top-0 left-0 w-full z-20 flex justify-between items-start p-6 md:px-12 md:pt-8 pointer-events-none">
      
      <div class="w-[40%] max-w-[500px] flex flex-col gap-2 mt-10">
        <div class="flex items-end gap-3 mb-1">
          <img src="/templates/equipamentos/goku.png" class="size-14 rounded-md border-2 border-white shadow-md object-cover object-top bg-neutral-200" alt="Goku Avatar" />
          <div class="flex flex-col justify-end">
            <div class="flex items-baseline gap-2">
              <h2 class="text-neutral-900 font-black italic tracking-widest text-xl uppercase drop-shadow-md leading-none">{{ gokuName }}</h2>
              <span class="text-neutral-700 font-black italic text-xs">Nvl {{ gokuLevel }}</span>
            </div>
            
            <div class="flex items-center gap-2 mt-1">
              <span :class="['font-bold italic text-[10px] px-1.5 rounded-sm uppercase border w-max transition-all', getFormBadgeClasses(playerForm, kaiokenLevel)]">
                {{ currentFormText }}
              </span>
              <span :title="gokuPassive.title" :class="['text-base transition-all filter', gokuPassive.active ? 'grayscale-0 opacity-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'grayscale opacity-40']">
                {{ gokuPassive.icon }}
              </span>
              <span v-if="isScouterActive" class="font-bold italic text-[10px] px-1.5 rounded-sm uppercase border w-max transition-all text-green-700 border-green-500 bg-green-50 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse flex items-center gap-1">
                ◎ Scouter
              </span>
            </div>

          </div>
        </div>
        
        <div class="relative w-full h-6 bg-neutral-300/80 backdrop-blur-md overflow-hidden border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] skew-x-[-15deg] origin-left flex items-center justify-center">
          <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300" :style="{ width: (gokuHp / gokuMaxHp) * 100 + '%' }">
            <div class="absolute top-0 right-0 w-4 h-full bg-white/50 blur-sm"></div>
          </div>
          <span class="z-10 text-white font-black italic text-xs tracking-widest skew-x-[15deg] text-shadow-hard">{{ Math.floor(gokuHp) }} / {{ gokuMaxHp }}</span>
        </div>
        
        <div class="flex gap-3 w-full pl-2">
          <div class="relative w-[60%] flex gap-1 h-4 skew-x-[-15deg] origin-left">
            <div v-for="i in gokuMaxKi" :key="'k'+i" :class="['flex-1 h-full border border-white transition-all', gokuKi >= i ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]' : 'bg-neutral-300/30']"></div>
            <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <span class="text-white font-black italic text-[9px] tracking-widest skew-x-[15deg] text-shadow-hard">{{ Math.floor(gokuKi) }} / {{ gokuMaxKi }}</span>
            </div>
          </div>
          <div class="relative w-[35%] h-4 bg-neutral-300/80 border border-white skew-x-[-15deg] overflow-hidden shadow-sm flex items-center justify-center">
            <div class="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-300" :style="{ width: (gokuStamina / gokuMaxStamina) * 100 + '%' }"></div>
            <span class="z-10 text-white font-black italic text-[9px] tracking-widest skew-x-[15deg] text-shadow-hard">{{ Math.floor(gokuStamina) }} / {{ gokuMaxStamina }}</span>
          </div>
        </div>

        <div v-if="isFused" class="w-full mt-2 flex flex-col gap-1 animate-fade-in">
           <div class="flex justify-between items-center text-yellow-600 font-black italic text-[10px] tracking-widest uppercase">
              <span>Fusão Potara</span>
              <span>{{ Math.floor(fusionTimeLeft / 60) }}:{{ (fusionTimeLeft % 60).toString().padStart(2, '0') }}</span>
           </div>
           <div class="w-full h-1.5 bg-neutral-300/50 rounded-full border border-yellow-500/30 overflow-hidden">
              <div class="h-full bg-yellow-400 shadow-[0_0_8px_#fbbf24] transition-all duration-1000 linear" :style="{ width: (fusionTimeLeft / 300) * 100 + '%' }"></div>
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

      <div v-if="currentTarget" class="w-[40%] max-w-[500px] flex flex-col gap-2 items-end mt-10 transition-all duration-300" :key="'hud-'+currentTarget.id">
        <div class="flex items-end gap-3 mb-1 flex-row-reverse text-right">
          <img :src="currentTarget.avatar" onerror="this.src='/templates/equipamentos/jiren.png'" class="size-14 rounded-md border-2 border-white shadow-md object-cover object-top bg-neutral-200" :alt="currentTarget.name" />
          <div class="flex flex-col justify-end items-end">
            <div class="flex items-baseline gap-2 flex-row-reverse">
              <h2 class="text-neutral-900 font-black italic tracking-widest text-xl uppercase drop-shadow-md leading-none">[{{ currentTarget.tag }}] {{ currentTarget.name }}</h2>
              <span class="text-neutral-700 font-black italic text-xs">Nvl {{ currentTarget.level }}</span>
            </div>
            
            <div class="flex items-center gap-2 mt-1 flex-row-reverse">
              <span :class="['font-bold italic text-[10px] px-1.5 rounded-sm uppercase border w-max', getFormBadgeClasses(currentTarget.form)]">
                {{ currentTarget.form }}
              </span>
              <span :title="getPassiveState(currentTarget).title" :class="['text-base transition-all filter', getPassiveState(currentTarget).active ? 'grayscale-0 opacity-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'grayscale opacity-40']">
                {{ getPassiveState(currentTarget).icon }}
              </span>
              <span v-if="currentTarget.hasScouter" class="font-bold italic text-[10px] px-1.5 rounded-sm uppercase border w-max transition-all text-green-700 border-green-500 bg-green-50 shadow-[0_0_8px_rgba(34,197,94,0.5)] flex items-center gap-1">
                ◎ Scouter
              </span>
            </div>
            
          </div>
        </div>
        
        <div class="relative w-full h-6 bg-neutral-300/80 backdrop-blur-md overflow-hidden border-2 border-white shadow-[0_0_15px_rgba(220,38,38,0.4)] skew-x-[15deg] origin-right flex items-center justify-center">
          <div class="absolute top-0 right-0 h-full bg-gradient-to-l from-orange-500 to-red-600 transition-all duration-300" :style="{ width: (currentTarget.hp / currentTarget.maxHp) * 100 + '%' }">
            <div class="absolute top-0 left-0 w-4 h-full bg-white/50 blur-sm"></div>
          </div>
          <span class="z-10 text-white font-black italic text-xs tracking-widest skew-x-[-15deg] text-shadow-hard">{{ Math.floor(currentTarget.hp) }} / {{ currentTarget.maxHp }}</span>
        </div>
        
        <div class="flex gap-3 w-full pr-2 flex-row-reverse">
          <div class="relative w-[60%] flex gap-1 h-4 skew-x-[15deg] origin-right justify-end flex-row-reverse">
            <div v-for="i in 5" :key="'ek'+i" :class="['flex-1 h-full border border-white transition-all', currentTarget.ki >= i ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-neutral-300/30']"></div>
            <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <span class="text-white font-black italic text-[9px] tracking-widest skew-x-[-15deg] text-shadow-hard">{{ Math.floor(currentTarget.ki) }} / 5</span>
            </div>
          </div>
          <div class="relative w-[35%] h-4 bg-neutral-300/80 border border-white skew-x-[15deg] overflow-hidden shadow-sm flex items-center justify-center">
            <div class="absolute top-0 right-0 h-full bg-yellow-500 transition-all duration-300" :style="{ width: currentTarget.stamina + '%' }"></div>
            <span class="z-10 text-white font-black italic text-[9px] tracking-widest skew-x-[-15deg] text-shadow-hard">{{ Math.floor(currentTarget.stamina) }} / 100</span>
          </div>
        </div>

        <div v-if="isScouterActive" class="w-full flex justify-end gap-2 mt-1 animate-fade-in pointer-events-none">
          <div class="bg-green-950/90 border border-green-500 backdrop-blur-md rounded px-3 py-1.5 flex flex-col items-end shadow-[0_0_15px_rgba(34,197,94,0.4)] relative overflow-hidden">
            <div class="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
            <div class="text-green-400 font-mono text-[9px] uppercase tracking-widest flex gap-3 relative z-10 text-shadow-hard">
              <span>For: <strong class="text-green-200">{{ currentTarget.str }}</strong></span>
              <span>Vel: <strong class="text-green-200">{{ currentTarget.spd }}</strong></span>
              <span>Def: <strong class="text-green-200">{{ currentTarget.def }}</strong></span>
            </div>
            <div class="text-green-400 font-black italic text-xs tracking-widest relative z-10 mt-0.5 text-shadow-hard">
              PDL: <span class="text-green-100 drop-shadow-[0_0_5px_#4ade80]">{{ currentTarget.pl }}</span>
            </div>
          </div>
        </div>

      </div>
    </header>

    <main class="absolute inset-0 z-30 flex justify-center items-center pointer-events-none mt-20">
      <div class="w-[850px] bg-[#f8f9fa]/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col pointer-events-auto border border-white/80 text-neutral-800 overflow-hidden">
        
        <div class="flex flex-col p-6 bg-white/20 items-center justify-center border-b border-neutral-300">
          
          <div class="w-full flex flex-col gap-1.5 mb-4">
            <div class="flex justify-between items-end">
              <label class="text-[10px] font-black uppercase tracking-widest text-cyan-600">
                Sua Vez de Agir!
              </label>
              <span class="text-[10px] font-bold text-neutral-500 tabular-nums">
                (Tempo limite: {{ turnTimeLeft }}s)
              </span>
            </div>
            <div class="h-2 w-full bg-neutral-300 rounded-full overflow-hidden shadow-inner border border-white/50">
              <div class="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-1000 ease-linear" :style="{ width: (turnTimeLeft / 60) * 100 + '%' }"></div>
            </div>
          </div>

          <div class="flex gap-6 w-full">
            
            <div class="flex-1 flex flex-col gap-2">
              <h3 class="text-[11px] font-black text-neutral-500 uppercase tracking-widest">Técnicas no Alvo</h3>
              <div class="relative w-full">
                <select v-model="selectedAttack" class="w-full appearance-none bg-white border border-neutral-300 text-neutral-800 font-bold text-[11px] tracking-wider uppercase p-3 rounded-xl outline-none focus:border-cyan-600 transition-all cursor-pointer shadow-sm">
                  <option v-for="atk in attacks" :key="atk.id" :value="atk.id">
                    {{ atk.name }} | KI: {{ atk.kiCost }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span class="text-neutral-400 text-xs">▼</span>
                </div>
              </div>
              <button @click="executeAction" :disabled="isGameOver || (isFused && !canAttackInFusion)" 
                      class="w-full bg-neutral-950 text-white p-3 rounded-xl font-black italic uppercase tracking-tighter text-lg hover:bg-cyan-600 disabled:opacity-40 disabled:grayscale transition-all shadow-xl flex justify-center items-center cursor-pointer">
                {{ (isFused && !canAttackInFusion) ? 'Impossibilitado' : 'EXECUTAR GOLPE' }}
              </button>
            </div>

            <div class="flex-1 flex flex-col gap-2">
              <h3 class="text-[11px] font-black text-neutral-500 uppercase tracking-widest">Mochila</h3>
              <div class="relative w-full">
                <select v-model="selectedItem" class="w-full appearance-none bg-white border border-neutral-300 text-neutral-800 font-bold text-[11px] tracking-wider uppercase p-3 rounded-xl outline-none focus:border-green-600 transition-all cursor-pointer shadow-sm">
                  <option v-for="item in items" :key="item.id" :value="item.id">
                    {{ item.name }} — ({{ item.desc }})
                  </option>
                </select>
                <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span class="text-neutral-400 text-xs">▼</span>
                </div>
              </div>
              <button @click="useItem" :disabled="isGameOver" 
                      class="w-full bg-green-600 text-white p-3 rounded-xl font-black italic uppercase tracking-tighter text-lg hover:bg-green-500 disabled:opacity-40 disabled:grayscale transition-all shadow-xl flex justify-center items-center cursor-pointer">
                USAR ITEM
              </button>
            </div>

          </div>
        </div>

        <div class="p-6 h-[160px] flex flex-col bg-white/40">
          <div class="overflow-y-auto flex flex-col gap-2 flex-1 scrollbar-hide text-[13px] leading-relaxed">
            <div v-for="(log, i) in combatLog" :key="i" class="flex gap-2">
              <span v-if="log.type === 'system'" class="text-neutral-500 font-bold">[SISTEMA]</span>
              <span v-else-if="log.type === 'goku'" class="text-cyan-600 font-bold">[JOGADOR]</span>
              <span v-else-if="log.type === 'enemy'" class="text-red-600 font-bold">[INIMIGO]</span>
              <span v-else-if="log.type === 'announcer'" class="text-yellow-600 font-black italic tracking-wide uppercase drop-shadow-sm flex items-center gap-1">
                🎙️ [LOCUTOR]
              </span>
              <span :class="log.type === 'announcer' ? 'text-yellow-700 font-bold' : 'text-neutral-800'">{{ log.msg }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white/60 p-4 border-t border-neutral-300 shadow-inner flex flex-col gap-2">
          <h3 class="text-[10px] font-black tracking-widest uppercase text-neutral-600 flex items-center gap-2 italic">
            <span class="size-2 bg-red-500 rounded-full animate-pulse"></span> Oponentes na Arena (Selecione o Alvo)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto pr-2 max-h-[220px] custom-scrollbar py-1">
            
            <div v-for="enemy in arenaPlayers" :key="enemy.id" 
                 @click="selectTarget(enemy.id)"
                 :class="[
                   'flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer backdrop-blur-sm relative overflow-hidden',
                   enemy.hp <= 0 ? 'opacity-40 grayscale pointer-events-none border-neutral-300 bg-neutral-200' :
                   selectedTargetId === enemy.id ? 'border-red-500 bg-red-50/80 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-neutral-300 bg-white/80 hover:border-red-300'
                 ]">
              
              <div v-if="enemy.hasPotara && enemy.hp > 0" class="absolute right-[-8px] top-[-8px] opacity-50 pointer-events-none">
                 <img src="/templates/itens/potara.png" style="border-radius: 8px; display: block;" />
              </div>

              <div v-if="enemy.hp <= 0" class="absolute inset-0 flex justify-center items-center z-20 bg-black/10">
                <span class="text-red-600 font-black text-2xl uppercase tracking-widest transform rotate-[-15deg] text-shadow-hard drop-shadow-md">K.O.</span>
              </div>

              <img :src="enemy.avatar" onerror="this.src='/templates/equipamentos/jiren.png'" class="size-14 rounded object-cover border border-white shadow-sm shrink-0" :alt="enemy.name" />
              
              <div class="flex flex-col flex-1 w-full relative z-10 gap-1 overflow-hidden">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-xs font-black uppercase text-neutral-900 leading-tight truncate italic">{{ enemy.name }}</span>
                  <span class="text-[9px] font-black italic text-neutral-500 shrink-0">Nvl {{ enemy.level }}</span>
                </div>
                
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span :class="['text-[8px] font-bold uppercase px-1 rounded-sm w-max', getFormBadgeClasses(enemy.form)]">{{ enemy.form }}</span>
                  
                  <span :title="getPassiveState(enemy).title" :class="['text-[10px] transition-all filter', getPassiveState(enemy).active ? 'grayscale-0 opacity-100 drop-shadow-sm' : 'grayscale opacity-40']">
                    {{ getPassiveState(enemy).icon }}
                  </span>

                  <span v-if="enemy.hasScouter" class="text-[7px] font-bold uppercase px-1 rounded-sm border border-green-500 text-green-700 bg-green-50 shadow-[0_0_5px_rgba(34,197,94,0.5)] flex items-center gap-0.5 animate-pulse">
                    ◎ Scouter
                  </span>
                </div>
                
                <div class="flex flex-col gap-0.5 mt-1">
                  <div class="relative w-full h-3 bg-neutral-300/80 border border-white skew-x-[-10deg] overflow-hidden flex items-center justify-center">
                    <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all" :style="{ width: (enemy.hp / enemy.maxHp) * 100 + '%' }"></div>
                    <span class="z-10 text-white font-black italic text-[8px] tracking-widest skew-x-[10deg] text-shadow-hard">{{ Math.floor(enemy.hp) }}/{{ enemy.maxHp }}</span>
                  </div>
                  <div class="flex gap-1 w-full">
                    <div class="relative w-1/2 h-2.5 bg-neutral-300/80 border border-white skew-x-[-10deg] overflow-hidden flex items-center justify-center">
                      <div class="absolute top-0 left-0 h-full bg-cyan-400 transition-all" :style="{ width: (enemy.ki / 5) * 100 + '%' }"></div>
                      <span class="z-10 text-white font-black italic text-[7px] tracking-widest skew-x-[10deg] text-shadow-hard">{{ Math.floor(enemy.ki) }}/5</span>
                    </div>
                    <div class="relative w-1/2 h-2.5 bg-neutral-300/80 border border-white skew-x-[-10deg] overflow-hidden flex items-center justify-center">
                      <div class="absolute top-0 left-0 h-full bg-yellow-400 transition-all" :style="{ width: enemy.stamina + '%' }"></div>
                      <span class="z-10 text-white font-black italic text-[7px] tracking-widest skew-x-[10deg] text-shadow-hard">{{ Math.floor(enemy.stamina) }}%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </main>

    <div v-if="fusionInvite" class="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-auto">
        <div class="bg-white p-8 rounded-2xl border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)] text-center max-w-sm">
            <h3 class="text-2xl font-black italic uppercase mb-2">FUSÃO POTARA</h3>
            <p class="text-neutral-600 text-sm font-bold mb-6">Deseja realizar a fusão com {{ fusionInvite.to }}?</p>
            <div class="flex gap-4">
                <button @click="confirmFusion(true)" class="flex-1 bg-green-600 text-white py-3 rounded-xl font-black uppercase hover:bg-green-500 transition-colors cursor-pointer">ACEITAR</button>
                <button @click="confirmFusion(false)" class="flex-1 bg-red-600 text-white py-3 rounded-xl font-black uppercase hover:bg-red-500 transition-colors cursor-pointer">RECUSAR</button>
            </div>
        </div>
    </div>

    <div v-if="isGameOver" class="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/80 backdrop-blur-sm pointer-events-auto">
      <div class="bg-white px-20 py-10 rounded-2xl shadow-2xl text-center border-2 border-neutral-300">
        <h1 class="text-5xl font-black italic tracking-widest uppercase text-neutral-900 mb-6">
          {{ gokuHp <= 0 ? 'K.O.' : 'ARENA DOMINADA' }}
        </h1>
        <button @click="() => location.reload()" class="px-10 py-4 bg-neutral-900 text-white font-black italic uppercase tracking-[0.2em] text-sm hover:bg-red-600 transition-all rounded-xl shadow-lg">
          Lutar Novamente
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.text-shadow-hard {
  text-shadow: 
    1px 1px 0px #000, 
    -1px -1px 0px #000, 
    1px -1px 0px #000, 
    -1px 1px 0px #000, 
    0px 2px 4px rgba(0,0,0,0.8);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.4);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.8);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(239, 68, 68, 0.4) transparent;
}

.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px) skewX(-15deg); } to { opacity: 1; transform: translateY(0) skewX(-15deg); } }

.shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
.flash { animation: flashWhite 0.2s ease-out both; }
@keyframes shake {
  10%, 90% { transform: translate3d(-3px, 0, 0); }
  20%, 80% { transform: translate3d(5px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-10px, 0, 0); }
  40%, 60% { transform: translate3d(10px, 0, 0); }
}
@keyframes flashWhite {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
  100% { filter: brightness(1); }
}
</style>