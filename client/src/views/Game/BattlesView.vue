<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

useHead({ title: 'Central de Combate | Dragon Ball Z RPG' })
const router = useRouter()

const goBack = () => {
  router.push({ name: 'game-home' })
}

const startProtocol = (id: number) => {
  const routes: Record<number, string> = {
    1: 'sagas',
    2: 'battles1v1',
    3: 'arena',
    4: 'torneio',
    5: 'gravidade',
  }

  const targetRoute = routes[id]
  if (targetRoute) {
    router.push({ name: targetRoute })
  }
}

const battleModes = [

  {

    id: 1,

    title: 'Sagas (Campanha)',

    category: 'PVE ESTRATÉGICO',

    desc: 'Reviva as batalhas icônicas da obra original. Enfrente vilões lendários em uma jornada narrativa que testará seus limites.',

    status: 'DISPONÍVEL',

    difficulty: 'Variável',

    image: '/templates/batalhas/sagas.png'

  },

  {

    id: 2,

    title: 'Duelo 1v1',

    category: 'PVP RANKED',

    desc: 'O clássico combate direto. Desafie outros guerreiros em tempo real para subir no ranking de poder individual.',

    status: 'ONLINE',

    difficulty: 'Competitivo',

    image: '/templates/batalhas/duelo1v1.png'

  },

  {

    id: 3,

    title: 'Arena (Todos x Todos)',

    category: 'BATTLE ROYALE',

    desc: 'Um campo de batalha caótico de sobrevivência. Entre em combates massivos onde apenas o último guerreiro em pé vence.',

    status: 'EVENTO ATIVO',

    difficulty: 'Extremo',

    image: '/templates/batalhas/arena.png'

  },

  {

    id: 4,

    title: 'Torneio de Artes Marciais',

    category: 'ELIMINATÓRIAS',

    desc: 'Participe do Tenkaichi Budokai. Chaveamentos eliminatórios em busca do título de campeão e prêmios em Z-Coins.',

    status: 'INSCRIÇÕES ABERTAS',

    difficulty: 'Elite',

    image: '/templates/batalhas/torneio.png'

  },

  {

    id: 5,

    title: 'Sala de Gravidade',

    category: 'TREINAMENTO',

    desc: 'Treinamento intensivo sob condições extremas. Aumente seus atributos base e multiplique seu ganho de experiência.',

    status: 'TREINO DISPONÍVEL',

    difficulty: 'Evolução',

    image: '/templates/batalhas/gravidade.png'

  }

]

</script>

<template>
  <div class="animate-fade-in bg-white min-h-screen pb-20 text-neutral-900 font-sans">
     <!-- <img src="https://www.riotgames.com/assets/img/structure/2c9f2b01af96673e5fb63b9aab3dad70/ContentShowcaseBKg.svg" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div> -->
    <header class="relative w-full h-[350px] bg-[#09090b] overflow-hidden flex flex-col justify-end pb-12 border-b border-neutral-800 shadow-2xl">
       <img src="https://images.alphacoders.com/135/1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto w-full px-6">
        <button @click="goBack" class="flex items-center gap-2 text-white font-black uppercase text-[10px] bg-white/5 px-5 py-2.5 rounded-full hover:bg-red-600 transition-all italic border border-white/10 mb-8 backdrop-blur-md w-fit">
          <i-solar-arrow-left-outline class="size-4" /> Voltar para a Base
        </button>
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">MODOS DE <span class="text-red-600">JOGO</span></h1>
        <p class="text-neutral-400 text-xs font-black uppercase tracking-[0.4em] italic leading-none">Selecione sua zona de engajamento</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 mt-16">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div v-for="mode in battleModes" :key="mode.id" 
             @click="startProtocol(mode.id)"
             class="group flex flex-col bg-white border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative cursor-pointer">
          
          <div class="relative h-[240px] overflow-hidden" style="clip-path: polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%);">
            <div class="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-500"></div>
            <img :src="mode.image" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" />
            
            <div class="absolute top-4 left-4 z-20 bg-neutral-950 text-white text-[9px] font-black px-3 py-1.5 uppercase italic tracking-widest border border-white/20">
              {{ mode.category }}
            </div>

            <div class="absolute bottom-6 right-10 z-20 text-[8px] font-black text-red-500 bg-white px-2 py-1 uppercase italic tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
               {{ mode.status }}
            </div>
          </div>

          <div class="p-8 flex flex-col flex-1">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] font-black text-neutral-400 uppercase italic">DIFICULDADE: {{ mode.difficulty }}</span>
            </div>
            
            <h2 class="text-2xl font-black text-neutral-900 uppercase italic tracking-tighter leading-tight mb-4 group-hover:text-red-600 transition-colors">
              {{ mode.title }}
            </h2>
            
            <p class="text-sm text-neutral-500 leading-relaxed font-medium mb-8 line-clamp-3 italic">
              {{ mode.desc }}
            </p>

            <div class="mt-auto flex items-center justify-between pt-6 border-t border-neutral-50">
              <span class="text-[10px] font-black text-red-600 uppercase italic tracking-widest">Iniciar Protocolo</span>
              <div class="size-8 bg-neutral-950 rounded-full flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                <i-solar-play-bold class="size-4" />
              </div>
            </div>
          </div>

          <div class="absolute bottom-0 right-0 w-0 h-1.5 bg-red-600 group-hover:w-full transition-all duration-700"></div>
        </div>
      </div>

    </main>

    

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>