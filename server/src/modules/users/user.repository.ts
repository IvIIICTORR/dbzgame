import { and, eq, isNull } from 'drizzle-orm'
import { db } from '#/db/index.js'
import { users } from '#/db/schema.js'
import type { CreateUserInput, UpdateUserInput } from './user.schema.js'

export const userRepository = {
	/**
	 * Insere um novo usuário no banco de dados.
	 * * @param data - Objeto contendo os dados processados do usuário (incluindo hash de senha e código de convite).
	 * @returns Promessa com os dados do usuário recém-criado.
	 */
	async create(
		data: Omit<CreateUserInput, 'password' | 'acceptedTerms'> & {
			passwordHash: string
			referralCode: string
			acceptedTermsAt: Date
		},
	) {
		const [inserted] = await db.insert(users).values(data).$returningId()
		if (!inserted) throw new Error('Falha ao criar usuário.')
		return this.findById(inserted.id)
	},

	/**
	 * Recupera todos os usuários que não foram marcados como excluídos.
	 * * @returns Promessa com um array de usuários ativos.
	 */
	async findAll() {
		return db.select().from(users).where(isNull(users.deletedAt))
	},

	/**
	 * Busca um usuário pelo seu identificador único, desde que não esteja excluído.
	 * * @param id - UUID ou ID do usuário.
	 * @returns Promessa com o usuário encontrado ou null caso não exista ou esteja deletado.
	 */
	async findById(id: string) {
		const [user] = await db
			.select()
			.from(users)
			.where(and(eq(users.id, id), isNull(users.deletedAt)))
		return user || null
	},

	/**
	 * Busca um usuário através do endereço de e-mail.
	 * * @param email - E-mail para consulta.
	 * @returns Promessa com o usuário encontrado ou null.
	 */
	async findByEmail(email: string) {
		const [user] = await db.select().from(users).where(eq(users.email, email))
		return user || null
	},

	async findByUsername(username: string) {
		const [user] = await db
			.select()
			.from(users)
			.where(and(eq(users.username, username), isNull(users.deletedAt)))
		return user || null
	},

	/**
	 * Atualiza os campos de um usuário específico e retorna o registro atualizado.
	 * * @param id - ID do usuário a ser atualizado.
	 * @param data - Objeto com os campos parciais para atualização.
	 * @returns Promessa com os novos dados do usuário.
	 */
	async update(id: string, data: UpdateUserInput) {
		await db.update(users).set(data).where(eq(users.id, id))
		return this.findById(id)
	},

	/**
	 * Realiza a exclusão lógica (soft delete) de um usuário, definindo a data de deleção.
	 * * @param id - ID do usuário a ser desativado.
	 * @returns Promessa de conclusão da operação.
	 */
	async delete(id: string) {
		// Soft delete
		await db
			.update(users)
			.set({ deletedAt: new Date() })
			.where(eq(users.id, id))
	},

	/**
	 * Concede dias de acesso VIP a um usuário e atualiza a data de expiração.
	 * @param userId - Identificador único do usuário.
	 * @param days - Quantidade de dias a serem adicionados a partir de hoje.
	 */
	async addRewards(userId: string, zeni: number, exp: number) {
		const user = await this.findById(userId)
		if (!user) return null

		const newZeni = user.zeni + zeni
		const newExp = user.exp + exp

		// Level up: cada 1000 EXP = 1 level
		const expPerLevel = 1000
		const totalExp = newExp
		const levelsGained = Math.floor(totalExp / expPerLevel)
		const newLevel = user.level + levelsGained
		const remainingExp = totalExp - (levelsGained * expPerLevel)

		// Power level cresce com level
		const newPowerLevel = user.powerLevel + (levelsGained * 500) + (exp > 0 ? Math.floor(exp / 2) : 0)

		await db
			.update(users)
			.set({
				zeni: newZeni,
				exp: levelsGained > 0 ? remainingExp : newExp,
				level: newLevel,
				powerLevel: newPowerLevel,
			})
			.where(eq(users.id, userId))

		return this.findById(userId)
	},

	async giveVipDays(userId: string, days: number) {
		const vipExpiresAt = new Date()
		vipExpiresAt.setDate(vipExpiresAt.getDate() + days)

		await db
			.update(users)
			.set({ isVip: true, vipExpiresAt })
			.where(eq(users.id, userId))
	},
}
