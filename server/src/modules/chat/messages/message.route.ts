import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { errorResponseSchema } from '#/shared/schemas/index.js'
import { messageController } from './message.controller.js'
import {
	createMessageBodySchema,
	messageResponseSchema,
	messagesHistoryResponseSchema,
} from './message.schema.js'

const conversationParamSchema = z.object({
	conversationId: z.string().uuid(),
})

export default async function messageRoutes(fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<ZodTypeProvider>()

	app.get(
		'/:conversationId',
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ['Messages'],
				summary: 'Histórico de mensagens',
				params: conversationParamSchema,
				response: {
					200: messagesHistoryResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		messageController.getAll,
	)

	app.post(
		'/:conversationId',
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ['Messages'],
				summary: 'Enviar mensagem',
				params: conversationParamSchema,
				body: createMessageBodySchema,
				response: {
					201: messageResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		messageController.create,
	)
}
