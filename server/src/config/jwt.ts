import type { FastifyJWTOptions } from '@fastify/jwt'
import { env } from './env.js'

export const jwtConfig: FastifyJWTOptions = {
	secret: env.JWT_SECRET,
	sign: {
		expiresIn: '7d',
	},
	cookie: {
		cookieName: 'token',
		signed: true,
	},
}
