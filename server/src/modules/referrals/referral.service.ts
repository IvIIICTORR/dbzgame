import { userRepository } from '../users/user.repository.js'
import { referralRepository } from './referral.repository.js'

const REWARD_DAYS = 7

export const referralService = {
	/**
	 * Valida um código de indicação e concede benefícios (VIP) tanto para o padrinho quanto para o indicado.
	 * * @param code - O código de indicação fornecido durante o registro.
	 * @param newUserId - O ID do usuário que acabou de se cadastrar.
	 * @returns Promessa de execução. Caso o código seja inválido ou o usuário tente indicar a si mesmo, a função encerra silenciosamente.
	 */
	async processReferral(code: string, newUserId: string) {
		const referrer = await referralRepository.getUserByReferralCode(code)

		if (!referrer || referrer.id === newUserId) return

		await referralRepository.createReferralLog(referrer.id, newUserId)

		await Promise.all([
			userRepository.giveVipDays(referrer.id, REWARD_DAYS),
			userRepository.giveVipDays(newUserId, REWARD_DAYS),
		])
	},

	/**
	 * Obtém o histórico de indicações de um usuário específico.
	 * * @param userId - ID do usuário padrinho.
	 * @returns Promessa com a lista de usuários indicados e o status da indicação.
	 */
	async getUserReferrals(userId: string) {
		return referralRepository.getReferralsByUserId(userId)
	},
}
