import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { referralController } from './referral.controller.js'
import { myReferralsResponseSchema } from './referral.schema.js'

export default async function referralRoutes(fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<ZodTypeProvider>()

	app.get(
		'/me',
		{
			schema: {
				tags: ['Referrals'],
				operationId: 'getMyReferrals',
				summary: 'Lista minhas indicações',
				response: {
					200: myReferralsResponseSchema,
				},
			},
			onRequest: [app.authenticate],
		},
		referralController.getMyReferrals,
	)
}
