import type { FastifyInstance } from 'fastify'
import { NotFound, Unauthorized } from '#/shared/errors/index.js'
import { comparePassword } from '#/shared/utils/password.js'
import { userRepository } from '../users/user.repository.js'
import type { LoginBody } from './auth.schema.js'
import type { User } from '#/db/schema.js'

export const authService = {
	/**
	 * Valida as credenciais do usuário (e-mail e senha).
	 * * @param param0 - Objeto contendo email e password para validação.
	 * @throws {Unauthorized} Se o usuário não existir ou a senha estiver incorreta.
	 * @returns Promessa com os dados do usuário validado.
	 */
	async validateCredentials({ email, password }: LoginBody): Promise<User> {
		const user = await userRepository.findByEmail(email)

		// 1. Garante que a comparação de hash sempre ocorra para mitigar timing attacks (enumeração de usuários)
		const passwordHash = user?.passwordHash ?? ''
		const isPasswordValid = await comparePassword(password, passwordHash)

		// 2. Unifica a falha para manter a mensagem de erro genérica por segurança
		if (!user || !isPasswordValid) {
			throw Unauthorized('Credenciais inválidas.')
		}

		return user
	},

	/**
	 * Assina um novo token JWT para o usuário informado.
	 * * @param app - Instância do Fastify que contém o plugin JWT.
	 * @param user - Objeto contendo o ID do usuário para o payload (sub).
	 * @returns String do token JWT gerado.
	 */
	generateToken(app: FastifyInstance, user: { id: string }) {
		return app.jwt.sign({
			sub: user.id,
		})
	},

	/**
	 * Busca um usuário pelo ID e garante sua existência.
	 * * @param id - Identificador único do usuário.
	 * @throws {NotFound} Se o usuário não for encontrado no banco de dados.
	 * @returns Promessa com os dados do usuário.
	 */
	async findUserById(id: string) {
		const user = await userRepository.findById(id)

		if (!user) {
			throw NotFound('Usuário não encontrado.')
		}

		return user
	},

	/**
	 * Helper para buscar usuário pelo e-mail através do repositório.
	 * * @param email - E-mail do usuário.
	 * @returns Promessa com o usuário encontrado ou null.
	 */
	async findUserByEmail(email: string) {
		return userRepository.findByEmail(email)
	},
}
