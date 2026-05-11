import type { OAuth2Namespace } from '@fastify/oauth2'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Server } from 'socket.io'

declare module 'fastify' {
	interface FastifyInstance {
		io: Server
		googleOAuth2: OAuth2Namespace
		discordOAuth2: OAuth2Namespace
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: {
			sub: string
		}
		user: {
			sub: string
		}
	}
}
