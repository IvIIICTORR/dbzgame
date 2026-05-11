import { eq } from 'drizzle-orm'
import { db } from '#/db/index.js'
import { referrals, users } from '#/db/schema.js'

export const referralRepository = {
	/**
	 * Busca um usuário no banco de dados através do seu código único de indicação.
	 * * @param code - Código de indicação (ex: SAM-A1B2).
	 * @returns Promessa com o usuário proprietário do código ou null se não encontrado.
	 */
	async getUserByReferralCode(code: string) {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.referralCode, code))
			.limit(1)
		return user || null
	},

	/**
	 * Cria um registro histórico vinculando o padrinho ao novo usuário indicado.
	 * * @param referrerId - ID do usuário que fez a indicação.
	 * @param referredId - ID do usuário que foi indicado.
	 */
	async createReferralLog(referrerId: string, referredId: string) {
		await db.insert(referrals).values({
			referrerId,
			referredId,
			status: 'completed',
		})
	},

	/**
	 * Realiza um Join entre a tabela de indicações e usuários para listar quem foi indicado.
	 * * @param userId - ID do padrinho para filtrar as indicações.
	 * @returns Promessa com um objeto formatado contendo ID da indicação, status e dados do indicado (username/avatar).
	 */
	async getReferralsByUserId(userId: string) {
		return db
			.select({
				id: referrals.id,
				status: referrals.status,
				createdAt: referrals.createdAt,
				referredUser: {
					username: users.username,
					avatarUrl: users.avatarUrl,
				},
			})
			.from(referrals)
			.innerJoin(users, eq(referrals.referredId, users.id))
			.where(eq(referrals.referrerId, userId))
	},
}
