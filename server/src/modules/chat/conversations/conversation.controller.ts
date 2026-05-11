import type { FastifyReply, FastifyRequest } from 'fastify'
import type { IdParam } from '#/shared/schemas/index.js'
import { conversationService } from './conversation.service.js'

export const conversationController = {
	/**
	 * Retorna o canal de chat global do jogo.
	 */
	async getGlobal(_request: FastifyRequest, reply: FastifyReply) {
		const conversation = await conversationService.getGlobal()
		return reply.send(conversation)
	},

	/**
	 * Retorna uma conversa pelo ID.
	 */
	async getById(
		request: FastifyRequest<{ Params: IdParam }>,
		reply: FastifyReply,
	) {
		const conversation = await conversationService.getById(request.params.id)
		return reply.send(conversation)
	},
}
