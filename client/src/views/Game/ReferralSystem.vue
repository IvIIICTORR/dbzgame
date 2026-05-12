<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Avatar from '@/components/icon/Avatar.vue'

useHead({ title: 'Recrutamento Z | Dragon Ball Z RPG' })

const auth = useAuthStore()
const router = useRouter()

const goBack = () => {
  router.push({ name: 'game-home' })
}

// Controlo dos Separadores (Tabs)
const activeTab = ref<'overview' | 'rewards' | 'history'>('overview')

// Link de Convite
const referralCode = computed(() => auth.user?.username || 'guerreiro123')
const referralLink = computed(() => `https://dbzgame.com.br/play/${referralCode.value}`)
const hasCopied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    hasCopied.value = true
    setTimeout(() => { hasCopied.value = false }, 3000)
  } catch (err) {
    console.error('Falha ao copiar:', err)
  }
}

const copyForInstagram = async () => {
  await copyToClipboard()
  alert('Link copiado com sucesso! Cole na sua Bio ou Stories do Instagram.')
  window.open('https://instagram.com', '_blank')
}

// Recompensas com Imagens do Servidor
const rewardTiers = [
  { required: 1, title: '500 Zeni', image: '/templates/itens/zenni_500.png' },
  { required: 3, title: 'Semente dos Deuses', image: '/templates/itens/semente.png' },
  { required: 5, title: 'Radar do Dragão', image: '/templates/itens/radar_dragao.png' },
  { required: 10, title: 'Cápsula de Nave', image: '/templates/itens/capsula_agua.png' },
]

// Mock de Dados
const totalCommission = ref(450)
const invitedFriends = ref([
  { id: 1, name: 'Kuririn89', status: 'completed', date: '12/10/2025', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kuririn', commission: 250 },
  { id: 2, name: 'BulmaTech', status: 'completed', date: '15/10/2025', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bulma', commission: 200 },
  { id: 3, name: 'GohanZ', status: 'pending', date: 'Ontem', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gohan', commission: 0 },
])

const allianceStats = computed(() => {
   const total = invitedFriends.value.length
   const confirmed = invitedFriends.value.filter(f => f.commission > 0).length
   const pending = total - confirmed
   const credits = totalCommission.value
   return { total, confirmed, pending, credits }
})
</script>

<template>
  <div class="animate-fade-in bg-white min-h-screen pb-20 text-neutral-900 font-sans relative overflow-x-hidden">
    
    <header class="relative w-full h-[300px] bg-[#09090b] overflow-hidden flex flex-col justify-end pb-10 border-b-8 border-red-600 shadow-2xl">
      <img src="https://images.alphacoders.com/135/1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>

      <div class="relative z-10 max-w-5xl mx-auto w-full px-6 flex flex-col items-start justify-end">
        <button @click="goBack" class="flex items-center gap-2 text-white font-black uppercase text-[10px] bg-white/5 px-4 py-2 rounded-full hover:bg-red-600 transition-all italic border border-white/10 mb-8 backdrop-blur-sm shadow-xl w-fit">
          <i-solar-arrow-left-outline class="size-4" /> Voltar para a Base
        </button>
        
        <h1 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
          Recrutamento <span class="text-red-600">Z</span>
        </h1>
        <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-4 italic">Convoque // Ganhe Recompensas</p>
      </div>
    </header>

    <div class="fixed top-[40%] right-[-5%] text-neutral-100 font-black text-[12rem] md:text-[18rem] select-none z-0 opacity-40 italic uppercase pointer-events-none">
      INVITE
    </div>

    <main class="relative z-10 max-w-4xl mx-auto px-6 mt-12 min-h-[600px]">
      
      <div class="flex flex-wrap items-center gap-4 mb-14 border-b border-neutral-100 pb-6">
         <button @click="activeTab = 'overview'" :class="['px-6 py-3 rounded-full text-[10px] font-black uppercase italic tracking-widest transition-all border-2 flex items-center gap-2', activeTab === 'overview' ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-transparent text-neutral-400 border-neutral-200 hover:border-red-300 hover:text-neutral-900']">
            <i-solar-link-circle-bold class="size-4" /> Visão Geral
         </button>
         <button @click="activeTab = 'rewards'" :class="['px-6 py-3 rounded-full text-[10px] font-black uppercase italic tracking-widest transition-all border-2 flex items-center gap-2', activeTab === 'rewards' ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-transparent text-neutral-400 border-neutral-200 hover:border-red-300 hover:text-neutral-900']">
            <i-solar-gift-bold class="size-4" /> Recompensas
            <span v-if="allianceStats.total > 0" :class="['flex size-4 items-center justify-center rounded-full text-[9px]', activeTab === 'rewards' ? 'bg-white text-red-600' : 'bg-red-600 text-white']">{{ allianceStats.total }}</span>
         </button>
         <button @click="activeTab = 'history'" :class="['px-6 py-3 rounded-full text-[10px] font-black uppercase italic tracking-widest transition-all border-2 flex items-center gap-2', activeTab === 'history' ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-transparent text-neutral-400 border-neutral-200 hover:border-red-300 hover:text-neutral-900']">
            <i-solar-history-bold class="size-4" /> Meus Recrutas
         </button>
      </div>

      <div v-show="activeTab === 'overview'" class="animate-fade-in space-y-8">
         <div class="relative overflow-hidden rounded-[2rem] bg-neutral-950 h-56 md:h-64 shadow-2xl group border-2 border-transparent hover:border-red-600/50 transition-colors">
            <img src="https://images.alphacoders.com/282/282181.jpg" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700" />
            <div class="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent"></div>
            
            <div class="relative h-full flex flex-col justify-center p-8 md:p-12 z-20">
               <span class="text-[10px] font-black uppercase text-red-500 tracking-[0.3em] mb-2 italic">Expanda a Aliança</span>
               <h2 class="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-lg italic leading-none">
                  CONVOQUE O SEU <br/><span class="text-red-600">GUERREIRO</span>
               </h2>
               <p class="text-neutral-400 text-xs font-medium max-w-md mt-4 leading-relaxed italic">
                  Compartilhe seu link de protocolo. Quando seus aliados atingirem o Nível 5, o sistema concederá recompensas épicas para ambos.
               </p>
            </div>
         </div>

         <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-neutral-50 p-8 rounded-[2rem] border border-neutral-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
               <div class="absolute left-0 top-0 w-1.5 h-full bg-neutral-900"></div>
               <div>
                  <h3 class="text-2xl font-black uppercase italic tracking-tighter text-neutral-900 mb-6">Seu Link de Acesso</h3>
                  <div class="flex flex-col gap-4 mb-6">
                     <div class="w-full flex items-center bg-white rounded-2xl px-5 py-4 border-2 border-neutral-200 overflow-hidden shadow-inner">
                        <span class="text-neutral-600 font-bold italic text-sm truncate select-all">{{ referralLink }}</span>
                     </div>
                     <button @click="copyToClipboard" :class="['w-full font-black italic uppercase text-[10px] tracking-widest py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2', hasCopied ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-neutral-950 hover:bg-neutral-800 text-white']">
                        <i-solar-check-circle-bold v-if="hasCopied" class="size-5" />
                        <i-solar-copy-bold v-else class="size-5" />
                        {{ hasCopied ? 'Link Copiado' : 'Copiar Link' }}
                     </button>
                  </div>
               </div>
               
               <div class="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span class="text-[9px] font-black uppercase italic tracking-widest text-neutral-400">Transmissão Rápida:</span>
                  <div class="flex gap-3">
                     <a :href="`https://wa.me/?text=Junta-te%20a%20mim%20no%20Dragon%20Ball%20Z%20RPG!%20${referralLink}`" target="_blank" class="flex items-center justify-center size-10 rounded-xl bg-[#25D366] text-white hover:scale-110 transition-transform shadow-md">
                        <i-ic-baseline-whatsapp class="size-5" />
                     </a>
                     <a :href="`https://www.threads.net/intent/post?text=Junta-te%20a%20mim%20no%20Dragon%20Ball%20Z%20RPG!%20${referralLink}`" target="_blank" class="flex items-center justify-center size-10 rounded-xl bg-black text-white hover:scale-110 transition-transform shadow-md">
                        <i-ri-threads-fill class="size-5" />
                     </a>
                     <button @click="copyForInstagram" class="flex items-center justify-center size-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:scale-110 transition-transform shadow-md">
                        <i-ri-instagram-line class="size-5" />
                     </button>
                  </div>
               </div>
            </div>

            <div class="bg-neutral-950 p-8 rounded-[2rem] border-2 border-red-600/30 relative overflow-hidden group hover:border-red-600 transition-colors flex flex-col justify-between shadow-xl">
               <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#dc262625_0%,_transparent_60%)] group-hover:bg-[radial-gradient(circle_at_top_right,_#dc262640_0%,_transparent_60%)] transition-colors"></div>
               
               <div class="relative z-10">
                  <div class="flex items-center justify-between mb-2">
                     <h3 class="text-2xl font-black uppercase italic tracking-tighter text-white">Comissão Vitalícia</h3>
                     <span class="bg-red-600 text-white text-[10px] font-black italic px-3 py-1 rounded-lg tracking-widest">10% OFF</span>
                  </div>
                  <p class="text-neutral-400 text-xs font-medium italic mb-6 leading-relaxed">
                     Receba passivamente <strong class="text-red-500">10% em Z-Coins VIP</strong> de todas as doações e compras feitas pelos guerreiros que você recrutou. Para sempre.
                  </p>
               </div>

               <div class="flex items-center gap-5 relative z-10 bg-white/5 p-5 rounded-2xl border border-white/10">
                  <div class="size-14 rounded-xl bg-red-600/20 flex items-center justify-center border border-red-500/50 shadow-inner">
                     <i-solar-wad-of-money-bold class="size-8 text-red-500" />
                  </div>
                  <div>
                     <span class="block text-[9px] font-black uppercase tracking-widest text-neutral-400 italic mb-1">Total Arrecadado</span>
                     <span class="text-4xl font-black text-white italic tracking-tighter leading-none flex items-center gap-2">
                        {{ allianceStats.credits }} <span class="text-red-500 text-lg">Z-Coins</span>
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div v-show="activeTab === 'rewards'" class="animate-fade-in">
         <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
               <h2 class="text-3xl font-black uppercase italic tracking-tighter text-neutral-900 mb-2">Trilha de Progresso</h2>
               <p class="text-neutral-500 italic font-medium leading-relaxed max-w-xl text-sm">
                  Acumule recrutas qualificados e libere suprimentos exclusivos no Arsenal.
               </p>
            </div>
            <div class="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
               <i-solar-users-group-two-rounded-bold class="size-5" />
               <span class="font-black italic uppercase tracking-widest text-xs">{{ allianceStats.total }} Recrutas Ativos</span>
            </div>
         </div>

         <div class="space-y-4">
            <section 
               v-for="(tier, index) in rewardTiers" 
               :key="index"
               :class="['relative flex items-center p-6 rounded-2xl border-2 transition-all hover:shadow-lg overflow-hidden group', 
                       allianceStats.total >= tier.required ? 'border-red-500 bg-white' : 'border-neutral-200 bg-neutral-50 opacity-80']"
            >
               <div v-if="allianceStats.total >= tier.required" class="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-50"></div>

               <div :class="['size-20 rounded-2xl flex items-center justify-center shadow-md border-2 mr-6 shrink-0 relative z-10 overflow-hidden bg-white p-2', 
                            allianceStats.total >= tier.required ? 'border-red-200' : 'border-neutral-200 grayscale opacity-60']">
                  <img :src="tier.image" :alt="tier.title" class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
               </div>
               
               <div class="flex-1 relative z-10">
                  <h4 :class="['text-xl font-black uppercase italic tracking-tighter', allianceStats.total >= tier.required ? 'text-neutral-900 line-through opacity-50' : 'text-neutral-900']">
                     {{ tier.title }}
                  </h4>
                  <p class="text-[10px] font-bold uppercase italic text-neutral-400 tracking-widest mt-1">
                     Desbloqueio: {{ tier.required }} Aliados
                  </p>
               </div>

               <div v-if="allianceStats.total >= tier.required" class="relative z-10 flex items-center text-green-600 font-black italic uppercase tracking-widest text-[10px] bg-green-100 px-4 py-2 rounded-xl shrink-0 shadow-sm border border-green-200">
                  <i-solar-check-circle-bold class="size-4 mr-1.5" /> Resgatado
               </div>
               <div v-else class="relative z-10 flex items-center text-neutral-400 font-black italic uppercase tracking-widest text-[10px] bg-neutral-200 px-4 py-2 rounded-xl shrink-0">
                  <i-solar-lock-bold class="size-4 mr-1.5" /> Bloqueado
               </div>
            </section>
         </div>
      </div>

      <div v-show="activeTab === 'history'" class="animate-fade-in">
         <div class="mb-10">
            <h2 class="text-3xl font-black uppercase italic tracking-tighter text-neutral-900 mb-2 border-l-4 border-red-600 pl-4">Aliança Z</h2>
            <p class="text-neutral-500 italic font-medium leading-relaxed max-w-xl text-sm">
               Métricas detalhadas e status de ativação dos guerreiros convocados.
            </p>
         </div>

         <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div class="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center text-center group hover:border-red-300 transition-colors shadow-sm">
               <span class="text-3xl font-black text-neutral-900 italic tracking-tighter mb-1">{{ allianceStats.total }}</span>
               <span class="text-[9px] font-black uppercase tracking-widest text-neutral-400">Total Recrutados</span>
            </div>
            <div class="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center text-center group hover:border-green-300 transition-colors shadow-sm">
               <span class="text-3xl font-black text-green-600 italic tracking-tighter mb-1">{{ allianceStats.confirmed }}</span>
               <span class="text-[9px] font-black uppercase tracking-widest text-neutral-400">Com Compra<br/>Confirmada</span>
            </div>
            <div class="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center text-center group hover:border-orange-300 transition-colors shadow-sm">
               <span class="text-3xl font-black text-orange-500 italic tracking-tighter mb-1">{{ allianceStats.pending }}</span>
               <span class="text-[9px] font-black uppercase tracking-widest text-neutral-400">Aguardando<br/>Primeira Compra</span>
            </div>
            <div class="bg-neutral-950 p-5 rounded-2xl border border-red-600/50 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group">
               <div class="absolute inset-0 bg-red-600/10 group-hover:bg-red-600/20 transition-colors"></div>
               <span class="relative z-10 text-3xl font-black text-red-500 italic tracking-tighter mb-1">{{ allianceStats.credits }}</span>
               <span class="relative z-10 text-[9px] font-black uppercase tracking-widest text-white">Créditos<br/>Ganhos</span>
            </div>
         </div>

         <div v-if="invitedFriends.length === 0" class="text-center py-20 bg-neutral-50 rounded-[3rem] border-2 border-dashed border-neutral-200">
            <i-solar-ghost-smile-outline class="size-16 text-neutral-300 mx-auto mb-4" />
            <h3 class="text-xl font-black italic uppercase text-neutral-900 mb-2">Nenhum guerreiro recrutado</h3>
            <p class="text-xs text-neutral-500 italic">Compartilhe seu link para formar sua aliança e gerar comissões.</p>
         </div>

         <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-2">
            <section 
               v-for="friend in invitedFriends" 
               :key="friend.id"
               class="transform -skew-x-[6deg] bg-white border-2 border-neutral-100 hover:border-red-300 hover:shadow-xl transition-all group overflow-hidden"
            >
               <div class="transform skew-x-[6deg] flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                  <div class="flex items-center gap-4">
                     <Avatar :src="friend.avatar" :alt="friend.name" class="size-12 shadow-sm border border-neutral-200" />
                     <div class="flex flex-col">
                        <p class="font-black text-neutral-900 uppercase italic tracking-tighter text-lg leading-none mb-1">{{ friend.name }}</p>
                        <p class="text-[9px] font-bold uppercase tracking-widest text-neutral-400 italic">Ingresso: {{ friend.date }}</p>
                     </div>
                  </div>
                  
                  <div class="flex flex-col items-start sm:items-end gap-2">
                     <span v-if="friend.commission > 0" class="flex items-center text-[9px] font-black text-green-700 bg-green-100 px-3 py-1 rounded-lg uppercase tracking-widest border border-green-200">
                        <i-solar-check-circle-bold class="size-3 mr-1" /> Compra Confirmada
                     </span>
                     <span v-else class="flex items-center text-[9px] font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-lg uppercase tracking-widest border border-orange-200">
                        <i-solar-clock-circle-bold class="size-3 mr-1" /> Aguardando
                     </span>
                     
                     <span v-if="friend.commission > 0" class="text-[10px] font-black italic uppercase text-red-600 tracking-widest flex items-center gap-1">
                        +{{ friend.commission }} Z-Coins <i-solar-wad-of-money-bold class="size-3" />
                     </span>
                  </div>
               </div>
            </section>
         </div>
      </div>

      <div class="mt-20 flex flex-col items-center gap-2 opacity-40 pb-10">
        <div class="flex items-center gap-4">
          <div class="size-8 bg-neutral-900 text-white rounded flex items-center justify-center font-black italic text-xs">Z</div>
          <p class="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.3em]">Referral Unit // Core Team Z</p>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>