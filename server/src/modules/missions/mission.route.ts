import type { FastifyInstance } from 'fastify'
import { MissionController } from './mission.controller.js'

export default async function missionRoutes(fastify: FastifyInstance) {
	fastify.get(
		'/daily',
		{ onRequest: [fastify.authenticate] },
		MissionController.getDailyMissions,
	)

	fastify.post(
		'/daily/:id/claim',
		{ onRequest: [fastify.authenticate] },
		MissionController.claimReward,
	)
}
