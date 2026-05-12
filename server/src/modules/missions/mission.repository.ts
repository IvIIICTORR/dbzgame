import { db } from '#/db/index.js'
import { dailyMissions, dailyMissionProgress } from '#/db/schema.js'
import { eq, and, desc } from 'drizzle-orm'

export const MissionRepository = {
	async findAllActiveMissions() {
		return await db
			.select()
			.from(dailyMissions)
			.where(eq(dailyMissions.isActive, true))
			.orderBy(desc(dailyMissions.createdAt))
	},

	async findProgressByUserAndDate(userId: string, date: string) {
		return await db
			.select()
			.from(dailyMissionProgress)
			.where(
				and(
					eq(dailyMissionProgress.userId, userId),
					eq(dailyMissionProgress.date, date),
				),
			)
	},

	async findProgressEntry(userId: string, missionId: string, date: string) {
		const [result] = await db
			.select()
			.from(dailyMissionProgress)
			.where(
				and(
					eq(dailyMissionProgress.userId, userId),
					eq(dailyMissionProgress.missionId, missionId),
					eq(dailyMissionProgress.date, date),
				),
			)
			.limit(1)
		return result
	},

	async upsertProgress(userId: string, missionId: string, date: string, progress: number) {
		const existing = await MissionRepository.findProgressEntry(userId, missionId, date)

		if (existing) {
			await db
				.update(dailyMissionProgress)
				.set({ progress })
				.where(eq(dailyMissionProgress.id, existing.id))
			return { ...existing, progress }
		}

		const [result] = await db
			.insert(dailyMissionProgress)
			.values({ userId, missionId, date, progress })
			.$returningId()
		return result
	},

	async claimMission(progressId: string) {
		await db
			.update(dailyMissionProgress)
			.set({ claimed: true, claimedAt: new Date() })
			.where(eq(dailyMissionProgress.id, progressId))
	},

	async findMissionById(missionId: string) {
		const [result] = await db
			.select()
			.from(dailyMissions)
			.where(eq(dailyMissions.id, missionId))
			.limit(1)
		return result
	},
}
