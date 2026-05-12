<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import Card from '@/components/icon/Card.vue'

useHead({ title: 'Corporação Cápsula - Loja | Dragon Ball Z RPG' })
const router = useRouter()

const activeTab = ref<'equipment' | 'consumables' | 'vip'>('equipment')

// --- LÓGICA DE PAGINAÇÃO ---
const currentPage = ref(0)
const itemsPerPage = 12

interface ShopItem {
  id: number
  name: string
  type: 'equipment' | 'consumables' | 'vip'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  description: string
  imageUrl: string
  isPermanentActive: boolean
  stats?: { def?: number; atk?: number; hp?: number }
  prices: {
    zeni?: { d7: number; d15: number; d30: number; perm?: number }
    vip?: { d7: number; d15: number; d30: number; perm?: number }
  }
}

const shopItems = ref<ShopItem[]>([
  // --- EQUIPAMENTOS ---
  { id: 1, name: 'Goku (Forma Base)', type: 'equipment', rarity: 'common', description: 'Um uniforme simples que carrega o peso de incontáveis batalhas e o espírito indomável de um artista marcial.', imageUrl: new URL('@/assets/templates/equipamentos/goku.png', import.meta.url).href, isPermanentActive: false, stats: { def: 150, hp: 500 }, prices: { zeni: { d7: 5000, d15: 9000, d30: 16000 }, vip: { d7: 50, d15: 90, d30: 150, perm: 500 } } },
  { id: 2, name: 'Vegeta (Super Saiyajin)', type: 'equipment', rarity: 'common', description: 'A clássica veste de combate da elite guerreira. Leveza absurda e defesa implacável.', imageUrl: new URL('@/assets/templates/equipamentos/vegeta.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 3000, d15: 5500, d30: 10000 }, vip: { d7: 30, d15: 55, d30: 100, perm: 350 } } },
  { id: 3, name: 'Vegeta (Super Saiyajin 2)', type: 'equipment', rarity: 'common', description: 'Traje de combate leve e resistente, ideal para artes marciais intensas.', imageUrl: new URL('@/assets/templates/equipamentos/vegeta_ssj2.png', import.meta.url).href, isPermanentActive: false, stats: { atk: 450, def: 50 }, prices: { zeni: { d7: 8000, d15: 15000, d30: 25000 } } },
  { id: 4, name: 'Trunks', type: 'equipment', rarity: 'common', description: 'Jaqueta clássica da Corporação Cápsula usada por Trunks do Futuro.', imageUrl: new URL('@/assets/templates/equipamentos/trunks.png', import.meta.url).href, isPermanentActive: false, stats: { def: 10 }, prices: { zeni: { d7: 500, d15: 900, d30: 1500 } } },
  { id: 5, name: 'Mestre Kame', type: 'equipment', rarity: 'common', description: 'Traje clássico laranja estilo Kame, leve para máxima agilidade.', imageUrl: new URL('@/assets/templates/equipamentos/mrkame.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 6, name: 'Mr Satan', type: 'equipment', rarity: 'common', description: 'Traje do campeão mundial. Estilo inconfundível para o combate.', imageUrl: new URL('@/assets/templates/equipamentos/mrsatan.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 7, name: 'Piccolo', type: 'equipment', rarity: 'common', description: 'Roupas pesadas de treinamento Namekuseijin.', imageUrl: new URL('@/assets/templates/equipamentos/piccolo2.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 8, name: 'Grande Saiyaman', type: 'equipment', rarity: 'common', description: 'Um traje tecnológico projetado para combater o crime com estilo, justiça e... poses dramáticas.', imageUrl: new URL('@/assets/templates/equipamentos/saiyaman.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 9, name: 'Freeza', type: 'equipment', rarity: 'common', description: 'Uma couraça natural e tecnológica que exala autoridade e um poder de luta esmagador.', imageUrl: new URL('@/assets/templates/equipamentos/freeza.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 10, name: 'Cell', type: 'equipment', rarity: 'common', description: 'A perfeição manifestada em uma carapaça impenetrável...', imageUrl: new URL('@/assets/templates/equipamentos/cell.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 11, name: 'Goku (Super Saiyajin 4)', type: 'equipment', rarity: 'common', description: 'A manifestação física do poder Oozaru sob controle absoluto.', imageUrl: new URL('@/assets/templates/equipamentos/goku_ssj4.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 12, name: 'Kale', type: 'equipment', rarity: 'common', description: 'Uma vestimentapara a elite dos Saiyajins do Sexto Universo.', imageUrl: new URL('@/assets/templates/equipamentos/kale.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 13, name: 'Cooler', type: 'equipment', rarity: 'common', description: 'A armadura definitiva de um conquistador.', imageUrl: new URL('@/assets/templates/equipamentos/kooler.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 14, name: 'Gohan', type: 'equipment', rarity: 'common', description: 'Traje de combate clássico...', imageUrl: new URL('@/assets/templates/equipamentos/gohan.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 15, name: 'Majin Boo', type: 'equipment', rarity: 'common', description: 'Traje de combate clássico...', imageUrl: new URL('@/assets/templates/equipamentos/majin_boo.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 16, name: 'Turlles', type: 'equipment', rarity: 'common', description: 'Traje de combate clássico...', imageUrl: new URL('@/assets/templates/equipamentos/turlles.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },
  { id: 17, name: 'Brolly', type: 'equipment', rarity: 'common', description: 'Traje de combate clássico...', imageUrl: new URL('@/assets/templates/equipamentos/brolly.png', import.meta.url).href, isPermanentActive: false, stats: { def: 45, atk: 20 }, prices: { zeni: { d7: 2500, d15: 4500, d30: 8000 } } },

  // --- CONSUMÍVEIS ---
  { id: 51, name: 'Semente dos Deuses', type: 'consumables', rarity: 'legendary', description: 'Restaura HP, Ki e Stamina a 100% instantaneamente.', imageUrl: new URL('@/assets/templates/itens/semente.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 2000, d15: 0, d30: 0 }, vip: { d7: 20, d15: 0, d30: 0 } } },
  { id: 52, name: 'Água Ultra Sagrada', type: 'consumables', rarity: 'epic', description: 'Dobra o dano do próximo ataque de Ki lançado.', imageUrl: new URL('@/assets/templates/itens/capsula_agua.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 1500, d15: 0, d30: 0 }, vip: { d7: 15, d15: 0, d30: 0 } } },
  { id: 53, name: 'Peixe Verde', type: 'consumables', rarity: 'rare', description: 'Peixe fresco que recupera uma pequena parte da Stamina.', imageUrl: new URL('@/assets/templates/itens/peixe_verde.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 300, d15: 0, d30: 0 } } },
  { id: 54, name: 'Peixe Azul', type: 'consumables', rarity: 'rare', description: 'Peixe nutritivo que recupera Stamina e Ki.', imageUrl: new URL('@/assets/templates/itens/peixe_azul.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 350, d15: 0, d30: 0 } } },
  { id: 55, name: 'Scouter (Verde)', type: 'consumables', rarity: 'rare', description: 'Permite medir o Poder de Luta do oponente.', imageUrl: new URL('@/assets/templates/itens/scouter_verde.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 1000, d15: 1800, d30: 3000 } } },
  { id: 56, name: 'Sopa', type: 'consumables', rarity: 'rare', description: 'Refeição quente que recupera energia gradualmente.', imageUrl: new URL('@/assets/templates/itens/sopa_1.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 150, d15: 0, d30: 0 } } },
  { id: 57, name: 'Maçazinha', type: 'consumables', rarity: 'rare', description: 'Lanche rápido para recuperar um pouco de fôlego.', imageUrl: new URL('@/assets/templates/itens/maca.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 50, d15: 0, d30: 0 } } },
  { id: 58, name: 'Remédio', type: 'consumables', rarity: 'rare', description: 'Cura ferimentos leves e cansaço.', imageUrl: new URL('@/assets/templates/itens/remedio.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 1200, d15: 0, d30: 0 } } },
  { id: 59, name: 'Radar do Dragão', type: 'consumables', rarity: 'rare', description: 'Invenção da Bulma para localizar as esferas místicas.', imageUrl: new URL('@/assets/templates/itens/radar_dragao.png', import.meta.url).href, isPermanentActive: true, prices: { vip: { d7: 100, d15: 180, d30: 300, perm: 1000 } } },
  { id: 60, name: 'Scouter (Vermelho)', type: 'consumables', rarity: 'rare', description: 'Permite ver os atributos mais detalhados do oponente.', imageUrl: new URL('@/assets/templates/itens/scouter_vermelho.png', import.meta.url).href, isPermanentActive: true, prices: { vip: { d7: 100, d15: 180, d30: 300, perm: 1000 } } },
  // --- MATERIAIS / VIP ---
  { id: 81, name: 'Aço Katchin', type: 'vip', rarity: 'legendary', description: 'O metal mais duro do universo, usado para melhorias épicas.', imageUrl: new URL('@/assets/templates/itens/katchin.png', import.meta.url).href, isPermanentActive: false, prices: { vip: { d7: 200, d15: 0, d30: 0 } } },
  { id: 82, name: 'Esfera do Dragão (4 Estrelas)', type: 'vip', rarity: 'epic', description: 'A esfera que pertenceu ao avô de Goku.', imageUrl: new URL('@/assets/templates/itens/esfera_4.png', import.meta.url).href, isPermanentActive: false, prices: { vip: { d7: 500, d15: 0, d30: 0 } } },
  { id: 83, name: 'Cápsula Hoi-Poi Vazia', type: 'vip', rarity: 'common', description: 'Usada para comprimir itens pesados no inventário.', imageUrl: new URL('@/assets/templates/itens/capsula_hoi.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 1000, d15: 0, d30: 0 } } },
  { id: 84, name: 'Madeira', type: 'vip', rarity: 'rare', description: 'Material de construção para a base do jogador.', imageUrl: new URL('@/assets/templates/itens/madeira.png', import.meta.url).href, isPermanentActive: false, prices: { zeni: { d7: 100, d15: 0, d30: 0 } } }
])

const selectedItem = ref<ShopItem>(shopItems.value[0])
const selectedDuration = ref<'d7' | 'd15' | 'd30' | 'perm'>('d7')
const paymentMethod = ref<'zeni' | 'vip'>('zeni')

const filteredItems = computed(() => shopItems.value.filter(item => item.type === activeTab.value))

// Lógica de Fatiamento para Paginação
const paginatedItems = computed(() => {
  const start = currentPage.value * itemsPerPage
  return filteredItems.value.slice(start, start + itemsPerPage)
})
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

const nextPage = () => { if (currentPage.value < totalPages.value - 1) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 0) currentPage.value-- }

// Resetar página ao trocar de aba
watch(activeTab, () => { currentPage.value = 0 })

const selectItem = (item: ShopItem) => {
  selectedItem.value = item
  selectedDuration.value = 'd7'
  if (!item.prices[paymentMethod.value]) {
    paymentMethod.value = item.prices.zeni ? 'zeni' : 'vip'
  }
}

const getDurationLabel = (d: string) => {
  if (d === 'd7') return '7 Dias'
  if (d === 'd15') return '15 Dias'
  if (d === 'd30') return '30 Dias'
  return 'Permanente'
}

const currentPrice = computed(() => {
  const method = paymentMethod.value
  const duration = selectedDuration.value
  return selectedItem.value.prices[method]?.[duration] || 0
})

const buyItem = () => {
  if (currentPrice.value === 0) return alert('Duração não disponível.')
  alert(`Compra realizada: ${selectedItem.value.name} (${getDurationLabel(selectedDuration.value)})`)
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'text-yellow-500 border-yellow-500 bg-yellow-50'
    case 'epic': return 'text-purple-500 border-purple-500 bg-purple-50'
    case 'rare': return 'text-blue-500 border-blue-500 bg-blue-50'
    default: return 'text-neutral-500 border-neutral-300 bg-neutral-50'
  }
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen font-sans pb-20">
    
    <header class="relative w-full h-[300px] bg-[#09090b] overflow-hidden flex flex-col justify-end pb-10 border-b-8 border-red-600 shadow-2xl">
      <img src="https://images.alphacoders.com/135/1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>
      <div class="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col items-start justify-end">
        <button @click="router.back()" class="flex items-center gap-2 text-white font-black uppercase text-[10px] bg-white/5 px-4 py-2 rounded-full hover:bg-red-600 transition-all border border-white/10 mb-8 backdrop-blur-sm shadow-xl w-fit">
          <i-solar:arrow-left-outline class="size-4" /> Sair da Loja
        </button>
        
        <h1 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
          Corporação <span class="text-red-600">Cápsula</span>
        </h1>
        <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-4 italic">Tecnologia Dr. Briefs // Suprimentos de Combate</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 mt-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-8 space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 p-1.5 bg-neutral-200/50 rounded-2xl w-max border border-neutral-200">
              <button v-for="tab in ['equipment', 'consumables', 'vip'] as const" :key="tab" @click="activeTab = tab" :class="['px-8 py-3 rounded-xl text-[12px] font-black tracking-widest transition-all', activeTab === tab ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700']">
                {{ tab === 'equipment' ? 'Equipamentos' : tab === 'consumables' ? 'Consumíveis' : 'Materiais / VIP' }}
              </button>
            </div>

            <div v-if="totalPages > 1" class="flex items-center gap-4">
              <button @click="prevPage" :disabled="currentPage === 0" class="p-2 bg-white border border-neutral-200 rounded-xl disabled:opacity-30 hover:border-red-600 transition-all">
                <i-solar:alt-arrow-left-outline class="size-5" />
              </button>
              <span class="text-[10px] font-black italic uppercase tracking-widest">{{ currentPage + 1 }} / {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages - 1" class="p-2 bg-white border border-neutral-200 rounded-xl disabled:opacity-30 hover:border-red-600 transition-all">
                <i-solar:alt-arrow-right-outline class="size-5" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[500px]">
            <div v-for="item in paginatedItems" :key="item.id" @click="selectItem(item)" 
              :class="['relative p-4 rounded-3xl border-2 transition-all cursor-pointer group flex flex-col items-center text-center h-fit', 
              selectedItem.id === item.id ? 'border-red-600 bg-red-50/50 shadow-lg scale-[1.02]' : 'border-neutral-200 bg-white hover:border-red-300 shadow-sm']">
              
              <div class="h-32 w-full flex items-center justify-center mb-4">
                <img :src="item.imageUrl" class="max-h-full max-w-[100%] object-contain drop-shadow-xl transition-transform group-hover:scale-110" />
              </div>

              <h3 class="font-black text-neutral-900 text-xs truncate w-full mb-1 leading-none">{{ item.name }}</h3>
              <span :class="['text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border mb-2', getRarityColor(item.rarity)]">
                {{ item.rarity }}
              </span>
              
              <div class="mt-auto pt-3 border-t border-neutral-100 w-full flex justify-center gap-2">
                <div v-if="item.prices.zeni" class="flex items-center gap-1 text-[9px] font-black text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded uppercase leading-none">ZENI</div>
                <div v-if="item.prices.vip" class="flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase leading-none">VIP</div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4">
          <Card class="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-2xl sticky top-8">
            <div class="flex flex-col items-center text-center mb-8">
              <div :class="['size-48 bg-neutral-950 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl border-4 relative overflow-hidden', getRarityColor(selectedItem.rarity).split(' ')[1]]">
                <div class="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                <img :src="selectedItem.imageUrl" class="relative z-10 max-h-[70%] max-w-[70%] object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
              
              <h2 class="text-2xl font-black text-neutral-900 uppercase tracking-tighter leading-none italic">{{ selectedItem.name }}</h2>
            </div>

            <div class="space-y-6">
              <div class="flex-1 space-y-4">
                <p class="text-sm text-neutral-600 leading-relaxed italic text-center px-4">{{ selectedItem.description }}</p>
                
                <div v-if="selectedItem.stats" class="p-3 rounded-lg border border-neutral-200 space-y-2" :class="getRarityColor(selectedItem.rarity).split(' ').slice(1).join(' ')">
                  <h4 class="text-[10px] font-bold uppercase tracking-widest italic" :class="getRarityColor(selectedItem.rarity).split(' ')[0]">Bónus de Atributos</h4>
                  <div class="grid grid-cols-2 gap-2 text-sm font-bold italic">
                    <div v-if="selectedItem.stats.def" class="text-blue-600">DEF +{{ selectedItem.stats.def }}</div>
                    <div v-if="selectedItem.stats.atk" class="text-red-600">ATK +{{ selectedItem.stats.atk }}</div>
                    <div v-if="selectedItem.stats.hp" class="text-green-600">HP +{{ selectedItem.stats.hp }}</div>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] italic">Método de Pagamento</label>
                <div class="grid grid-cols-2 gap-3">
                  <button @click="paymentMethod = 'zeni'" :disabled="!selectedItem.prices.zeni" 
                    :class="['py-3 rounded-xl border-2 font-black text-[10px] transition-all uppercase italic', 
                    paymentMethod === 'zeni' ? 'bg-yellow-500 border-yellow-600 text-white shadow-lg' : 'bg-white border-neutral-100 text-neutral-400 opacity-50']">
                    Zeni Normal
                  </button>
                  <button @click="paymentMethod = 'vip'" :disabled="!selectedItem.prices.vip" 
                    :class="['py-3 rounded-xl border-2 font-black text-[10px] transition-all uppercase italic', 
                    paymentMethod === 'vip' ? 'bg-red-600 border-red-700 text-white shadow-lg' : 'bg-white border-neutral-100 text-neutral-400 opacity-50']">
                    Z-Coins VIP
                  </button>
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] italic">Período de Ativação</label>
                <div class="grid grid-cols-2 gap-2">
                  <button v-for="d in (['d7', 'd15', 'd30'] as const)" :key="d" 
                    @click="selectedDuration = d"
                    :class="['py-2 rounded-lg border font-bold text-[10px] transition-all uppercase italic', 
                    selectedDuration === d ? 'bg-neutral-900 text-white shadow-md' : 'bg-neutral-50 text-neutral-400 border-neutral-200']">
                    {{ getDurationLabel(d) }}
                  </button>
                  
                  <button 
                    @click="selectedDuration = 'perm'"
                    :disabled="!selectedItem.isPermanentActive"
                    :class="['py-2 rounded-lg border font-bold text-[10px] transition-all uppercase italic', 
                    selectedDuration === 'perm' ? 'bg-red-600 border-red-700 text-white shadow-md' : 
                    selectedItem.isPermanentActive ? 'bg-neutral-50 text-neutral-400 border-neutral-200 hover:border-red-500' : 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed opacity-40']"
                  >
                    Permanente {{ !selectedItem.isPermanentActive ? '(OFF)' : '' }}
                  </button>
                </div>
              </div>

              <div class="pt-6 border-t border-neutral-100 px-2">
                <div class="flex items-center justify-between mb-4 px-2">
                  <span class="text-[10px] font-black text-neutral-400 uppercase italic">Total a Pagar:</span>
                  <span class="text-2xl font-black text-neutral-900 tracking-tighter italic">
                    {{ currentPrice }} <span class="text-xs uppercase" :class="paymentMethod === 'zeni' ? 'text-yellow-600' : 'text-red-600'">{{ paymentMethod }}</span>
                  </span>
                </div>
                
                <button @click="buyItem" :disabled="currentPrice === 0" 
                  class="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-200 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 italic">
                  <i-solar:cart-large-bold class="size-5" /> Confirmar Aquisição
                </button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.drop-shadow-xl { filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1)); }
</style>