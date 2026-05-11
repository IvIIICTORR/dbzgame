import type {
	CookieSerializeOptions,
	FastifyCookieOptions,
} from '@fastify/cookie'
import { env } from './env.js'

export const authCookieOptions: CookieSerializeOptions = {
	path: '/',
	httpOnly: true,
	secure: true,
	sameSite: 'lax',
	signed: true,
	maxAge: 60 * 60 * 24 * 7, // 7 dias — mesmo TTL do JWT
}

export const cookieConfig: FastifyCookieOptions = {
	secret: env.COOKIE_SECRET,
}
