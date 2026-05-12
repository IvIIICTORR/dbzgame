<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

useHead({ title: 'Gestão da Conta | Dragon Ball Z RPG' })

const auth = useAuthStore()
const router = useRouter()

// Controle de Navegação Lateral
const activeSection = ref('riot-id')

const scrollTo = (sectionId: string) => {
  activeSection.value = sectionId
  const el = document.getElementById(sectionId)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 40
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

// Estados e Upload
const isLoading = ref(false)
const feedbackMessage = ref<{ type: 'success' | 'error', text: string } | null>(null)
const isMfaDismissed = ref(false)

const fileInputRef = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)

const profileForm = reactive({
  gameName: '',
  nameColor: '#FF8C00', // Cor do Nome
  email: 'sky*************@gm***.com',
  country: 'BRA',
  race: 'Saiyajin', // Nova propriedade: Raça
  login: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  avatarFile: null as File | null
})

const gameSettings = reactive({
  receiveChallenges: true,
  audioEnabled: false,
})

onMounted(() => {
  if (auth.user) {
    profileForm.gameName = auth.user.fullName || auth.user.username || ''
    profileForm.login = auth.user.username || ''
    profileForm.nameColor = auth.user.nameColor || '#FF8C00'
    // Supondo que a raça venha do auth.user.race no futuro, usamos um fallback aqui:
    profileForm.race = auth.user.race || 'Saiyajin'
    avatarPreview.value = auth.user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guerreiro'
  }
})

// Lógica de Upload do Avatar
const triggerUpload = () => fileInputRef.value?.click()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  avatarPreview.value = URL.createObjectURL(file)
  profileForm.avatarFile = file
}

const saveChanges = async () => {
  isLoading.value = true
  feedbackMessage.value = null

  if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
    feedbackMessage.value = { type: 'error', text: 'As senhas não coincidem.' }
    isLoading.value = false
    return
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    feedbackMessage.value = { type: 'success', text: 'Alterações salvas com sucesso.' }
  } catch (error) {
    feedbackMessage.value = { type: 'error', text: 'Ocorreu um erro.' }
  } finally {
    isLoading.value = false
    setTimeout(() => { feedbackMessage.value = null }, 4000)
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 font-sans text-neutral-900 pb-32">
    
    <header class="relative w-full h-[300px] bg-[#09090b] overflow-hidden flex flex-col justify-end pb-10 border-b-8 border-red-600 shadow-2xl">
      <img src="https://images.alphacoders.com/135/1356201.png" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>

      <div class="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-12 flex flex-col items-start justify-end">
        <button @click="router.back()" class="flex items-center gap-2 text-white font-black uppercase text-[10px] bg-white/5 px-4 py-2 rounded-full hover:bg-red-600 transition-all italic border border-white/10 mb-8 backdrop-blur-sm shadow-xl w-fit">
          <i-solar-arrow-left-outline class="size-4" /> Voltar para a Base
        </button>
        
        <h1 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
          Editar <span class="text-red-600">Perfil</span>
        </h1>
        <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-4 italic">Identidade // Segurança de Combate</p>
      </div>
    </header>

    <div class="max-w-[1400px] mx-auto flex items-start">
      
      <aside class="sticky top-0 w-80 h-screen pt-12 pl-12 pr-6 hidden lg:block shrink-0">
        <h2 class="text-2xl font-black text-neutral-900 leading-tight mb-12">
          Menu da<br/>Conta
        </h2>

        <nav class="space-y-4 font-bold text-[11px] uppercase tracking-widest">
          <button @click="scrollTo('riot-id')" :class="['w-full flex items-center gap-4 text-left transition-colors', activeSection === 'riot-id' ? 'text-red-600' : 'text-neutral-500 hover:text-neutral-900']">
            <i-solar-user-id-bold class="size-4" /> IDENTIDADE Z
          </button>
          <button @click="scrollTo('personal-info')" :class="['w-full flex items-center gap-4 text-left transition-colors', activeSection === 'personal-info' ? 'text-red-600' : 'text-neutral-500 hover:text-neutral-900']">
            <i-solar-user-circle-bold class="size-4" /> INFORMAÇÃO PESSOAL
          </button>
          <button @click="scrollTo('account-signin')" :class="['w-full flex items-center gap-4 text-left transition-colors', activeSection === 'account-signin' ? 'text-red-600' : 'text-neutral-500 hover:text-neutral-900']">
            <i-solar-key-bold class="size-4" /> ACESSO À CONTA
          </button>
          <button @click="scrollTo('connected-accounts')" :class="['w-full flex items-center gap-4 text-left transition-colors', activeSection === 'connected-accounts' ? 'text-red-600' : 'text-neutral-500 hover:text-neutral-900']">
            <i-solar-layers-bold class="size-4" /> CONTAS CONECTADAS
          </button>
          <button @click="scrollTo('mfa')" :class="['w-full flex items-center gap-4 text-left transition-colors', activeSection === 'mfa' ? 'text-red-600' : 'text-neutral-500 hover:text-neutral-900']">
            <i-solar-shield-check-bold class="size-4" /> AUTENTICAÇÃO<br/>MULTI-FATOR
          </button>
          <button @click="scrollTo('communication')" :class="['w-full flex items-center gap-4 text-left transition-colors', activeSection === 'communication' ? 'text-red-600' : 'text-neutral-500 hover:text-neutral-900']">
            <i-solar-chat-square-bold class="size-4" /> PREFERÊNCIAS DE<br/>COMUNICAÇÃO
          </button>
        </nav>
      </aside>

      <main class="flex-1 w-full max-w-[850px] px-6 lg:px-0 pt-12 space-y-6">
        
        <div v-if="feedbackMessage" :class="['p-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-between shadow-sm', feedbackMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200']">
          {{ feedbackMessage.text }}
          <button @click="feedbackMessage = null"><i-solar-close-circle-bold class="size-5" /></button>
        </div>

        <div v-if="!isMfaDismissed" class="bg-amber-50 border border-amber-200 text-amber-900 p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-sm">
          <div class="absolute top-0 left-0 h-full w-2 bg-amber-400"></div>
          <button @click="isMfaDismissed = true" class="absolute top-4 right-4 text-amber-900/40 hover:text-amber-900 transition-colors"><i-solar-close-circle-bold class="size-5" /></button>
          
          <div class="pl-4 w-full md:w-1/2">
            <h3 class="font-black text-lg mb-1 tracking-tight flex items-center gap-2">
               <i-solar-bell-bold class="size-5 text-amber-500" />
               Autenticação multi-fator disponível
            </h3>
            <p class="text-sm font-medium opacity-80 mt-2">A segurança da sua conta é importante. Ajude-nos a proteger seus dados ativando a Autenticação multi-fator.</p>
          </div>
          <div class="w-full md:w-1/2 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-3 mt-4 md:mt-0 pr-2">
             <button class="w-full sm:w-auto px-6 py-3 font-bold text-xs uppercase tracking-widest border-2 border-amber-900/20 text-amber-900 hover:bg-amber-100 rounded-xl transition-colors">Saiba Mais</button>
             <button class="w-full sm:w-auto px-6 py-3 font-bold text-xs uppercase tracking-widest bg-amber-500 text-white hover:bg-amber-600 rounded-xl transition-colors shadow-md">Ativar MFA</button>
          </div>
        </div>

        <form @submit.prevent="saveChanges" class="space-y-6">
          
          <section id="riot-id" class="bg-white border border-neutral-200 rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-16 shadow-sm">
            <div class="w-full lg:w-[40%]">
              <h2 class="text-2xl font-black text-neutral-900 mb-3">Identidade Z</h2>
              <p class="text-neutral-500 text-sm font-medium leading-relaxed">
                Personalize como os outros jogadores verão você no servidor. Faça upload do seu avatar e escolha uma cor que represente seu ki.
              </p>
            </div>
            <div class="w-full lg:w-[60%] flex flex-col gap-8">
              
              <div class="flex items-center gap-6">
                 <div class="relative group cursor-pointer shrink-0" @click="triggerUpload">
                    <div 
                       class="size-24 md:size-28 border-4 shadow-sm group-hover:opacity-80 transition-all bg-neutral-100 overflow-hidden" 
                       :style="{ 
                          borderColor: profileForm.nameColor, 
                          clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' 
                       }">
                       <img :src="avatarPreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guerreiro'" class="w-full h-full object-cover" />
                    </div>
                    <div class="absolute -bottom-2 -right-2 bg-neutral-900 text-white p-2 rounded-full border-2 border-white shadow-md z-10">
                       <i-solar-camera-bold class="size-4" />
                    </div>
                    <input type="file" ref="fileInputRef" accept="image/*" class="hidden" @change="handleFileUpload" />
                 </div>
                 <div class="pt-2">
                    <h3 class="font-black text-2xl mb-1 tracking-tight truncate max-w-[200px]" :style="{ color: profileForm.nameColor }">
                       {{ profileForm.gameName || 'Guerreiro Z' }}
                    </h3>
                    <p class="text-[9px] font-black uppercase tracking-widest text-neutral-400">Clique na imagem para alterar</p>
                 </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1 relative">
                  <span class="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Nome em Jogo</span>
                  <input v-model="profileForm.gameName" :style="{ color: profileForm.nameColor }" class="w-full bg-neutral-50 font-bold text-sm pt-8 pb-3 px-4 rounded-xl outline-none border-2 border-neutral-100 focus:border-red-500 focus:bg-white transition-colors" />
                </div>
                <div class="w-full sm:w-1/3 relative">
                  <span class="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Cor do Nome</span>
                  <div class="w-full bg-neutral-50 pt-7 pb-2 px-4 rounded-xl border-2 border-neutral-100 h-[60px] flex items-center justify-center cursor-pointer relative overflow-hidden focus-within:border-red-500 focus-within:bg-white transition-colors">
                     <input type="color" v-model="profileForm.nameColor" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                     <div class="w-full h-2 rounded-full shadow-inner pointer-events-none" :style="{ backgroundColor: profileForm.nameColor }"></div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end border-t border-neutral-100 pt-6 mt-2">
                <button type="submit" class="bg-neutral-900 hover:bg-red-600 text-white px-8 py-4 font-bold text-[11px] uppercase tracking-widest transition-colors rounded-xl shadow-md flex items-center gap-2">
                   Salvar Identidade <i-solar-diskette-bold class="size-4" />
                </button>
              </div>
            </div>
          </section>

          <section id="personal-info" class="bg-white border border-neutral-200 rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-16 shadow-sm">
            <div class="w-full lg:w-[40%]">
              <h2 class="text-2xl font-black text-neutral-900 mb-3">Informação Pessoal</h2>
              <p class="text-neutral-500 text-sm font-medium leading-relaxed">
                Esta informação é privada e não será compartilhada com outros jogadores. Leia nosso <a href="#" class="text-red-600 hover:underline">Aviso de Privacidade</a> a qualquer momento.
              </p>
            </div>
            <div class="w-full lg:w-[60%] flex flex-col gap-4">
              <div class="relative w-full">
                <span class="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Endereço de E-mail</span>
                <input disabled v-model="profileForm.email" class="w-full bg-neutral-100 text-neutral-600 font-bold text-sm pt-8 pb-3 px-4 rounded-xl outline-none border-2 border-neutral-200 cursor-not-allowed" />
              </div>
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="w-full sm:w-1/2 relative">
                  <span class="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">País / Região</span>
                  <input disabled v-model="profileForm.country" class="w-full bg-neutral-100 text-neutral-600 font-bold text-sm pt-8 pb-3 px-4 rounded-xl outline-none border-2 border-neutral-200 cursor-not-allowed" />
                </div>
                <div class="w-full sm:w-1/2 relative">
                  <span class="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Raça do Jogador</span>
                  <input disabled v-model="profileForm.race" class="w-full bg-neutral-100 text-neutral-600 font-bold text-sm pt-8 pb-3 px-4 rounded-xl outline-none border-2 border-neutral-200 cursor-not-allowed" />
                </div>
              </div>
            </div>
          </section>

          <section id="account-signin" class="bg-white border border-neutral-200 rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-16 shadow-sm">
            <div class="w-full lg:w-[40%]">
              <h2 class="text-2xl font-black text-neutral-900 mb-3">Acesso à Conta</h2>
              <p class="text-neutral-500 text-sm font-medium leading-relaxed">
                Recomendamos que você atualize periodicamente sua senha para ajudar a prevenir acessos não autorizados.
              </p>
            </div>
            <div class="w-full lg:w-[60%] flex flex-col gap-8">
              <div class="relative w-full">
                <span class="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Nome de Usuário</span>
                <input disabled v-model="profileForm.login" class="w-full bg-neutral-100 text-neutral-600 font-bold text-sm pt-8 pb-3 px-4 rounded-xl outline-none border-2 border-neutral-200 cursor-not-allowed" />
              </div>
              
              <div>
                 <h3 class="text-lg font-black text-neutral-900 mb-4">Mudar Senha</h3>
                 <div class="space-y-4">
                    <input type="password" v-model="profileForm.currentPassword" placeholder="SENHA ATUAL" class="w-full bg-neutral-50 text-neutral-900 font-bold text-[11px] uppercase tracking-widest px-5 py-4 rounded-xl outline-none border-2 border-neutral-100 focus:border-red-500 focus:bg-white transition-colors placeholder:text-neutral-400" />
                    <input type="password" v-model="profileForm.newPassword" placeholder="NOVA SENHA" class="w-full bg-neutral-50 text-neutral-900 font-bold text-[11px] uppercase tracking-widest px-5 py-4 rounded-xl outline-none border-2 border-neutral-100 focus:border-red-500 focus:bg-white transition-colors placeholder:text-neutral-400" />
                    <input type="password" v-model="profileForm.confirmPassword" placeholder="CONFIRMAR NOVA SENHA" class="w-full bg-neutral-50 text-neutral-900 font-bold text-[11px] uppercase tracking-widest px-5 py-4 rounded-xl outline-none border-2 border-neutral-100 focus:border-red-500 focus:bg-white transition-colors placeholder:text-neutral-400" />
                 </div>
              </div>

              <div class="flex justify-end border-t border-neutral-100 pt-6">
                <button type="submit" class="bg-neutral-900 hover:bg-red-600 text-white px-8 py-4 font-bold text-[11px] uppercase tracking-widest transition-colors rounded-xl shadow-md">Atualizar Senha</button>
              </div>
            </div>
          </section>

          <section id="connected-accounts" class="bg-white border border-neutral-200 rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-16 shadow-sm">
            <div class="w-full lg:w-[40%]">
              <h2 class="text-2xl font-black text-neutral-900 mb-3">Contas Conectadas</h2>
              <p class="text-neutral-500 text-sm font-medium leading-relaxed">
                Vincule suas redes sociais para facilitar o login. O Discord também é essencial para o servidor da comunidade.
              </p>
            </div>
            <div class="w-full lg:w-[60%] flex flex-col gap-6">
               
               <div>
                  <h3 class="font-bold mb-4 text-[10px] uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                     Plataformas Disponíveis <i-solar-info-circle-outline class="size-3" />
                  </h3>
                  <div class="grid grid-cols-1 gap-4">
                     
                     <div class="bg-white border-2 border-neutral-100 shadow-sm p-5 flex items-center justify-between rounded-2xl">
                        <div class="flex items-center gap-4 font-black text-neutral-900 text-base">
                           <i-ri-google-fill class="size-7 text-[#DB4437]" /> Google
                        </div>
                        <span class="text-[9px] font-black uppercase tracking-widest text-green-700 bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                           <i-solar-check-circle-bold class="size-3" /> Conectado
                        </span>
                     </div>
                     
                     <button type="button" class="bg-[#5865F2] hover:bg-[#4752C4] shadow-md text-white p-5 flex items-center justify-between rounded-2xl transition-all hover:-translate-y-1">
                        <div class="flex items-center gap-4 font-bold text-white text-base">
                           <i-ri-discord-fill class="size-7" /> Discord
                        </div>
                        <div class="flex items-center gap-2">
                           <span class="text-[10px] font-bold uppercase tracking-widest text-white/90">Vincular</span>
                           <i-solar-add-circle-bold class="size-5" />
                        </div>
                     </button>
                     
                  </div>
               </div>
            </div>
          </section>

          <section id="mfa" class="bg-white border border-neutral-200 rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-16 shadow-sm">
            <div class="w-full lg:w-[40%]">
              <h2 class="text-2xl font-black text-neutral-900 mb-3">Autenticação Multi-Fator</h2>
              <p class="text-neutral-500 text-sm font-medium leading-relaxed mb-4">
                Proteja sua conta contra acessos não autorizados exigindo um código de segurança ao fazer login.
              </p>
            </div>
            <div class="w-full lg:w-[60%] flex flex-col gap-6">
               <div class="bg-neutral-50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-neutral-200">
                  <div class="flex items-center gap-4">
                     <div class="bg-white border border-neutral-200 text-neutral-900 size-12 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                        <i-solar-letter-bold class="size-5" />
                     </div>
                     <div class="flex flex-col">
                        <span class="font-bold text-sm text-neutral-900 truncate max-w-[150px] sm:max-w-xs">sky***********@gm***.com</span>
                        <span class="text-[9px] font-black uppercase tracking-widest text-neutral-400 mt-1">Não Ativado</span>
                     </div>
                  </div>
                  <button type="button" class="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3.5 font-bold text-[11px] uppercase tracking-widest transition-colors rounded-xl shadow-sm text-center">Habilitar MFA</button>
               </div>
            </div>
          </section>

          <section id="communication" class="bg-white border border-neutral-200 rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-16 shadow-sm">
            <div class="w-full lg:w-[40%]">
              <h2 class="text-2xl font-black text-neutral-900 mb-3">Preferências de Comunicação</h2>
            </div>
            <div class="w-full lg:w-[60%] flex flex-col gap-8">
              
               <label class="flex items-start gap-5 cursor-pointer group">
                  <div class="relative flex items-center justify-center mt-1 shrink-0">
                     <input type="checkbox" v-model="gameSettings.receiveChallenges" class="peer appearance-none size-6 border-2 border-neutral-300 rounded-md bg-white checked:bg-red-600 checked:border-red-600 transition-colors cursor-pointer" />
                     <i-solar-check-read-linear class="absolute text-white size-4 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <div>
                     <span class="block font-black text-neutral-900 mb-1">Comunicações do Servidor</span>
                     <span class="block text-sm font-medium text-neutral-500 leading-relaxed">Sim, o servidor pode enviar novidades sobre atualizações, eventos, lançamentos e outros conteúdos.</span>
                  </div>
               </label>

               <label class="flex items-start gap-5 cursor-pointer group">
                  <div class="relative flex items-center justify-center mt-1 shrink-0">
                     <input type="checkbox" v-model="gameSettings.audioEnabled" class="peer appearance-none size-6 border-2 border-neutral-300 rounded-md bg-white checked:bg-red-600 checked:border-red-600 transition-colors cursor-pointer" />
                     <i-solar-check-read-linear class="absolute text-white size-4 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <div>
                     <span class="block font-black text-neutral-900 mb-1">Publicidade Direcionada</span>
                     <span class="block text-sm font-medium text-neutral-500 leading-relaxed">Sim, o servidor pode compartilhar minhas informações pessoais com parceiros para campanhas personalizadas.</span>
                  </div>
               </label>

            </div>
          </section>

        </form>

        <div class="pt-16 flex justify-center border-t border-neutral-200 mt-12">
           <a href="suporte" class="font-black text-[11px] uppercase tracking-widest text-neutral-400 hover:text-red-600 transition-colors">Suporte ao Jogador</a>
        </div>

      </main>
    </div>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}

/* Esconde o input default de cor mantendo-o acessível ao clique */
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
}
</style>