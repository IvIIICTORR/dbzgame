import { randomBytes } from 'node:crypto'
import { BadRequest } from '#/shared/errors/index.js'
import { hashPassword } from '#/shared/utils/password.js'
import { authService } from '../auth.service.js'
import { mailService } from './mail.service.js'
import { passwordRepository } from './password.repository.js'

const TOKEN_EXPIRATION_MS = 1000 * 60 * 60 // 1 hora

export const passwordService = {
	/**
	 * Inicia o fluxo de recuperação de senha: busca o usuário e gera o e-mail.
	 * * @param email - Endereço de e-mail do usuário.
	 * @returns Promessa de execução (não retorna dados sensíveis).
	 */
	async forgotPassword(email: string) {
		const user = await authService.findUserByEmail(email)

		if (user) {
			const token = await passwordService.createToken(user.id)
			await mailService.sendForgotPasswordEmail(
				user.email,
				user.username,
				token,
			)
		}
	},

	/**
	 * Gera um token criptográfico aleatório e o persiste com data de expiração.
	 * * @param userId - ID único do usuário.
	 * @returns O token gerado em formato hexadecimal.
	 */
	async createToken(userId: string) {
		const token = randomBytes(32).toString('hex')
		const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS)

		await passwordRepository.saveResetToken(userId, token, expiresAt)
		return token
	},

	/**
	 * Valida a existência e a expiração de um token no banco de dados.
	 * * @param token - Token hexadecimal a ser validado.
	 * @throws {BadRequest} Se o token for inexistente ou estiver expirado.
	 * @returns Dados do token e ID do usuário associado.
	 */
	async validateToken(token: string) {
		const resetData = await passwordRepository.findValidToken(token)

		if (!resetData) {
			throw BadRequest('Token inválido ou expirado.')
		}

		return resetData
	},

	/**
	 * Realiza o hash da nova senha e atualiza o registro do usuário.
	 * * @param userId - ID do usuário.
	 * @param passwordPlain - Senha em texto puro para ser hasheada.
	 * @returns Promessa de atualização concluída.
	 */
	async resetPassword(userId: string, passwordPlain: string) {
		const passwordHash = await hashPassword(passwordPlain)
		await passwordRepository.updatePasswordAndDeleteToken(userId, passwordHash)
	},
}
