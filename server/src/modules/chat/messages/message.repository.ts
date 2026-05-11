import { desc, eq } from 'drizzle-orm'
import { db } from '#/db/index.js'
import { messages } from '#/db/schema.js'

// Colunas do sender que queremos expor (evita vazar passwordHash etc.)
const senderColumns = {
	id: true,
	username: true,
	name: true,
	avatarUrl: true,
	isVerified: true,
	race: true,
} as const

export const messageRepository = {
	/**
	 * Busca as últimas N mensagens de uma conversa, ordenadas da mais antiga
	 * para a mais recente.
	 */
	async findByConversation(conversationId: string, limit = 20) {
		const rows = await db.query.messages.findMany({
			where: eq(messages.conversationId, conversationId),
			with: { sender: { columns: senderColumns } },
			orderBy: [desc(messages.createdAt)],
			limit,
		})
		return rows.reverse()
	},

	/**
	 * Insere uma nova mensagem e retorna o registro completo com sender.
	 */
	async create(data: {
		conversationId: string
		senderId: string
		content: string
		type?: 'text' | 'system'
	}) {
		// Correção: Acessando o primeiro item do array de forma segura
		const result = await db.insert(messages).values(data).$returningId()
		const inserted = result[0]

		if (!inserted) return null

		return db.query.messages.findFirst({
			where: eq(messages.id, inserted.id),
			with: { sender: { columns: senderColumns } },
		})
	},

	/**
	 * Busca uma mensagem pelo ID (com sender).
	 */
	async findById(id: string) {
		return db.query.messages.findFirst({
			where: eq(messages.id, id),
			with: { sender: { columns: senderColumns } },
		})
	},
}
