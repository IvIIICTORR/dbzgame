import { NotFound } from '#/shared/errors/index.js'
import { conversationRepository } from './conversation.repository.js'

export const conversationService = {
	/**
	 * Retorna o canal global. Lança 404 se não existir.
	 */
	async getGlobal() {
		const conversation = await conversationRepository.findBySlug('global')
		if (!conversation) throw NotFound('Canal global não encontrado')
		return conversation
	},

	/**
	 * Retorna uma conversa pelo ID. Lança 404 se não existir.
	 */
	async getById(id: string) {
		const conversation = await conversationRepository.findById(id)
		if (!conversation) throw NotFound('Conversa não encontrada')
		return conversation
	},
}
