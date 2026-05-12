<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthButton from '@/components/auth/AuthButton.vue'
import Card from '@/components/icon/Card.vue'

useHead({ title: 'Inventário - Dragon Ball Z RPG' })

const auth = useAuthStore()
const router = useRouter()

// Navegação do Inventário
const activeTab = ref<'equipment' | 'consumables' | 'materials'>('equipment')

// --- LÓGICA DE PAGINAÇÃO ---
const currentPage = ref(0)
const itemsPerPage = 15

// ------------------------------------------------------------------------
// MOCKS: SISTEMA DE ITENS (IMAGENS 2D PNG)
// ------------------------------------------------------------------------
const BASE_HOLOGRAM_URL = new URL('@/assets/templates/base.png', import.meta.url).href 

interface Item {
  id: number
  name: string
  type: 'armor' | 'weapon' | 'consumable' | 'material'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  icon: string
  description: string
  stats?: { def?: number; atk?: number; hp?: number }
  imageUrl?: string 
}

const inventory = ref<Item[]>([
  // --- EQUIPAMENTOS (Armaduras e Armas) ---
  { id: 1, name: 'Goku (Armadura de Combate Saiyajin)', type: 'armor', rarity: 'common', icon: 'i-solar:shield-user-bold', description: 'Armadura incrivelmente elástica fornecida pelo exército de Freeza. Oferece alta resistência a impactos físicos e de Ki.', stats: { def: 150, hp: 500 }, imageUrl: new URL('@/assets/templates/equipamentos/vegeta.png', import.meta.url).href },
  { id: 2, name: 'Goku (Gi da Escola Tartaruga)', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame), tecido com fios leves para garantir máxima agilidade nas evasões.', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/vegeta_ssj2.png', import.meta.url).href },
  { id: 3, name: 'Grande Saiyaman', type: 'armor', rarity: 'common', icon: 'i-solar:sword-bold', description: 'Uma espada lendária e extremamente pesada, outrora encravada no Planeta Supremo. Aumenta drasticamente o poder de ataque.', stats: { atk: 450, def: 50 }, imageUrl: new URL('@/assets/templates/equipamentos/saiyaman.png', import.meta.url).href },
  { id: 4, name: 'Trunks', type: 'armor', rarity: 'common', icon: 'i-solar:target-bold', description: 'Dispositivo eletrónico acoplado ao ouvido. Permite medir o Poder de Luta (Ki) do oponente, além de funcionar como comunicador.', stats: { def: 10 }, imageUrl: new URL('@/assets/templates/equipamentos/trunks.png', import.meta.url).href },
  { id: 13, name: 'Mestre Kame', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/mrkame.png', import.meta.url).href },
  { id: 14, name: 'Mr Satan', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/mrsatan.png', import.meta.url).href },
  { id: 15, name: 'Turlles', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/turlles.png', import.meta.url).href },
  { id: 16, name: 'Piccolo', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/piccolo2.png', import.meta.url).href },
  { id: 17, name: 'Kooler', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/kooler.png', import.meta.url).href },
  { id: 18, name: 'Goku (Forma Base)', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/goku.png', import.meta.url).href },
  { id: 26, name: 'Goku (Super Saiyajin 4)', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/goku_ssj4.png', import.meta.url).href },
  { id: 27, name: 'Brolly', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/brolly.png', import.meta.url).href },
  { id: 28, name: 'Cell', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/cell.png', import.meta.url).href },
  { id: 29, name: 'Freeza', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/freeza.png', import.meta.url).href },
  { id: 31, name: 'Gohan', type: 'armor', rarity: 'common', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/gohan.png', import.meta.url).href },
  { id: 32, name: 'Kale', type: 'armor', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/kale.png', import.meta.url).href },
  { id: 33, name: 'Toppo (Forma Base)', type: 'armor', rarity: 'epic', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/toppo.png', import.meta.url).href },
  { id: 34, name: 'Bulma', type: 'armor', rarity: 'epic', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/bulma.png', import.meta.url).href },
  { id: 35, name: 'Jiren (Forma Base)', type: 'armor', rarity: 'epic', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/jiren.png', import.meta.url).href },
  { id: 36, name: 'Chichi', type: 'armor', rarity: 'epic', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/chichi.png', import.meta.url).href },
  { id: 37, name: 'Goku (Ultra Instinct)', type: 'armor', rarity: 'legendary', icon: 'i-solar:t-shirt-bold', description: 'Traje de combate clássico na cor laranja (estilo Kame).', stats: { def: 45, atk: 20 }, imageUrl: new URL('@/assets/templates/equipamentos/goku_instinto.png', import.meta.url).href },

  // --- CONSUMÍVEIS ---
  { id: 5, name: 'Semente dos Deuses', type: 'consumable', rarity: 'legendary', icon: 'i-solar:leaf-bold', description: 'Cultivada pelo Mestre Karin. Restaura o HP, Ki e Stamina a 100% instantaneamente.', imageUrl: new URL('@/assets/templates/itens/semente.png', import.meta.url).href },
  { id: 6, name: 'Água Ultra Sagrada', type: 'consumable', rarity: 'epic', icon: 'i-solar:cup-star-bold', description: 'Água mística que liberta o poder oculto do guerreiro.', imageUrl: new URL('@/assets/templates/itens/capsula_agua.png', import.meta.url).href },
  { id: 7, name: 'Banquete da Corp. Cápsula', type: 'consumable', rarity: 'rare', icon: 'i-solar:box-minimalistic-bold', description: 'Uma refeição completa condensada numa única cápsula.', imageUrl: new URL('@/assets/templates/itens/banquete.png', import.meta.url).href },
  { id: 11, name: 'Peixe Verde', type: 'consumable', rarity: 'rare', icon: 'i-solar:box-minimalistic-bold', description: 'Recupera 50% da Stamina.', imageUrl: new URL('@/assets/templates/itens/peixe_verde.png', import.meta.url).href },
  { id: 12, name: 'Peixe Azul', type: 'consumable', rarity: 'rare', icon: 'i-solar:box-minimalistic-bold', description: 'Recupera 50% da Stamina.', imageUrl: new URL('@/assets/templates/itens/peixe_azul.png', import.meta.url).href },
  { id: 19, name: 'Scouter (Verde)', type: 'consumable', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Mede o Poder de Luta.', imageUrl: new URL('@/assets/templates/itens/scouter_verde.png', import.meta.url).href },
  { id: 20, name: 'Scouter (Vermelho)', type: 'consumable', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Mede o Poder de Luta.', imageUrl: new URL('@/assets/templates/itens/scouter_vermelho.png', import.meta.url).href },
  { id: 21, name: 'Sopa', type: 'consumable', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Recupera energia.', imageUrl: new URL('@/assets/templates/itens/sopa_1.png', import.meta.url).href },
  { id: 22, name: 'Lanchinho', type: 'consumable', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Recupera energia.', imageUrl: new URL('@/assets/templates/itens/lanchinho.png', import.meta.url).href },
  { id: 23, name: 'Maçazinha', type: 'consumable', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Recupera energia.', imageUrl: new URL('@/assets/templates/itens/maca.png', import.meta.url).href },
  { id: 24, name: 'Maça Envenenada', type: 'consumable', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Cuidado ao comer.', imageUrl: new URL('@/assets/templates/itens/maca_envenenada.png', import.meta.url).href },
  { id: 25, name: 'Remédio', type: 'consumable', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Cura ferimentos.', imageUrl: new URL('@/assets/templates/itens/remedio.png', import.meta.url).href },
  { id: 30, name: 'Radar do Dragão', type: 'consumable', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Localiza as esferas.', imageUrl: new URL('@/assets/templates/itens/radar_dragao.png', import.meta.url).href },

  // --- MATERIAIS ---
  { id: 8, name: 'Aço Katchin', type: 'material', rarity: 'legendary', icon: 'i-solar:diamond-bold', description: 'O metal mais duro conhecido no Universo 7.', imageUrl: new URL('@/assets/templates/itens/katchin.png', import.meta.url).href },
  { id: 9, name: 'Esfera do Dragão (4 Estrelas)', type: 'material', rarity: 'epic', icon: 'i-solar:record-circle-bold', description: 'Reúne as sete para invocar Shenlong.', imageUrl: new URL('@/assets/templates/itens/esfera_4.png', import.meta.url).href },
  { id: 10, name: 'Cápsula Hoi-Poi Vazia', type: 'material', rarity: 'common', icon: 'i-solar:battery-charge-bold', description: 'Usada no sistema de Crafting.', imageUrl: new URL('@/assets/templates/itens/capsula_hoi.png', import.meta.url).href },
  { id: 38, name: 'Madeira', type: 'material', rarity: 'rare', icon: 'i-solar:t-shirt-bold', description: 'Material básico.', imageUrl: new URL('@/assets/templates/itens/madeira.png', import.meta.url).href },
])

// Estado de Equipamento
const equippedArmor = ref<Item | null>(null)
const selectedItem = ref<Item | null>(inventory.value[0])

const currentImageUrl = computed(() => {
  return equippedArmor.value?.imageUrl || BASE_HOLOGRAM_URL
})

const filteredInventory = computed(() => {
  return inventory.value.filter(item => {
    if (activeTab.value === 'equipment') return ['armor', 'weapon'].includes(item.type)
    if (activeTab.value === 'consumables') return item.type === 'consumable'
    if (activeTab.value === 'materials') return item.type === 'material'
    return false
  })
})

// --- COMPUTED PARA PAGINAÇÃO ---
const paginatedItems = computed(() => {
  const start = currentPage.value * itemsPerPage
  return filteredInventory.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredInventory.value.length / itemsPerPage))

const nextPage = () => { if (currentPage.value < totalPages.value - 1) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 0) currentPage.value-- }

// Resetar página ao mudar de aba
watch(activeTab, () => { currentPage.value = 0 })

const selectItem = (item: Item) => { selectedItem.value = item }

const equipSelectedItem = () => {
  if (selectedItem.value && ['armor', 'weapon'].includes(selectedItem.value.type)) {
    equippedArmor.value = selectedItem.value
  }
}

const unequipArmor = () => { equippedArmor.value = null }

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
        <button @click="router.back()" class="flex items-center gap-2 text-white font-black uppercase text-[10px] bg-white/5 px-4 py-2 rounded-full hover:bg-red-600 transition-all italic border border-white/10 mb-8 backdrop-blur-sm shadow-xl w-fit">
          <i-solar:arrow-left-outline class="size-4" /> Voltar ao Menu
        </button>
        
        <h1 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
          Cápsula de <span class="text-red-600">Equipamentos</span>
        </h1>
        <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-4 italic">Arsenal Z // Inventário de Combate</p>
      </div>
    </header>

    <div class="p-6 md:p-12 max-w-7x4 mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-5 space-y-6">
          <Card class="bg-white p-2 rounded-2xl border border-neutral-100 shadow-xl overflow-hidden relative">
            <div class="absolute top-4 left-4 z-10 flex gap-2">
              <span v-if="!equippedArmor" class="px-3 py-1 bg-blue-100 text-blue-600 border border-blue-200 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm animate-pulse">Modo Holograma</span>
              <span v-else class="px-3 py-1 bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">Traje Equipado</span>
            </div>

            <div class="absolute top-4 right-4 z-10">
              <button v-if="equippedArmor" @click="unequipArmor" class="size-8 bg-neutral-900 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                <i-solar:refresh-bold class="size-4" />
              </button>
            </div>

            <div class="relative w-full h-[450px] bg-neutral-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
              <div class="absolute bottom-0 w-64 h-16 bg-blue-500/20 blur-2xl rounded-[100%]"></div>
              <img :src="currentImageUrl" :class="['relative z-10 max-w-full max-h-[90%] object-contain transition-all duration-700', !equippedArmor ? 'hologram-filter' : 'drop-shadow-2xl']" />
            </div>

            <div class="p-4 mt-2 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-2 gap-4">
              <div>
                <span class="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Poder de Luta Total</span>
                <span class="text-xl font-black text-neutral-900">14,500</span>
              </div>
              <div>
                <span class="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Equipamento Atual</span>
                <span class="text-sm font-bold text-orange-600 truncate">{{ equippedArmor?.name || 'Traje Padrão' }}</span>
              </div>
            </div>
          </Card>
        </div>

        <div class="lg:col-span-7 flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 p-1 bg-neutral-200/50 rounded-xl w-max border border-neutral-200">
              <button @click="activeTab = 'equipment'" :class="['px-6 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'equipment' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700']">Equipamentos</button>
              <button @click="activeTab = 'consumables'" :class="['px-6 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'consumables' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700']">Consumíveis</button>
              <button @click="activeTab = 'materials'" :class="['px-6 py-2 rounded-lg text-sm font-bold transition-all', activeTab === 'materials' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700']">Materiais</button>
            </div>

            <div v-if="totalPages > 1" class="flex items-center gap-3">
              <button @click="prevPage" :disabled="currentPage === 0" class="size-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center hover:border-red-500 disabled:opacity-20 transition-all shadow-sm">
                <i-solar:alt-arrow-left-outline class="size-5" />
              </button>
              <span class="text-[10px] font-black uppercase tracking-widest italic">{{ currentPage + 1 }} / {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages - 1" class="size-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center hover:border-red-500 disabled:opacity-20 transition-all shadow-sm">
                <i-solar:alt-arrow-right-outline class="size-5" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 flex-1 h-full">
            <Card class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xl h-full">
              <div class="grid grid-cols-4 sm:grid-cols-5 gap-3">
                <button v-for="item in paginatedItems" :key="item.id" @click="selectItem(item)"
                  :class="['relative aspect-square rounded-xl border-2 flex items-center justify-center transition-all bg-neutral-50 overflow-hidden', 
                           selectedItem?.id === item.id ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] bg-orange-50' : 'border-neutral-200 hover:border-orange-300',
                           equippedArmor?.id === item.id ? 'ring-2 ring-green-500 ring-offset-2' : '']"
                >
                  <div v-if="equippedArmor?.id === item.id" class="absolute top-1 right-1 size-4 bg-green-500 text-white rounded-full flex items-center justify-center border border-white shadow-md z-20"><i-solar:check-circle-bold class="size-2" /></div>
                  
                  <img v-if="item.imageUrl" :src="item.imageUrl" :class="['z-10 object-contain p-1', ['consumable', 'material'].includes(item.type) ? 'max-h-[60%] max-w-[60%]' : 'w-full h-full']" />
                  <component v-else :is="item.icon" :class="['size-8 z-10', getRarityColor(item.rarity).split(' ')[0]]" />
                </button>
                <div v-for="i in Math.max(0, 15 - paginatedItems.length)" :key="'empty'+i" class="aspect-square rounded-xl border-2 border-neutral-200 border-dashed bg-neutral-50/50 flex items-center justify-center opacity-50"></div>
              </div>
            </Card>

            <Card class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xl flex flex-col h-full">
              <template v-if="selectedItem">
                <div class="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
                  <div :class="['size-16 rounded-xl border-2 flex items-center justify-center shrink-0 shadow-sm overflow-hidden bg-neutral-50 p-2', getRarityColor(selectedItem.rarity)]">
                    <img v-if="selectedItem.imageUrl" :src="selectedItem.imageUrl" class="w-full h-full object-contain" />
                    <component v-else :is="selectedItem.icon" class="size-8" />
                  </div>
                  <div>
                    <h3 class="font-black text-neutral-900 leading-tight text-sm">{{ selectedItem.name }}</h3>
                    <span class="text-[10px] font-bold uppercase tracking-widest mt-1 block" :class="getRarityColor(selectedItem.rarity).split(' ')[0]">{{ selectedItem.rarity }}</span>
                  </div>
                </div>

                <div class="flex-1 space-y-4">
                  <p class="text-sm text-neutral-600 leading-relaxed">{{ selectedItem.description }}</p>
                  <div v-if="selectedItem.stats" class="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-2">
                    <h4 class="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Bónus de Atributos</h4>
                    <div class="grid grid-cols-2 gap-2 text-sm font-bold">
                      <div v-if="selectedItem.stats.def" class="text-blue-600">DEF +{{ selectedItem.stats.def }}</div>
                      <div v-if="selectedItem.stats.atk" class="text-red-600">ATK +{{ selectedItem.stats.atk }}</div>
                      <div v-if="selectedItem.stats.hp" class="text-green-600">HP +{{ selectedItem.stats.hp }}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 pt-4 border-t border-neutral-100">
                  <AuthButton v-if="['armor', 'weapon'].includes(selectedItem.type)" @click="equipSelectedItem"
                    :disabled="equippedArmor?.id === selectedItem.id"
                    class="w-full bg-neutral-900 hover:bg-black text-white disabled:bg-neutral-200">
                    {{ equippedArmor?.id === selectedItem.id ? 'Já Equipado' : 'Equipar' }}
                  </AuthButton>
                  <AuthButton v-else-if="selectedItem.type === 'consumable'" class="w-full bg-green-600 hover:bg-green-700 text-white">Usar Item</AuthButton>
                  <AuthButton v-else variant="outline" class="w-full border-neutral-300 text-neutral-700">Forjar</AuthButton>
                </div>
              </template>
              <div v-else class="flex flex-col items-center justify-center h-full text-center opacity-50">
                <i-solar:box-minimalistic-outline class="size-16 text-neutral-400 mb-4" />
                <p class="text-sm font-bold text-neutral-500">Selecione um item</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hologram-filter {
  filter: sepia(100%) hue-rotate(180deg) saturate(300%) contrast(150%) brightness(120%) drop-shadow(0 0 15px rgba(59, 130, 246, 0.8));
  opacity: 0.85;
}
</style>