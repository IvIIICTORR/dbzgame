import cors from '@fastify/cors'
import fp from 'fastify-plugin'
import { corsConfig } from '#/config/cors.js'

export default fp(async (app) => {
	app.register(cors, corsConfig)
})
