import { randomBytes } from 'node:crypto'
import { Conflict, NotFound } from '#/shared/errors/index.js'
import { hashPassword } from '#/shared/utils/password.js'
import { referralService } from '../referrals/referral.service.js'
import { userRepository } from './user.repository.js'
import type { CreateUserInput, UpdateUserInput } from './user.schema.js'

export const userService = {
	/**
	 * Realiza a criação do usuário, valida e-mails duplicados e gera hash de senha e código de convite.
	 * * @param data - Dados de entrada para criação do usuário.
	 * @param ref - Código de referência opcional para o sistema de indicação.
	 * @throws {Conflict} Caso o e-mail já esteja cadastrado no sistema.
	 * @returns Promessa com o usuário persistido e processado.
	 */
	async create(data: CreateUserInput, ref?: string) {
		const existingUser = await userRepository.findByEmail(data.email)
		if (existingUser) throw Conflict('E-mail já cadastrado.')

		const existingUsername = await userRepository.findByUsername(data.username)
		if (existingUsername) throw Conflict('Nome de usuário já está em uso.')

		const { password, acceptedTerms, ...userData } = data
		const passwordHash = await hashPassword(password)
		const referralCode = `${data.username.substring(0, 3).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`

		const user = await userRepository.create({
			...userData,
			passwordHash,
			referralCode,
			acceptedTermsAt: new Date(),
		})

		if (user && ref) {
			await referralService.processReferral(ref, user.id)
		}

		return user
	},

	/**
	 * Obtém todos os registros de usuários do repositório.
	 * * @returns Promessa com array de usuários.
	 */
	async getAll() {
		return userRepository.findAll()
	},

	/**
	 * Busca um usuário por ID e garante sua existência para operações subsequentes.
	 * * @param id - Identificador único do usuário.
	 * @throws {NotFound} Se o usuário não for encontrado.
	 * @returns Promessa com os dados do usuário.
	 */
	async getById(id: string) {
		const user = await userRepository.findById(id)
		if (!user) throw NotFound('Usuário não encontrado.')
		return user
	},

	/**
	 * Atualiza informações de um usuário após validar sua existência.
	 * * @param id - ID do usuário.
	 * @param data - Dados para atualização.
	 * @returns Promessa com o registro atualizado.
	 */
	async update(id: string, data: UpdateUserInput) {
		await this.getById(id)
		return userRepository.update(id, data)
	},

	/**
	 * Exclui um usuário do sistema após validar sua existência.
	 * * @param id - ID do usuário a ser removido.
	 * @returns Promessa de conclusão da deleção.
	 */
	async delete(id: string) {
		await this.getById(id)
		return userRepository.delete(id)
	},
}
