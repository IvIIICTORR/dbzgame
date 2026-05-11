import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { Server } from 'socket.io'
import { env } from '#/config/env.js'
import { socketOptions } from '#/config/websocket.js'
import { registerChatSocket } from '#/modules/chat/chat.socket.js'
import { db } from '#/db/index.js'
import { users } from '#/db/schema.js'
import { Unauthorized, NotFound } from '#/shared/errors/index.js'
import { eq } from 'drizzle-orm'

export default fp(
	async (app: FastifyInstance) => {
		const io = new Server(app.server, socketOptions)

		// Decorate
		app.decorate('io', io)

		// ── Middleware de autenticação ────────────────────────────────────────
		io.use(async (socket, next) => {
			try {
				// 1. Extrai o valor bruto do cookie da string de cabeçalho
				const rawCookieHeader = socket.handshake.headers.cookie ?? ''
				const rawToken = parseCookie(rawCookieHeader, 'token')

				if (!rawToken) {
					return next(NotFound('Unauthorized: token ausente'))
				}

				// 2. DESASSINA o cookie (Necessário pois você usa signed: true)
				// Isso remove o prefixo 's:' e valida a assinatura do cookie
				const unsigned = app.unsignCookie(rawToken)

				if (!unsigned.valid || unsigned.value === null) {
					return next(NotFound('Unauthorized: assinatura do cookie inválida'))
				}

				// 3. Verifica o JWT usando o valor limpo (unsigned.value)
				const payload = app.jwt.verify<{ sub: string }>(unsigned.value)

				// 4. Busca o usuário no banco de dados
				const user = await db.query.users.findFirst({
					where: eq(users.id, payload.sub),
					columns: { id: true, username: true },
				})

				if (!user) {
					return next(NotFound('Unauthorized: usuário não encontrado'))
				}

				// Injeta os dados no socket
				socket.data.userId = user.id
				socket.data.username = user.username

				next()
			} catch (err) {
				app.log.warn(err, '[websocket] falha na autenticação')
				next(Unauthorized('Unauthorized'))
			}
		})

		// ── Lifecycle ────────────────────────────────────────────────────────
		app.addHook('onClose', async (instance) => {
			instance.io.close()
		})

		app.addHook('onListen', async () => {
			app.log.info(
				`WebSocket listening at http://${env.HOST}:${env.PORT}${socketOptions.path}`,
			)
		})

		// ── Eventos globais ──────────────────────────────────────────────────
		io.on('connection', (socket) => {
			app.log.info(
				`User connected: ${socket.id} (userId=${socket.data.userId})`,
			)

			socket.on('disconnect', (reason) => {
				app.log.info(`User disconnected: ${socket.id} | Reason: ${reason}`)
			})
		})

		// ── Registra os handlers do módulo de chat ───────────────────────────
		registerChatSocket(io, app)
	},
	{
		name: 'plugin-websocket',
		// Garante que os plugins de cookie e jwt já estejam carregados
		dependencies: ['@fastify/cookie', '@fastify/jwt'],
	},
)

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseCookie(cookieHeader: string, name: string): string | undefined {
	const match = cookieHeader
		.split(';')
		.map((c) => c.trim())
		.find((c) => c.startsWith(`${name}=`))

	return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined
}
