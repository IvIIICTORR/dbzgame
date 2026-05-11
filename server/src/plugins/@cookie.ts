import cookie from '@fastify/cookie'
import fp from 'fastify-plugin'
import { cookieConfig } from '#/config/cookie.js'

export default fp(async (app) => {
	app.register(cookie, cookieConfig)
})
