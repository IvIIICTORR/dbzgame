import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { passwordController } from './password.controller.js'
import {
	forgotPasswordBodySchema,
	resetPasswordBodySchema,
	verifyTokenQuerySchema,
	verifyTokenResponseSchema,
} from './password.schema.js'

export default async function passwordRoutes(fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<ZodTypeProvider>()

	app.post(
		'/forgot',
		{
			schema: {
				tags: ['Passwords'],
				operationId: 'forgotPassword',
				summary: 'Solicita reset de senha',
				body: forgotPasswordBodySchema,
			},
		},
		passwordController.forgot,
	)

	app.get(
		'/verify',
		{
			schema: {
				tags: ['Passwords'],
				operationId: 'verifyPasswordToken',
				summary: 'Verifica se o token de reset é válido',
				querystring: verifyTokenQuerySchema,
				response: { 200: verifyTokenResponseSchema },
			},
		},
		passwordController.verify,
	)

	app.post(
		'/reset',
		{
			schema: {
				tags: ['Passwords'],
				operationId: 'resetPassword',
				summary: 'Define a nova senha usando o token',
				body: resetPasswordBodySchema,
			},
		},
		passwordController.reset,
	)
}
