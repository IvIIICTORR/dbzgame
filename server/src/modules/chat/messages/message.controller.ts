import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateMessageBody } from './message.schema.js'
import { messageService } from './message.service.js'

type ConversationParam = { conversationId: string }

export const messageController = {
	/**
	 * Retorna o histórico das últimas 20 mensagens da conversa.
	 */
	async getAll(
		request: FastifyRequest<{ Params: ConversationParam }>,
		reply: FastifyReply,
	) {
		const messages = await messageService.getAll(request.params.conversationId)
		return reply.send(messages)
	},

	/**
	 * Persiste a mensagem no banco e emite o evento socket para a sala.
	 */
	async create(
		request: FastifyRequest<{
			Params: ConversationParam
			Body: CreateMessageBody
		}>,
		reply: FastifyReply,
	) {
		const { sub: senderId } = request.user

		const message = await messageService.create({
			conversationId: request.params.conversationId,
			senderId,
			content: request.body.content,
		})

		// Notifica todos na sala em tempo real
		request.server.io
			.to(request.params.conversationId)
			.emit('chat:message', message)

		return reply.status(201).send(message)
	},
}
