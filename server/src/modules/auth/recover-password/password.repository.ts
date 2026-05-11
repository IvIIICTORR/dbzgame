import { and, eq, gt } from 'drizzle-orm'
import { db } from '#/db/index.js'
import { tokens, users } from '#/db/schema.js'

export const passwordRepository = {
	/**
	 * Deleta tokens anteriores do usuário e salva um novo dentro de uma transação.
	 * * @param userId - ID do usuário.
	 * @param token - Token gerado.
	 * @param expiresAt - Objeto Date com o tempo de expiração.
	 */
	async saveResetToken(userId: string, token: string, expiresAt: Date) {
		return await db.transaction(async (tx) => {
			await tx.delete(tokens).where(eq(tokens.userId, userId))

			await tx.insert(tokens).values({
				userId,
				token,
				expiresAt,
			})
		})
	},

	/**
	 * Busca no banco um token que corresponda ao valor informado e ainda não tenha expirado.
	 * * @param token - Token hexadecimal.
	 * @returns O registro do token se encontrado e válido, caso contrário, undefined.
	 */
	async findValidToken(token: string) {
		return await db.query.tokens.findFirst({
			where: (t) => and(eq(t.token, token), gt(t.expiresAt, new Date())),
		})
	},

	/**
	 * Executa uma transação atômica para atualizar a senha do usuário e invalidar seus tokens.
	 * * @param userId - ID do usuário.
	 * @param passwordHash - Nova senha já processada por algoritmo de hash.
	 */
	async updatePasswordAndDeleteToken(userId: string, passwordHash: string) {
		await db.transaction(async (tx) => {
			await tx.update(users).set({ passwordHash }).where(eq(users.id, userId))

			await tx.delete(tokens).where(eq(tokens.userId, userId))
		})
	},
}
