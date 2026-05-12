<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

useHead({ title: 'Centro Comercial Z - Dragon Ball Z RPG' })

const auth = useAuthStore()
const router = useRouter()

// --- ESTADO DO JOGADOR ---
const playerZeni = ref(125400)
const playerPremium = ref(2500)
const taxRate = 0.10

type TabType = 'consumables' | 'equipment' | 'black_market' | 'market' | 'live_auction' | 'my_store' | 'donations'
const activeTab = ref<TabType>('consumables')

// --- LOJA OFICIAL (NPC) ---
const shopItems = ref([
  { id: 1, name: 'Semente dos Deuses', category: 'consumable', rarity: 'legendary', description: 'Restaura 100% de HP, KI e ST.', price: 5000, imageUrl: 'https://images.info-dbz.fr/divers/img/render-senzu.png', stock: 5 },
  { id: 2, name: 'Água Sagrada', category: 'consumable', rarity: 'rare', description: 'Recupera 50% de KI.', price: 1200, imageUrl: 'https://images.info-dbz.fr/divers/img/render-water.png', stock: 'Ilimitado' },
  { id: 4, name: 'Armadura do Exército', category: 'equipment', rarity: 'rare', description: 'DEF +50, HP +150.', price: 8500, imageUrl: 'https://images.info-dbz.fr/divers/img/render-armor.png', stock: 'Ilimitado' },
  { id: 5, name: 'Pesos de Tornozelo', category: 'equipment', rarity: 'epic', description: 'Duplica a EXP ganha.', price: 15000, imageUrl: 'https://images.info-dbz.fr/divers/img/render-weights.png', stock: 1 },
  { id: 6, name: 'Radar Z Modificado', category: 'black_market', rarity: 'legendary', description: 'Encontra itens raros.', price: 50000, imageUrl: 'https://images.info-dbz.fr/divers/img/render-radar.png', stock: 1 },
  { id: 7, name: 'Aço Katchin Ilegal', category: 'black_market', rarity: 'epic', description: 'Material de forja denso.', price: 25000, imageUrl: 'https://images.info-dbz.fr/divers/img/render-steel.png', stock: 3 }
])

const filteredNpcItems = computed(() => {
  if (activeTab.value === 'black_market') return shopItems.value.filter(item => item.category === 'black_market')
  if (activeTab.value === 'equipment') return shopItems.value.filter(item => item.category === 'equipment')
  return shopItems.value.filter(item => item.category === 'consumable')
})

const buyingItemId = ref<number | null>(null)
const buyNpcItem = (item: any) => {
  if (playerZeni.value < item.price) return alert('Zeni insuficiente!')
  buyingItemId.value = item.id
  setTimeout(() => {
    playerZeni.value -= item.price
    if (typeof item.stock === 'number') item.stock--
    buyingItemId.value = null
  }, 600)
}

// --- MERCADO P2P ---
const marketListings = ref([
  { id: 101, seller: 'Vegeta_Prince', sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vegeta', itemName: 'Armadura Saiyajin (Elite)', rarity: 'epic', price: 15000, imageUrl: 'https://images.info-dbz.fr/divers/img/render-armor.png' },
  { id: 102, seller: 'Trunks_Future', sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trunks', itemName: 'Espada de Aço Z', rarity: 'legendary', price: 120000, imageUrl: 'https://images.info-dbz.fr/divers/img/render-sword.png' }
])

const myListings = ref([{ id: 201, itemName: 'Cápsula Hoi-Poi Vazia', rarity: 'common', price: 1000 }])
const pendingOffers = ref([{ id: 301, buyer: 'Kuririn_Mitado', buyerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kuririn', itemName: 'Cápsula Hoi-Poi Vazia', offerAmount: 800 }])

// --- LEILÃO AO VIVO ---
const liveAuction = ref({
  timeLeft: '00:14:59',
  item: { name: 'Radar do Dragão (Original)', rarity: 'legendary', description: 'Localização exata das Esferas no Mapa.', imageUrl: 'https://images.info-dbz.fr/divers/img/render-radar.png' },
  currentBidZeni: 450000,
  currentBidPremium: 0,
  topBidder: 'Yamcha_Wolf',
  bidType: 'zeni'
})

const chatInput = ref('')
const chatMessages = ref([
  { id: 1, type: 'system', user: 'Sistema', text: 'O Leilão Mítico começou!' },
  { id: 2, type: 'user', user: 'Vegeta_Prince', text: 'Esse radar vai ser meu!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vegeta' }
])
const chatContainer = ref<HTMLElement | null>(null)

const sendChatMessage = () => {
  if (!chatInput.value.trim()) return
  chatMessages.value.push({ id: Date.now(), type: 'user', user: auth.user?.username || 'Shiro Cobra', text: chatInput.value, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artemis' })
  chatInput.value = ''
  nextTick(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight })
}

// --- DOAÇÕES ---
const packages = ref([
  { id: 'pkg_1', name: 'Apoiador Inicial', zCoins: 100, bonus: 0, priceBRL: 10.00, color: 'orange' },
  { id: 'pkg_2', name: 'Guerreiro Z', zCoins: 250, bonus: 25, priceBRL: 25.00, popular: true, color: 'blue' },
  { id: 'pkg_3', name: 'Super Saiyajin', zCoins: 500, bonus: 100, priceBRL: 50.00, color: 'yellow' },
  { id: 'pkg_4', name: 'Nível Divino', zCoins: 1200, bonus: 300, priceBRL: 100.00, color: 'red' }
])

const goBack = () => router.push({ name: 'battles' })
</script>

<template>
  <div class="animate-fade-in bg-white min-h-screen pb-20 font-sans text-neutral-900 overflow-x-hidden">
    
    <header class="bg-[#09090b] pt-16 pb-12 border-b-8 border-orange-500 shadow-2xl relative">
      <img src="https://images.alphacoders.com/135/1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>
      
      <div class="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <button @click="goBack" class="text-white/40 hover:text-orange-500 font-black text-[9px] uppercase italic tracking-[0.3em] mb-4 transition-colors">← VOLTAR</button>
          <h1 class="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
            Z-SHOP <span class="text-orange-500">CENTER</span>
          </h1>
        </div>

        <div class="flex gap-4">
          <div class="bg-white/5 border border-white/10 p-4 px-6 rounded-2xl text-right">
            <span class="block text-[8px] text-neutral-500 font-black uppercase italic mb-1 tracking-widest">Zeni</span>
            <span class="text-2xl font-black text-white italic leading-none">{{ playerZeni.toLocaleString() }}</span>
          </div>
          <div class="bg-orange-600 p-4 px-6 rounded-2xl text-right shadow-[0_0_20px_rgba(234,88,12,0.3)]">
            <span class="block text-[8px] text-white/50 font-black uppercase italic mb-1 tracking-widest">Z-Coins</span>
            <span class="text-2xl font-black text-white italic leading-none">{{ playerPremium.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <aside class="lg:col-span-3 space-y-6">
        <div class="space-y-1">
          <h3 class="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-4 mb-3">Loja NPC</h3>
          <button v-for="t in [{id: 'consumables', label: 'Consumíveis'}, {id: 'equipment', label: 'Equipamentos'}, {id: 'black_market', label: 'Mercado Negro'}]" :key="t.id"
                  @click="activeTab = t.id as TabType" :class="['w-full text-left px-6 py-4 rounded-2xl font-black italic uppercase text-[10px] tracking-widest border-l-4 transition-all', activeTab === t.id ? 'bg-neutral-900 text-white border-orange-500 shadow-lg' : 'bg-neutral-50 text-neutral-400 border-transparent']">
            {{ t.label }}
          </button>
        </div>
        <div class="space-y-1 pt-4 border-t border-neutral-100">
          <h3 class="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-4 mb-3">Interação P2P</h3>
          <button v-for="t in [{id: 'market', label: 'Mercado Livre'}, {id: 'live_auction', label: 'Leilão Ao Vivo'}, {id: 'my_store', label: 'Minha Loja'}]" :key="t.id"
                  @click="activeTab = t.id as TabType" :class="['w-full text-left px-6 py-4 rounded-2xl font-black italic uppercase text-[10px] tracking-widest border-l-4 transition-all', activeTab === t.id ? 'bg-neutral-900 text-white border-orange-500 shadow-lg' : 'bg-neutral-50 text-neutral-400 border-transparent']">
            {{ t.label }}
          </button>
        </div>
        <button @click="activeTab = 'donations'" :class="['w-full text-left px-6 py-4 rounded-2xl font-black italic uppercase text-[10px] tracking-widest border-l-4 transition-all mt-4', activeTab === 'donations' ? 'bg-red-600 text-white border-red-800 shadow-lg' : 'bg-red-50 text-red-600 border-transparent']">
          Apoiar Servidor (VIP)
        </button>
      </aside>

      <div class="lg:col-span-9">
        
        <div v-if="['consumables', 'equipment', 'black_market'].includes(activeTab)" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div v-for="item in filteredNpcItems" :key="item.id" class="group bg-white border border-neutral-100 p-6 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 relative">
             <div class="relative h-40 bg-neutral-50 rounded-3xl mb-6 flex items-center justify-center p-6 overflow-hidden" style="clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);">
                <img :src="item.imageUrl" class="size-full object-contain group-hover:scale-110 transition-transform duration-700" />
                <span class="absolute top-4 left-4 text-[8px] font-black bg-neutral-900 text-white px-2 py-1 uppercase italic border border-white/10">{{ item.rarity }}</span>
             </div>
             <h3 class="text-xl font-black italic uppercase text-neutral-900 mb-2">{{ item.name }}</h3>
             <p class="text-[11px] text-neutral-500 font-medium italic mb-8 h-8 line-clamp-2">{{ item.description }}</p>
             <div class="flex items-center justify-between border-t border-neutral-100 pt-6">
                <span class="text-lg font-black italic text-neutral-900">{{ item.price.toLocaleString() }} <span class="text-[10px] text-orange-500 uppercase">Z</span></span>
                <button @click="buyNpcItem(item)" class="bg-neutral-950 text-white px-6 py-3 rounded-xl font-black italic uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all">Comprar</button>
             </div>
          </div>
        </div>

        <div v-if="activeTab === 'market'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="listing in marketListings" :key="listing.id" class="bg-white border border-neutral-100 p-8 rounded-[3rem] shadow-sm hover:shadow-xl transition-all">
             <div class="flex items-center gap-3 mb-6">
                <img :src="listing.sellerAvatar" class="size-8 rounded-full bg-neutral-100" />
                <span class="text-[10px] font-black italic uppercase text-neutral-400">Vendedor: <span class="text-orange-600">{{ listing.seller }}</span></span>
             </div>
             <div class="flex items-center gap-6">
                <img :src="listing.imageUrl" class="size-24 object-contain bg-neutral-50 rounded-2xl p-4" />
                <div>
                   <h3 class="text-lg font-black italic uppercase text-neutral-900 leading-tight">{{ listing.itemName }}</h3>
                   <span class="text-xs font-black italic text-neutral-400 uppercase tracking-widest">{{ listing.rarity }}</span>
                   <div class="mt-4 flex items-center gap-4">
                      <span class="text-xl font-black italic">{{ listing.price.toLocaleString() }} Z</span>
                      <button class="bg-neutral-950 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase italic hover:bg-orange-600">Comprar</button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div v-if="activeTab === 'live_auction'" class="bg-neutral-900 rounded-[3rem] overflow-hidden shadow-2xl animate-fade-in border-b-8 border-orange-600">
           <div class="bg-orange-600 p-6 flex justify-between items-center text-white italic font-black">
              <span class="uppercase text-xs tracking-widest animate-pulse">● Leilão Ativo</span>
              <span class="text-2xl font-mono">{{ liveAuction.timeLeft }}</span>
           </div>
           <div class="grid grid-cols-1 xl:grid-cols-2 h-[500px]">
              <div class="p-10 flex flex-col items-center justify-center text-center border-r border-white/5">
                 <img :src="liveAuction.item.imageUrl" class="size-48 object-contain mb-6 animate-bounce" style="animation-duration: 4s" />
                 <h2 class="text-white text-3xl font-black italic uppercase tracking-tighter">{{ liveAuction.item.name }}</h2>
                 <p class="text-neutral-500 text-xs italic mt-2">{{ liveAuction.item.description }}</p>
                 <div class="mt-8 bg-white/5 p-6 rounded-3xl border border-white/10 w-full">
                    <span class="text-[9px] text-neutral-500 uppercase font-black block mb-2">Lance Atual ({{ liveAuction.topBidder }})</span>
                    <span class="text-4xl text-white font-black italic">{{ liveAuction.currentBidZeni.toLocaleString() }} Z</span>
                 </div>
              </div>
              <div class="bg-white/5 flex flex-col h-full overflow-hidden">
                 <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
                    <div v-for="msg in chatMessages" :key="msg.id" class="text-xs">
                       <span v-if="msg.type === 'system'" class="text-orange-500 font-black italic uppercase tracking-widest block text-center py-2">{{ msg.text }}</span>
                       <div v-else class="flex items-start gap-3">
                          <img :src="msg.avatar" class="size-6 rounded-full" />
                          <p class="text-neutral-400 font-medium italic"><span class="text-white font-black mr-2">{{ msg.user }}:</span> {{ msg.text }}</p>
                       </div>
                    </div>
                 </div>
                 <div class="p-4 bg-black/40">
                    <input v-model="chatInput" @keyup.enter="sendChatMessage" placeholder="Escreva seu lance..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-orange-600" />
                 </div>
              </div>
           </div>
        </div>

        <div v-if="activeTab === 'my_store'" class="space-y-10">
           <div v-for="offer in pendingOffers" :key="offer.id" class="bg-orange-50 border-2 border-orange-200 p-8 rounded-[2.5rem] flex items-center justify-between">
              <div class="flex items-center gap-6">
                 <img :src="offer.buyerAvatar" class="size-16 rounded-3xl bg-white border border-orange-100 p-2" />
                 <div>
                    <h4 class="text-[10px] font-black text-orange-600 uppercase italic tracking-widest mb-1">Oferta Recebida de {{ offer.buyer }}</h4>
                    <p class="text-lg font-black text-neutral-900 italic uppercase">{{ offer.itemName }} por {{ offer.offerAmount }} Zeni</p>
                 </div>
              </div>
              <div class="flex gap-3">
                 <button class="bg-neutral-950 text-white px-8 py-3 rounded-xl font-black italic uppercase text-[10px]">Aceitar</button>
                 <button class="text-neutral-400 font-black italic uppercase text-[10px]">Recusar</button>
              </div>
           </div>
        </div>

        <div v-if="activeTab === 'donations'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div v-for="pkg in packages" :key="pkg.id" class="group bg-white border border-neutral-100 p-8 rounded-[2.5rem] hover:border-red-600 transition-all text-center">
              <h3 class="text-lg font-black italic uppercase text-neutral-900 mb-4">{{ pkg.name }}</h3>
              <div class="size-20 bg-red-50 rounded-full mx-auto mb-6 flex items-center justify-center font-black italic text-2xl text-red-600">Z</div>
              <span class="text-2xl font-black italic">{{ pkg.zCoins + pkg.bonus }} Z-Coins</span>
              <div class="mt-8 pt-6 border-t border-neutral-50 font-black italic text-sm">R$ {{ pkg.priceBRL.toFixed(2) }}</div>
           </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>