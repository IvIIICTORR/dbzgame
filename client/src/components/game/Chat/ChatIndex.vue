<script setup lang="ts">
import { getChatConversationsGlobalQuery } from '@/api/@pinia/colada.gen'
import { useChat } from '@/composables/useChat'
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@pinia/colada'
import { computed, nextTick, ref, watch } from 'vue'

// ── Dados remotos / Estado ───────────────────────────────────────────────────

const auth = useAuthStore() // [Novo] Uso do store
const { data: conversation } = useQuery(getChatConversationsGlobalQuery())

// ID reativo: começa null até a query resolver
const conversationId = computed(() => conversation.value?.id ?? null)

// ── Chat via socket ───────────────────────────────────────────────────────────

const { messages, typingList, isConnected, isJoined, error, sendMessage, notifyTyping } =
  useChat(conversationId)

// ── Helpers de apresentação ───────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function typingLabel(list: typeof typingList.value): string {
  if (!list.length) return ''
  const names = list.map((u) => u.username)
  if (names.length === 1) return `${names[0]} está digitando...`
  if (names.length === 2) return `${names[0]} e ${names[1]} estão digitando...`
  return 'Várias pessoas estão digitando...'
}

// ── Agrupamento de mensagens ──────────────────────────────────────────────────

function isSequence(index: number): boolean {
  if (index <= 0) return false
  const curr = messages.value[index]
  const prev = messages.value[index - 1]
  return !!(curr && prev && curr.senderId === prev.senderId)
}

function hasNext(index: number): boolean {
  if (index >= messages.value.length - 1) return false
  const curr = messages.value[index]
  const next = messages.value[index + 1]
  return !!(curr && next && curr.senderId === next.senderId)
}

// ── Scroll automático ─────────────────────────────────────────────────────────

const scrollContainer = ref<HTMLElement | null>(null)

async function scrollToBottom(smooth = true) {
  await nextTick()
  requestAnimationFrame(() => {
    // aguarda o browser pintar
    scrollContainer.value?.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    })
  })
}

// Somente mensagens novas e typing (não mais o watch de isJoined)
watch([() => messages.value.length, () => typingList.value.length], () => scrollToBottom(true), {
  flush: 'post',
})

// ✅ Scroll inicial: chamado APÓS a transição fade terminar
function onListEnter() {
  scrollToBottom() // smooth = true por padrão
}
</script>

<template>
  <div class="relative flex h-112 flex-col">
    <ChatHeader />

    <Transition name="fade" mode="out-in" @after-enter="onListEnter">
      <div
        v-if="!isJoined"
        key="loading"
        class="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-neutral-400"
      >
        <span
          class="inline-block size-4 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-500"
        />
        <span>{{ !isConnected ? 'Conectando...' : 'Carregando mensagens...' }}</span>
      </div>

      <div
        v-else-if="error"
        key="error"
        class="flex flex-1 items-center justify-center text-sm text-red-400"
      >
        {{ error }}
      </div>

      <div
        v-else
        key="list"
        ref="scrollContainer"
        class="no-scrollbar flex-1 overflow-y-auto px-4 py-2"
      >
        <div class="flex flex-col gap-1">
          <ChatMessage
            v-for="(msg, index) in messages"
            :key="msg.id"
            :name="msg.sender.username"
            :time="formatTime(msg.createdAt)"
            :avatar="msg.sender.avatarUrl ?? undefined"
            :content="msg.content"
            :is-mine="msg.senderId === auth.user?.id"
            :is-sequence="isSequence(index)"
            :is-verified="msg.sender.isVerified"
            :has-next="hasNext(index)"
          />

          <Transition name="typing">
            <div v-if="typingList.length" class="typing-container">
              <div class="flex flex-col gap-1 px-2 pt-2 pb-4">
                <div class="ml-1 flex h-4 items-center gap-1">
                  <span
                    class="dot size-1.5 animate-bounce rounded-full bg-neutral-400"
                    style="animation-delay: 0ms"
                  ></span>
                  <span
                    class="dot size-1.5 animate-bounce rounded-full bg-neutral-400"
                    style="animation-delay: 150ms"
                  ></span>
                  <span
                    class="dot size-1.5 animate-bounce rounded-full bg-neutral-400"
                    style="animation-delay: 300ms"
                  ></span>
                </div>
                <span class="text-[10px] leading-none text-neutral-400 italic">
                  {{ typingLabel(typingList) }}
                </span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <ChatInput :disabled="!isJoined" @send="sendMessage" @typing="notifyTyping" />
  </div>
</template>

<style scoped>
/* 1. Reset de Scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 2. Animação das Bolinhas (Bounce) */
.dot {
  animation: bounce 1.4s infinite ease-in-out both;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
}

/* 3. Transição de Entrada/Saída do Indicador */
/* O segredo aqui é o overflow: hidden e a transição do max-height */
.typing-enter-active,
.typing-leave-active {
  transition:
    max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease,
    transform 0.3s ease;
  overflow: hidden;
}

.typing-enter-from,
.typing-leave-to {
  max-height: 0 !important;
  opacity: 0;
  transform: translateY(10px);
  /* Remove margens durante a transição para evitar o "gap" */
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.typing-enter-to,
.typing-leave-from {
  max-height: 100px; /* Valor alto o suficiente para conter o texto e bolinhas */
  opacity: 1;
  transform: translateY(0);
}

/* 4. Transição das Mensagens (Fade) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
