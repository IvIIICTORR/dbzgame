import swagger from '@fastify/swagger'
import scalarApiReference from '@scalar/fastify-api-reference'
import fp from 'fastify-plugin'
import { swaggerConfig } from '#/config/swagger.js'

export default fp(async (app) => {
	// 1. Registro do Swagger Core
	await app.register(swagger, swaggerConfig)

	// 2. Registro do Scalar (Interface UI)
	await app.register(scalarApiReference, {
		routePrefix: '/docs',
	})

	// 3. Rota auxiliar para o JSON do Swagger
	app.get(
		'/docs/json',
		{
			schema: {
				hide: true,
			},
		},
		() => {
			return app.swagger()
		},
	)
})
