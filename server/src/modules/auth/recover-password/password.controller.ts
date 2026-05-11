import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
	ForgotPasswordBody,
	ResetPasswordBody,
	VerifyTokenQuery,
} from './password.schema.js'
import { passwordService } from './password.service.js'

export const passwordController = {
	/**
	 * Solicita a recuperação de senha enviando um e-mail com o token.
	 * * @param request - Requisição contendo o e-mail no corpo (Body).
	 * @param reply - Resposta HTTP 200 confirmando o processamento.
	 * @returns Promessa com a mensagem de instruções enviadas.
	 */
	async forgot(
		request: FastifyRequest<{ Body: ForgotPasswordBody }>,
		reply: FastifyReply,
	) {
		await passwordService.forgotPassword(request.body.email)

		return reply.status(200).send({
			message: 'Se o e-mail estiver cadastrado, as instruções foram enviadas.',
		})
	},

	/**
	 * Verifica se um token de recuperação ainda é válido.
	 * * @param request - Requisição contendo o token na query string.
	 * @param reply - Resposta HTTP confirmando a validade.
	 * @returns Promessa indicando se o token é válido.
	 */
	async verify(
		request: FastifyRequest<{ Querystring: VerifyTokenQuery }>,
		reply: FastifyReply,
	) {
		await passwordService.validateToken(request.query.token)

		return reply.send({ valid: true, message: 'Token válido.' })
	},

	/**
	 * Processa a alteração definitiva da senha utilizando o token de validação.
	 * * @param request - Requisição contendo o token e a nova senha no corpo.
	 * @param reply - Resposta HTTP confirmando o sucesso da operação.
	 * @returns Promessa com mensagem de sucesso.
	 */
	async reset(
		request: FastifyRequest<{ Body: ResetPasswordBody }>,
		reply: FastifyReply,
	) {
		const { token, password } = request.body
		const resetData = await passwordService.validateToken(token)

		await passwordService.resetPassword(resetData.userId, password)

		return reply.send({ message: 'Senha atualizada com sucesso.' })
	},
}
