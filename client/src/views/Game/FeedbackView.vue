<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/auth'

useHead({ title: 'Central de Feedbacks | Dragon Ball Z RPG' })
const router = useRouter()
const auth = useAuthStore()

const goBack = () => {
  router.push({ name: 'game-home' })
}

// --- ESTADOS ---
const activeTab = ref<'submit' | 'board' | 'my_feedbacks'>('submit')
const isSubmitting = ref(false)
const feedbackMessage = ref<{ type: 'success' | 'error', text: string } | null>(null)

// --- FORMULÁRIO DE ENVIO ---
const form = reactive({
  category: 'suggestion',
  title: '',
  description: ''
})

// Categorias com imagens
const categories = [
  { 
    id: 'suggestion', 
    label: 'Sugestões', 
    sub: 'Ideias de Melhoria', 
    img: '/templates/feedbacks/1.png' 
  },
  { 
    id: 'bug', 
    label: 'Reportar Bug', 
    sub: 'Erros de Sistema', 
    img: '/templates/feedbacks/2.png' 
  },
  { 
    id: 'balancing', 
    label: 'Equilíbrio', 
    sub: 'Ajustes no Combate', 
    img: '/templates/feedbacks/4.png' 
  },
  { 
    id: 'other', 
    label: 'Outros', 
    sub: 'Assuntos Gerais', 
    img: '/templates/feedbacks/5.png' 
  }
]

const submitFeedback = () => {
  if (!form.title || !form.description) {
    feedbackMessage.value = { type: 'error', text: 'Preencha todos os campos da transmissão.' }
    setTimeout(() => { feedbackMessage.value = null }, 3000)
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    feedbackMessage.value = { type: 'success', text: 'Transmissão enviada ao Conselho Z com sucesso!' }
    form.title = ''
    form.description = ''
    setTimeout(() => { feedbackMessage.value = null; activeTab.value = 'board' }, 2000)
  }, 1200)
}

// --- MOCKS: MURAL DA COMUNIDADE ---
const communityFeedbacks = ref([
  { 
    id: 'FB-101', author: 'Vegeta_Prince', 
    category: 'Balanceamento', title: 'Nerfar a habilidade "Hakai" na Arena', 
    desc: 'O dano base está ignorando completamente a defesa passiva das armaduras nível 50+. Precisamos de um ajuste urgente para o torneio.',
    upvotes: 142, status: 'Em Análise', hasUpvoted: false
  },
  { 
    id: 'FB-102', author: 'Bulma_Briefs', 
    category: 'Sugestão / Melhoria', title: 'Adicionar filtro por Raridade no Mercado Livre', 
    desc: 'Fica muito difícil achar itens Lendários na aba do mercado com tantos itens comuns sendo postados toda hora. Um filtro ajudaria muito.',
    upvotes: 89, status: 'Aprovado', hasUpvoted: true
  },
  { 
    id: 'FB-103', author: 'Trunks_Future', 
    category: 'Reportar Bug', title: 'Bug visual na Sala de Gravidade (500G)', 
    desc: 'Quando ativo 500G com a estamina abaixo de 10%, a tela pisca em vermelho e o multiplicador de XP zera visualmente.',
    upvotes: 34, status: 'Resolvido', hasUpvoted: false
  }
])

const myFeedbacks = ref([
  { 
    id: 'FB-089', category: 'Sugestão / Melhoria', title: 'Implementar Batalhas de Guilda', 
    desc: 'Seria incrível ter um modo onde os grupos do ranking pudessem declarar guerra entre si por territórios no mapa múndi.',
    status: 'Em Análise'
  }
])

const toggleUpvote = (item: any) => {
  if (item.hasUpvoted) { item.upvotes--; item.hasUpvoted = false } 
  else { item.upvotes++; item.hasUpvoted = true }
}
</script>

<template>
  <div class="animate-fade-in bg-white min-h-screen pb-20 text-neutral-900 font-sans">
    
    <header class="relative w-full h-[300px] bg-[#09090b] overflow-hidden flex flex-col justify-end pb-10 border-b border-neutral-800 shadow-2xl">
      <img src="https://images.alphacoders.com/135/1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>

      <div class="relative z-10 max-w-5xl mx-auto w-full px-6">
        <button @click="goBack" class="flex items-center gap-2 text-white font-black uppercase text-[10px] bg-white/5 px-4 py-2 rounded-full hover:bg-red-600 transition-all italic border border-white/10 mb-8 backdrop-blur-sm shadow-xl w-fit">
          <i-solar:arrow-left-outline class="size-4" /> Voltar para a Base
        </button>
        
        <h1 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
          Voz da <span class="text-red-600">Comunidade</span>
        </h1>
        <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-4 italic">Feedbacks // Central de Transmissões Z</p>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 mt-12">
      
      <div class="flex flex-wrap items-center gap-3 mb-8">
         <button @click="activeTab = 'submit'" :class="['px-6 py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all', activeTab === 'submit' ? 'bg-red-600 text-white shadow-md' : 'bg-neutral-50 text-neutral-500 border border-neutral-200 hover:border-red-300']">
            Enviar Ideia
         </button>
         <button @click="activeTab = 'board'" :class="['px-6 py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all', activeTab === 'board' ? 'bg-red-600 text-white shadow-md' : 'bg-neutral-50 text-neutral-500 border border-neutral-200 hover:border-red-300']">
            Mural da Comunidade
         </button>
         <button @click="activeTab = 'my_feedbacks'" :class="['px-6 py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all', activeTab === 'my_feedbacks' ? 'bg-red-600 text-white shadow-md' : 'bg-neutral-50 text-neutral-500 border border-neutral-200 hover:border-red-300']">
            Meus Relatórios
         </button>
      </div>

      <div class="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden min-h-[500px]">
        <div class="absolute top-10 right-10 text-neutral-100 font-black text-9xl select-none z-0 opacity-50 italic uppercase">VOICE</div>

        <div v-if="feedbackMessage" :class="['relative z-10 mb-8 p-4 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-center shadow-sm', feedbackMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200']">
           {{ feedbackMessage.text }}
        </div>

        <div v-show="activeTab === 'submit'" class="relative z-10 animate-fade-in">
           <p class="text-lg text-neutral-600 italic leading-relaxed mb-10 border-l-4 border-red-600 pl-6 bg-white/50 py-4 pr-4">
             O Conselho Z está ouvindo. Relate bugs, sugira melhorias ou balanceamentos. As melhores ideias moldarão as próximas atualizações do nosso universo.
           </p>

           <form @submit.prevent="submitFeedback" class="space-y-10">
              
              <div>
                 <span class="text-[12px] font-black text-neutral-900 uppercase tracking-tighter italic mb-6 block">Classificação da Mensagem</span>
                 
                 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3 px-2">
                    
                    <div v-for="cat in categories" :key="cat.id" 
                         @click="form.category = cat.id"
                         class="relative h-[220px] cursor-pointer group rounded-xl lg:rounded-none z-0">
                       
                       <div :class="['absolute inset-0 transition-all duration-300 lg:-skew-x-[8deg] overflow-hidden rounded-xl lg:rounded-none', 
                                    form.category === cat.id ? 'z-10 scale-[1.03] shadow-[0_10px_30px_rgba(220,38,38,0.3)] border-2 border-red-500' : 'opacity-80 hover:opacity-100 grayscale-[0.6] hover:grayscale-0 border border-neutral-300']">
                          
                          <img :src="cat.img" class="absolute inset-0 w-full h-full object-cover lg:skew-x-[8deg] scale-[1.3] group-hover:scale-125 transition-transform duration-700" />
                          <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent"></div>
                          <div v-if="form.category === cat.id" class="absolute inset-0 bg-red-600/20 mix-blend-overlay"></div>
                       </div>

                       <div class="absolute inset-0 p-5 flex flex-col items-center justify-end text-center z-20 pointer-events-none">
                          
                          <div v-if="form.category === cat.id" class="absolute top-3 right-3 lg:right-5 size-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                             <i-solar:check-read-bold class="size-4 text-white" />
                          </div>

                          <h3 class="text-xl font-black italic uppercase tracking-tighter text-white drop-shadow-md leading-none mb-1">
                             {{ cat.label }}
                          </h3>
                          <p class="text-[9px] font-bold uppercase italic text-neutral-300 tracking-widest mb-4">
                             {{ cat.sub }}
                          </p>

                          <div :class="['w-10 h-1 rounded-full transition-colors', form.category === cat.id ? 'bg-red-600' : 'bg-neutral-600']"></div>
                       </div>

                    </div>
                 </div>
              </div>

              <div class="space-y-6">
                 <div>
                    <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic mb-2 block">Assunto / Título</span>
                    <input v-model="form.title" class="w-full bg-white border border-neutral-200 rounded-2xl p-4 text-sm font-bold italic outline-none focus:border-red-600 transition-colors shadow-sm" placeholder="Ex: Ajuste no sistema de Ki" />
                 </div>
                 <div>
                    <span class="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic mb-2 block">Detalhes da Transmissão</span>
                    <textarea v-model="form.description" rows="5" class="w-full bg-white border border-neutral-200 rounded-2xl p-4 text-sm font-medium italic outline-none focus:border-red-600 transition-colors shadow-sm resize-none" placeholder="Explique detalhadamente sua ideia ou como o erro ocorreu..."></textarea>
                 </div>
              </div>

              <div class="pt-6 border-t border-neutral-200 flex justify-end">
                 <button type="submit" :disabled="isSubmitting" class="bg-neutral-900 text-white font-black text-[10px] uppercase italic px-10 py-4 rounded-xl hover:bg-red-600 transition-all tracking-widest shadow-xl flex items-center gap-2">
                    {{ isSubmitting ? 'Transmitindo...' : 'Enviar Protocolo' }}
                    <i-solar:arrow-right-linear v-if="!isSubmitting" class="size-4" />
                 </button>
              </div>
           </form>
        </div>

        <div v-show="activeTab === 'board'" class="relative z-10 space-y-6 animate-fade-in">
           <p class="text-lg text-neutral-600 italic leading-relaxed mb-8 border-l-4 border-red-600 pl-6 bg-white/50 py-4 pr-4">
             Veja o que outros guerreiros estão sugerindo. Apoie as melhores ideias para que elas ganhem prioridade na mesa do Conselho.
           </p>

           <section v-for="fb in communityFeedbacks" :key="fb.id" class="group bg-white p-6 rounded-2xl border border-neutral-200 hover:border-red-500/30 transition-all hover:shadow-md flex flex-col md:flex-row gap-6">
              <div class="flex flex-col items-center justify-center bg-neutral-50 p-4 rounded-xl border border-neutral-200 shrink-0 md:w-20">
                 <button @click="toggleUpvote(fb)" :class="['p-1 rounded-full transition-colors', fb.hasUpvoted ? 'text-red-600' : 'text-neutral-400 hover:text-red-500']">
                    <i-solar:alt-arrow-up-bold class="size-6" />
                 </button>
                 <span :class="['text-lg font-black italic mt-1 leading-none', fb.hasUpvoted ? 'text-red-600' : 'text-neutral-600']">{{ fb.upvotes }}</span>
              </div>

              <div class="flex-1">
                 <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div class="flex flex-col gap-1">
                       <span class="text-red-600 font-black italic text-xs leading-none uppercase tracking-tighter">{{ fb.id }} // {{ fb.category }}</span>
                       <h2 class="text-xl font-black text-neutral-900 uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">
                          {{ fb.title }}
                       </h2>
                    </div>
                    <span :class="['text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic h-fit border', fb.status === 'Aprovado' || fb.status === 'Resolvido' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-orange-50 border-orange-200 text-orange-600']">
                       {{ fb.status }}
                    </span>
                 </div>
                 
                 <p class="text-neutral-600 leading-relaxed font-medium mb-4 text-sm">{{ fb.desc }}</p>
                 <span class="text-[9px] font-black uppercase italic text-neutral-400">Autor: {{ fb.author }}</span>
              </div>
           </section>
        </div>

        <div v-show="activeTab === 'my_feedbacks'" class="relative z-10 space-y-6 animate-fade-in">
           <p class="text-lg text-neutral-600 italic leading-relaxed mb-8 border-l-4 border-red-600 pl-6 bg-white/50 py-4 pr-4">
             Acompanhe o status das transmissões que você enviou ao servidor.
           </p>

           <section v-for="fb in myFeedbacks" :key="fb.id" class="group bg-white p-6 rounded-2xl border border-neutral-200 hover:border-red-500/30 transition-all hover:shadow-md">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                 <div class="flex flex-col gap-1">
                    <span class="text-red-600 font-black italic text-xs leading-none uppercase tracking-tighter">{{ fb.id }} // {{ fb.category }}</span>
                    <h2 class="text-xl font-black text-neutral-900 uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">
                       {{ fb.title }}
                    </h2>
                 </div>
                 <span class="bg-orange-50 border-orange-200 text-orange-600 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic h-fit">
                    {{ fb.status }}
                 </span>
              </div>
              <p class="text-neutral-600 leading-relaxed font-medium text-sm">{{ fb.desc }}</p>
           </section>
        </div>

      </div>

      

    </main>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>