import { eq } from 'drizzle-orm'
import { db } from '#/db/index.js'
import { conversations } from '#/db/schema.js'

export const conversationRepository = {
	/**
	 * Busca uma conversa pelo slug (ex: 'global').
	 * @param slug
	 * @returns
	 */
	async findBySlug(slug: string) {
		return db.query.conversations.findFirst({
			where: eq(conversations.slug, slug),
		})
	},

	/**
	 * Busca uma conversa pelo ID.
	 * @param id
	 * @returns
	 */
	async findById(id: string) {
		return db.query.conversations.findFirst({
			where: eq(conversations.id, id),
		})
	},
}
