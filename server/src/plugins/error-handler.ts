import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from '#/shared/errors/index.js'

export default async function errorHandlerPlugin(app: FastifyInstance) {
	app.setErrorHandler((error, _request, reply) => {
		// 1. Trata erros conhecidos da aplicação (AppError)
		if (error instanceof AppError) {
			return reply.status(error.statusCode).send({
				message: error.message,
			})
		}

		// 2. Trata erros de validação do Zod (Bad Request automático)
		if (error instanceof ZodError) {
			return reply.status(400).send({
				message: 'Erro de validação.',
				errors: error.flatten().fieldErrors,
			})
		}

		// 3. Trata erros inesperados (Internal Server Error)
		app.log.error(error) // Loga o erro real para depuração no console
		return reply.status(500).send({
			message: 'Erro interno do servidor.',
		})
	})
}
