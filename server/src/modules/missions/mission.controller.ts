import type { FastifyRequest, FastifyReply } from 'fastify'
import { MissionService } from './mission.service.js'

export const MissionController = {
	async getDailyMissions(request: FastifyRequest, reply: FastifyReply) {
		const userId = request.user.sub
		const missions = await MissionService.getDailyMissions(userId)
		return reply.send(missions)
	},

	async claimReward(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const userId = request.user.sub
		const { id } = request.params
		const result = await MissionService.claimReward(userId, id)
		return reply.send(result)
	},
}
