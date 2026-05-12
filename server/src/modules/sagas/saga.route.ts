import type { FastifyInstance } from 'fastify'
import { SagaController } from './saga.controller.js'

export default async function sagaRoutes(fastify: FastifyInstance) {
	fastify.get(
		'/',
		{ onRequest: [fastify.authenticate] },
		SagaController.getAll,
	)

	fastify.get(
		'/:id',
		{ onRequest: [fastify.authenticate] },
		SagaController.getDetail as any,
	)

	fastify.post(
		'/:id/result',
		{ onRequest: [fastify.authenticate] },
		SagaController.submitResult as any,
	)
}
