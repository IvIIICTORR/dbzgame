import { db } from '#/db/index.js'
import { news } from '#/db/schema.js'
import { eq, desc } from 'drizzle-orm'

export const NewsRepository = {
	async findAll() {
		return await db.select().from(news).orderBy(desc(news.publishedAt))
	},

	async findBySlug(slug: string) {
		const [result] = await db
			.select()
			.from(news)
			.where(eq(news.slug, slug))
			.limit(1)
		return result
	},

	async create(data: typeof news.$inferInsert) {
		return await db.insert(news).values(data)
	},
}
