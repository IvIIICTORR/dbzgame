// src/composables/useChat.ts
import { useAuthStore } from '@/stores/auth' // [Novo] Import do store
import type {
  ChatHistory,
  ChatMessage,
  ClientToServerEvents,
  ServerToClientEvents,
  TypingPayload,
} from '@/types/websocket.d'
import { websocket } from '@/websocket'
import type { Socket } from 'socket.io-client'
import { onUnmounted, readonly, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const TYPING_TIMEOUT_MS = 2500

export function useChat(conversationIdSource: MaybeRefOrGetter<string | null>) {
  const socket = websocket as ChatSocket
  const auth = useAuthStore() // [Novo] Instância do auth

  const messages = ref<ChatMessage[]>([])
  const typingUsers = ref<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const typingList = ref<TypingPayload[]>([])
  const isConnected = ref(socket.connected)
  const isJoined = ref(false)
  const error = ref<string | null>(null)

  let typingDebounceTimer: ReturnType<typeof setTimeout> | null = null

  const currentId = () => toValue(conversationIdSource)

  function join(id: string) {
    socket.emit('chat:join', id)
  }

  function leave(id: string) {
    socket.emit('chat:leave', id)
    isJoined.value = false
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  function onConnect() {
    isConnected.value = true
    error.value = null
    const id = currentId()
    if (id && auth.isAuthenticated) join(id) // [Update] Verifica auth
  }

  function onDisconnect() {
    isConnected.value = false
    isJoined.value = false
    typingUsers.value.forEach(clearTimeout)
    typingUsers.value.clear()
    typingList.value = []
  }

  function onHistory(history: ChatHistory) {
    messages.value = history
    isJoined.value = true
  }

  function onMessage(message: ChatMessage) {
    if (messages.value.some((m) => m.id === message.id)) return
    messages.value.push(message)
  }

  function onTyping(payload: TypingPayload) {
    const prev = typingUsers.value.get(payload.userId)
    if (prev) clearTimeout(prev)

    if (!typingList.value.some((u) => u.userId === payload.userId)) {
      typingList.value.push(payload)
    }

    const timer = setTimeout(() => {
      typingList.value = typingList.value.filter((u) => u.userId !== payload.userId)
      typingUsers.value.delete(payload.userId)
    }, TYPING_TIMEOUT_MS)

    typingUsers.value.set(payload.userId, timer)
  }

  function onError(err: { message: string }) {
    error.value = err.message
  }

  // ── Listeners ─────────────────────────────────────────────────────────────

  function attachListeners() {
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('chat:history', onHistory)
    socket.on('chat:message', onMessage)
    socket.on('chat:typing', onTyping)
    socket.on('chat:error', onError)
  }

  function detachListeners() {
    socket.off('connect', onConnect)
    socket.off('disconnect', onDisconnect)
    socket.off('chat:history', onHistory)
    socket.off('chat:message', onMessage)
    socket.off('chat:typing', onTyping)
    socket.off('chat:error', onError)
  }

  // ── Watches ────────────────────────────────────────────────────────────────

  // Reage a mudanças no ID
  watch(
    () => toValue(conversationIdSource),
    (newId, oldId) => {
      if (oldId && isJoined.value) {
        leave(oldId)
        messages.value = []
        typingList.value = []
      }

      if (!newId || !auth.isAuthenticated) return

      if (socket.connected) join(newId)
      else socket.connect()
    },
  )

  // [Novo] Reage a logout/login
  watch(
    () => auth.isAuthenticated,
    (isAuthed) => {
      if (!isAuthed) {
        const id = currentId()
        if (id) leave(id)
        socket.disconnect()
      } else {
        const id = currentId()
        if (id) socket.connect()
      }
    },
  )

  function sendMessage(content: string) {
    const id = currentId()
    const trimmed = content.trim()
    if (!trimmed || !isJoined.value || !id) return
    socket.emit('chat:message', { conversationId: id, content: trimmed })
  }

  function notifyTyping() {
    const id = currentId()
    if (!isJoined.value || !id || typingDebounceTimer) return
    socket.emit('chat:typing', id)
    typingDebounceTimer = setTimeout(() => {
      typingDebounceTimer = null
    }, TYPING_TIMEOUT_MS)
  }

  attachListeners()

  const initialId = currentId()
  if (initialId && auth.isAuthenticated) {
    if (socket.connected) join(initialId)
    else socket.connect()
  }

  onUnmounted(() => {
    const id = currentId()
    if (id && isJoined.value) leave(id)
    detachListeners()
    if (typingDebounceTimer) clearTimeout(typingDebounceTimer)
    typingUsers.value.forEach(clearTimeout)
    if (socket.listeners('chat:message').length === 0) socket.disconnect()
  })

  return {
    messages: readonly(messages),
    typingList: readonly(typingList),
    isConnected: readonly(isConnected),
    isJoined: readonly(isJoined),
    error: readonly(error),
    sendMessage,
    notifyTyping,
  }
}
