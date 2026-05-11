import type { FastifyCorsOptions } from '@fastify/cors'
import { env } from './env.js'

export const corsConfig: FastifyCorsOptions = {
	origin: env.FRONTEND_URL,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	credentials: true,
}
