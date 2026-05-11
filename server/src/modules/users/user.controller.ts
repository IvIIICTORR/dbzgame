import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
	CreateUserInput,
	RegisterQueryInput,
	UpdateUserInput,
	UserIdParam,
} from './user.schema.js'
import { userService } from './user.service.js'

export const userController = {
	/**
	 * Cria um novo usuário no sistema e processa convites de referência, se existirem.
	 * * @param request - Requisição contendo os dados do usuário no corpo e código de referência na query.
	 * @param reply - Objeto de resposta com status 201 em caso de sucesso.
	 * @returns Promessa com os dados do usuário criado.
	 */
	async create(
		request: FastifyRequest<{
			Body: CreateUserInput
			Querystring: RegisterQueryInput
		}>,
		reply: FastifyReply,
	) {
		const user = await userService.create(request.body, request.query.ref)
		return reply.status(201).send(user)
	},

	/**
	 * Recupera a listagem completa de usuários.
	 * * @param _request - Objeto de requisição (não utilizado).
	 * @param reply - Objeto de resposta.
	 * @returns Promessa com a lista de todos os usuários.
	 */
	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const users = await userService.getAll()
		return reply.send(users)
	},

	/**
	 * Busca um usuário específico através do seu ID único.
	 * * @param request - Requisição contendo o ID nos parâmetros.
	 * @param reply - Objeto de resposta.
	 * @returns Promessa com os dados do usuário encontrado.
	 */
	async getById(
		request: FastifyRequest<{ Params: UserIdParam }>,
		reply: FastifyReply,
	) {
		const user = await userService.getById(request.params.id)
		return reply.send(user)
	},

	/**
	 * Atualiza os dados de um usuário existente.
	 * * @param request - Requisição contendo o ID e os novos dados para atualização.
	 * @param reply - Objeto de resposta.
	 * @returns Promessa com o usuário atualizado.
	 */
	async update(
		request: FastifyRequest<{ Params: UserIdParam; Body: UpdateUserInput }>,
		reply: FastifyReply,
	) {
		const user = await userService.update(request.params.id, request.body)
		return reply.send(user)
	},

	/**
	 * Remove um usuário do sistema permanentemente.
	 * * @param request - Requisição contendo o ID do usuário a ser deletado.
	 * @param reply - Objeto de resposta com status 204.
	 */
	async delete(
		request: FastifyRequest<{ Params: UserIdParam }>,
		reply: FastifyReply,
	) {
		await userService.delete(request.params.id)
		return reply.status(204).send()
	},
}
