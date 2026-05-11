import type { SwaggerOptions } from '@fastify/swagger'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export const swaggerConfig: SwaggerOptions = {
	openapi: {
		info: {
			title: 'API Server',
			description: 'Server API Documentation',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
}
