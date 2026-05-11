import { NewsRepository } from './new.repository.js'
import { NotFound } from '#/shared/errors/index.js'

export const NewsService = {
	async getAllNews() {
		const items = await NewsRepository.findAll()
		return items
	},

	async getNewsDetails(slug: string) {
		const post = await NewsRepository.findBySlug(slug)
		if (!post) throw NotFound('Notícia não encontrada')

		return post
	},
}
