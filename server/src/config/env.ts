import { z } from 'zod'

const envSchema = z.object({
	// ---------------------------------------------------------------------------
	// SERVER CONFIGURATION
	// ---------------------------------------------------------------------------
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	PORT: z.coerce.number().default(3000),
	HOST: z.coerce.string().default('127.0.0.1'),
	FRONTEND_URL: z.url().default('http://localhost:5173'),

	// DATABASE (MySQL)
	DATABASE_URL: z.url(),

	// ---------------------------------------------------------------------------
	// SECURITY & AUTHENTICATION
	// ---------------------------------------------------------------------------
	JWT_SECRET: z.string().min(1),
	COOKIE_SECRET: z.string().min(1),

	// ---------------------------------------------------------------------------
	// EMAIL SERVICE (Resend)
	// ---------------------------------------------------------------------------
	RESEND_API_KEY: z.string().min(1),
	MAIL_FROM: z.string().min(1),

	// ---------------------------------------------------------------------------
	// OAUTH PROVIDERS (Social Login)
	// ---------------------------------------------------------------------------
	// Google
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),

	// Discord
	DISCORD_CLIENT_ID: z.string().min(1),
	DISCORD_CLIENT_SECRET: z.string().min(1),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('❌ Invalid environment variables', _env.error.format())
	throw new Error('Invalid environment variables.')
}

export const env = _env.data
