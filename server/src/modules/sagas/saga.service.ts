import { SagaRepository } from './saga.repository.js'
import { NotFound, BadRequest } from '#/shared/errors/index.js'

export const SagaService = {
	async getAllSagas(userId: string) {
		const allSagas = await SagaRepository.findAllActive()
		const progressList = await SagaRepository.findProgressByUser(userId)

		const progressMap = new Map(
			progressList.map((p) => [p.sagaId, p]),
		)

		// Determinar quais sagas estão desbloqueadas
		const completedSagaIds = new Set(
			progressList.filter((p) => p.status === 'completed').map((p) => p.sagaId),
		)

		return allSagas.map((saga) => {
			const progress = progressMap.get(saga.id)

			// Uma saga está desbloqueada se não tem requisito OU se o requisito está concluído
			const unlocked = !saga.requiresSagaId || completedSagaIds.has(saga.requiresSagaId)

			let status: 'CONCLUÍDO' | 'EM PROGRESSO' | 'BLOQUEADO'
			if (progress?.status === 'completed') status = 'CONCLUÍDO'
			else if (progress?.status === 'in_progress') status = 'EM PROGRESSO'
			else if (unlocked && !progress) status = 'BLOQUEADO'
			else status = 'BLOQUEADO'

			// Override: se desbloqueada e sem progresso, mostra como disponível (não bloqueado)
			if (unlocked && !progress) status = 'EM PROGRESSO'

			return {
				id: saga.id,
				title: saga.title,
				episode: saga.episode,
				desc: saga.description,
				difficulty: saga.difficulty,
				reward: saga.reward,
				rewardZeni: saga.rewardZeni,
				rewardExp: saga.rewardExp,
				image: saga.imageUrl,
				rank: progress?.rank ?? '-',
				status,
				unlocked,
				victories: progress?.victories ?? 0,
				defeats: progress?.defeats ?? 0,
				bestTime: progress?.bestTime ?? null,
			}
		})
	},

	async getSagaDetail(userId: string, sagaId: string) {
		const saga = await SagaRepository.findById(sagaId)
		if (!saga) throw NotFound('Saga não encontrada')

		const stages = await SagaRepository.findStagesBySagaId(sagaId)
		const progress = await SagaRepository.findProgressEntry(userId, sagaId)

		return {
			id: saga.id,
			title: saga.title,
			episode: saga.episode,
			desc: saga.description,
			difficulty: saga.difficulty,
			reward: saga.reward,
			rewardZeni: saga.rewardZeni,
			rewardExp: saga.rewardExp,
			image: saga.imageUrl,
			status: progress?.status ?? 'locked',
			rank: progress?.rank ?? null,
			stages: stages.map((s) => ({
				id: s.id,
				stageName: s.stageName,
				enemyName: s.enemyName,
				enemyLevel: s.enemyLevel,
				enemyHp: s.enemyHp,
				enemyAvatarUrl: s.enemyAvatarUrl,
				enemyImageUrl: s.enemyImageUrl,
				enemyForm: s.enemyForm,
			})),
		}
	},

	async submitBattleResult(
		userId: string,
		sagaId: string,
		data: { won: boolean; timeElapsed: number },
	) {
		const saga = await SagaRepository.findById(sagaId)
		if (!saga) throw NotFound('Saga não encontrada')

		const progress = await SagaRepository.findProgressEntry(userId, sagaId)

		if (progress?.status === 'completed' && data.won) {
			// Já concluída, mas pode melhorar o rank/tempo
			const updateData: Record<string, unknown> = {
				victories: (progress.victories ?? 0) + 1,
			}
			if (data.timeElapsed && (!progress.bestTime || data.timeElapsed < progress.bestTime)) {
				updateData.bestTime = data.timeElapsed
			}
			const newRank = calculateRank(data.timeElapsed)
			if (isRankBetter(newRank, progress.rank)) {
				updateData.rank = newRank
			}
			await SagaRepository.upsertProgress(userId, sagaId, updateData)

			return {
				success: true,
				won: true,
				reward: null,
				message: 'Batalha vencida! Seu progresso foi atualizado.',
			}
		}

		if (data.won) {
			const rank = calculateRank(data.timeElapsed)
			await SagaRepository.upsertProgress(userId, sagaId, {
				status: 'completed',
				rank,
				victories: (progress?.victories ?? 0) + 1,
				bestTime: data.timeElapsed,
				completedAt: new Date(),
			})

			return {
				success: true,
				won: true,
				reward: { zeni: saga.rewardZeni, exp: saga.rewardExp, item: saga.reward },
				message: `Saga concluída! Rank: ${rank}. +${saga.rewardZeni} Zeni, +${saga.rewardExp} EXP`,
			}
		}

		// Derrota
		await SagaRepository.upsertProgress(userId, sagaId, {
			status: 'in_progress',
			defeats: (progress?.defeats ?? 0) + 1,
		})

		return {
			success: true,
			won: false,
			reward: null,
			message: 'Derrota. Treine mais e tente novamente!',
		}
	},
}

function calculateRank(timeElapsed: number): 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' {
	if (timeElapsed <= 30) return 'SSS'
	if (timeElapsed <= 45) return 'SS'
	if (timeElapsed <= 60) return 'S'
	if (timeElapsed <= 75) return 'A'
	if (timeElapsed <= 90) return 'B'
	if (timeElapsed <= 120) return 'C'
	return 'D'
}

const rankOrder = ['D', 'C', 'B', 'A', 'S', 'SS', 'SSS'] as const

function isRankBetter(newRank: string, currentRank: string | null): boolean {
	if (!currentRank) return true
	const newIdx = rankOrder.indexOf(newRank as typeof rankOrder[number])
	const curIdx = rankOrder.indexOf(currentRank as typeof rankOrder[number])
	return newIdx > curIdx
}
