import type { FastifyInstance } from 'fastify'
import { SagaController } from './saga.controller.js'

export default async function sagaRoutes(fastify: FastifyInstance) {
	fastify.get(
		'/sagas',
		{ onRequest: [fastify.authenticate] },
		SagaController.getAll,
	)

	fastify.get(
		'/sagas/:id',
		{ onRequest: [fastify.authenticate] },
		SagaController.getDetail as any,
	)

	fastify.post(
		'/sagas/:id/result',
		{ onRequest: [fastify.authenticate] },
		SagaController.submitResult as any,
	)
}
