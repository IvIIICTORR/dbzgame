import { InternalError, NotFound } from '#/shared/errors/index.js'
import { conversationRepository } from '../conversations/conversation.repository.js'
import { messageRepository } from './message.repository.js'

export const messageService = {
	/**
	 * Retorna o histórico das últimas 20 mensagens de uma conversa.
	 * Lança 404 se a conversa não existir.
	 */
	async getAll(conversationId: string) {
		const conversation = await conversationRepository.findById(conversationId)

		// O Service decide lançar o erro de negócio (404)
		if (!conversation) {
			throw NotFound('Conversa não encontrada')
		}

		return messageRepository.findByConversation(conversationId, 20)
	},

	/**
	 * Persiste uma nova mensagem e retorna o registro completo.
	 */
	async create(data: {
		conversationId: string
		senderId: string
		content: string
	}) {
		const conversation = await conversationRepository.findById(
			data.conversationId,
		)

		if (!conversation) {
			throw NotFound('Conversa não encontrada')
		}

		const message = await messageRepository.create(data)

		// Caso algo falhe na busca após inserção, o Service reporta o erro
		if (!message) {
			throw InternalError('Erro ao recuperar mensagem após criação')
		}

		return message
	},
}
