import type { ServerOptions } from 'socket.io'
import { env } from './env.js'

export const socketOptions: Partial<ServerOptions> = {
	cors: {
		origin: env.FRONTEND_URL,
		methods: ['GET', 'POST'],
		credentials: true,
	},
	pingTimeout: 10000,
	pingInterval: 25000,
	path: '/websocket/',
}
