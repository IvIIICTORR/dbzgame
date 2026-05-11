// src/types/websocket.d.ts
import type {
  GetChatMessagesByConversationIdResponse,
  PostChatMessagesByConversationIdResponse,
} from '@/api/types.gen'

// ── Aliases para clareza ──────────────────────────────────────────────────────

export type ChatMessage = PostChatMessagesByConversationIdResponse
export type ChatHistory = GetChatMessagesByConversationIdResponse

export type TypingPayload = {
  userId: string
  username: string
}

export type ChatError = {
  message: string
}

// ── Contratos de eventos do Socket.IO ─────────────────────────────────────────
//    Usados para tipar o cliente: Socket<ServerToClient, ClientToServer>

export interface ServerToClientEvents {
  /** Enviado ao entrar na sala: histórico das últimas 20 mensagens */
  'chat:history': (messages: ChatHistory) => void

  /** Nova mensagem em tempo real */
  'chat:message': (message: ChatMessage) => void

  /** Outro usuário está digitando */
  'chat:typing': (payload: TypingPayload) => void

  /** Erro de negócio (sala não encontrada, não autenticado etc.) */
  'chat:error': (error: ChatError) => void
}

export interface ClientToServerEvents {
  /** Entra em uma sala e recebe o histórico */
  'chat:join': (conversationId: string) => void

  /** Sai de uma sala */
  'chat:leave': (conversationId: string) => void

  /** Envia uma mensagem */
  'chat:message': (payload: { conversationId: string; content: string }) => void

  /** Notifica que está digitando */
  'chat:typing': (conversationId: string) => void
}
