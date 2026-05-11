import jwt from '@fastify/jwt'
import type { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { jwtConfig } from '#/config/jwt.js'

export default fp(async (app) => {
	app.register(jwt, jwtConfig)

	app.decorate(
		'authenticate',
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify({ onlyCookie: true })
			} catch (err) {
				return reply.status(401).send(err)
			}
		},
	)
})
