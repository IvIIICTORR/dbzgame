import type { FastifyReply, FastifyRequest } from 'fastify'
import { referralService } from './referral.service.js'

export const referralController = {
	/**
	 * Recupera a lista de usuários que foram indicados pelo usuário atualmente autenticado.
	 * * @param request - Requisição contendo os dados do usuário logado (sub no JWT).
	 * @param reply - Objeto de resposta para envio da lista de indicações.
	 * @returns Promessa contendo o array de indicações com dados dos usuários indicados.
	 */
	async getMyReferrals(request: FastifyRequest, reply: FastifyReply) {
		const referrals = await referralService.getUserReferrals(request.user.sub)
		return reply.send(referrals)
	},
}
