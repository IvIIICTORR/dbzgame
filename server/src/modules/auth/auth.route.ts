import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { errorResponseSchema } from '#/shared/schemas/index.js'
import { userResponseSchema } from '../users/user.schema.js'
import { authController } from './auth.controller.js'
import { loginBodySchema, loginResponseSchema } from './auth.schema.js'

export default async function authRoutes(fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<ZodTypeProvider>()

	app.post(
		'/login',
		{
			schema: {
				tags: ['Auth'],
				summary: 'Autentica o usuário e define o cookie',
				operationId: 'loginUser',
				body: loginBodySchema,
				response: {
					200: loginResponseSchema,
					401: errorResponseSchema,
				},
			},
		},
		authController.login,
	)

	app.get(
		'/me',
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ['Auth'],
				operationId: 'getCurrentUser',
				summary: 'Retorna o perfil do usuário logado',
				response: {
					200: userResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		authController.me,
	)

	app.post(
		'/logout',
		{
			onRequest: [app.authenticate],
			schema: {
				tags: ['Auth'],
				operationId: 'logoutUser',
				summary: 'Remove o cookie de autenticação',
				response: {
					200: errorResponseSchema,
				},
			},
		},
		authController.logout,
	)
}
