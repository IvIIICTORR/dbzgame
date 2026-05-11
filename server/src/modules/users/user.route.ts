import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { errorResponseSchema } from '#/shared/schemas/index.js'
import { userController } from './user.controller.js'
import {
	createUserSchema,
	registerQuerySchema,
	updateUserSchema,
	userIdParamSchema,
	userListResponseSchema,
	userResponseSchema,
} from './user.schema.js'

export default async function usersRoutes(fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<ZodTypeProvider>()

	app.post(
		'/',
		{
			schema: {
				tags: ['Users'],
				summary: 'Cria um novo usuário',
				operationId: 'createUser',
				body: createUserSchema,
				querystring: registerQuerySchema,
				response: {
					201: userResponseSchema,
					400: errorResponseSchema,
				},
			},
		},
		userController.create,
	)

	app.get(
		'/',
		{
			schema: {
				tags: ['Users'],
				operationId: 'listUsers',
				summary: 'Lista todos os usuários',
				response: {
					200: userListResponseSchema,
				},
			},
		},
		userController.getAll,
	)

	app.get(
		'/:id',
		{
			schema: {
				tags: ['Users'],
				summary: 'Busca usuário por ID',
				operationId: 'getUser',
				params: userIdParamSchema,
				response: {
					200: userResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		userController.getById,
	)

	app.put(
		'/:id',
		{
			schema: {
				tags: ['Users'],
				summary: 'Atualiza um usuário',
				operationId: 'updateUser',
				params: userIdParamSchema,
				body: updateUserSchema,
				response: {
					200: userResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		userController.update,
	)

	app.delete(
		'/:id',
		{
			schema: {
				tags: ['Users'],
				summary: 'Remove um usuário (Soft Delete)',
				operationId: 'deleteUser',
				params: userIdParamSchema,
				response: {
					204: z.null().describe('Usuário deletado com sucesso'),
					404: errorResponseSchema,
				},
			},
		},
		userController.delete,
	)
}
