import type { FastifyReply, FastifyRequest } from 'fastify'
import { authCookieOptions } from '#/config/cookie.js'
import type { LoginBody } from './auth.schema.js'
import { authService } from './auth.service.js'

export const authController = {
	/**
	 * Realiza a autenticação do usuário, gera o token JWT e o define nos cookies.
	 * * @param request - Requisição contendo as credenciais de login no corpo.
	 * @param reply - Objeto de resposta para configurar cookies e status.
	 * @returns Promessa com a mensagem de sucesso e dados básicos do usuário.
	 */
	async login(
		request: FastifyRequest<{ Body: LoginBody }>,
		reply: FastifyReply,
	) {
		const user = await authService.validateCredentials(request.body)
		const accessToken = authService.generateToken(request.server, user)

		return reply
			.setCookie('token', accessToken, authCookieOptions)
			.status(200)
			.send({
				message: 'Login realizado com sucesso.',
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					avatarUrl: user.avatarUrl,
				},
			})
	},

	/**
	 * Obtém os dados do usuário atualmente autenticado com base no token enviado.
	 * * @param request - Requisição contendo o payload do JWT decodificado no objeto user.
	 * @param reply - Objeto de resposta.
	 * @returns Promessa com os dados completos do usuário.
	 */
	async me(request: FastifyRequest, reply: FastifyReply) {
		const user = await authService.findUserById(request.user.sub)

		return reply.send(user)
	},

	/**
	 * Finaliza a sessão do usuário invalidando o cookie de autenticação.
	 * * @param _request - Objeto de requisição (não utilizado).
	 * @param reply - Objeto de resposta para limpar o cookie.
	 * @returns Promessa com a confirmação de logout.
	 */
	async logout(_request: FastifyRequest, reply: FastifyReply) {
		return reply
			.clearCookie('token', authCookieOptions)
			.status(200)
			.send({ message: 'Logout realizado com sucesso.' })
	},
}
