import { type FastifyOAuth2Options, fastifyOauth2 } from '@fastify/oauth2'
import { env } from './env.js'

export const googleOauthOptions: FastifyOAuth2Options = {
	name: 'googleOAuth2',
	scope: ['profile', 'email'],
	credentials: {
		client: {
			id: env.GOOGLE_CLIENT_ID,
			secret: env.GOOGLE_CLIENT_SECRET,
		},
		auth: fastifyOauth2.GOOGLE_CONFIGURATION,
	},
	startRedirectPath: '/auth/google/redirect',
	callbackUri: `http://localhost:${env.PORT}/auth/google/callback`,
}
