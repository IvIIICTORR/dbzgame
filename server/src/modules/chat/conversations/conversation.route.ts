import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { errorResponseSchema, idParamSchema } from '#/shared/schemas/index.js'
import { conversationController } from './conversation.controller.js'
import { conversationResponseSchema } from './conversation.schema.js'

export default async function conversationRoutes(fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<ZodTypeProvider>()

	app.get(
		'/global',
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ['Conversations'],
				summary: 'Obter canal global',
				response: {
					200: conversationResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		conversationController.getGlobal,
	)

	app.get(
		'/:id',
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ['Conversations'],
				summary: 'Obter conversa por ID',
				params: idParamSchema,
				response: {
					200: conversationResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		conversationController.getById,
	)
}
