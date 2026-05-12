<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

useHead({ title: 'Base de Comando - Dragon Ball Z RPG' })
const auth = useAuthStore()

// --- MOCK DATA DO JOGADOR ---
const playerStatus = {
  powerLevel: '145.200',
  zeni: '12,540',
  location: 'Planeta Terra - Capital do Oeste',
  isVip: true,
  vipUntil: '15 MAI 2026',
  hp: 100, maxHp: 100,
  ki: 85, maxKi: 100,
  stamina: 60, maxStamina: 100
}

// --- MISSÕES DIÁRIAS ---
interface DailyMission {
  id: number
  title: string
  desc: string
  progress: number
  total: number
  image: string
  reward: { zeni: number; exp: number }
  claimed: boolean
}

const dailyMissions = ref<DailyMission[]>([
  { id: 1, title: 'Aquecimento', desc: 'Derrota 5 Saibamens.', progress: 5, total: 5, image: '/templates/capsula.png', reward: { zeni: 200, exp: 100 }, claimed: false },
  { id: 2, title: 'Controle de Ki', desc: 'Treina Atributos 3 vezes.', progress: 1, total: 3, image: '/templates/cell.png', reward: { zeni: 150, exp: 80 }, claimed: false },
  { id: 3, title: 'Desafiante', desc: 'Vence 1 duelo na Arena.', progress: 0, total: 1, image: '/templates/freeza.png', reward: { zeni: 500, exp: 250 }, claimed: false },
  { id: 4, title: 'Explorador', desc: 'Encontra 1 Esfera do Dragão.', progress: 0, total: 1, image: '/templates/esferas.png', reward: { zeni: 1000, exp: 500 }, claimed: false },
  { id: 5, title: 'Treino Pesado', desc: 'Gravidade 100x.', progress: 2, total: 10, image: '/templates/treinopesado.png', reward: { zeni: 300, exp: 200 }, claimed: false },
  { id: 6, title: 'Patrulha Galáctica', desc: 'Ajude o Jaco.', progress: 0, total: 1, image: '/templates/patrulha.png', reward: { zeni: 400, exp: 150 }, claimed: false },
  { id: 7, title: 'Mestre Kame', desc: 'Entrega de leite.', progress: 1, total: 1, image: '/templates/mestrekame.png', reward: { zeni: 250, exp: 120 }, claimed: false }
])

const claimReward = (mission: DailyMission) => {
  if (mission.progress < mission.total || mission.claimed) return
  mission.claimed = true
  // TODO: Chamar API para registrar coleta e adicionar recompensas ao jogador
}

// --- NOVIDADES ---
const featuredNews = {
  id: 1, 
  title: 'O DESPERTAR DOS GUERREIROS: Explore o Novo Ecossistema de RPG por Turnos Completamente Repaginado!', 
  category: 'PATCH NOTES', date: '27 MAR 2026', author: 'Equipe Z', 
  likes: 1240, image: 'https://4kwallpapers.com/images/wallpapers/dragon-ball-3840x2160-14616.jpeg'
}

const listNews = [
  { id: 2, title: 'O HERDEIRO DO FUTURO – Trunks chega com Habilidades Exclusivas!', category: 'PERSONAGENS', date: '25 MAR 2026', author: 'Dev Team', likes: 850, image: 'https://wallpapers-clan.com/wp-content/uploads/2024/10/epic-dragon-ball-trunks-desktop-wallpaper-cover-1.jpg' },
  { id: 3, title: 'DOMINAÇÃO TOTAL: Inscrições abertas para o Torneio do Poder!', category: 'COMPETITIVO', date: '22 MAR 2026', author: 'Sr. Kaioh', likes: 2100, image: 'https://criticalhits.com.br/wp-content/uploads/2018/03/goku-jiren-05.jpg' },
  { id: 4, title: 'PROTEJA SUA CONTA: Novo Protocolo de Segurança Z-Shield!', category: 'SISTEMA', date: '18 MAR 2026', author: 'Suporte', likes: 430, image: '/templates/verificacao_email.png' },
  { id: 5, title: 'DIÁRIO DOS DEVS: Transformações de Classe no Próximo Mês!', category: 'DIÁRIO', date: '15 MAR 2026', author: 'Equipe Z', likes: 980, image: 'https://assetsio.gnwcdn.com/Captura-de-ecra%CC%83-2026-01-25%2C-a%CC%80s-08.56.06.png' }
]

// --- LÓGICA DE DRAG COM INÉRCIA ---
const scrollContainer = ref<HTMLElement | null>(null)
let isDown = false, startX: number, scrollLeft: number, velocity = 0, rafId: number, lastPos: number, lastTime: number

const runMomentum = () => {
  if (!scrollContainer.value) return
  scrollContainer.value.scrollLeft += velocity
  velocity *= 0.95 
  if (Math.abs(velocity) > 0.5) rafId = requestAnimationFrame(runMomentum)
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDown = true; velocity = 0; cancelAnimationFrame(rafId)
  const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
  startX = pageX - (scrollContainer.value?.offsetLeft || 0)
  scrollLeft = scrollContainer.value?.scrollLeft || 0
  lastPos = pageX; lastTime = Date.now()
}

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDown || !scrollContainer.value) return
  const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
  scrollContainer.value.scrollLeft = scrollLeft - (pageX - (scrollContainer.value.offsetLeft + startX))
  const now = Date.now(), dx = pageX - lastPos
  velocity = -dx * 0.8; lastPos = pageX; lastTime = now
}
const stopDrag = () => { isDown = false; runMomentum() }
</script>

<template>
  <div class="animate-fade-in bg-neutral-50 min-h-screen overflow-x-hidden text-neutral-900 font-sans">
    
    <section class="relative w-full min-h-[400px] bg-[#09090b] overflow-hidden flex flex-col justify-end pb-12 border-b border-neutral-800 shadow-2xl">
      <img src="https://images.alphacoders.com/135/thumb-1920-1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col gap-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="flex items-center gap-6">
            <div class="relative shrink-0">
              <div class="absolute -inset-1.5 bg-gradient-to-tr from-red-600 to-yellow-500 blur-sm opacity-50"></div>
              <div class="relative size-24 md:size-28 bg-[#111] p-1 shadow-2xl" style="clip-path: polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%);">
                <img :src="auth.user?.avatarUrl || 'https://www.kodargames.com/images/team/shiro.webp'" class="w-full h-full object-cover" />
              </div>
              <div class="absolute -bottom-1 left-1/6 -translate-x-1/10 bg-red-600 text-white text-[10px] font-black px-5 py-1 rounded shadow-lg uppercase italic border border-white/10">Nível 85</div>
            </div>

            <div class="flex flex-col">
              <div class="flex items-center gap-2 mb-1.5 font-black text-red-500 text-[10px] uppercase tracking-widest leading-none">
                <span class="w-2 h-2 bg-red-500 animate-pulse rounded-full"></span> /// {{ playerStatus.location }}
              </div>
              <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-md leading-none">
                {{ auth.user?.name || auth.user?.username || '[DBZ] Shiro' }}
              </h1>
              <span v-if="playerStatus.isVip" class="mt-2 text-yellow-400 text-[10px] font-black uppercase bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20 w-fit">CONTA VIP ATÉ {{ playerStatus.vipUntil }}</span>
            </div>
          </div>

          <div class="bg-[#111113]/80 backdrop-blur-md border-l-4 border-red-600 px-6 py-4 flex flex-col justify-center min-w-[200px]" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 15px) 100%, 0 100%, 0 10px);">
            <span class="text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-1 italic">Poder de Luta</span>
            <span class="text-3xl font-black text-green-400 tracking-tighter tabular-nums leading-none">{{ playerStatus.powerLevel }}</span>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row bg-[#111113]/95 backdrop-blur-xl border border-neutral-800 shadow-2xl overflow-hidden" style="clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 15px) 100%, 0 100%, 0 10px);">
          <div class="flex-1 px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-b lg:border-b-0 lg:border-r border-neutral-800">
            <div v-for="stat in [{l:'Saúde (HP)', v:playerStatus.hp, m:playerStatus.maxHp, c:'from-red-600 to-red-400'}, {l:'Ki Energy', v:playerStatus.ki, m:playerStatus.maxKi, c:'from-cyan-500 to-blue-600'}, {l:'Estamina', v:playerStatus.stamina, m:playerStatus.maxStamina, c:'from-orange-500 to-yellow-500'}]" :key="stat.l" class="flex flex-col gap-2">
              <div class="flex justify-between text-[10px] font-black uppercase italic text-neutral-100">
                <span>{{ stat.l }}</span>
                <span class="tracking-tighter tabular-nums font-bold">{{ stat.v }} / {{ stat.m }}</span>
              </div>
              <div class="h-2.5 bg-black rounded-full border border-white/10 relative overflow-hidden">
                <div class="h-full bg-gradient-to-r transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.5)]" :class="stat.c" :style="`width: ${stat.v}%`"></div>
              </div>
            </div>
          </div>
          <div class="px-10 py-6 flex flex-col justify-center bg-neutral-900/60 min-w-[180px]">
            <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 italic">Zenis Correntes</span>
            <div class="flex items-center gap-3 font-black text-2xl text-yellow-500 italic leading-none">
              <i-solar:wad-of-money-bold class="size-6" /> {{ playerStatus.zeni }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mt-16">
      <h2 class="text-3xl font-black text-neutral-900 italic uppercase tracking-tighter">Missões Diárias</h2>
      <div class="w-full mt-8 relative">
        <div ref="scrollContainer" class="flex gap-6 overflow-x-auto pb-12 cursor-grab active:cursor-grabbing hide-scrollbar select-none"
             @mousedown="startDrag" @mousemove="handleDrag" @mouseup="stopDrag" @mouseleave="stopDrag"
             @touchstart="startDrag" @touchmove="handleDrag" @touchend="stopDrag">
          
          <div v-for="(mission, index) in dailyMissions" :key="mission.id"
               class="relative w-[300px] h-[440px] shrink-0 transition-all duration-500 hover:scale-[1.03] bg-neutral-900 overflow-hidden shadow-xl group"
               :class="[
                 index !== 0 ? '-ml-10' : '',
                 mission.claimed ? 'ring-2 ring-neutral-500/30 opacity-60' : mission.progress === mission.total ? 'ring-2 ring-yellow-500/50 shadow-yellow-900/20' : ''
               ]"
               style="clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);">
            
            <img :src="mission.image" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" 
                 :class="mission.claimed ? 'opacity-20 grayscale' : mission.progress === mission.total ? 'opacity-80' : 'opacity-80'" draggable="false" />
            
            <div v-if="mission.claimed" class="absolute top-6 right-8 z-10 bg-green-500 text-white p-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)]">
              <i-solar:check-circle-bold class="size-6" />
            </div>
            <div v-else-if="mission.progress === mission.total" class="absolute top-6 right-8 z-10 bg-yellow-500 text-black p-1.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.6)] animate-bounce">
              <i-solar:gift-bold class="size-6" />
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            <div v-if="mission.claimed" class="absolute inset-0 bg-neutral-900/30 pointer-events-none"></div>
            <div v-else-if="mission.progress === mission.total" class="absolute inset-0 bg-yellow-500/5 pointer-events-none"></div>

            <div class="absolute bottom-10 left-0 w-full px-10 text-center">
              <h3 class="text-2xl font-black italic uppercase mb-2 leading-none"
                  :class="mission.claimed ? 'text-neutral-500' : mission.progress === mission.total ? 'text-yellow-400' : 'text-white'">
                {{ mission.title }}
              </h3>
              <p class="text-[10px] font-bold uppercase mb-4 tracking-widest"
                 :class="mission.claimed ? 'text-neutral-600' : mission.progress === mission.total ? 'text-yellow-200/80' : 'text-white/70'">
                {{ mission.claimed ? 'Recompensa Coletada' : mission.progress === mission.total ? `+${mission.reward.zeni} Zeni / +${mission.reward.exp} EXP` : mission.desc }}
              </p>
              
              <div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mb-2 border border-white/5">
                <div class="h-full transition-all duration-1000 ease-out" 
                     :class="mission.claimed ? 'bg-neutral-500' : mission.progress === mission.total ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-orange-500 shadow-[0_0_5px_#f97316]'" 
                     :style="`width: ${(mission.progress/mission.total)*100}%`" />
              </div>
              
              <button v-if="mission.progress === mission.total && !mission.claimed"
                      @click.stop="claimReward(mission)"
                      class="mt-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer">
                Coletar Recompensa
              </button>
              <span v-else class="text-[11px] font-black uppercase italic tracking-widest tabular-nums"
                    :class="mission.claimed ? 'text-neutral-500' : 'text-white/80'">
                {{ mission.claimed ? 'Concluída ✓' : `${mission.progress} / ${mission.total}` }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 mt-16 mb-20">
      <h2 class="text-3xl font-black text-neutral-900 italic uppercase mb-8 tracking-tighter">Novidades do Universo</h2>
      <div class="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
        
        <RouterLink :to="`/news/${featuredNews.id}`" class="relative h-[500px] rounded-2xl overflow-hidden group shadow-2xl border border-neutral-200 block">
          <img :src="featuredNews.image" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div class="absolute bottom-10 left-10 right-10 text-white">
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-red-600 px-3 py-1 text-[10px] font-black uppercase italic tracking-widest">Destaque</span>
              <div class="flex items-center gap-3 text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
                 <span class="flex items-center gap-1"><i-solar:heart-bold class="size-3 text-red-500"/> {{ featuredNews.likes }}</span>
              </div>
            </div>
            <h3 class="text-3xl font-black uppercase italic leading-tight group-hover:text-red-500 transition-colors">{{ featuredNews.title }}</h3>
          </div>
        </RouterLink>

        <div class="flex flex-col gap-4">
          <RouterLink v-for="news in listNews" :key="news.id" :to="`/news/${news.id}`" class="flex bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-lg transition-all group">
            <div class="flex-1 p-5 flex flex-col justify-center">
              <span class="text-[9px] font-black text-red-500 uppercase italic mb-1">{{ news.category }}</span>
              <h4 class="text-sm font-black uppercase italic group-hover:text-red-600 transition-colors leading-tight mb-2 line-clamp-2">{{ news.title }}</h4>
              <div class="flex items-center gap-3 text-[9px] font-black text-neutral-400 uppercase italic">
                <span>{{ news.date }}</span>
                <span class="flex items-center gap-1"><i-solar:heart-outline class="size-3"/> {{ news.likes }}</span>
              </div>
            </div>
            <div class="w-32 shrink-0 overflow-hidden"><img :src="news.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="relative w-full min-h-[500px] mt-24 bg-[#f3f4f6] overflow-hidden flex flex-col md:flex-row border-y border-neutral-200">
      <div class="w-full md:w-[45%] flex justify-center md:justify-end p-10 md:p-16 z-10 relative">
        <div class="max-w-[450px] w-full flex flex-col items-center md:items-start text-center md:text-left justify-center">
          <h2 class="text-4xl md:text-5xl font-black text-neutral-900 mb-6 tracking-tighter italic uppercase leading-[0.9]">Saia na Frente,<br>Seja VIP</h2>
          <p class="text-neutral-600 mb-8 font-medium">Obtenha vantagens exclusivas no universo Z e trilhe seu próprio caminho para o topo.</p>
          <div class="flex gap-4 mb-10 w-full">
            <div class="bg-white border-2 border-yellow-500/20 py-5 rounded-2xl flex-1 flex flex-col items-center shadow-xl">
              <span class="text-3xl font-black text-yellow-600 italic">2X</span>
              <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest">XP Bônus</span>
            </div>
            <div class="bg-white border-2 border-yellow-500/20 py-5 rounded-2xl flex-1 flex flex-col items-center shadow-xl">
              <span class="text-3xl font-black text-yellow-600 italic">+100%</span>
              <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Zeni Diário</span>
            </div>
          </div>
          <button class="bg-red-600 hover:bg-black text-white font-black text-sm px-12 py-4 rounded-full transition-all uppercase italic tracking-widest shadow-2xl hover:scale-105 active:scale-95">Adquirir Passe VIP</button>
        </div>
      </div>
      <div class="absolute right-0 top-0 w-full md:w-[60%] h-full hidden md:block" style="clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);">
        <img src="https://wallpapers-clan.com/wp-content/uploads/2025/01/dragon-ball-goku-god-of-destruction-fusion-desktop-wallpaper-preview.jpg" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.text-shadow { text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
</style>