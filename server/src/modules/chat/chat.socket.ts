import type { FastifyInstance } from 'fastify'
import type { Server, Socket } from 'socket.io'
import { conversationRepository } from './conversations/conversation.repository.js'
import { messageService } from './messages/message.service.js'

//
//  CLIENT → SERVER
//  ┌─────────────────┬──────────────────────────────────────────────────────┐
//  │ chat:join       │ conversationId: string                               │
//  │ chat:leave      │ conversationId: string                               │
//  │ chat:message    │ { conversationId: string; content: string }          │
//  │ chat:typing     │ { conversationId: string }                           │
//  └─────────────────┴──────────────────────────────────────────────────────┘
//
//  SERVER → CLIENT
//  ┌─────────────────┬──────────────────────────────────────────────────────┐
//  │ chat:history    │ MessageResponse[]  (enviado ao entrar na sala)       │
//  │ chat:message    │ MessageResponse    (nova mensagem em tempo real)     │
//  │ chat:typing     │ { userId, username }                                 │
//  │ chat:error      │ { message: string }                                  │
//  └─────────────────┴──────────────────────────────────────────────────────┘

// Dados do usuário autenticado que ficam no handshake após validação do JWT
type AuthData = {
	userId: string
	username: string
}

export function registerChatSocket(io: Server, app: FastifyInstance) {
	io.on('connection', (socket: Socket) => {
		// O userId e username devem ser injetados via middleware de autenticação
		// do Socket.IO (ex: verificando socket.handshake.auth.token com fastify.jwt)
		const auth = socket.data as AuthData

		// ── chat:join ──────────────────────────────────────────────────────────
		socket.on('chat:join', async (conversationId: string) => {
			try {
				const conversation =
					await conversationRepository.findById(conversationId)

				if (!conversation) {
					socket.emit('chat:error', { message: 'Conversa não encontrada' })
					return
				}

				await socket.join(conversationId)

				const history = await messageService.getAll(conversationId)
				socket.emit('chat:history', history)

				app.log.info(`[chat:join] socket=${socket.id} room=${conversationId}`)
			} catch (err) {
				app.log.error(err, '[chat:join] erro inesperado')
				socket.emit('chat:error', { message: 'Erro ao entrar na conversa' })
			}
		})

		// ── chat:leave ─────────────────────────────────────────────────────────
		socket.on('chat:leave', async (conversationId: string) => {
			await socket.leave(conversationId)
			app.log.info(`[chat:leave] socket=${socket.id} room=${conversationId}`)
		})

		// ── chat:message ───────────────────────────────────────────────────────
		socket.on(
			'chat:message',
			async (payload: { conversationId: string; content: string }) => {
				try {
					if (!auth?.userId) {
						socket.emit('chat:error', { message: 'Não autenticado' })
						return
					}

					const message = await messageService.create({
						conversationId: payload.conversationId,
						senderId: auth.userId,
						content: payload.content,
					})

					// Envia para todos na sala (inclusive o remetente)
					io.to(payload.conversationId).emit('chat:message', message)
				} catch (err: any) {
					app.log.error(err, '[chat:message] erro inesperado')
					socket.emit('chat:error', {
						message: err?.message ?? 'Erro ao enviar mensagem',
					})
				}
			},
		)

		// ── chat:typing ────────────────────────────────────────────────────────
		socket.on('chat:typing', (conversationId: string) => {
			if (!auth?.userId) return

			// Emite apenas para os outros membros da sala (sem o próprio remetente)
			socket.to(conversationId).emit('chat:typing', {
				userId: auth.userId,
				username: auth.username,
			})
		})
	})
}
