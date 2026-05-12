import { db } from '#/db/index.js'
import { sagas, sagaStages, sagaProgress } from '#/db/schema.js'
import { eq, and, asc } from 'drizzle-orm'

export const SagaRepository = {
	async findAllActive() {
		return await db
			.select()
			.from(sagas)
			.where(eq(sagas.isActive, true))
			.orderBy(asc(sagas.sortOrder))
	},

	async findById(sagaId: string) {
		const [result] = await db
			.select()
			.from(sagas)
			.where(eq(sagas.id, sagaId))
			.limit(1)
		return result
	},

	async findStagesBySagaId(sagaId: string) {
		return await db
			.select()
			.from(sagaStages)
			.where(eq(sagaStages.sagaId, sagaId))
			.orderBy(asc(sagaStages.sortOrder))
	},

	async findProgressByUser(userId: string) {
		return await db
			.select()
			.from(sagaProgress)
			.where(eq(sagaProgress.userId, userId))
	},

	async findProgressEntry(userId: string, sagaId: string) {
		const [result] = await db
			.select()
			.from(sagaProgress)
			.where(
				and(
					eq(sagaProgress.userId, userId),
					eq(sagaProgress.sagaId, sagaId),
				),
			)
			.limit(1)
		return result
	},

	async upsertProgress(
		userId: string,
		sagaId: string,
		data: {
			status?: 'locked' | 'in_progress' | 'completed'
			rank?: 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'
			bestTime?: number
			victories?: number
			defeats?: number
			currentStageId?: string
			completedAt?: Date
		},
	) {
		const existing = await SagaRepository.findProgressEntry(userId, sagaId)

		if (existing) {
			await db
				.update(sagaProgress)
				.set(data)
				.where(eq(sagaProgress.id, existing.id))
			return { ...existing, ...data }
		}

		await db.insert(sagaProgress).values({
			userId,
			sagaId,
			...data,
		} as typeof sagaProgress.$inferInsert)
		return { userId, sagaId, ...data }
	},
}
