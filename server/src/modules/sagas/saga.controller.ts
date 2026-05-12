import type { FastifyRequest, FastifyReply } from 'fastify'
import { SagaService } from './saga.service.js'

export const SagaController = {
	async getAll(request: FastifyRequest, reply: FastifyReply) {
		const userId = request.user.sub
		const result = await SagaService.getAllSagas(userId)
		return reply.send(result)
	},

	async getDetail(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const userId = request.user.sub
		const { id } = request.params
		const result = await SagaService.getSagaDetail(userId, id)
		return reply.send(result)
	},

	async submitResult(
		request: FastifyRequest<{
			Params: { id: string }
			Body: { won: boolean; timeElapsed: number }
		}>,
		reply: FastifyReply,
	) {
		const userId = request.user.sub
		const { id } = request.params
		const { won, timeElapsed } = request.body
		const result = await SagaService.submitBattleResult(userId, id, { won, timeElapsed })
		return reply.send(result)
	},
}
