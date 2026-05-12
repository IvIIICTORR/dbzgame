import { MissionRepository } from './mission.repository.js'
import { BadRequest, NotFound } from '#/shared/errors/index.js'

const getTodayDate = () => new Date().toISOString().split('T')[0]

export const MissionService = {
	async getDailyMissions(userId: string) {
		const today = getTodayDate()
		const missions = await MissionRepository.findAllActiveMissions()
		const progressList = await MissionRepository.findProgressByUserAndDate(userId, today)

		const progressMap = new Map(
			progressList.map((p) => [p.missionId, p]),
		)

		return missions.map((mission) => {
			const progress = progressMap.get(mission.id)
			return {
				id: mission.id,
				title: mission.title,
				desc: mission.description,
				progress: progress?.progress ?? 0,
				total: mission.total,
				image: mission.imageUrl,
				reward: { zeni: mission.rewardZeni, exp: mission.rewardExp },
				claimed: progress?.claimed ?? false,
			}
		})
	},

	async claimReward(userId: string, missionId: string) {
		const today = getTodayDate()

		const mission = await MissionRepository.findMissionById(missionId)
		if (!mission) throw NotFound('Missão não encontrada')

		let progressEntry = await MissionRepository.findProgressEntry(userId, missionId, today)

		if (!progressEntry) {
			throw BadRequest('Nenhum progresso encontrado para esta missão hoje')
		}

		if (progressEntry.claimed) {
			throw BadRequest('Recompensa já foi coletada hoje')
		}

		if (progressEntry.progress < mission.total) {
			throw BadRequest('Missão ainda não foi concluída')
		}

		await MissionRepository.claimMission(progressEntry.id)

		return {
			success: true,
			reward: { zeni: mission.rewardZeni, exp: mission.rewardExp },
			message: `Recompensa coletada: +${mission.rewardZeni} Zeni, +${mission.rewardExp} EXP`,
		}
	},
}
