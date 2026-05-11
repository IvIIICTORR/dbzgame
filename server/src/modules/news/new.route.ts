import type { FastifyInstance } from 'fastify'
import { NewsController } from './new.controller.js'

export async function newsRoutes(app: FastifyInstance) {
	app.get('/news', NewsController.index)
	app.get('/news/:slug', NewsController.show)
}
