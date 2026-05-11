import fastifyOauth2Plugin from '@fastify/oauth2'
import fp from 'fastify-plugin'
import { googleOauthOptions } from '#/config/auth.js'

export default fp(async (app) => {
	app.register(fastifyOauth2Plugin, googleOauthOptions)
})
