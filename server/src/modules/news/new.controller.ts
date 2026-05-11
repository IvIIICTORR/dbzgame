import type { FastifyRequest, FastifyReply } from 'fastify'
import { NewsService } from './new.service.js'

export const NewsController = {
	async index(_request: FastifyRequest, reply: FastifyReply) {
		const news = await NewsService.getAllNews()
		return reply.send(news)
	},

	async show(
		request: FastifyRequest<{ Params: { slug: string } }>,
		reply: FastifyReply,
	) {
		const { slug } = request.params
		const post = await NewsService.getNewsDetails(slug)
		return reply.send(post)
	},
}
